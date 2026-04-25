package com.apsitsafe.service;

import com.apsitsafe.dto.ItemRequest;
import com.apsitsafe.model.Item;
import com.apsitsafe.model.User;
import com.apsitsafe.repository.ItemRepository;
import com.apsitsafe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
    }

    /**
     * Get filtered items with visibility rules:
     * - RESOLVED items are always excluded
     * - FOUND items are only visible to the user who reported them (or admins via separate endpoint)
     * - LOST items are always visible to everyone
     *
     * @param requestingUserId The userId from JWT (null if not logged in)
     * @param isAdmin Whether the requesting user has ADMIN role
     */
    public List<Item> getFilteredItems(String type, String category, String location, String search,
                                        Long requestingUserId, boolean isAdmin) {
        // Convert "all" values to null for the query
        String typeFilter = (type == null || type.equalsIgnoreCase("all")) ? null : type.toUpperCase();
        String categoryFilter = (category == null || category.equalsIgnoreCase("all")) ? null : category;
        String locationFilter = (location == null || location.equalsIgnoreCase("all")) ? null : location;
        String searchFilter = (search == null || search.isBlank()) ? null : search;

        List<Item> items = itemRepository.findWithFilters(typeFilter, categoryFilter, locationFilter, searchFilter);

        // Post-filter: visibility rules
        return items.stream()
                .filter(item -> {
                    // Always exclude RESOLVED items from public listings
                    if ("RESOLVED".equalsIgnoreCase(item.getStatus())) {
                        return false;
                    }
                    // FOUND items: only visible to the reporter or admins
                    if ("FOUND".equals(item.getType())) {
                        if (isAdmin) return true;
                        if (requestingUserId == null) return false;
                        if (item.getReportedBy() == null) return false;
                        return requestingUserId.equals(item.getReportedBy().getId());
                    }
                    // LOST items: always visible
                    return true;
                })
                .collect(Collectors.toList());
    }

    /**
     * Paginated version of getFilteredItems (Issue #15)
     */
    public Page<Item> getFilteredItemsPaged(String type, String category, String location, String search, int page, int size) {
        String typeFilter = (type == null || type.equalsIgnoreCase("all")) ? null : type.toUpperCase();
        String categoryFilter = (category == null || category.equalsIgnoreCase("all")) ? null : category;
        String locationFilter = (location == null || location.equalsIgnoreCase("all")) ? null : location;
        String searchFilter = (search == null || search.isBlank()) ? null : search;

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return itemRepository.findWithFiltersPaged(typeFilter, categoryFilter, locationFilter, searchFilter, pageable);
    }

    public Item reportLostItem(ItemRequest request, Long userId) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        Item item = Item.builder()
                .itemName(request.getItemName())
                .type("LOST")
                .status("LOST")
                .category(request.getCategory())
                .location(request.getLocation())
                .date(LocalDate.parse(request.getDate()))
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .contactName(request.getContactName())
                .contactPhone(request.getContactPhone())
                .contactEmail(request.getContactEmail())
                .reportedBy(user)
                .build();

        return itemRepository.save(item);
    }

    public Item reportFoundItem(ItemRequest request, Long userId) {
        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        Item item = Item.builder()
                .itemName(request.getItemName())
                .type("FOUND")
                .status("FOUND")
                .category(request.getCategory())
                .location(request.getLocation())
                .date(LocalDate.parse(request.getDate()))
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .contactName(request.getContactName())
                .contactPhone(request.getContactPhone())
                .contactEmail(request.getContactEmail())
                .reportedBy(user)
                .build();

        item = itemRepository.save(item);

        // If linked to a lost item, mark it as RESOLVED and notify the owner
        if (request.getLinkedLostItemId() != null) {
            try {
                Item lostItem = itemRepository.findById(request.getLinkedLostItemId()).orElse(null);
                if (lostItem != null && "LOST".equalsIgnoreCase(lostItem.getStatus())) {
                    lostItem.setStatus("RESOLVED");
                    itemRepository.save(lostItem);

                    // Notify the owner of the lost item about the found item
                    if (lostItem.getReportedBy() != null) {
                        notificationService.notifyOwnerItemFound(lostItem, item);
                    }
                }
            } catch (Exception e) {
                System.err.println("Failed to process linked lost item: " + e.getMessage());
            }
        }

        // Fire notification to all admins
        try {
            notificationService.notifyAdminsItemFound(item);
            notificationService.checkAndNotifyMatches(item);
        } catch (Exception e) {
            // Don't fail the report if notification fails
            System.err.println("Failed to send notification: " + e.getMessage());
        }

        return item;
    }

    public List<Item> getMyReports(Long userId) {
        return itemRepository.findByReportedById(userId);
    }

    public Item updateItem(Long id, ItemRequest request) {
        Item item = getItemById(id);
        item.setItemName(request.getItemName());
        item.setCategory(request.getCategory());
        item.setLocation(request.getLocation());
        item.setDate(LocalDate.parse(request.getDate()));
        item.setDescription(request.getDescription());
        if (request.getImageUrl() != null) {
            item.setImageUrl(request.getImageUrl());
        }
        item.setContactName(request.getContactName());
        item.setContactPhone(request.getContactPhone());
        item.setContactEmail(request.getContactEmail());
        return itemRepository.save(item);
    }

    public Item updateItemStatus(Long id, String status, Long requestingUserId, boolean isAdmin) {
        Item item = getItemById(id);
        
        // Ownership / Authorization check for status update
        if (!isAdmin) {
            if (requestingUserId == null || item.getReportedBy() == null || !item.getReportedBy().getId().equals(requestingUserId)) {
                throw new RuntimeException("Not authorized to update status of this item");
            }
        }
        
        item.setStatus(status);
        return itemRepository.save(item);
    }

    public void deleteItem(Long id) {
        if (!itemRepository.existsById(id)) {
            throw new RuntimeException("Item not found with id: " + id);
        }
        itemRepository.deleteById(id);
    }
}

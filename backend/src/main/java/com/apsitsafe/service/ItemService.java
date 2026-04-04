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

@Service
public class ItemService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Item> getAllItems() {
        return itemRepository.findAll();
    }

    public Item getItemById(Long id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found with id: " + id));
    }

    public List<Item> getFilteredItems(String type, String category, String location, String search) {
        // Convert "all" values to null for the query
        String typeFilter = (type == null || type.equalsIgnoreCase("all")) ? null : type.toUpperCase();
        String categoryFilter = (category == null || category.equalsIgnoreCase("all")) ? null : category;
        String locationFilter = (location == null || location.equalsIgnoreCase("all")) ? null : location;
        String searchFilter = (search == null || search.isBlank()) ? null : search;

        return itemRepository.findWithFilters(typeFilter, categoryFilter, locationFilter, searchFilter);
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

        return itemRepository.save(item);
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

    public Item updateItemStatus(Long id, String status) {
        Item item = getItemById(id);
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

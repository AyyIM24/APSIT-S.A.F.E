package com.apsitsafe.service;

import com.apsitsafe.dto.ClaimRequestDTO;
import com.apsitsafe.model.ClaimRequest;
import com.apsitsafe.model.Item;
import com.apsitsafe.model.User;
import com.apsitsafe.repository.ClaimRequestRepository;
import com.apsitsafe.repository.ItemRepository;
import com.apsitsafe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ClaimService {

    @Autowired
    private ClaimRequestRepository claimRequestRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationService notificationService;

    public ClaimRequest submitClaim(ClaimRequestDTO dto, Long userId) {
        Item item = itemRepository.findById(dto.getItemId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        // Prevent the finder from claiming their own found item
        if (userId != null && item.getReportedBy() != null
                && "FOUND".equalsIgnoreCase(item.getType())
                && userId.equals(item.getReportedBy().getId())) {
            throw new RuntimeException("You cannot claim an item that you reported as found");
        }

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        ClaimRequest claim = ClaimRequest.builder()
                .item(item)
                .claimedBy(user)
                .claimedByName(dto.getClaimedByName())
                .email(dto.getEmail())
                .proof(dto.getProof())
                .status("pending")
                .build();

        claim = claimRequestRepository.save(claim);

        // Notify admins about new claim
        try {
            notificationService.notifyAdminsClaimSubmitted(claim);
        } catch (Exception e) {
            System.err.println("Failed to send claim notification: " + e.getMessage());
        }

        return claim;
    }

    public List<ClaimRequest> getAllClaims() {
        return claimRequestRepository.findAll();
    }

    public List<ClaimRequest> getClaimsByStatus(String status) {
        if (status == null || status.equalsIgnoreCase("all")) {
            return claimRequestRepository.findAll();
        }
        return claimRequestRepository.findByStatus(status);
    }

    public ClaimRequest approveClaim(Long claimId) {
        ClaimRequest claim = claimRequestRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claim.setStatus("approved");
        claim.setUpdatedAt(LocalDateTime.now());

        // Generate unique pickup token for QR code
        String pickupToken = "SAFE-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        claim.setPickupToken(pickupToken);

        // Update item status to SECURED (not RESOLVED — that happens on physical pickup)
        Item item = claim.getItem();
        item.setStatus("SECURED");
        itemRepository.save(item);

        claim = claimRequestRepository.save(claim);

        // Notify the claimer
        try {
            notificationService.notifyClaimApproved(claim);
        } catch (Exception e) {
            System.err.println("Failed to send approval notification: " + e.getMessage());
        }

        return claim;
    }

    public ClaimRequest rejectClaim(Long claimId) {
        ClaimRequest claim = claimRequestRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claim.setStatus("rejected");
        claim.setUpdatedAt(LocalDateTime.now());

        claim = claimRequestRepository.save(claim);

        // Notify the claimer
        try {
            notificationService.notifyClaimRejected(claim);
        } catch (Exception e) {
            System.err.println("Failed to send rejection notification: " + e.getMessage());
        }

        return claim;
    }

    public ClaimRequest findByPickupToken(String token) {
        return claimRequestRepository.findByPickupToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid pickup token: " + token));
    }

    public ClaimRequest confirmPickup(String token) {
        ClaimRequest claim = findByPickupToken(token);

        if (!"approved".equals(claim.getStatus())) {
            throw new RuntimeException("This claim has not been approved yet");
        }
        if (Boolean.TRUE.equals(claim.getPickedUp())) {
            throw new RuntimeException("This item has already been picked up on " + claim.getPickedUpAt());
        }

        claim.setPickedUp(true);
        claim.setPickedUpAt(LocalDateTime.now());
        claim.setUpdatedAt(LocalDateTime.now());

        // Update item status to RESOLVED (final state — removed from listings)
        Item item = claim.getItem();
        item.setStatus("RESOLVED");
        itemRepository.save(item);

        claim = claimRequestRepository.save(claim);

        // Notify claimer and item reporter
        try {
            notificationService.notifyPickupComplete(claim);
        } catch (Exception e) {
            System.err.println("Failed to send pickup notification: " + e.getMessage());
        }

        return claim;
    }

    public List<ClaimRequest> getClaimsByItem(Long itemId) {
        return claimRequestRepository.findByItemId(itemId);
    }

    public List<ClaimRequest> getClaimsByUser(Long userId) {
        return claimRequestRepository.findByClaimedById(userId);
    }

    /**
     * Get all handed-over items (resolved cases)
     * Returns claims that have been picked up with complete handover details
     */
    public List<ClaimRequest> getHandedOverItems() {
        List<ClaimRequest> allClaims = claimRequestRepository.findAll();
        return allClaims.stream()
                .filter(claim -> "approved".equals(claim.getStatus()) && 
                                Boolean.TRUE.equals(claim.getPickedUp()))
                .toList();
    }

    /**
     * Get handed-over items within a date range (for admin reporting)
     */
    public List<ClaimRequest> getHandedOverItemsInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        List<ClaimRequest> allClaims = claimRequestRepository.findAll();
        return allClaims.stream()
                .filter(claim -> "approved".equals(claim.getStatus()) && 
                                Boolean.TRUE.equals(claim.getPickedUp()) &&
                                claim.getPickedUpAt() != null &&
                                !claim.getPickedUpAt().isBefore(startDate) &&
                                !claim.getPickedUpAt().isAfter(endDate))
                .toList();
    }
}

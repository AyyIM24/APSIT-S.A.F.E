package com.apsitsafe.service;

import com.apsitsafe.model.ClaimRequest;
import com.apsitsafe.model.Item;
import com.apsitsafe.model.Notification;
import com.apsitsafe.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // ===== EVENT NOTIFICATIONS =====

    /**
     * When a FOUND item is reported → notify all admins (broadcast)
     */
    public void notifyAdminsItemFound(Item item) {
        Notification notification = Notification.builder()
                .userId(null) // broadcast to all admins
                .userType("ADMIN")
                .title("New Found Item Reported")
                .message("A found item \"" + item.getItemName() + "\" has been reported at " + item.getLocation() + ". Review and secure it.")
                .type("ITEM_FOUND")
                .itemId(item.getId())
                .build();
        notificationRepository.save(notification);
    }

    /**
     * When a claim is submitted → notify all admins (broadcast)
     */
    public void notifyAdminsClaimSubmitted(ClaimRequest claim) {
        Notification notification = Notification.builder()
                .userId(null) // broadcast to all admins
                .userType("ADMIN")
                .title("New Claim Request")
                .message(claim.getClaimedByName() + " has submitted a claim for \"" + claim.getItem().getItemName() + "\". Review their proof and approve or reject.")
                .type("CLAIM_SUBMITTED")
                .itemId(claim.getItem().getId())
                .build();
        notificationRepository.save(notification);
    }

    /**
     * When a claim is approved → notify the claimer
     */
    public void notifyClaimApproved(ClaimRequest claim) {
        if (claim.getClaimedBy() == null) return;

        Notification notification = Notification.builder()
                .userId(claim.getClaimedBy().getId())
                .userType("USER")
                .title("Claim Approved! 🎉")
                .message("Your claim for \"" + claim.getItem().getItemName() + "\" has been approved. Show the QR code to the admin for pickup.")
                .type("CLAIM_APPROVED")
                .itemId(claim.getItem().getId())
                .build();
        notificationRepository.save(notification);
    }

    /**
     * When a claim is rejected → notify the claimer
     */
    public void notifyClaimRejected(ClaimRequest claim) {
        if (claim.getClaimedBy() == null) return;

        Notification notification = Notification.builder()
                .userId(claim.getClaimedBy().getId())
                .userType("USER")
                .title("Claim Rejected")
                .message("Your claim for \"" + claim.getItem().getItemName() + "\" was not approved. If you believe this is incorrect, please submit a new claim with additional proof.")
                .type("CLAIM_REJECTED")
                .itemId(claim.getItem().getId())
                .build();
        notificationRepository.save(notification);
    }

    /**
     * When QR pickup is confirmed → notify the claimer AND the item reporter
     */
    public void notifyPickupComplete(ClaimRequest claim) {
        // Notify the person who picked up the item
        if (claim.getClaimedBy() != null) {
            Notification claimerNotif = Notification.builder()
                    .userId(claim.getClaimedBy().getId())
                    .userType("USER")
                    .title("Pickup Complete! ✅")
                    .message("You have successfully picked up \"" + claim.getItem().getItemName() + "\". Thank you for using APSIT S.A.F.E!")
                    .type("PICKUP_COMPLETE")
                    .itemId(claim.getItem().getId())
                    .build();
            notificationRepository.save(claimerNotif);
        }

        // Notify the person who originally reported finding the item
        if (claim.getItem().getReportedBy() != null) {
            Long reporterId = claim.getItem().getReportedBy().getId();
            // Don't double-notify if reporter is also the claimer
            if (claim.getClaimedBy() == null || !reporterId.equals(claim.getClaimedBy().getId())) {
                Notification reporterNotif = Notification.builder()
                        .userId(reporterId)
                        .userType("USER")
                        .title("Item Returned to Owner")
                        .message("The item \"" + claim.getItem().getItemName() + "\" that you reported has been picked up by its owner. Thank you for helping!")
                        .type("PICKUP_COMPLETE")
                        .itemId(claim.getItem().getId())
                        .build();
                notificationRepository.save(reporterNotif);
            }
        }
    }

    // ===== QUERY METHODS =====

    /**
     * Get all notifications for a specific user (targeted + admin broadcasts if admin)
     */
    public List<Notification> getUserNotifications(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    /**
     * Get admin broadcast notifications
     */
    public List<Notification> getAdminNotifications() {
        return notificationRepository.findByUserTypeAndUserIdIsNullOrderByCreatedAtDesc("ADMIN");
    }

    /**
     * Get unread count for a user
     */
    public long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsRead(userId, false);
    }

    /**
     * Get unread count for admin broadcasts
     */
    public long getAdminUnreadCount() {
        return notificationRepository.countByUserTypeAndUserIdIsNullAndIsRead("ADMIN", false);
    }

    /**
     * Mark a single notification as read
     */
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    /**
     * Mark all notifications as read for a user
     */
    public void markAllRead(Long userId) {
        List<Notification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        for (Notification n : unread) {
            if (!n.getIsRead()) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        }
    }

    /**
     * Mark all admin broadcast notifications as read
     */
    public void markAllAdminRead() {
        List<Notification> unread = notificationRepository.findByUserTypeAndUserIdIsNullOrderByCreatedAtDesc("ADMIN");
        for (Notification n : unread) {
            if (!n.getIsRead()) {
                n.setIsRead(true);
                notificationRepository.save(n);
            }
        }
    }
}

package com.apsitsafe.service;

import com.apsitsafe.model.Admin;
import com.apsitsafe.model.ClaimRequest;
import com.apsitsafe.model.Item;
import com.apsitsafe.model.Notification;
import com.apsitsafe.model.User;
import com.apsitsafe.repository.AdminRepository;
import com.apsitsafe.repository.ItemRepository;
import com.apsitsafe.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.internet.MimeMessage;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    // ===== EVENT NOTIFICATIONS =====

    /**
     * When a FOUND item is reported → notify all admins (broadcast)
     */
    @Async
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

        // Send email to all admins
        sendEmailToAllAdmins(
                "New Found Item Reported",
                "A found item \"" + item.getItemName() + "\" has been reported at " + item.getLocation() + ". Please review and secure it."
        );
    }

    /**
     * When someone reports finding a specific lost item → notify the owner directly
     */
    @Async
    public void notifyOwnerItemFound(Item lostItem, Item foundItem) {
        if (lostItem.getReportedBy() == null) return;

        Long ownerId = lostItem.getReportedBy().getId();

        Notification notification = Notification.builder()
                .userId(ownerId)
                .userType("USER")
                .title("Your Item Has Been Found! 🎉")
                .message("Someone found your lost item \"" + lostItem.getItemName() + "\"! Go to the found item to claim it back.")
                .type("ITEM_FOUND_FOR_OWNER")
                .itemId(foundItem.getId()) // Link to the FOUND item so owner can claim it
                .build();
        notificationRepository.save(notification);

        sendEmailIfEnabled(
                lostItem.getReportedBy().getEmail(),
                "Your Lost Item Has Been Found!",
                "Hello " + lostItem.getReportedBy().getName() + ",<br><br>"
                        + "Great news! Someone has found your lost item <b>\"" + lostItem.getItemName() + "\"</b>.<br><br>"
                        + "Please log in to APSIT S.A.F.E and check your notifications to claim it back.<br><br>"
                        + "— APSIT S.A.F.E Team"
        );
    }

    /**
     * Checks if a newly reported FOUND item matches any LOST items in the same category,
     * and notifies the users who lost them.
     */
    @Async
    public void checkAndNotifyMatches(Item foundItem) {
        if (!"FOUND".equals(foundItem.getType())) return;

        // Find LOST items with the same category
        List<Item> lostItems = itemRepository.findWithFilters("LOST", foundItem.getCategory(), null, null);
        
        for (Item lostItem : lostItems) {
            // Ensure the lost item is not already resolved
            if ("RESOLVED".equals(lostItem.getStatus())) continue;
            
            // Only notify if the reporter of the lost item is valid
            if (lostItem.getReportedBy() != null) {
                Long lostReporterId = lostItem.getReportedBy().getId();
                // Prevent self-notification if same user reports lost then finds it
                if (foundItem.getReportedBy() != null && foundItem.getReportedBy().getId().equals(lostReporterId)) continue;
                
                Notification matchNotif = Notification.builder()
                        .userId(lostReporterId)
                        .userType("USER")
                        .title("Potential Match Found in " + foundItem.getCategory() + "!")
                        .message("A new item matching the category of your lost '" + lostItem.getItemName() + "' was just reported as found. Check it out on the Discovery Hub!")
                        .type("ITEM_MATCH")
                        .itemId(foundItem.getId()) // Link to the new found item
                        .build();
                notificationRepository.save(matchNotif);

                sendEmailIfEnabled(
                        lostItem.getReportedBy().getEmail(),
                        "Potential Match for your Lost Item",
                        "Hello " + lostItem.getReportedBy().getName() + ",\n\n"
                                + "A new item matching the category of your lost '" + lostItem.getItemName() + "' has been reported as FOUND.\n\n"
                                + "Details: " + foundItem.getItemName() + " near " + foundItem.getLocation() + "\n"
                                + "Please check the APSIT S.A.F.E Discovery Hub to see if it belongs to you.\n\n"
                                + "— APSIT S.A.F.E Team"
                );
            }
        }
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

        sendEmailToAllAdmins(
                "New Claim Request",
                claim.getClaimedByName() + " has submitted a claim for \"" + claim.getItem().getItemName() + "\". Please review their proof."
        );
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

        sendEmailIfEnabled(
                claim.getClaimedBy().getEmail(),
                "Claim Approved!",
                "Hello <b>" + claim.getClaimedBy().getName() + "</b>,\n\n"
                        + "Your claim for <b>\"" + claim.getItem().getItemName() + "\"</b> has been approved.\n\n"
                        + "Show the QR code below to the admin to collect your item:\n\n"
                        + "<img src=\"https://quickchart.io/qr?text=https://apsit-safe.edu.in/pickup/" + claim.getPickupToken() + "&size=250\" alt=\"Pickup QR Code\" style=\"border: 10px solid white; display: block;\" />\n\n"
                        + "— APSIT S.A.F.E Team"
        );
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

        sendEmailIfEnabled(
                claim.getClaimedBy().getEmail(),
                "Claim Not Approved",
                "Hello " + claim.getClaimedBy().getName() + ",\n\n"
                        + "Your claim for \"" + claim.getItem().getItemName() + "\" was reviewed and not approved.\n"
                        + "If you believe this is incorrect, please submit a new claim with additional proof.\n\n"
                        + "— APSIT S.A.F.E Team"
        );
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

            sendEmailIfEnabled(
                    claim.getClaimedBy().getEmail(),
                    "Item Picked Up Successfully",
                    "Hello " + claim.getClaimedBy().getName() + ",\n\n"
                            + "You have successfully picked up \"" + claim.getItem().getItemName() + "\".\n"
                            + "Thank you for using APSIT S.A.F.E!\n\n"
                            + "— APSIT S.A.F.E Team"
            );
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

                sendEmailIfEnabled(
                        claim.getItem().getReportedBy().getEmail(),
                        "Item Returned to Owner",
                        "Hello " + claim.getItem().getReportedBy().getName() + ",\n\n"
                                + "The item \"" + claim.getItem().getItemName() + "\" that you reported has been picked up by its owner.\n"
                                + "Thank you for helping!\n\n"
                                + "— APSIT S.A.F.E Team"
                );
            }
        }
    }

    /**
     * When a new user registers → notify all admins
     */
    public void notifyNewUserRegistered(User user) {
        Notification notification = Notification.builder()
                .userId(null) // broadcast to all admins
                .userType("ADMIN")
                .title("New Student Registered")
                .message(user.getName() + " (" + user.getEmail() + ") has registered on APSIT S.A.F.E.")
                .type("USER_REGISTERED")
                .build();
        notificationRepository.save(notification);

        sendEmailToAllAdmins(
                "New Student Registered",
                user.getName() + " (" + user.getEmail() + ") has registered on APSIT S.A.F.E."
        );
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

    // ===== EMAIL HELPERS =====

    /**
     * Send email to a single recipient if mail is enabled.
     */
    private void sendEmailIfEnabled(String toEmail, String subject, String body) {
        if (!mailEnabled || mailSender == null || toEmail == null) return;
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(toEmail);
            helper.setSubject("[APSIT S.A.F.E] " + subject);
            
            // Convert newlines to HTML breaks if they aren't already tags
            String htmlBody = body.replace("\n", "<br>");
            helper.setText(htmlBody, true); // true sets it to HTML format
            
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email to " + toEmail + ": " + e.getMessage());
        }
    }

    /**
     * Send email to all admins if mail is enabled.
     */
    private void sendEmailToAllAdmins(String subject, String body) {
        if (!mailEnabled || mailSender == null) return;
        try {
            List<Admin> admins = adminRepository.findAll();
            for (Admin admin : admins) {
                sendEmailIfEnabled(admin.getEmail(), subject,
                        "Hello " + admin.getName() + ",\n\n" + body + "\n\n— APSIT S.A.F.E System");
            }
        } catch (Exception e) {
            System.err.println("Failed to send admin email notifications: " + e.getMessage());
        }
    }
}

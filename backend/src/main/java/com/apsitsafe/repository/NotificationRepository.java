package com.apsitsafe.repository;

import com.apsitsafe.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Notifications targeted at a specific user
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Broadcast notifications for a user type (e.g. all admins)
    List<Notification> findByUserTypeAndUserIdIsNullOrderByCreatedAtDesc(String userType);

    // Count unread notifications for a specific user
    long countByUserIdAndIsRead(Long userId, Boolean isRead);

    // Count unread broadcast notifications for admin
    long countByUserTypeAndUserIdIsNullAndIsRead(String userType, Boolean isRead);
}

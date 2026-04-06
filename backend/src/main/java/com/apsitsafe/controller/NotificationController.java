package com.apsitsafe.controller;

import com.apsitsafe.config.JwtUtil;
import com.apsitsafe.model.Notification;
import com.apsitsafe.service.NotificationService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private JwtUtil jwtUtil;

    /**
     * GET /api/notifications — get current user's notifications
     */
    @GetMapping
    public ResponseEntity<?> getUserNotifications(HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }
        List<Notification> notifications = notificationService.getUserNotifications(userId);
        return ResponseEntity.ok(notifications);
    }

    /**
     * GET /api/notifications/admin — get admin broadcast notifications
     */
    @GetMapping("/admin")
    public ResponseEntity<?> getAdminNotifications() {
        List<Notification> notifications = notificationService.getAdminNotifications();
        return ResponseEntity.ok(notifications);
    }

    /**
     * GET /api/notifications/unread-count — get unread count for current user
     */
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount(HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        String role = extractRole(httpRequest);

        long count = 0;
        if (userId != null) {
            count = notificationService.getUnreadCount(userId);
        }
        // If admin, also add admin broadcast unread count
        if ("ADMIN".equalsIgnoreCase(role)) {
            count += notificationService.getAdminUnreadCount();
        }

        return ResponseEntity.ok(Map.of("count", count));
    }

    /**
     * PUT /api/notifications/{id}/read — mark a notification as read
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        try {
            Notification notification = notificationService.markAsRead(id);
            return ResponseEntity.ok(notification);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PUT /api/notifications/read-all — mark all notifications as read
     */
    @PutMapping("/read-all")
    public ResponseEntity<?> markAllRead(HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        String role = extractRole(httpRequest);

        if (userId != null) {
            notificationService.markAllRead(userId);
        }
        if ("ADMIN".equalsIgnoreCase(role)) {
            notificationService.markAllAdminRead();
        }

        return ResponseEntity.ok(Map.of("message", "All notifications marked as read"));
    }

    private Long extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        return null;
    }

    private String extractRole(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractRole(token);
        }
        return null;
    }
}

package com.apsitsafe.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId; // nullable — null means broadcast (e.g. all admins)

    @Column(name = "user_type", nullable = false)
    private String userType; // "USER" or "ADMIN"

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(nullable = false)
    private String type; // ITEM_FOUND, CLAIM_SUBMITTED, CLAIM_APPROVED, CLAIM_REJECTED, PICKUP_COMPLETE

    @Column(name = "is_read", nullable = false)
    @Builder.Default
    private Boolean isRead = false;

    @Column(name = "item_id")
    private Long itemId; // nullable — reference to related item

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

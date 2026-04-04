package com.apsitsafe.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "claim_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "item_id", nullable = false)
    @JsonIgnoreProperties({"reportedBy", "hibernateLazyInitializer", "handler"})
    private Item item;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "claimed_by_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User claimedBy;

    @Column(name = "claimed_by_name", nullable = false)
    private String claimedByName;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String proof;

    @Column(nullable = false)
    @Builder.Default
    private String status = "pending"; // pending, approved, rejected

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewed_by_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private Admin reviewedBy;

    // ===== QR PICKUP SYSTEM =====

    @Column(name = "pickup_token", unique = true)
    private String pickupToken; // Unique token generated on approval, encoded in QR

    @Column(name = "picked_up")
    @Builder.Default
    private Boolean pickedUp = false; // True after admin scans QR and confirms pickup

    @Column(name = "picked_up_at")
    private LocalDateTime pickedUpAt; // Timestamp of pickup

    // =============================

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();
}

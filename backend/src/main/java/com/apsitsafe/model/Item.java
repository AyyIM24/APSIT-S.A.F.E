package com.apsitsafe.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Item {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "item_name", nullable = false)
    private String itemName;

    @Column(nullable = false)
    private String type; // "LOST" or "FOUND"

    @Column(nullable = false)
    @Builder.Default
    private String status = "LOST"; // LOST, FOUND, SECURED, RESOLVED

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private LocalDate date;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "contact_name")
    private String contactName;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "contact_email")
    private String contactEmail;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reported_by_id")
    @JsonIgnoreProperties({"password", "hibernateLazyInitializer", "handler"})
    private User reportedBy;

    // Links a FOUND item back to the original LOST item (nullable — only set when finder links to a lost report)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "linked_lost_item_id")
    @JsonIgnoreProperties({"linkedLostItem", "hibernateLazyInitializer", "handler"})
    private Item linkedLostItem;

    @Column(name = "created_at", updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}

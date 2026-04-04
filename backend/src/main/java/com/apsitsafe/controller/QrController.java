package com.apsitsafe.controller;

import com.apsitsafe.model.ClaimRequest;
import com.apsitsafe.service.ClaimService;
import com.apsitsafe.service.QrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/qr")
public class QrController {

    @Autowired
    private QrService qrService;

    @Autowired
    private ClaimService claimService;

    @Value("${app.qr.base-url:http://localhost:3000}")
    private String qrBaseUrl;

    /**
     * Generate QR code image (PNG) for an approved claim.
     * The QR encodes a verification URL with the pickup token.
     *
     * GET /api/qr/generate/{claimId}
     * Returns: PNG image
     */
    @GetMapping(value = "/generate/{claimId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<?> generateQrForClaim(@PathVariable Long claimId,
                                                 @RequestParam(defaultValue = "300") int size) {
        try {
            // Get the claim and check it's approved
            ClaimRequest claim = claimService.getAllClaims().stream()
                    .filter(c -> c.getId().equals(claimId))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("Claim not found"));

            if (!"approved".equals(claim.getStatus())) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "QR can only be generated for approved claims"
                ));
            }

            if (claim.getPickupToken() == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "No pickup token found for this claim"
                ));
            }

            // Build the QR content — a verification URL using configurable base URL
            String qrContent = String.format(
                    "%s/verify/%s|ITEM:%s|CLAIMANT:%s|TOKEN:%s",
                    qrBaseUrl,
                    claim.getPickupToken(),
                    claim.getItem().getItemName(),
                    claim.getClaimedByName(),
                    claim.getPickupToken()
            );

            byte[] qrImage = qrService.generateQrCode(qrContent, size, size);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.set("Content-Disposition",
                    "inline; filename=\"pickup-qr-" + claim.getPickupToken() + ".png\"");

            return new ResponseEntity<>(qrImage, headers, HttpStatus.OK);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Generate a QR code for any arbitrary text/URL.
     * Useful for generating QR labels for found items.
     *
     * GET /api/qr/item/{itemId}
     * Returns: PNG image
     */
    @GetMapping(value = "/item/{itemId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<?> generateQrForItem(@PathVariable Long itemId,
                                                @RequestParam(defaultValue = "300") int size) {
        try {
            String qrContent = String.format("%s/item/%d", qrBaseUrl, itemId);
            byte[] qrImage = qrService.generateQrCode(qrContent, size, size);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG);
            headers.set("Content-Disposition",
                    "inline; filename=\"item-" + itemId + "-qr.png\"");

            return new ResponseEntity<>(qrImage, headers, HttpStatus.OK);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Verify a pickup token from a scanned QR code.
     * Returns claim details without marking as picked up.
     *
     * GET /api/qr/verify/{token}
     */
    @GetMapping("/verify/{token}")
    public ResponseEntity<?> verifyPickupToken(@PathVariable String token) {
        try {
            ClaimRequest claim = claimService.findByPickupToken(token);

            Map<String, Object> result = new HashMap<>();
            result.put("valid", true);
            result.put("claimId", claim.getId());
            result.put("itemName", claim.getItem().getItemName());
            result.put("itemLocation", claim.getItem().getLocation());
            result.put("claimedBy", claim.getClaimedByName());
            result.put("claimantEmail", claim.getEmail());
            result.put("status", claim.getStatus());
            result.put("pickupToken", claim.getPickupToken());
            result.put("pickedUp", claim.getPickedUp());
            result.put("pickedUpAt", claim.getPickedUpAt());
            result.put("approvedAt", claim.getUpdatedAt());

            if (Boolean.TRUE.equals(claim.getPickedUp())) {
                result.put("message", "⚠️ This item has ALREADY been picked up on " + claim.getPickedUpAt());
            } else {
                result.put("message", "✅ Valid pickup token. Ready for item handover.");
            }

            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {
            Map<String, Object> error = new HashMap<>();
            error.put("valid", false);
            error.put("message", "❌ Invalid or expired pickup token");
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    /**
     * Confirm item pickup after admin scans QR.
     * Marks the claim as picked up with timestamp.
     *
     * PUT /api/qr/pickup/{token}
     */
    @PutMapping("/pickup/{token}")
    public ResponseEntity<?> confirmPickup(@PathVariable String token) {
        try {
            ClaimRequest claim = claimService.confirmPickup(token);

            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "🎉 Item successfully handed over!");
            result.put("itemName", claim.getItem().getItemName());
            result.put("pickedUpBy", claim.getClaimedByName());
            result.put("pickedUpAt", claim.getPickedUpAt());
            result.put("pickupToken", claim.getPickupToken());

            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

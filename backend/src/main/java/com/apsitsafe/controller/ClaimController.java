package com.apsitsafe.controller;

import com.apsitsafe.config.JwtUtil;
import com.apsitsafe.dto.ClaimRequestDTO;
import com.apsitsafe.model.ClaimRequest;
import com.apsitsafe.service.ClaimService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    @Autowired
    private ClaimService claimService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> submitClaim(@Valid @RequestBody ClaimRequestDTO dto,
                                         HttpServletRequest httpRequest) {
        try {
            Long userId = extractUserId(httpRequest);
            ClaimRequest claim = claimService.submitClaim(dto, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(claim);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<ClaimRequest>> getAllClaims(
            @RequestParam(required = false) String status) {
        List<ClaimRequest> claims = claimService.getClaimsByStatus(status);
        return ResponseEntity.ok(claims);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approveClaim(@PathVariable Long id) {
        try {
            ClaimRequest claim = claimService.approveClaim(id);
            Map<String, Object> resp = new HashMap<>();
            resp.put("message", "Claim approved successfully");
            resp.put("claim", claim);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectClaim(@PathVariable Long id) {
        try {
            ClaimRequest claim = claimService.rejectClaim(id);
            Map<String, Object> resp = new HashMap<>();
            resp.put("message", "Claim rejected");
            resp.put("claim", claim);
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/item/{itemId}")
    public ResponseEntity<List<ClaimRequest>> getClaimsByItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(claimService.getClaimsByItem(itemId));
    }

    @GetMapping("/my-claims")
    public ResponseEntity<?> getMyClaims(HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
        }
        return ResponseEntity.ok(claimService.getClaimsByUser(userId));
    }

    private Long extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            return jwtUtil.extractUserId(token);
        }
        return null;
    }
}

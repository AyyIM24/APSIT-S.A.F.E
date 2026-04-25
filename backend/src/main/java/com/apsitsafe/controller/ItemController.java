package com.apsitsafe.controller;

import com.apsitsafe.config.JwtUtil;
import com.apsitsafe.dto.ItemRequest;
import com.apsitsafe.model.Item;
import com.apsitsafe.service.ItemService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/items")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getAllItems(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            HttpServletRequest httpRequest) {

        // Extract userId and role from JWT (nullable — public endpoint)
        Long userId = extractUserId(httpRequest);
        boolean isAdmin = "ADMIN".equalsIgnoreCase(extractRole(httpRequest));

        // If page & size are provided, return paginated results
        if (page != null && size != null) {
            Page<Item> pagedItems = itemService.getFilteredItemsPaged(type, category, location, search, page, size);
            Map<String, Object> response = new HashMap<>();
            response.put("content", pagedItems.getContent());
            response.put("totalPages", pagedItems.getTotalPages());
            response.put("totalElements", pagedItems.getTotalElements());
            response.put("currentPage", pagedItems.getNumber());
            response.put("pageSize", pagedItems.getSize());
            return ResponseEntity.ok(response);
        }

        // Default: return filtered items with visibility rules
        List<Item> items = itemService.getFilteredItems(type, category, location, search, userId, isAdmin);
        return ResponseEntity.ok(items);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        try {
            Item item = itemService.getItemById(id);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/lost")
    public ResponseEntity<?> reportLostItem(@Valid @RequestBody ItemRequest request,
                                            HttpServletRequest httpRequest) {
        try {
            Long userId = extractUserId(httpRequest);
            Item item = itemService.reportLostItem(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/found")
    public ResponseEntity<?> reportFoundItem(@Valid @RequestBody ItemRequest request,
                                             HttpServletRequest httpRequest) {
        try {
            Long userId = extractUserId(httpRequest);
            Item item = itemService.reportFoundItem(request, userId);
            return ResponseEntity.status(HttpStatus.CREATED).body(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/my-reports")
    public ResponseEntity<?> getMyReports(HttpServletRequest httpRequest) {
        try {
            Long userId = extractUserId(httpRequest);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
            }
            List<Item> items = itemService.getMyReports(userId);
            return ResponseEntity.ok(items);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @Valid @RequestBody ItemRequest request) {
        try {
            Item item = itemService.updateItem(id, request);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateItemStatus(@PathVariable Long id, @RequestBody Map<String, String> body, HttpServletRequest httpRequest) {
        try {
            String status = body.get("status");
            Long userId = extractUserId(httpRequest);
            boolean isAdmin = "ADMIN".equalsIgnoreCase(extractRole(httpRequest));
            Item item = itemService.updateItemStatus(id, status, userId, isAdmin);
            return ResponseEntity.ok(item);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            itemService.deleteItem(id);
            Map<String, String> resp = new HashMap<>();
            resp.put("message", "Item deleted successfully");
            return ResponseEntity.ok(resp);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private Long extractUserId(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                return jwtUtil.extractUserId(token);
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }

    private String extractRole(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                return jwtUtil.extractRole(token);
            } catch (Exception e) {
                return null;
            }
        }
        return null;
    }
}

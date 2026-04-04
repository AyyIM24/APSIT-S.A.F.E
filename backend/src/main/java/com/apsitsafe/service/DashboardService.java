package com.apsitsafe.service;

import com.apsitsafe.dto.DashboardStats;
import com.apsitsafe.repository.ClaimRequestRepository;
import com.apsitsafe.repository.ItemRepository;
import com.apsitsafe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ClaimRequestRepository claimRequestRepository;

    public DashboardStats getStats() {
        long totalLost = itemRepository.countByType("LOST");
        long totalFound = itemRepository.countByType("FOUND");
        long pendingClaims = claimRequestRepository.countByStatus("pending");
        long resolvedCount = itemRepository.countByStatus("RESOLVED");
        long securedCount = itemRepository.countByStatus("SECURED");
        long totalUsers = userRepository.count();
        long totalItems = itemRepository.count();

        // Category breakdown
        List<Object[]> categoryRaw = itemRepository.countByCategory();
        List<Map<String, Object>> categoryData = new ArrayList<>();
        for (Object[] row : categoryRaw) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0]);
            map.put("value", row[1]);
            categoryData.add(map);
        }

        // Location breakdown
        List<Object[]> locationRaw = itemRepository.countByLocation();
        List<Map<String, Object>> locationData = new ArrayList<>();
        for (Object[] row : locationRaw) {
            Map<String, Object> map = new HashMap<>();
            map.put("name", row[0]);
            map.put("count", row[1]);
            locationData.add(map);
        }

        return DashboardStats.builder()
                .totalLost(totalLost)
                .totalFound(totalFound)
                .pendingClaims(pendingClaims)
                .resolvedCount(resolvedCount)
                .securedCount(securedCount)
                .totalUsers(totalUsers)
                .totalItems(totalItems)
                .categoryData(categoryData)
                .locationData(locationData)
                .build();
    }
}

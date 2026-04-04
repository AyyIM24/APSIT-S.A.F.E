package com.apsitsafe.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {

    private long totalLost;
    private long totalFound;
    private long pendingClaims;
    private long resolvedCount;
    private long securedCount;
    private long totalUsers;
    private long totalItems;

    private List<Map<String, Object>> categoryData;
    private List<Map<String, Object>> locationData;
}

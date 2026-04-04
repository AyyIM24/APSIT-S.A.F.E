package com.apsitsafe.repository;

import com.apsitsafe.model.ClaimRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRequestRepository extends JpaRepository<ClaimRequest, Long> {

    List<ClaimRequest> findByStatus(String status);

    List<ClaimRequest> findByItemId(Long itemId);

    List<ClaimRequest> findByClaimedById(Long userId);

    Optional<ClaimRequest> findByPickupToken(String pickupToken);

    long countByStatus(String status);
}

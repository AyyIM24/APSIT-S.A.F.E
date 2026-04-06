package com.apsitsafe.repository;

import com.apsitsafe.model.OtpVerification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpVerificationRepository extends JpaRepository<OtpVerification, Long> {

    Optional<OtpVerification> findTopByUserIdAndIsUsedFalseOrderByCreatedAtDesc(Long userId);

    Optional<OtpVerification> findByUserIdAndOtpCode(Long userId, String otpCode);
}

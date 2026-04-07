package com.apsitsafe.service;

import com.apsitsafe.model.OtpVerification;
import com.apsitsafe.model.User;
import com.apsitsafe.repository.OtpVerificationRepository;
import com.apsitsafe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
public class OtpService {

    @Autowired
    private OtpVerificationRepository otpRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.enabled:false}")
    private boolean mailEnabled;

    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * Generate a 6-digit OTP, save it to DB, and send it via email (or log to console in dev mode).
     */
    public void generateAndSendOtp(User user) {
        // Invalidate any existing unused OTP for this user
        otpRepository.findTopByUserIdAndIsUsedFalseOrderByCreatedAtDesc(user.getId())
                .ifPresent(otp -> {
                    otp.setIsUsed(true);
                    otpRepository.save(otp);
                });

        // Generate 6-digit OTP
        String otpCode = String.format("%06d", RANDOM.nextInt(1000000));

        // Save OTP to database
        OtpVerification otp = OtpVerification.builder()
                .userId(user.getId())
                .otpCode(otpCode)
                .expiresAt(LocalDateTime.now().plusMinutes(5))
                .build();
        otpRepository.save(otp);

        // Build email content
        String subject = "[APSIT S.A.F.E] Your verification code";
        String body = "Hello " + user.getName() + ",\n\n"
                + "Your verification code is: " + otpCode + "\n\n"
                + "This code is valid for 5 minutes.\n\n"
                + "If you did not request this, please ignore this email.\n\n"
                + "— APSIT S.A.F.E Team";

        // Send email or log to console
        if (mailEnabled && mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(user.getEmail());
                message.setSubject(subject);
                message.setText(body);
                mailSender.send(message);
                System.out.println("OTP email sent to " + user.getEmail());
            } catch (Exception e) {
                System.err.println("Failed to send OTP email: " + e.getMessage());
                System.out.println("==== DEV MODE OTP for " + user.getEmail() + ": " + otpCode + " ====");
            }
        } else {
            System.out.println("==== DEV MODE OTP for " + user.getEmail() + ": " + otpCode + " ====");
        }
    }

    /**
     * Verify an OTP code for a user. Enforces 3-attempt limit and 5-minute expiry.
     * On success, marks user as email-verified.
     */
    public boolean verifyOtp(Long userId, String otpCode) {
        OtpVerification otp = otpRepository.findTopByUserIdAndIsUsedFalseOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new RuntimeException("No OTP found. Please request a new one."));

        // Increment attempt count
        otp.setAttemptCount(otp.getAttemptCount() + 1);

        // Check max attempts (3)
        if (otp.getAttemptCount() >= 3) {
            otp.setIsUsed(true);
            otpRepository.save(otp);
            throw new RuntimeException("Too many attempts. Please request a new OTP.");
        }

        // Check expiry (5 minutes)
        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            otp.setIsUsed(true);
            otpRepository.save(otp);
            throw new RuntimeException("OTP expired. Please request a new one.");
        }

        // Check code match
        if (!otpCode.equals(otp.getOtpCode())) {
            otpRepository.save(otp);
            throw new RuntimeException("Invalid OTP.");
        }

        // ✅ Success — mark OTP as used
        otp.setIsUsed(true);
        otpRepository.save(otp);

        // Mark user as email-verified
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setIsEmailVerified(true);
        userRepository.save(user);

        return true;
    }

    /**
     * Resend OTP — invalidates old one and generates a new one.
     */
    public void resendOtp(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        generateAndSendOtp(user);
    }

    /**
     * Verify OTP without marking user's email as verified.
     * Used for password reset flow where email is already verified.
     */
    public boolean verifyOtpWithoutMarkingVerified(Long userId, String otpCode) {
        OtpVerification otp = otpRepository.findTopByUserIdAndIsUsedFalseOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new RuntimeException("No OTP found. Please request a new one."));

        otp.setAttemptCount(otp.getAttemptCount() + 1);

        if (otp.getAttemptCount() >= 3) {
            otp.setIsUsed(true);
            otpRepository.save(otp);
            throw new RuntimeException("Too many attempts. Please request a new OTP.");
        }

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            otp.setIsUsed(true);
            otpRepository.save(otp);
            throw new RuntimeException("OTP expired. Please request a new one.");
        }

        if (!otpCode.equals(otp.getOtpCode())) {
            otpRepository.save(otp);
            throw new RuntimeException("Invalid OTP.");
        }

        otp.setIsUsed(true);
        otpRepository.save(otp);
        return true;
    }
}


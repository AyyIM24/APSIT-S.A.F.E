package com.apsitsafe.controller;

import com.apsitsafe.config.JwtUtil;
import com.apsitsafe.dto.*;
import com.apsitsafe.model.User;
import com.apsitsafe.repository.UserRepository;
import com.apsitsafe.service.AuthService;
import com.apsitsafe.service.GoogleAuthService;
import com.apsitsafe.service.OtpService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private GoogleAuthService googleAuthService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${apsit.allowed.domain:apsit.edu.in}")
    private String allowedDomain;

    // ==================== EXISTING ENDPOINTS ====================

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            LoginResponse response = authService.registerUser(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.loginUser(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.loginAdmin(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== GOOGLE OAUTH ====================

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleLoginRequest request) {
        try {
            // 1. Verify Google ID token
            GoogleIdToken.Payload payload = googleAuthService.verifyGoogleToken(request.getIdToken());
            String email = payload.getEmail();
            String name = (String) payload.get("name");
            String googleSub = payload.getSubject();

            // 2. Domain restriction
            if (email == null || !email.endsWith("@" + allowedDomain)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Only @" + allowedDomain + " email addresses are allowed"));
            }

            // 3. Check if user exists
            User user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                // Create new user from Google data
                user = User.builder()
                        .name(name != null ? name : email.split("@")[0])
                        .email(email)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .googleSub(googleSub)
                        .isEmailVerified(true) // Google already verified their email
                        .build();
                user = userRepository.save(user);
            } else {
                // Update Google sub if not set
                if (user.getGoogleSub() == null) {
                    user.setGoogleSub(googleSub);
                }
                // Mark as verified since Google confirmed their email
                if (!Boolean.TRUE.equals(user.getIsEmailVerified())) {
                    user.setIsEmailVerified(true);
                }
                user = userRepository.save(user);
            }

            // 4. Generate JWT
            String token = jwtUtil.generateToken(user.getEmail(), "USER", user.getId());

            return ResponseEntity.ok(LoginResponse.builder()
                    .token(token)
                    .email(user.getEmail())
                    .name(user.getName())
                    .userId(user.getId())
                    .role("USER")
                    .message("Google login successful")
                    .build());

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== OTP VERIFICATION ====================

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest request) {
        try {
            otpService.verifyOtp(request.getUserId(), request.getOtpCode());

            // OTP verified — generate JWT
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            String token = jwtUtil.generateToken(user.getEmail(), "USER", user.getId());

            return ResponseEntity.ok(LoginResponse.builder()
                    .token(token)
                    .email(user.getEmail())
                    .name(user.getName())
                    .userId(user.getId())
                    .role("USER")
                    .message("Email verified successfully")
                    .build());

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody OtpRequest request) {
        try {
            otpService.resendOtp(request.getUserId());
            return ResponseEntity.ok(Map.of("message", "Verification code sent. Check your email."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ==================== FORGOT PASSWORD ====================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("No account found with this email."));

            otpService.generateAndSendOtp(user);

            return ResponseEntity.ok(Map.of(
                    "message", "Verification code sent to your email.",
                    "userId", user.getId()
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            User user = userRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found."));

            // Verify OTP (this will throw if invalid/expired)
            otpService.verifyOtpWithoutMarkingVerified(user.getId(), request.getOtpCode());

            // Update password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Password reset successfully. You can now login."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

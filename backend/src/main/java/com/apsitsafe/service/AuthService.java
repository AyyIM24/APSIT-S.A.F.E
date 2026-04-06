package com.apsitsafe.service;

import com.apsitsafe.config.JwtUtil;
import com.apsitsafe.dto.LoginRequest;
import com.apsitsafe.dto.LoginResponse;
import com.apsitsafe.dto.RegisterRequest;
import com.apsitsafe.model.Admin;
import com.apsitsafe.model.User;
import com.apsitsafe.repository.AdminRepository;
import com.apsitsafe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private OtpService otpService;

    @Autowired
    private NotificationService notificationService;

    public LoginResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .branch(request.getBranch())
                .year(request.getYear())
                .rollNo(request.getRollNo())
                .isEmailVerified(false)
                .build();

        user = userRepository.save(user);

        // Send OTP for email verification
        try {
            otpService.generateAndSendOtp(user);
        } catch (Exception e) {
            System.err.println("Failed to send OTP: " + e.getMessage());
        }

        // Notify admins about new registration
        try {
            notificationService.notifyNewUserRegistered(user);
        } catch (Exception e) {
            System.err.println("Failed to send registration notification: " + e.getMessage());
        }

        // Return response with requiresOtp=true — NO JWT yet
        return LoginResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role("USER")
                .message("Registration successful. Check your email for a verification code.")
                .requiresOtp(true)
                .build();
    }

    public LoginResponse loginUser(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        if ("suspended".equals(user.getStatus())) {
            throw new RuntimeException("Account is suspended. Contact admin.");
        }

        // Check email verification
        if (user.getIsEmailVerified() == null || !user.getIsEmailVerified()) {
            throw new RuntimeException("EMAIL_NOT_VERIFIED");
        }

        String token = jwtUtil.generateToken(user.getEmail(), "USER", user.getId());

        return LoginResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .userId(user.getId())
                .role("USER")
                .message("Login successful")
                .build();
    }

    public LoginResponse loginAdmin(LoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid admin credentials"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid admin credentials");
        }

        String token = jwtUtil.generateToken(admin.getEmail(), "ADMIN", admin.getId());

        return LoginResponse.builder()
                .token(token)
                .email(admin.getEmail())
                .name(admin.getName())
                .userId(admin.getId())
                .role("ADMIN")
                .message("Admin login successful")
                .build();
    }
}

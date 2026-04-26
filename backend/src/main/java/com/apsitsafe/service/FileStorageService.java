package com.apsitsafe.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${cloudinary.cloud-name:}")
    private String cloudName;

    @Value("${cloudinary.api-key:}")
    private String apiKey;

    @Value("${cloudinary.api-secret:}")
    private String apiSecret;

    private Cloudinary cloudinary;
    private boolean useCloudinary = false;

    @PostConstruct
    public void init() {
        // If Cloudinary credentials are provided, use cloud storage
        if (cloudName != null && !cloudName.isEmpty()
                && apiKey != null && !apiKey.isEmpty()
                && apiSecret != null && !apiSecret.isEmpty()) {
            cloudinary = new Cloudinary(ObjectUtils.asMap(
                    "cloud_name", cloudName,
                    "api_key", apiKey,
                    "api_secret", apiSecret,
                    "secure", true
            ));
            useCloudinary = true;
            System.out.println("☁️ Cloudinary configured — images will be stored in the cloud.");
        } else {
            System.out.println("📁 Cloudinary not configured — using local file storage.");
        }
    }

    public String storeFile(MultipartFile file) {
        if (useCloudinary) {
            return storeToCloudinary(file);
        } else {
            return storeToLocal(file);
        }
    }

    /**
     * Upload to Cloudinary — returns a full HTTPS URL
     */
    private String storeToCloudinary(MultipartFile file) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "apsit-safe",
                    "resource_type", "image"
            ));
            // Return the secure URL directly (e.g. https://res.cloudinary.com/...)
            return (String) result.get("secure_url");
        } catch (IOException ex) {
            throw new RuntimeException("Failed to upload image to Cloudinary: " + ex.getMessage(), ex);
        }
    }

    /**
     * Store to local filesystem — returns a relative path (for local dev)
     */
    private String storeToLocal(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            Path targetLocation = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return "/api/uploads/" + uniqueFilename;
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again.", ex);
        }
    }
}

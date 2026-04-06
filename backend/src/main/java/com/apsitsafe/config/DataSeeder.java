package com.apsitsafe.config;

import com.apsitsafe.model.Admin;
import com.apsitsafe.model.Item;
import com.apsitsafe.model.User;
import com.apsitsafe.model.ClaimRequest;
import com.apsitsafe.repository.AdminRepository;
import com.apsitsafe.repository.ClaimRequestRepository;
import com.apsitsafe.repository.ItemRepository;
import com.apsitsafe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private ClaimRequestRepository claimRequestRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed Admin
        if (!adminRepository.existsByEmail("admin@apsit.edu.in")) {
            Admin admin = Admin.builder()
                    .name("Admin")
                    .email("admin@apsit.edu.in")
                    .password(passwordEncoder.encode("admin123"))
                    .role("ADMIN")
                    .build();
            adminRepository.save(admin);
            System.out.println("✅ Default admin created: admin@apsit.edu.in / admin123");
        }

        // Seed Users
        if (!userRepository.existsByEmail("ayyan@apsit.edu.in")) {
            User u1 = userRepository.save(User.builder().name("Ayyan Muqadam").email("ayyan@apsit.edu.in")
                    .password(passwordEncoder.encode("password123")).phone("+91 8591752540")
                    .branch("Information Technology").year("Second Year").rollNo("IT-2024-001").build());
            User u2 = userRepository.save(User.builder().name("Rahul Sharma").email("rahul@apsit.edu.in")
                    .password(passwordEncoder.encode("password123")).phone("+91 9876543210")
                    .branch("Computer Science").year("Third Year").rollNo("CS-2023-045").build());
            User u3 = userRepository.save(User.builder().name("Priya Patel").email("priya@apsit.edu.in")
                    .password(passwordEncoder.encode("password123")).phone("+91 9123456789")
                    .branch("Electronics").year("Second Year").rollNo("EC-2024-022").build());
            User u4 = userRepository.save(User.builder().name("Amit Kumar").email("amit@apsit.edu.in")
                    .password(passwordEncoder.encode("password123")).phone("+91 8765432109")
                    .branch("Mechanical").year("Third Year").rollNo("ME-2023-018").build());
            User u5 = userRepository.save(User.builder().name("Bishnupriya Mohapatra").email("bishnupriya@apsit.edu.in")
                    .password(passwordEncoder.encode("password123")).phone("+91 7654321098")
                    .branch("Information Technology").year("Second Year").rollNo("IT-2024-008").build());
            System.out.println("✅ 5 sample users created");

            // Seed Items
            Item i1 = itemRepository.save(Item.builder().itemName("Blue HP Laptop").type("LOST").status("LOST")
                    .category("electronics").location("Library 2nd Floor").date(LocalDate.of(2026, 2, 14))
                    .description("Blue HP Pavilion laptop with APSIT sticker on lid. Was left on a desk near the window.")
                    .imageUrl("https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")
                    .contactName("Ayyan Muqadam").contactPhone("+91 8591752540").contactEmail("ayyan@apsit.edu.in")
                    .reportedBy(u1).build());
            Item i2 = itemRepository.save(Item.builder().itemName("iPhone 13").type("FOUND").status("FOUND")
                    .category("electronics").location("Canteen").date(LocalDate.of(2026, 2, 13))
                    .description("White iPhone 13 found near the food counter. Has a transparent case with dried flowers.")
                    .imageUrl("https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")
                    .contactName("Amit Kumar").contactPhone("+91 8765432109").contactEmail("amit@apsit.edu.in")
                    .reportedBy(u4).build());
            Item i3 = itemRepository.save(Item.builder().itemName("APSIT ID Card").type("LOST").status("LOST")
                    .category("id-cards").location("Lab 402").date(LocalDate.of(2026, 2, 12))
                    .description("Student ID card for IT department. Name partially visible.")
                    .imageUrl("https://images.unsplash.com/photo-1633265486064-086b219458ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")
                    .contactName("Rahul Sharma").contactPhone("+91 9876543210").contactEmail("rahul@apsit.edu.in")
                    .reportedBy(u2).build());
            Item i4 = itemRepository.save(Item.builder().itemName("Blue Umbrella").type("FOUND").status("FOUND")
                    .category("others").location("Main Gate").date(LocalDate.of(2026, 2, 11))
                    .description("Blue foldable umbrella found near the main gate security cabin.")
                    .imageUrl("https://images.unsplash.com/photo-1559132219-c689fccc099a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")
                    .contactName("Bishnupriya Mohapatra").contactPhone("+91 7654321098").contactEmail("bishnupriya@apsit.edu.in")
                    .reportedBy(u5).build());
            Item i5 = itemRepository.save(Item.builder().itemName("Data Structures Notes").type("LOST").status("LOST")
                    .category("books").location("Seminar Hall").date(LocalDate.of(2026, 2, 10))
                    .description("Handwritten DS notes, about 50 pages, spiral bound. Has name written inside.")
                    .imageUrl("https://images.unsplash.com/photo-1544816155-12df9643f363?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")
                    .contactName("Priya Patel").contactPhone("+91 9123456789").contactEmail("priya@apsit.edu.in")
                    .reportedBy(u3).build());
            Item i6 = itemRepository.save(Item.builder().itemName("Calculator").type("FOUND").status("SECURED")
                    .category("electronics").location("Lab 401").date(LocalDate.of(2026, 2, 9))
                    .description("Casio scientific calculator found in Lab 401 after the exam.")
                    .imageUrl("https://images.unsplash.com/photo-1587145820266-a5951ee6f620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80")
                    .contactName("Amit Kumar").contactPhone("+91 8765432109").contactEmail("amit@apsit.edu.in")
                    .reportedBy(u4).build());
            System.out.println("✅ 6 sample items created");

            // Seed Claims
            claimRequestRepository.save(ClaimRequest.builder()
                    .item(i1).claimedBy(u2).claimedByName("Rahul Sharma").email("rahul@apsit.edu.in")
                    .proof("I lost my blue HP laptop in the library on Feb 14. It has a Batman sticker on the back and my name engraved on the bottom.")
                    .status("pending").build());
            claimRequestRepository.save(ClaimRequest.builder()
                    .item(i2).claimedBy(u3).claimedByName("Priya Patel").email("priya@apsit.edu.in")
                    .proof("This is my iPhone 13. It has a purple case with flower patterns. The lock screen wallpaper is a photo of my dog.")
                    .status("pending").build());
            claimRequestRepository.save(ClaimRequest.builder()
                    .item(i3).claimedBy(u4).claimedByName("Amit Kumar").email("amit@apsit.edu.in")
                    .proof("My student ID card with roll number CS-2023-045. The card also has my library code on the back.")
                    .status("approved").build());
            System.out.println("✅ 3 sample claim requests created");
        }
    }
}

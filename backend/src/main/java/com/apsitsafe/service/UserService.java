package com.apsitsafe.service;

import com.apsitsafe.model.User;
import com.apsitsafe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public List<User> searchUsers(String query) {
        return userRepository.findByNameContainingIgnoreCaseOrEmailContainingIgnoreCase(query, query);
    }

    public User toggleSuspend(Long id) {
        User user = getUserById(id);
        if ("active".equals(user.getStatus())) {
            user.setStatus("suspended");
        } else {
            user.setStatus("active");
        }
        return userRepository.save(user);
    }

    public User updateProfile(Long id, User updatedUser) {
        User user = getUserById(id);
        if (updatedUser.getName() != null) user.setName(updatedUser.getName());
        if (updatedUser.getPhone() != null) user.setPhone(updatedUser.getPhone());
        if (updatedUser.getBranch() != null) user.setBranch(updatedUser.getBranch());
        if (updatedUser.getYear() != null) user.setYear(updatedUser.getYear());
        if (updatedUser.getRollNo() != null) user.setRollNo(updatedUser.getRollNo());
        return userRepository.save(user);
    }
}

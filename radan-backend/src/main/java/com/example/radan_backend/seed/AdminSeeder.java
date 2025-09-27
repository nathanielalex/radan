package com.example.radan_backend.seed;

import com.example.radan_backend.entity.User;
import com.example.radan_backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class AdminSeeder implements CommandLineRunner {

    //will seed everytime the app starts

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public void run(String... args) throws Exception {
        createAdminAccount();
    }

    private void createAdminAccount() {
        String adminEmail = "admin@radan.com";

        Optional<User> optionalAdmin = userRepository.findByEmail(adminEmail);

        // If admin account doesn't exist, create it
        if (optionalAdmin.isEmpty()) {
            User admin = new User();
            admin.setName("Administrator");
            admin.setEmail(adminEmail);
            admin.setPhoneNumber("0000000000");

            admin.setPassword(passwordEncoder.encode("admin123"));

            // Set the role to ROLE_ADMIN
            admin.setRole("ROLE_ADMIN");

            userRepository.save(admin);
            System.out.println("Admin account created successfully!");
        } else {
            System.out.println("Admin account already exists.");
        }
    }
}

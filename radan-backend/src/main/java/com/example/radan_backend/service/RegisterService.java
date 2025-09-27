package com.example.radan_backend.service;

import com.example.radan_backend.Command;
import com.example.radan_backend.dto.LoginResponse;
import com.example.radan_backend.dto.RegisterRequest;
import com.example.radan_backend.entity.User;
import com.example.radan_backend.exceptions.UserAlreadyExistsException;
import com.example.radan_backend.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class RegisterService implements Command<RegisterRequest, String> {

    private final UserRepository userRepository;

    private final BCryptPasswordEncoder encoder;

    public RegisterService(UserRepository userRepository, BCryptPasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @Override
    public ResponseEntity<String> execute(RegisterRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        //also need better error handling with custom exceptions like before
        if(optionalUser.isEmpty()) {
            User user = new User();
            user.setName(request.getName());
            user.setEmail(request.getEmail());
            user.setPassword(encoder.encode(request.getPassword()));
            user.setPhoneNumber(request.getPhoneNumber());
            user.setRole("ROLE_USER");
            userRepository.save(user);
            return ResponseEntity.ok("register success");
        }

        throw new UserAlreadyExistsException();
    }
}

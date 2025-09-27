package com.example.radan_backend.service;

import com.example.radan_backend.Query;
import com.example.radan_backend.dto.LoginRequest;
import com.example.radan_backend.dto.LoginResponse;
import com.example.radan_backend.entity.User;
import com.example.radan_backend.exceptions.InvalidCredentialsException;
import com.example.radan_backend.repository.UserRepository;
import com.example.radan_backend.security.jwt.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService implements Query<LoginRequest, LoginResponse> {

    private final AuthenticationManager manager;
    private final UserRepository userRepository;

    public LoginService(AuthenticationManager manager, UserRepository userRepository) {
        this.manager = manager;
        this.userRepository = userRepository;
    }

    @Override
    public ResponseEntity<LoginResponse> execute(LoginRequest request) {
        UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(
                request.getEmail(),
                request.getPassword()
        );
        try {
            Authentication authentication = manager.authenticate(token);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String email = authentication.getName();
            Optional<User> user = userRepository.findByEmail(email);
            if(user.isPresent()) {
                String jwt = JwtUtil.generateToken(email, String.valueOf(user.get().getId()), authentication.getAuthorities());
                return ResponseEntity.ok(new LoginResponse(jwt));
            }
            return null;
        } catch (BadCredentialsException ex) {
            throw new InvalidCredentialsException();
        }
    }
}

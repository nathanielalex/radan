package com.example.radan_backend.controller;

import com.example.radan_backend.dto.LoginRequest;
import com.example.radan_backend.dto.LoginResponse;
import com.example.radan_backend.dto.RegisterRequest;
import com.example.radan_backend.service.LoginService;
import com.example.radan_backend.service.RegisterService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    private final LoginService loginService;

    private final RegisterService registerService;

    public AuthController(LoginService loginService, RegisterService registerService) {
        this.loginService = loginService;
        this.registerService = registerService;
    }

    //by peachez
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return loginService.execute(request);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        return registerService.execute(request);
    }
}

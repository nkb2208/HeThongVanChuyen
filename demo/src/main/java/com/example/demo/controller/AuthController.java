package com.example.demo.controller;

import com.example.demo.dto.AuthenticationDTO;
import com.example.demo.dto.AuthenticationRequest;
import com.example.demo.dto.RegisterRequest;
import com.example.demo.repository.TaiKhoanRepository;
import com.example.demo.service.AuthenticationService;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor 
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost", "http://127.0.0.1:5173", "http://127.0.0.1"})
public class AuthController {

    @Autowired
    private TaiKhoanRepository taiKhoanRepository;

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<AuthenticationDTO> register(@RequestBody RegisterRequest request) {
        //TODO: process POST request
        
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequest request) {
        try {
            return ResponseEntity.ok(authenticationService.authenticate(request));
        } catch (LockedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Tài khoản của bạn đã bị khóa!");
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Tài khoản hoặc mật khẩu không đúng!");
        }
    }
    
}

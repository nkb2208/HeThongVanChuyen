package com.example.demo.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;


@RestController 
@RequestMapping("/api/demo-controller")
public class DemoController {
    
    @GetMapping("")
    public ResponseEntity<String> sayHello() {
        return ResponseEntity.ok("Hello");
    }
    
}

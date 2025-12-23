package com.example.controllers;


import com.example.DTO.UserDTO;
import com.example.models.AppUser;
import com.example.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthService authService;

    @PostMapping("/signup")
    public AppUser signup(@RequestBody UserDTO user) {
        return authService.signup(user.getEmail(), user.getPassword());
    }



}

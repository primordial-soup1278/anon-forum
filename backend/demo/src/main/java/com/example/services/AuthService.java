package com.example.services;

import com.example.models.AppUser;
import com.example.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;



    public AppUser signup(String email, String password) {
        if(userRepository.existsByEmail(email)) {
           throw new RuntimeException("Email already exists");
        }

        AppUser appUser = new AppUser();
        appUser.setCreatedAt(LocalDateTime.now());

        return userRepository.save(appUser);
    }

}

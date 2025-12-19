package com.example.repositories;

import com.example.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // select from users where email = ?
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);


}

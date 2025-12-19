package com.example.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Entity
public class Board {
    @Id
    @GeneratedValue
    private Long id;

    private Long ownerId;

    private LocalDateTime createdAt;

    private String name;
    private ArrayList<String> categories;

    /* will contain user id's */
    private ArrayList<Long> members;

}

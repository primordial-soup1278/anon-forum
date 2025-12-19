package com.example.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

import java.time.LocalDateTime;
import java.util.ArrayList;

@Entity
public class Post {

    @Id
    @GeneratedValue
    private Long id;

    private Long posterId;

    private String title;
    private String message;
    private LocalDateTime createdAt;
    private Long upvotes;
    private Long downvotes;

    private ArrayList<String> comments;
}

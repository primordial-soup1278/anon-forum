package com.example.models;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
public class Comment {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(optional = false)
    private Post post;

    @ManyToOne(optional = false)
    private AppUser author;

    @Column(nullable = false)
    private String message;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Comment() {}
    public Comment(Post post, AppUser author, String message) {}

    public Long getId() {
        return id;
    }
    public void setId(Long id) {this.id = id;}

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

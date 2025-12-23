package com.example.DTO;

import java.time.LocalDateTime;

public class CommentDTO {

    private Long id;
    private String message;
    private LocalDateTime createdAt;

    public CommentDTO(Long id, String message, LocalDateTime createdAt) {
        this.id = id;
        this.message = message;
        this.createdAt = createdAt;
    }
}

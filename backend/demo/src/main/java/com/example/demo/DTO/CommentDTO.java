package com.example.demo.DTO;

import java.time.LocalDateTime;

public class CommentDTO {

    private Long id;
    private String content;
    private LocalDateTime createdAt;
    public String authorId;

    public CommentDTO(Long id, String content, LocalDateTime createdAt,  String authorId) {
        this.id = id;
        this.content = content;
        this.createdAt = createdAt;
        this.authorId = authorId;
    }
    public Long getId() { return id; }
    public String getContent() { return content; }
    public String getAuthorId() { return authorId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}

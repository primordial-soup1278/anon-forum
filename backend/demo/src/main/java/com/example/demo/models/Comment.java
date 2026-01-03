package com.example.demo.models;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
public class Comment {

    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, length = 2000)
    private String content;

    // Supabase user id (UUID as string)
    @Column(name = "author_id", nullable = false)
    private String authorID;

    @ManyToOne(optional = false)
    @JoinColumn(name = "post_id")
    private Post post;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Comment() {}
    public Comment(Post post, String authorID, String content) {
        this.post = post;
        this.authorID = authorID;
        this.content = content;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {this.id = id;}

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public Post getPost() { return post;}
    public void setPost(Post post) { this.post = post;}
    public String getAuthorID() { return authorID; }
    public void setAuthorID(String authorID) { this.authorID = authorID; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}

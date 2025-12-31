package com.example.demo.models;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Post {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "author_id", nullable = false)
    private String authorId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "board_id")
    private Board board;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 5000)
    private String message;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;


    @OneToMany(mappedBy = "post")
    private List<PostVote> votes = new ArrayList<>();

    private String category;

    @OneToMany(
            mappedBy = "post",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<Comment> comments = new ArrayList<>();

    public Post() {}

    public Post(String authorId, Board board, String title, String message) {
        this.authorId = authorId;
        this.board = board;
        this.title = title;
        this.message = message;
    }

    // getters
    public Long getId() { return id; }
    public String getAuthorId() { return authorId; }
    public Board getBoard() { return board; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public List<Comment> getComments() { return comments; }
    public List<PostVote> getVotes() { return votes; }
    public String getCategory() { return category;}
    public void setVotes(List<PostVote> votes) { this.votes = votes; }
    // setters if necessary for title/message updates
    public void setCategory(String category) { this.category = category;}
    public void setTitle(String title) { this.title = title; }
    public void setMessage(String message) { this.message = message; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }
    public void setBoard(Board board) { this.board = board; }
}
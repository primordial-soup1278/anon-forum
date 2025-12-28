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

    private String authorID;

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


    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Comment> comments = new ArrayList<>();

    public Post() {}

    public Post(String authorID, Board board, String title, String message) {
        this.authorID = authorID;
        this.board = board;
        this.title = title;
        this.message = message;
    }

    // getters
    public Long getId() { return id; }
    public String getAuthor() { return authorID; }
    public Board getBoard() { return board; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public List<Comment> getComments() { return comments; }
    public List<PostVote> getVotes() { return votes; }
    public void setVotes(List<PostVote> votes) { this.votes = votes; }
    // setters if necessary for title/message updates
    public void setTitle(String title) { this.title = title; }
    public void setMessage(String message) { this.message = message; }
    public void setAuthor(String authorID) { this.authorID = authorID; }
    public void setBoard(Board board) { this.board = board; }
}
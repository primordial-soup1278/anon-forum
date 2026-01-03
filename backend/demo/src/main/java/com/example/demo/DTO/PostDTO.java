package com.example.demo.DTO;

import java.time.LocalDateTime;
import java.util.List;

public class PostDTO {

    private Long id;
    private Long boardId;
    private String title;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private long upVotes;
    private List<CommentDTO> comments;
    private String category;
    private boolean userHasUpvoted;

    public PostDTO() {}
    public PostDTO(Long id, Long boardId, String title, String message,
                   LocalDateTime createdAt, LocalDateTime updatedAt,
                   long upVotes,
                   String category,
                   List<CommentDTO> comments,
                   boolean userHasUpvoted) {
        this.id = id;
        this.boardId = boardId;
        this.title = title;
        this.message = message;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.upVotes = upVotes;
        this.category = category;
        this.comments = comments;
        this.userHasUpvoted = userHasUpvoted;
    }

    // getters
    public boolean getUserHasUpvoted() {return  userHasUpvoted;}
    public String getCategory() { return this.category; }
    public Long getId() { return id; }
    public Long getBoardId() { return boardId; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public long getUpVotes() { return upVotes; }
    public List<CommentDTO> getComments() { return comments; }

    public void setId(Long id) { this.id = id; }
    public void setBoardId(Long boardId) { this.boardId = boardId; }
    public void setTitle(String title) { this.title = title; }
    public void setMessage(String message) { this.message = message; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
    public void setUpVotes(long upVotes) { this.upVotes = upVotes; }
    public void setComments(List<CommentDTO> comments) { this.comments = comments; }
    public void setCategory(String category) { this.category = category; }
    public void setUserHasUpvoted(boolean userHasUpvoted) { this.userHasUpvoted = userHasUpvoted; }
}


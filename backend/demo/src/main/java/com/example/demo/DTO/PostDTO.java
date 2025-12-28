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
    private long downVotes;
    private PostVoteDTO userVote; // current user's vote
    private List<CommentDTO> comments;

    public PostDTO(Long id, Long boardId, String title, String message,
                   LocalDateTime createdAt, LocalDateTime updatedAt,
                   long upVotes, long downVotes,
                   PostVoteDTO userVote, List<CommentDTO> comments) {
        this.id = id;
        this.boardId = boardId;
        this.title = title;
        this.message = message;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.upVotes = upVotes;
        this.downVotes = downVotes;
        this.userVote = userVote;
        this.comments = comments;
    }

    // getters
    public Long getId() { return id; }
    public Long getBoardId() { return boardId; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public long getUpVotes() { return upVotes; }
    public long getDownVotes() { return downVotes; }
    public PostVoteDTO getUserVote() { return userVote; }
    public List<CommentDTO> getComments() { return comments; }
}


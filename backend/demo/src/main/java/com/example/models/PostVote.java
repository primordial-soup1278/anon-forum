package com.example.models;

import jakarta.persistence.*;

@Entity
public class PostVote {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne(optional = false)
    private AppUser user;

    @ManyToOne(optional = false)
    private Post post;

    @Enumerated(EnumType.STRING)
    private VoteType type; // UPVOTE or DOWNVOTE

    public enum VoteType { UPVOTE, DOWNVOTE }

    public VoteType getType() { return type; }
}

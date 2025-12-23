package com.example.DTO;

public class PostVoteDTO {

    private final Long postId;
    private final boolean upvoted;
    private final boolean downvoted;

    public PostVoteDTO(Long postId, boolean upvoted, boolean downvoted) {
        this.postId = postId;
        this.upvoted = upvoted;
        this.downvoted = downvoted;
    }

    public Long getPostId() {
        return postId;
    }

    public boolean isUpvoted() {
        return upvoted;
    }

    public boolean isDownvoted() {
        return downvoted;
    }

}
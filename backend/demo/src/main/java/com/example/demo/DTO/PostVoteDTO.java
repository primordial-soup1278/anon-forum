package com.example.demo.DTO;

import com.example.demo.models.Post;

public class PostVoteDTO {

    private Long postId;
    private Long upVotes;
    private boolean userUpvoted;

    public PostVoteDTO() {}
    public PostVoteDTO(Long postId, Long upVotes, boolean userUpvoted) {
        this.postId = postId;
        this.upVotes = upVotes;
        this.userUpvoted = userUpvoted;
    }

    public Long getPostId() {
        return postId;
    }

    public Long getUpVotes() {
        return upVotes;
    }

    public boolean isUserUpvoted() {
        return userUpvoted;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public void setUpVotes(Long upVotes) {this.upVotes = upVotes;}
    public void setUserUpvoted(boolean userUpvoted) {this.userUpvoted = userUpvoted;}
}

package com.example.demo.repositories;

import com.example.demo.models.Post;
import com.example.demo.models.PostVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostVoteRepository extends JpaRepository<PostVote, Long> {
    Long countByPostAndType(Post post, PostVote.VoteType type);
    Optional<PostVote> findByUserIDAndPost(String userID, Post post);
}

package com.example.demo.repositories;

import com.example.demo.models.Post;
import com.example.demo.models.PostVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostVoteRepository extends JpaRepository<PostVote, Long> {
    Long countByPostId(Long postId);
    boolean existsByPostIdAndUserId(Long postId, String userId);
    Optional<PostVote> findByPostIdAndUserId(Long postId, String userId);
}

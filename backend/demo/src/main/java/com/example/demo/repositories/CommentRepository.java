package com.example.demo.repositories;

import com.example.demo.models.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // Get all comments for a post (oldest → newest)
    List<Comment> findByPostIdOrderByCreatedAtAsc(Long postId);

    // Optional: count comments for a post (for comment badge / count)
    long countByPostId(Long postId);
}

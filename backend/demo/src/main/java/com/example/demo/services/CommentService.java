package com.example.demo.services;

import com.example.demo.DTO.CommentDTO;
import com.example.demo.models.Comment;
import com.example.demo.models.Post;
import com.example.demo.repositories.CommentRepository;
import com.example.demo.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentService {
    @Autowired
    private CommentRepository commentRepository;
    @Autowired
    private PostRepository postRepository;
    public List<CommentDTO> getCommentsForPost(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public CommentDTO createComment(CommentDTO commentDTO, Long postId, Jwt jwt) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("post not found"));
        Comment comment = new Comment();
        comment.setPost(post);
        comment.setAuthorID(jwt.getSubject());
        comment.setContent(commentDTO.getContent());

        Comment saved = commentRepository.save(comment);

        return toDTO(saved);
    }

    private CommentDTO toDTO(Comment comment) {
        return new CommentDTO(
                comment.getId(),
                comment.getContent(),
                comment.getCreatedAt(),
                comment.getAuthorID()
        );
    }
}

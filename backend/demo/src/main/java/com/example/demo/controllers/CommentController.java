package com.example.demo.controllers;

import com.example.demo.DTO.CommentDTO;
import com.example.demo.models.Comment;
import com.example.demo.repositories.CommentRepository;
import com.example.demo.services.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comment/{postId}/comment")
public class CommentController {
    @Autowired
    private CommentService commentService;

    @GetMapping
    public List<CommentDTO> getCommentsForPost(@PathVariable Long postId) {
        return commentService.getCommentsForPost(postId);
    }

    @PostMapping
    public CommentDTO createComment(
            @PathVariable Long postId,
            @RequestBody CommentDTO commentDTO,
            @AuthenticationPrincipal Jwt jwt)
    {
        return commentService.createComment(commentDTO,  postId, jwt);
    }
}

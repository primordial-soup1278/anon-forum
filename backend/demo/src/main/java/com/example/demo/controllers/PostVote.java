package com.example.demo.controllers;

import com.example.demo.DTO.PostVoteDTO;
import com.example.demo.repositories.PostVoteRepository;
import com.example.demo.services.PostVoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vote/{postId}")
public class PostVote {

    @Autowired
    private PostVoteService postVoteService;

    @PostMapping
    public ResponseEntity<PostVoteDTO> toggleVote(@PathVariable Long postId, @AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok(
            postVoteService.toggleVote(postId, jwt)
        );
    }

}

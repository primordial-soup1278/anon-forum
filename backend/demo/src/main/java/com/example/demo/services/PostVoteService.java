package com.example.demo.services;

import com.example.demo.DTO.PostVoteDTO;
import com.example.demo.models.Post;
import com.example.demo.models.PostVote;
import com.example.demo.repositories.PostRepository;
import com.example.demo.repositories.PostVoteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PostVoteService {
    @Autowired
    private PostVoteRepository postVoteRepository;
    @Autowired
    private PostRepository postRepository;


    @Transactional
    public PostVoteDTO toggleVote(Long postId, Jwt jwt) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + postId + " does not exist"));

        Optional<PostVote> existing = postVoteRepository.findByPostIdAndUserId(postId, jwt.getSubject());

        if (existing.isPresent()) {
            postVoteRepository.delete(existing.get());
        }
        else {
            PostVote postVote = new PostVote();
            postVote.setUserId(jwt.getSubject());
            postVote.setPost(post);
            postVoteRepository.save(postVote);
        }

        Long upVotes = postVoteRepository.countByPostId(postId);

        boolean userHasUpvoted = postVoteRepository.existsByPostIdAndUserId(postId, jwt.getSubject());

        return new PostVoteDTO(postId, upVotes, userHasUpvoted);
    }
}

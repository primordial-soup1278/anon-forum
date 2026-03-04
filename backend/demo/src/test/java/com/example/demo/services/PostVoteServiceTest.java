package com.example.demo.services;

import com.example.demo.DTO.PostVoteDTO;
import com.example.demo.models.Post;
import com.example.demo.models.PostVote;
import com.example.demo.repositories.PostRepository;
import com.example.demo.repositories.PostVoteRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostVoteServiceTest {

    @Mock
    private PostVoteRepository postVoteRepository;

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private PostVoteService postVoteService;

    private Post testPost;
    private Jwt mockJwt;

    @BeforeEach
    void setUp() {
        testPost = new Post();
        testPost.setTitle("Test Post");
        testPost.setMessage("Test message");

        mockJwt = new Jwt("token", Instant.now(), Instant.now().plusSeconds(3600),
                Map.of("alg", "HS256"), Map.of("sub", "user123"));
    }

    @Test
    void toggleVote_NewVote_CreatesVote() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(postVoteRepository.findByPostIdAndUserId(1L, "user123")).thenReturn(Optional.empty());
        when(postVoteRepository.countByPostId(1L)).thenReturn(1L);
        when(postVoteRepository.existsByPostIdAndUserId(1L, "user123")).thenReturn(true);

        PostVoteDTO result = postVoteService.toggleVote(1L, mockJwt);

        assertEquals(1L, result.getUpVotes());
        assertTrue(result.isUserUpvoted());
        verify(postVoteRepository).save(any(PostVote.class));
    }

    @Test
    void toggleVote_ExistingVote_DeletesVote() {
        PostVote existingVote = new PostVote();
        existingVote.setId(1L);
        existingVote.setPost(testPost);
        existingVote.setUserId("user123");

        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(postVoteRepository.findByPostIdAndUserId(1L, "user123")).thenReturn(Optional.of(existingVote));
        when(postVoteRepository.countByPostId(1L)).thenReturn(0L);
        when(postVoteRepository.existsByPostIdAndUserId(1L, "user123")).thenReturn(false);

        PostVoteDTO result = postVoteService.toggleVote(1L, mockJwt);

        assertEquals(0L, result.getUpVotes());
        assertFalse(result.isUserUpvoted());
        verify(postVoteRepository).delete(existingVote);
    }

    @Test
    void toggleVote_PostNotFound_ThrowsException() {
        when(postRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(IllegalArgumentException.class, () -> postVoteService.toggleVote(999L, mockJwt));
    }
}

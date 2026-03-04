package com.example.demo.services;

import com.example.demo.DTO.CommentDTO;
import com.example.demo.models.Comment;
import com.example.demo.models.Post;
import com.example.demo.repositories.CommentRepository;
import com.example.demo.repositories.PostRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private CommentService commentService;

    private Post testPost;
    private Comment testComment;
    private Jwt mockJwt;

    @BeforeEach
    void setUp() {
        testPost = new Post();
        testPost.setTitle("Test Post");
        testPost.setMessage("Test message");

        testComment = new Comment();
        testComment.setId(1L);
        testComment.setContent("Test comment");
        testComment.setPost(testPost);
        testComment.setAuthorID("user123");
        testComment.setCreatedAt(LocalDateTime.now());

        mockJwt = new Jwt("token", Instant.now(), Instant.now().plusSeconds(3600),
                Map.of("alg", "HS256"), Map.of("sub", "user123"));
    }

    @Test
    void getCommentsForPost_ReturnsComments() {
        when(commentRepository.findByPostIdOrderByCreatedAtAsc(1L)).thenReturn(List.of(testComment));

        List<CommentDTO> result = commentService.getCommentsForPost(1L);

        assertEquals(1, result.size());
        assertEquals("Test comment", result.get(0).getContent());
    }

    @Test
    void createComment_ValidRequest_ReturnsCreatedComment() {
        CommentDTO commentDTO = new CommentDTO(null, "New comment", null, null);

        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> {
            Comment c = invocation.getArgument(0);
            c.setId(2L);
            c.setCreatedAt(LocalDateTime.now());
            return c;
        });

        CommentDTO result = commentService.createComment(commentDTO, 1L, mockJwt);

        assertEquals("New comment", result.getContent());
        assertEquals("user123", result.getAuthorId());
    }

    @Test
    void createComment_PostNotFound_ThrowsException() {
        CommentDTO commentDTO = new CommentDTO(null, "New comment", null, null);

        when(postRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> commentService.createComment(commentDTO, 999L, mockJwt));
    }
}

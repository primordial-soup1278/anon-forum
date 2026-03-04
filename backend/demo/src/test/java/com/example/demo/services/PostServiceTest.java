package com.example.demo.services;

import com.example.demo.DTO.CreatePostRequest;
import com.example.demo.DTO.PostDTO;
import com.example.demo.models.Board;
import com.example.demo.models.Post;
import com.example.demo.models.PostVote;
import com.example.demo.repositories.BoardRepository;
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
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private BoardRepository boardRepository;

    @Mock
    private PostVoteRepository postVoteRepository;

    @InjectMocks
    private PostService postService;

    private Board testBoard;
    private Post testPost;
    private Jwt mockJwt;

    @BeforeEach
    void setUp() {
        testBoard = new Board();
        testBoard.setId(1L);
        testBoard.setName("Test Board");
        testBoard.setOwnerId("user123");
        testBoard.setMembers(new HashSet<>(Set.of("user123")));
        testBoard.setCategories(new ArrayList<>(List.of("general")));

        testPost = new Post();
        testPost.setTitle("Test Post");
        testPost.setMessage("Test message");
        testPost.setAuthorId("user123");
        testPost.setBoard(testBoard);

        mockJwt = new Jwt("token", Instant.now(), Instant.now().plusSeconds(3600),
                Map.of("alg", "HS256"), Map.of("sub", "user123"));
    }

    @Test
    void getPostsByBoardId_ReturnsListOfPosts() {
        when(postRepository.findPostsByBoardId(1L)).thenReturn(List.of(testPost));
        when(postVoteRepository.countByPostId(any())).thenReturn(0L);

        List<PostDTO> result = postService.getPostsByBoardId(1L);

        assertEquals(1, result.size());
        assertEquals("Test Post", result.get(0).getTitle());
    }

    @Test
    void getPostById_WhenExists_ReturnsPost() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));
        when(postVoteRepository.countByPostId(any())).thenReturn(0L);

        PostDTO result = postService.getPostById(1L);

        assertEquals("Test Post", result.getTitle());
    }

    @Test
    void getPostById_WhenNotExists_ThrowsException() {
        when(postRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> postService.getPostById(999L));
    }

    @Test
    void createPost_ValidRequest_ReturnsCreatedPost() {
        CreatePostRequest request = new CreatePostRequest(1L, "New Post", "New message", "general");
        
        when(boardRepository.findById(1L)).thenReturn(Optional.of(testBoard));
        when(postRepository.save(any(Post.class))).thenAnswer(invocation -> {
            Post p = invocation.getArgument(0);
            return p;
        });
        when(postVoteRepository.countByPostId(any())).thenReturn(0L);

        PostDTO result = postService.createPost(request, mockJwt);

        assertEquals("New Post", result.getTitle());
        assertEquals("New message", result.getMessage());
    }

    @Test
    void createPost_BoardNotFound_ThrowsException() {
        CreatePostRequest request = new CreatePostRequest(999L, "New Post", "New message", "general");
        
        when(boardRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> postService.createPost(request, mockJwt));
    }

    @Test
    void deletePost_ExistingPost_DeletesSuccessfully() {
        when(postRepository.existsById(1L)).thenReturn(true);
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));

        postService.deletePost(1L);

        verify(postRepository).delete(testPost);
    }

    @Test
    void deletePost_NonExistingPost_ThrowsException() {
        when(postRepository.existsById(999L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> postService.deletePost(999L));
    }
}

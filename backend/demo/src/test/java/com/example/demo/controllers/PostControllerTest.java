package com.example.demo.controllers;

import com.example.demo.DTO.CreatePostRequest;
import com.example.demo.DTO.PostDTO;
import com.example.demo.services.PostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostController.class)
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PostService postService;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void getBoardPost_ReturnsPosts() throws Exception {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(1L);
        postDTO.setTitle("Test Post");

        when(postService.getPostsByBoardId(1L)).thenReturn(List.of(postDTO));

        mockMvc.perform(get("/api/post/1/get-board-posts")
                        .with(jwt().jwt(builder -> builder.subject("user123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Post"));
    }

    @Test
    void getPostById_ReturnsPost() throws Exception {
        PostDTO postDTO = new PostDTO();
        postDTO.setId(1L);
        postDTO.setTitle("Test Post");

        when(postService.getPostById(1L)).thenReturn(postDTO);

        mockMvc.perform(get("/api/post/1/get-post-by-id")
                        .with(jwt().jwt(builder -> builder.subject("user123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Post"));
    }

    @Test
    void createPost_WithValidRequest_ReturnsCreated() throws Exception {
        CreatePostRequest request = new CreatePostRequest(1L, "New Post", "Content", "general");

        PostDTO postDTO = new PostDTO();
        postDTO.setId(1L);
        postDTO.setTitle("New Post");
        postDTO.setMessage("Content");

        when(postService.createPost(any(CreatePostRequest.class), any(Jwt.class))).thenReturn(postDTO);

        mockMvc.perform(post("/api/post/create-post")
                        .with(jwt().jwt(builder -> builder.subject("user123")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("New Post"));
    }
}

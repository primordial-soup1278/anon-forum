package com.example.demo.controllers;

import com.example.demo.DTO.CommentDTO;
import com.example.demo.services.CommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommentController.class)
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CommentService commentService;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void getCommentsForPost_ReturnsComments() throws Exception {
        CommentDTO comment = new CommentDTO(1L, "Test comment", LocalDateTime.now(), "user123");

        when(commentService.getCommentsForPost(1L)).thenReturn(List.of(comment));

        mockMvc.perform(get("/api/comment/1/comment")
                        .with(jwt().jwt(builder -> builder.subject("user123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].content").value("Test comment"));
    }

    @Test
    void createComment_WithValidRequest_ReturnsCreated() throws Exception {
        CommentDTO request = new CommentDTO(null, "New comment", null, null);

        CommentDTO response = new CommentDTO(1L, "New comment", LocalDateTime.now(), "user123");

        when(commentService.createComment(any(CommentDTO.class), eq(1L), any(Jwt.class))).thenReturn(response);

        mockMvc.perform(post("/api/comment/1/comment")
                        .with(jwt().jwt(builder -> builder.subject("user123")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").value("New comment"))
                .andExpect(jsonPath("$.authorId").value("user123"));
    }
}

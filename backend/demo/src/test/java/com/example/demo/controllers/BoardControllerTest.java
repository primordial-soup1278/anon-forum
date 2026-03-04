package com.example.demo.controllers;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.services.BoardService;
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
import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BoardController.class)
class BoardControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BoardService boardService;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Test
    void getAllBoard_ReturnsBoards() throws Exception {
        BoardDTO board = new BoardDTO();
        board.setId(1L);
        board.setName("Test Board");

        when(boardService.getAllBoards()).thenReturn(List.of(board));

        mockMvc.perform(get("/api/board/get-all-board")
                        .with(jwt().jwt(builder -> builder.subject("user123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Test Board"));
    }

    @Test
    void getBoardById_ReturnsBoard() throws Exception {
        BoardDTO board = new BoardDTO();
        board.setId(1L);
        board.setName("Test Board");

        when(boardService.getBoard(1L)).thenReturn(Optional.of(board));

        mockMvc.perform(get("/api/board/1/get-board")
                        .with(jwt().jwt(builder -> builder.subject("user123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Board"));
    }

    @Test
    void getBoardById_NotFound_ReturnsNotFound() throws Exception {
        when(boardService.getBoard(999L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/board/999/get-board")
                        .with(jwt().jwt(builder -> builder.subject("user123"))))
                .andExpect(status().isNotFound());
    }

    @Test
    void createBoard_WithValidRequest_ReturnsCreated() throws Exception {
        BoardDTO request = new BoardDTO();
        request.setName("New Board");
        request.setDescription("Description");

        BoardDTO response = new BoardDTO();
        response.setId(1L);
        response.setName("New Board");

        when(boardService.createBoard(any(BoardDTO.class), any(Jwt.class))).thenReturn(response);

        mockMvc.perform(post("/api/board/create-board")
                        .with(jwt().jwt(builder -> builder.subject("user123")))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Board"));
    }

    @Test
    void subscribe_ReturnsUpdatedBoard() throws Exception {
        BoardDTO board = new BoardDTO();
        board.setId(1L);
        board.setName("Test Board");
        board.setMembers(new HashSet<>(Set.of("user123")));

        when(boardService.subscribeToBoard(eq(1L), any())).thenReturn(board);

        mockMvc.perform(post("/api/board/1/subscribe")
                        .with(jwt().jwt(builder -> builder.subject("user123"))))
                .andExpect(status().isOk());
    }

    @Test
    void deleteBoard_Success_ReturnsOk() throws Exception {
        mockMvc.perform(delete("/api/board/1/delete")
                        .with(jwt().jwt(builder -> builder.subject("user123"))))
                .andExpect(status().isOk())
                .andExpect(content().string("Board deleted successfully"));
    }

    @Test
    void getUserBoards_ReturnsUsersBoards() throws Exception {
        BoardDTO board = new BoardDTO();
        board.setId(1L);
        board.setOwnerId("user123");

        when(boardService.getBoardsByOwnerId(any(Jwt.class))).thenReturn(List.of(board));

        mockMvc.perform(get("/api/board/user123/get-user-boards")
                        .with(jwt().jwt(builder -> builder.subject("user123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].ownerId").value("user123"));
    }
}

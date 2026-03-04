package com.example.demo.controllers;

import com.example.demo.DTO.PostVoteDTO;
import com.example.demo.services.PostVoteService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.security.oauth2.jwt.Jwt;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(com.example.demo.controllers.PostVote.class)
class PostVoteControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private PostVoteService postVoteService;

    @MockitoBean
    private JwtDecoder jwtDecoder;

    @Test
    void toggleVote_ReturnsVoteResult() throws Exception {
        PostVoteDTO voteDTO = new PostVoteDTO(1L, 5L, true);

        when(postVoteService.toggleVote(eq(1L), any())).thenReturn(voteDTO);

        mockMvc.perform(post("/api/vote/1")
                        .with(jwt().jwt(builder -> builder.subject("user123"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.postId").value(1))
                .andExpect(jsonPath("$.upVotes").value(5))
                .andExpect(jsonPath("$.userUpvoted").value(true));
    }
}

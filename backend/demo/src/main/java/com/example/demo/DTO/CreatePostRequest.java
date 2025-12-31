package com.example.demo.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public record CreatePostRequest(
        @NotNull Long boardId,
        @NotBlank String title,
        @NotBlank String message,
        @NotBlank String category
) {}

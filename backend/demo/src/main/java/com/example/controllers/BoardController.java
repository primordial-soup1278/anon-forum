package com.example.controllers;

import com.example.DTO.BoardDTO;
import com.example.models.Board;
import com.example.repositories.BoardRepository;
import com.example.services.BoardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
public class BoardController {
    @Autowired
    private BoardService boardService;

    @GetMapping("/{ownerId}/get-board")
    public ResponseEntity<List<BoardDTO>> getBoard(@AuthenticationPrincipal Jwt jwt) {
        try {
            List<BoardDTO> boards = boardService.getBoardsByOwnerId(jwt);
            return ResponseEntity.ok(boards);
        }
        catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/create-board")
    public ResponseEntity<BoardDTO> createBoard(@RequestBody BoardDTO board, @AuthenticationPrincipal Jwt jwt) {
        try {
            BoardDTO boardDTO = boardService.createBoard(board, jwt);
            return ResponseEntity.ok(boardDTO);
        }
        catch (Exception e) {
           return  ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{id}/get-board")
    public ResponseEntity<BoardDTO> getBoardById(@PathVariable Long id) {
       try {
           BoardDTO board = boardService.getBoard(id).orElseThrow(() -> new RuntimeException("Board not found"));
           return ResponseEntity.ok(board);
       }
       catch (Exception e) {
           return ResponseEntity.badRequest().build();
       }
    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<String> deleteBoard(@PathVariable Long id) {
        try {
            boardService.deleteBoard(id);
            return new ResponseEntity<>("Board deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

}

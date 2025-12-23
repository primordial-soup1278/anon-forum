package com.example.services;

import com.example.DTO.BoardDTO;
import com.example.models.Board;
import com.example.repositories.BoardRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BoardService {
    @Autowired
    private BoardRepository boardRepository;

    public Optional<BoardDTO> getBoard(Long id) {
        return boardRepository.findById(id).map(this::toDTO);
    }

    public List<BoardDTO> getBoardsByOwnerId(Jwt jwt) {

        // supposed to be anonymous I don't want other users to be able to tell
        // who owns the board
        return boardRepository.getBoardsByPosterId(jwt.getSubject())
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public BoardDTO joinBoard(Long boardId, Jwt jwt) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        String userID = jwt.getSubject();

        // if board has no members
        if (board.getMembers() == null) {
            board.setMembers(new ArrayList<>());
        }

        board.getMembers().add(userID);

        Board saved = boardRepository.save(board);

        return toDTO(saved);
    }

    public BoardDTO updateBoard(Long id, Jwt jwt, BoardDTO updatedBoard) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Board not found"));

        String userID = jwt.getSubject();

        if(!board.getOwnerId().equals(userID))
            throw new RuntimeException("User is not owner of this board");

        board.setName(updatedBoard.getName());
        board.setCategories(updatedBoard.getCategories());
        board.setUpdatedAt(LocalDateTime.now());
        Board saved = boardRepository.save(board);
        return toDTO(saved);
    }


    public BoardDTO createBoard(BoardDTO boardDTO, Jwt jwt) {

        if (!jwt.getSubject().equals(String.valueOf(boardDTO.getOwnerId()))) {
            throw new RuntimeException("Forbidden");
        }
        Board board = new Board();
        board.setId(boardDTO.getId());
        board.setOwnerId(jwt.getSubject());
        board.setCreatedAt(LocalDateTime.now());
        board.setName(boardDTO.getName());
        board.setCategories(boardDTO.getCategories());
        board.setMembers(boardDTO.getMembers());
        Board saved = boardRepository.save(board);
        return toDTO(saved);
    }

    public void deleteBoard(Long id) {

        if(!boardRepository.existsById(id)) {
            throw new RuntimeException("Board not found");
        }
        Board board = boardRepository.findById(id).orElseThrow(() -> new RuntimeException("Board not found"));

        boardRepository.delete(board);
    }

    private BoardDTO toDTO(Board board) {
        BoardDTO dto = new BoardDTO();
        dto.setId(board.getId());
        dto.setName(board.getName());
        dto.setOwnerId(board.getOwnerId());
        dto.setCategories(board.getCategories());
        dto.setMembers(board.getMembers());
        return dto;
    }
}

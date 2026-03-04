package com.example.demo.services;

import com.example.demo.DTO.BoardDTO;
import com.example.demo.models.Board;
import com.example.demo.repositories.BoardRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.jwt.Jwt;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BoardServiceTest {

    @Mock
    private BoardRepository boardRepository;

    @InjectMocks
    private BoardService boardService;

    private Board testBoard;
    private BoardDTO testBoardDTO;
    private Jwt mockJwt;

    @BeforeEach
    void setUp() {
        testBoard = new Board();
        testBoard.setId(1L);
        testBoard.setName("Test Board");
        testBoard.setDescription("Test Description");
        testBoard.setOwnerId("user123");
        testBoard.setMembers(new HashSet<>(Set.of("user123")));
        testBoard.setCategories(new ArrayList<>(List.of("general", "help")));
        testBoard.setCreatedAt(LocalDateTime.now());

        testBoardDTO = new BoardDTO();
        testBoardDTO.setId(1L);
        testBoardDTO.setName("Test Board");
        testBoardDTO.setDescription("Test Description");
        testBoardDTO.setOwnerId("user123");
        testBoardDTO.setMembers(new HashSet<>(Set.of("user123")));
        testBoardDTO.setCategories(new ArrayList<>(List.of("general", "help")));

        mockJwt = new Jwt("token", Instant.now(), Instant.now().plusSeconds(3600),
                Map.of("alg", "HS256"), Map.of("sub", "user123"));
    }

    @Test
    void getBoard_WhenExists_ReturnsBoard() {
        when(boardRepository.findById(1L)).thenReturn(Optional.of(testBoard));

        Optional<BoardDTO> result = boardService.getBoard(1L);

        assertTrue(result.isPresent());
        assertEquals("Test Board", result.get().getName());
    }

    @Test
    void getBoard_WhenNotExists_ReturnsEmpty() {
        when(boardRepository.findById(999L)).thenReturn(Optional.empty());

        Optional<BoardDTO> result = boardService.getBoard(999L);

        assertTrue(result.isEmpty());
    }

    @Test
    void getAllBoards_ReturnsAllBoards() {
        when(boardRepository.findAll()).thenReturn(List.of(testBoard));

        List<BoardDTO> result = boardService.getAllBoards();

        assertEquals(1, result.size());
        assertEquals("Test Board", result.get(0).getName());
    }

    @Test
    void createBoard_ValidRequest_ReturnsCreatedBoard() {
        when(boardRepository.save(any(Board.class))).thenAnswer(invocation -> {
            Board b = invocation.getArgument(0);
            b.setId(1L);
            b.setCreatedAt(LocalDateTime.now());
            return b;
        });

        BoardDTO result = boardService.createBoard(testBoardDTO, mockJwt);

        assertEquals("Test Board", result.getName());
        assertEquals("user123", result.getOwnerId());
    }

    @Test
    void deleteBoard_ExistingBoard_DeletesSuccessfully() {
        when(boardRepository.existsById(1L)).thenReturn(true);
        when(boardRepository.findById(1L)).thenReturn(Optional.of(testBoard));

        boardService.deleteBoard(1L);

        verify(boardRepository).delete(testBoard);
    }

    @Test
    void deleteBoard_NonExistingBoard_ThrowsException() {
        when(boardRepository.existsById(999L)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> boardService.deleteBoard(999L));
    }

    @Test
    void subscribeToBoard_ValidUser_AddsToMembers() {
        testBoard.setMembers(new HashSet<>()); // start with empty
        when(boardRepository.findById(1L)).thenReturn(Optional.of(testBoard));
        when(boardRepository.save(any(Board.class))).thenReturn(testBoard);

        boardService.subscribeToBoard(1L, mockJwt);

        assertTrue(testBoard.getMembers().contains("user123"));
    }

    @Test
    void subscribeToBoard_AlreadySubscribed_ThrowsException() {
        when(boardRepository.findById(1L)).thenReturn(Optional.of(testBoard));

        assertThrows(RuntimeException.class, () -> boardService.subscribeToBoard(1L, mockJwt));
    }

    @Test
    void unsubscribeFromBoard_SubscribedUser_RemovesFromMembers() {
        Set<String> membersWithOther = new HashSet<>(Set.of("user123", "user456"));
        testBoard.setMembers(membersWithOther);
        
        Jwt otherUserJwt = new Jwt("token", Instant.now(), Instant.now().plusSeconds(3600),
                Map.of("alg", "HS256"), Map.of("sub", "user456"));
        when(boardRepository.findById(1L)).thenReturn(Optional.of(testBoard));
        when(boardRepository.save(any(Board.class))).thenReturn(testBoard);

        boardService.unsubscribeFromBoard(1L, otherUserJwt);

        assertFalse(testBoard.getMembers().contains("user456"));
    }

    @Test
    void unsubscribeFromBoard_Owner_ThrowsException() {
        when(boardRepository.findById(1L)).thenReturn(Optional.of(testBoard));

        assertThrows(RuntimeException.class, () -> boardService.unsubscribeFromBoard(1L, mockJwt));
    }

    @Test
    void updateBoard_Owner_UpdatesSuccessfully() {
        BoardDTO updateDTO = new BoardDTO();
        updateDTO.setName("Updated Board");
        updateDTO.setCategories(new ArrayList<>(List.of("updated")));

        when(boardRepository.findById(1L)).thenReturn(Optional.of(testBoard));
        when(boardRepository.save(any(Board.class))).thenReturn(testBoard);

        boardService.updateBoard(1L, mockJwt, updateDTO);

        verify(boardRepository).save(testBoard);
    }

    @Test
    void updateBoard_NotOwner_ThrowsException() {
        BoardDTO updateDTO = new BoardDTO();
        updateDTO.setName("Updated Board");

        Jwt otherUserJwt = new Jwt("token", Instant.now(), Instant.now().plusSeconds(3600),
                Map.of("alg", "HS256"), Map.of("sub", "otheruser"));
        when(boardRepository.findById(1L)).thenReturn(Optional.of(testBoard));

        assertThrows(RuntimeException.class, () -> boardService.updateBoard(1L, otherUserJwt, updateDTO));
    }
}

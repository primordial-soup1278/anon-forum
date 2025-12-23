package com.example.repositories;

import com.example.models.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> getBoardsByPosterId(String id);
}

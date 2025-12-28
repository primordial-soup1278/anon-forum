package com.example.demo.repositories;

import com.example.demo.models.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> getBoardsByOwnerId(String id);
}

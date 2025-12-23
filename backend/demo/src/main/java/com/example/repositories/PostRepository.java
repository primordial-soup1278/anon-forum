package com.example.repositories;

import com.example.models.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.ArrayList;
import java.util.List;

public interface PostRepository extends JpaRepository<Post,Long> {
    List<Post> findPostsByPosterId(Long id);

    List<Post> findPostsByBoardId(Long id);
}

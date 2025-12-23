package com.example.repositories;

import com.example.models.AppUser;
import com.example.models.Post;
import com.example.models.PostVote;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PostVoteRepository extends JpaRepository<PostVote, Long> {
    Long countByPostAndType(Post post, PostVote.VoteType type);
    Optional<PostVote> findByUserAndPost(AppUser user, Post post);
}

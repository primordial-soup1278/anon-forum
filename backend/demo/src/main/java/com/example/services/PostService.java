package com.example.services;

import com.example.DTO.CommentDTO;
import com.example.DTO.PostDTO;
import com.example.DTO.PostVoteDTO;
import com.example.models.AppUser;
import com.example.models.Board;
import com.example.models.Post;
import com.example.models.PostVote;
import com.example.repositories.BoardRepository;
import com.example.repositories.PostRepository;
import com.example.repositories.PostVoteRepository;
import com.example.repositories.UserRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BoardRepository boardRepository;
    @Autowired
    private PostVoteRepository postVoteRepository;

    public List<PostDTO> getPostsByPosterId(Long id, Jwt jwt) {

        if(jwt.getSubject().equals(String.valueOf(id))) {
            throw new RuntimeException("Illegal access");
        }
        // Load current user from JWT
        AppUser currentUser = userRepository.findById(jwt.getSubject())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return postRepository.findPostsByPosterId(id)
                .stream()
                .map(post -> toDTO(post, currentUser))
                .toList();
    }

    public List<PostDTO> getPostsByBoardId(Long id, Jwt jwt) {
        AppUser currentUser = userRepository.findById(jwt.getSubject())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return postRepository.findPostsByBoardId(id)
                .stream()
                .map(post -> toDTO(post, currentUser))
                .toList();
    }

    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
           throw new RuntimeException("Post with id " + id + " does not exist");
        }

        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post with id " + id + " does not exist"));


        postRepository.delete(post);
    }

    public PostDTO createPost(PostDTO postDTO, Jwt jwt) {
        String userId = jwt.getSubject();
        AppUser appUser = userRepository.findById(userId)
                .orElseGet(() -> userRepository.save(new AppUser()));
        Board board = boardRepository.findById(postDTO.getBoardId())
                .orElseThrow(() -> new RuntimeException("Board with id " + postDTO.getBoardId() + " does not exist"));
        Post post = new Post();
        post.setTitle(postDTO.getTitle());
        post.setMessage(postDTO.getMessage());
        post.setAuthor(appUser);
        post.setBoard(board);
        Post saved = postRepository.save(post);
        AppUser currentUser = userRepository.findById(jwt.getSubject())
                .orElseThrow(() -> new RuntimeException("User with id " + jwt.getSubject() + " does not exist"));
        return toDTO(saved, currentUser);
    }


    private PostDTO toDTO(Post post, AppUser currentUser) {
        long upVotes = postVoteRepository.countByPostAndType(post, PostVote.VoteType.UPVOTE);
        long downVotes = postVoteRepository.countByPostAndType(post, PostVote.VoteType.DOWNVOTE);
        PostVoteDTO userVote = postVoteRepository.findByUserAndPost(currentUser, post)
                .map(v -> new PostVoteDTO(
                        post.getId(),
                        v.getType() == PostVote.VoteType.UPVOTE,
                        v.getType() == PostVote.VoteType.DOWNVOTE
                ))
                .orElse(new PostVoteDTO(post.getId(), false, false));
        List<CommentDTO> commentDTOs = post.getComments().stream()
                .map(c -> new CommentDTO(c.getId(), c.getMessage(), c.getCreatedAt()))
                .toList();
        return new PostDTO(
                post.getId(),
                post.getBoard().getId(),
                post.getTitle(),
                post.getMessage(),
                post.getCreatedAt(),
                post.getUpdatedAt(),
                upVotes,
                downVotes,
                userVote,
                commentDTOs
        );
    }

}

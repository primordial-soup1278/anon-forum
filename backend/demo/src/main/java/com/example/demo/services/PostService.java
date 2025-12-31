package com.example.demo.services;

import com.example.demo.DTO.CommentDTO;
import com.example.demo.DTO.CreatePostRequest;
import com.example.demo.DTO.PostDTO;
import com.example.demo.DTO.PostVoteDTO;
import com.example.demo.models.Board;
import com.example.demo.models.Post;
import com.example.demo.models.PostVote;
import com.example.demo.repositories.BoardRepository;
import com.example.demo.repositories.PostRepository;
import com.example.demo.repositories.PostVoteRepository;
import jakarta.annotation.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {
    @Autowired
    private PostRepository postRepository;
    @Autowired
    private BoardRepository boardRepository;
    @Autowired
    private PostVoteRepository postVoteRepository;

    public List<PostDTO> getPostsByPosterId(Long id, Jwt jwt) {

        if(jwt.getSubject().equals(String.valueOf(id))) {
            throw new RuntimeException("Illegal access");
        }
        // Load current user from JWT
        String userID =  jwt.getSubject();
        /*AppUser currentUser = userRepository.findById(jwt.getSubject())
                .orElseThrow(() -> new RuntimeException("User not found"));*/

        return postRepository.findPostsByAuthorId(id)
                .stream()
                .map(post -> toDTO(post, userID))
                .toList();
    }

    public List<PostDTO> getPostsByBoardId(Long id) {
        return postRepository.findPostsByBoardId(id)
                .stream()
                .map(post -> toDTO(post, null))
                .toList();
    }

    public void deletePost(Long id) {
        if (!postRepository.existsById(id)) {
           throw new RuntimeException("Post with id " + id + " does not exist");
        }

        Post post = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post with id " + id + " does not exist"));


        postRepository.delete(post);
    }

    public PostDTO createPost(CreatePostRequest req, Jwt jwt) {
        String userId = jwt != null ? jwt.getSubject() : null;

        Board board = boardRepository.findById(req.boardId())
                .orElseThrow(() -> new RuntimeException(
                        "Board with id " + req.boardId() + " does not exist"
                ));

        Post post = new Post();
        post.setTitle(req.title());
        post.setMessage(req.message());
        post.setAuthorId(userId);
        post.setCategory(req.category());
        post.setBoard(board);
        Post saved = postRepository.save(post);
        return toDTO(saved, userId);
    }


    private PostDTO toDTO(Post post, @Nullable String currentUserID) {
        long upVotes = postVoteRepository.countByPostAndType(post, PostVote.VoteType.UPVOTE);
        long downVotes = postVoteRepository.countByPostAndType(post, PostVote.VoteType.DOWNVOTE);
        PostVoteDTO userVote;
        if (currentUserID == null) {
            userVote = new PostVoteDTO(post.getId(), false, false);
        }
        else {
            userVote = postVoteRepository.findByUserIDAndPost(currentUserID, post)
                    .map(v -> new PostVoteDTO(
                            post.getId(),
                            v.getType() == PostVote.VoteType.UPVOTE,
                            v.getType() == PostVote.VoteType.DOWNVOTE
                    ))
                    .orElse(new PostVoteDTO(post.getId(), false, false));
        }
        List<CommentDTO> commentDTOs = post.getComments().stream()
                .map(c -> new CommentDTO(c.getId(), c.getContent(), c.getCreatedAt()))
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
                post.getCategory(),
                userVote,
                commentDTOs
        );
    }

}

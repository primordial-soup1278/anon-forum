package com.example.demo.services;

import com.example.demo.DTO.CommentDTO;
import com.example.demo.DTO.PostDTO;
import com.example.demo.DTO.PostVoteDTO;
import com.example.demo.models.Board;
import com.example.demo.models.Post;
import com.example.demo.models.PostVote;
import com.example.demo.repositories.BoardRepository;
import com.example.demo.repositories.PostRepository;
import com.example.demo.repositories.PostVoteRepository;
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

        return postRepository.findPostsByAuthorID(id)
                .stream()
                .map(post -> toDTO(post, userID))
                .toList();
    }

    public List<PostDTO> getPostsByBoardId(Long id, Jwt jwt) {
        String currentUserID =  jwt.getSubject();
        return postRepository.findPostsByBoardId(id)
                .stream()
                .map(post -> toDTO(post, currentUserID))
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
        /*AppUser appUser = userRepository.findById(userId)
                .orElseGet(() -> userRepository.save(new AppUser()));*/
        Board board = boardRepository.findById(postDTO.getBoardId())
                .orElseThrow(() -> new RuntimeException("Board with id " + postDTO.getBoardId() + " does not exist"));
        Post post = new Post();
        post.setTitle(postDTO.getTitle());
        post.setMessage(postDTO.getMessage());
        post.setAuthor(userId);
        post.setBoard(board);
        Post saved = postRepository.save(post);
        /*AppUser currentUser = userRepository.findById(jwt.getSubject())
                .orElseThrow(() -> new RuntimeException("User with id " + jwt.getSubject() + " does not exist"));*/
        String currentUserID =  jwt.getSubject();
        return toDTO(saved, currentUserID);
    }


    private PostDTO toDTO(Post post, String currentUserID) {
        long upVotes = postVoteRepository.countByPostAndType(post, PostVote.VoteType.UPVOTE);
        long downVotes = postVoteRepository.countByPostAndType(post, PostVote.VoteType.DOWNVOTE);
        PostVoteDTO userVote = postVoteRepository.findByUserIDAndPost(currentUserID, post)
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

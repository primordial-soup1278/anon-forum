package com.example.demo.controllers;

import com.example.demo.services.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/post")
public class PostController {

    @Autowired
    private PostService postService;

    /*@GetMapping("/{id}/get-user-post")
    public ResponseEntity<List<PostDTO>> getUserPost(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        try {
            List<PostDTO> posts = postService.getPostsByPosterId(id, jwt);
            return new ResponseEntity<>(posts, HttpStatus.OK);
        }
        catch (Exception e) {
            return new  ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }


    @GetMapping("/{boardId}/get-board-post")
    public List<PostDTO> getBoardPost(@PathVariable Long boardId) {
        return postService.getPostsByBoardId(boardId);
    }

    @PostMapping("/create-post")
    public ResponseEntity<PostDTO> createPost(@RequestBody PostDTO postDTO, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity.ok(
                postService.createPost(postDTO,jwt)
        );
    }
    @DeleteMapping("/{postId}/delete")
    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        try {
            postService.deletePost(postId);
            return new ResponseEntity<>("Post with id " + postId + " has been deleted", HttpStatus.OK);
        }
        catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }*/
}

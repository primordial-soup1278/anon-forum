package com.example.demo.models;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.util.Date;

@Entity
@Table(
        uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "user_id"})
)
public class PostVote {

    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "post_id")
    private Post post;

    @CreationTimestamp
    private Date createdAt;

    public Long getId() {
        return id;
    }

    public String getUserId() {
        return userId;
    }

    public Post getPost() { return post;}

    public Date getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id;}

    public void setUserId(String userId) { this.userId = userId;}

    public void setPost(Post post) { this.post = post;}


}

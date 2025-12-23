package com.example.DTO;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class BoardDTO {
    private Long id;
    private String ownerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String name;
    private List<String> categories;

    /* will contain user id's */
    private List<String> members;

    public BoardDTO() {}

    public BoardDTO(
            Long id,
            String ownerId,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            String name,
            ArrayList<String> categories,
            ArrayList<String> members)
    {
        this.id = id;
        this.ownerId = ownerId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.name = name;
        this.categories = categories;
        this.members = members;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getOwnerId() {return ownerId;}
    public void setOwnerId(String ownerId) {this.ownerId = ownerId;}
    public LocalDateTime getCreatedAt() {return createdAt;}
    public void setCreatedAt(LocalDateTime createdAt) {this.createdAt = createdAt;}
    public LocalDateTime getUpdatedAt() {return updatedAt;}
    public void setUpdatedAt(LocalDateTime updatedAt) {this.updatedAt = updatedAt;}
    public String getName() {return name;}
    public void setName(String name) {this.name = name;}
    public List<String> getCategories() {return categories;}
    public void setCategories(List<String> categories) {this.categories = categories;}
    public List<String> getMembers() {return members;}
    public void setMembers(List<String> members) {this.members = members;}
}

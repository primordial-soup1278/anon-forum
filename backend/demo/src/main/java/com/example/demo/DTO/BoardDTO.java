package com.example.demo.DTO;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class BoardDTO {
    private Long id;
    private String ownerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String name;
    private List<String> categories;

    private String description;

    /* will contain user id's */
    private Set<String> members;

    public BoardDTO() {}

    public BoardDTO(
            Long id,
            String ownerId,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            String name,
            ArrayList<String> categories,
            Set<String> members,
            String description)
    {
        this.id = id;
        this.ownerId = ownerId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.name = name;
        this.categories = categories;
        this.members = members;
        this.description = description;
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
    public Set<String> getMembers() {return members;}
    public void setMembers(Set<String> members) {this.members = members;}
    public void setDescription (String description) {this.description = description;}
    public String getDescription() {return description;}
}

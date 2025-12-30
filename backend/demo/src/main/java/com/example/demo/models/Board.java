package com.example.demo.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Board {
    @Id
    @GeneratedValue
    private Long id;

    // stores supabase uuid directly
    @Column(name = "owner_id", nullable = false)
    private String ownerId; // supabase uuid

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String description;

    private String name;

    @ElementCollection
    @CollectionTable(
            name = "board_categories",
            joinColumns = @JoinColumn(name = "board_id")
    )
    @Column(name = "categories")
    private List<String> categories;

    /* will contain user id's */
    @ElementCollection
    private List<String> members;


    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}
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
    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}

}

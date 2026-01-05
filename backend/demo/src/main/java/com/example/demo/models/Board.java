package com.example.demo.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @CollectionTable(
            name = "board_members",
            joinColumns = @JoinColumn(name = "board_id")
    )
    @ElementCollection
    @Column(name = "user_id")
    private Set<String> members = new HashSet<>();


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
    public Set<String> getMembers() {return members;}
    public void setMembers(Set<String> members) {this.members = members;}
    public String getDescription() {return description;}
    public void setDescription(String description) {this.description = description;}

}

package com.example.usermanagement.domain;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

public class User {
    private final UUID id;
    private final String name;
    private final String email;
    private final Set<Role> roles;

    public User(String name, String email) {
        this.id = UUID.randomUUID();
        this.name = name;
        this.email = email;
        this.roles = new HashSet<>();
    }

    public User(UUID id, String name, String email, Set<Role> roles) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.roles = new HashSet<>(roles);
    }

    // Getters
    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public Set<Role> getRoles() { return new HashSet<>(roles); }

    public void assignRole(Role role) {
        roles.add(role);
    }

    // Business validations
    public boolean isValid() {
        return name != null && !name.isBlank() &&
                email != null && email.matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
    }
}
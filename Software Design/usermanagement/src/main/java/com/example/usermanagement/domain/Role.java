package com.example.usermanagement.domain;

import java.util.UUID;

public class Role {
    private final UUID id;
    private final String roleName;

    public Role(String roleName) {
        this.id = UUID.randomUUID();
        this.roleName = roleName;
    }

    public Role(UUID id, String roleName) {
        this.id = id;
        this.roleName = roleName;
    }

    // Getters
    public UUID getId() { return id; }
    public String getRoleName() { return roleName; }

    // Business validation
    public boolean isValid() {
        return roleName != null && !roleName.isBlank();
    }
}
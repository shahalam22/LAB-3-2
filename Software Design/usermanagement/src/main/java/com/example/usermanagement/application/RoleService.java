package com.example.usermanagement.application;

import com.example.usermanagement.domain.Role;
import com.example.usermanagement.application.interfaces.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class RoleService {
    private final RoleRepository roleRepository;

    public RoleService(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public UUID createRole(String roleName) {
        Role role = new Role(roleName);
        if (!role.isValid()) {
            throw new IllegalArgumentException("Invalid role data");
        }
        return roleRepository.save(role).getId();
    }
}
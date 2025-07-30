package com.example.usermanagement.infrastructure.controller;

import com.example.usermanagement.application.RoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/roles")
public class RoleController {
    private final RoleService roleService;

    public RoleController(RoleService roleService) {
        this.roleService = roleService;
    }

    @PostMapping
    public ResponseEntity<UUID> createRole(@RequestBody CreateRoleRequest request) {
        try {
            UUID roleId = roleService.createRole(request.roleName());
            return ResponseEntity.status(HttpStatus.CREATED).body(roleId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // DTO for request
    public record CreateRoleRequest(String roleName) {}
}
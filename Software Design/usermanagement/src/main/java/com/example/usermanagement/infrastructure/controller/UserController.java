package com.example.usermanagement.infrastructure.controller;

import com.example.usermanagement.application.UserService;
import com.example.usermanagement.domain.User;
import com.example.usermanagement.domain.Role;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UUID> createUser(
            @RequestBody CreateUserRequest request) {
        try {
            UUID userId = userService.createUser(request.name(), request.email());
            return ResponseEntity.status(HttpStatus.CREATED).body(userId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/{userId}/assign-role/{roleId}")
    public ResponseEntity<String> assignRole(
            @PathVariable UUID userId,
            @PathVariable UUID roleId) {
        try {
            userService.assignRole(userId, roleId);
            return ResponseEntity.ok("Role assigned successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUser(@PathVariable UUID id) {
        try {
            User user = userService.getUser(id);
            return ResponseEntity.ok(UserResponse.fromDomain(user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DTOs for request/response
    public record CreateUserRequest(String name, String email) {}

    public record UserResponse(UUID id, String name, String email, Set<RoleResponse> roles) {
        public static UserResponse fromDomain(User user) {
            Set<RoleResponse> roles = user.getRoles().stream()
                    .map(RoleResponse::fromDomain)
                    .collect(Collectors.toSet());
            return new UserResponse(
                    user.getId(),
                    user.getName(),
                    user.getEmail(),
                    roles
            );
        }
    }

    public record RoleResponse(UUID id, String roleName) {
        public static RoleResponse fromDomain(Role role) {
            return new RoleResponse(role.getId(), role.getRoleName());
        }
    }
}
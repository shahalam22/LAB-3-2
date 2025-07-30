package com.example.usermanagement.infrastructure.persistence;

import com.example.usermanagement.domain.User;
import com.example.usermanagement.domain.Role;
import com.example.usermanagement.application.interfaces.UserRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Set;


@Repository
public class UserJpaRepository implements UserRepository {
    private final SpringDataUserRepository springDataUserRepository;

    public UserJpaRepository(SpringDataUserRepository springDataUserRepository) {
        this.springDataUserRepository = springDataUserRepository;
    }

    @Override
    public User save(User user) {
        UserJpaEntity entity = toJpaEntity(user);
        UserJpaEntity savedEntity = springDataUserRepository.save(entity);
        return toDomainEntity(savedEntity);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return springDataUserRepository.findById(id)
                .map(this::toDomainEntity);
    }

    private UserJpaEntity toJpaEntity(User user) {
        UserJpaEntity entity = new UserJpaEntity(
                user.getId(),
                user.getName(),
                user.getEmail()
        );

        Set<RoleJpaEntity> roleEntities = user.getRoles().stream()
                .map(role -> new RoleJpaEntity(role.getId(), role.getRoleName()))
                .collect(Collectors.toSet());

        entity.setRoles(roleEntities);
        return entity;
    }

    private User toDomainEntity(UserJpaEntity entity) {
        Set<Role> roles = entity.getRoles().stream()
                .map(roleEntity -> new Role(roleEntity.getId(), roleEntity.getRoleName()))
                .collect(Collectors.toSet());

        return new User(
                entity.getId(),
                entity.getName(),
                entity.getEmail(),
                roles
        );
    }
}

interface SpringDataUserRepository extends org.springframework.data.jpa.repository.JpaRepository<UserJpaEntity, UUID> {}
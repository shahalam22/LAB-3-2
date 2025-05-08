package com.example.usermanagement.infrastructure.persistence;

import com.example.usermanagement.domain.Role;
import com.example.usermanagement.application.interfaces.RoleRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public class RoleJpaRepository implements RoleRepository {
    private final SpringDataRoleRepository springDataRoleRepository;

    public RoleJpaRepository(SpringDataRoleRepository springDataRoleRepository) {
        this.springDataRoleRepository = springDataRoleRepository;
    }

    @Override
    public Role save(Role role) {
        RoleJpaEntity entity = new RoleJpaEntity(role.getId(), role.getRoleName());
        RoleJpaEntity savedEntity = springDataRoleRepository.save(entity);
        return new Role(savedEntity.getId(), savedEntity.getRoleName());
    }

    @Override
    public Optional<Role> findById(UUID id) {
        return springDataRoleRepository.findById(id)
                .map(entity -> new Role(entity.getId(), entity.getRoleName()));
    }
}

interface SpringDataRoleRepository extends org.springframework.data.jpa.repository.JpaRepository<RoleJpaEntity, UUID> {}
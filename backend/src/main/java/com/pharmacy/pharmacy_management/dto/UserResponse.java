package com.pharmacy.pharmacy_management.dto;

import java.time.LocalDateTime;

import com.pharmacy.pharmacy_management.entity.Role;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        Role role,
        String phoneNumber,
        boolean enabled,
        LocalDateTime createdAt) {
}

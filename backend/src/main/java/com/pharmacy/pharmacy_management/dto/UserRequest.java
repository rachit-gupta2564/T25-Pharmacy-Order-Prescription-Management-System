package com.pharmacy.pharmacy_management.dto;

import com.pharmacy.pharmacy_management.entity.Role;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UserRequest(
        @NotBlank(message = "Full name is required")
        @Size(max = 120, message = "Full name must be at most 120 characters")
        String fullName,

        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        @Size(max = 150, message = "Email must be at most 150 characters")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 6, max = 120, message = "Password must be between 6 and 120 characters")
        String password,

        @NotNull(message = "Role is required")
        Role role,

        @Size(max = 20, message = "Phone number must be at most 20 characters")
        String phoneNumber,

        Boolean enabled) {
}

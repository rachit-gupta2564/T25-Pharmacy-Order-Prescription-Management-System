package com.pharmacy.pharmacy_management.dto;

public record AuthResponse(
        String token,
        UserResponse user) {
}

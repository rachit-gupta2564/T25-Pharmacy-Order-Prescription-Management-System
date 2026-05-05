package com.pharmacy.pharmacy_management.service;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharmacy.pharmacy_management.dto.AuthLoginRequest;
import com.pharmacy.pharmacy_management.dto.AuthRegisterRequest;
import com.pharmacy.pharmacy_management.dto.AuthResponse;
import com.pharmacy.pharmacy_management.dto.UserResponse;
import com.pharmacy.pharmacy_management.entity.Role;
import com.pharmacy.pharmacy_management.entity.User;
import com.pharmacy.pharmacy_management.exception.BadRequestException;
import com.pharmacy.pharmacy_management.repository.UserRepository;
import com.pharmacy.pharmacy_management.security.CurrentUserService;

@Service
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final CurrentUserService currentUserService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            CurrentUserService currentUserService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.currentUserService = currentUserService;
    }

    public AuthResponse register(AuthRegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already registered: " + request.email());
        }

        User user = userRepository.save(User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(Role.PATIENT)
                .phoneNumber(request.phoneNumber())
                .enabled(true)
                .build());

        return new AuthResponse(buildBasicToken(request.email(), request.password()), mapToResponse(user));
    }

    @Transactional(readOnly = true)
    public AuthResponse login(AuthLoginRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new BadRequestException("Invalid email or password");
        }

        return new AuthResponse(buildBasicToken(request.email(), request.password()), mapToResponse(user));
    }

    @Transactional(readOnly = true)
    public UserResponse me() {
        return mapToResponse(currentUserService.getCurrentUser());
    }

    private String buildBasicToken(String email, String password) {
        String raw = email + ":" + password;
        return "Basic " + Base64.getEncoder().encodeToString(raw.getBytes(StandardCharsets.UTF_8));
    }

    private UserResponse mapToResponse(User user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getPhoneNumber(),
                user.isEnabled(),
                user.getCreatedAt());
    }
}

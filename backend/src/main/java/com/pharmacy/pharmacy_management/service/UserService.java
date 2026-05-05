package com.pharmacy.pharmacy_management.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharmacy.pharmacy_management.dto.UserRequest;
import com.pharmacy.pharmacy_management.dto.UserResponse;
import com.pharmacy.pharmacy_management.entity.Role;
import com.pharmacy.pharmacy_management.entity.User;
import com.pharmacy.pharmacy_management.exception.BadRequestException;
import com.pharmacy.pharmacy_management.exception.ResourceNotFoundException;
import com.pharmacy.pharmacy_management.repository.UserRepository;

@Service
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponse create(UserRequest request) {
        validateUniqueEmail(request.email(), null);

        User user = User.builder()
                .fullName(request.fullName())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .role(request.role())
                .phoneNumber(request.phoneNumber())
                .enabled(request.enabled() == null || request.enabled())
                .build();

        return mapToResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findAll() {
        return userRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<UserResponse> findByRole(Role role) {
        return userRepository.findAll().stream()
                .filter(user -> user.getRole() == role)
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public UserResponse findById(Long id) {
        return mapToResponse(getUser(id));
    }

    public UserResponse update(Long id, UserRequest request) {
        User user = getUser(id);
        validateUniqueEmail(request.email(), id);

        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(request.role());
        user.setPhoneNumber(request.phoneNumber());
        user.setEnabled(request.enabled() == null || request.enabled());

        return mapToResponse(userRepository.save(user));
    }

    public void delete(Long id) {
        userRepository.delete(getUser(id));
    }

    @Transactional(readOnly = true)
    public User getUser(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", id));
    }

    private void validateUniqueEmail(String email, Long currentUserId) {
        userRepository.findByEmail(email)
                .filter(existingUser -> !existingUser.getId().equals(currentUserId))
                .ifPresent(existingUser -> {
                    throw new BadRequestException("Email is already registered: " + email);
                });
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

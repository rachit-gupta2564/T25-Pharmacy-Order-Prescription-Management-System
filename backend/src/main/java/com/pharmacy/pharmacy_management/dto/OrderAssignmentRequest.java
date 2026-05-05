package com.pharmacy.pharmacy_management.dto;

import jakarta.validation.constraints.NotNull;

public record OrderAssignmentRequest(
        @NotNull(message = "Delivery agent id is required")
        Long deliveryAgentId) {
}

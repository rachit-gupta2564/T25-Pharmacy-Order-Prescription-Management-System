package com.pharmacy.pharmacy_management.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequest(
        @NotNull(message = "Order id is required")
        Long orderId,

        @NotNull(message = "Medicine id is required")
        Long medicineId,

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        Integer quantity) {
}

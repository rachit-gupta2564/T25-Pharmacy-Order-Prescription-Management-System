package com.pharmacy.pharmacy_management.dto;

import java.util.List;

import com.pharmacy.pharmacy_management.entity.FulfillmentType;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CheckoutRequest(
        Long prescriptionId,

        @NotNull(message = "Fulfillment type is required")
        FulfillmentType fulfillmentType,

        @Size(max = 500, message = "Delivery address must be at most 500 characters")
        String deliveryAddress,

        @Valid
        @NotEmpty(message = "At least one cart item is required")
        List<CheckoutItemRequest> items) {
}

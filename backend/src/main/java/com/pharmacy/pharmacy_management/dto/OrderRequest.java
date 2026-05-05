package com.pharmacy.pharmacy_management.dto;

import com.pharmacy.pharmacy_management.entity.FulfillmentType;
import com.pharmacy.pharmacy_management.entity.OrderStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record OrderRequest(
        @NotNull(message = "Patient id is required")
        Long patientId,

        Long prescriptionId,

        Long deliveryAgentId,

        @NotBlank(message = "Order number is required")
        @Size(max = 80, message = "Order number must be at most 80 characters")
        String orderNumber,

        OrderStatus status,

        @NotNull(message = "Fulfillment type is required")
        FulfillmentType fulfillmentType,

        @Size(max = 500, message = "Delivery address must be at most 500 characters")
        String deliveryAddress) {
}

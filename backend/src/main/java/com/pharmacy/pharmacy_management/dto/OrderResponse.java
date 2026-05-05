package com.pharmacy.pharmacy_management.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.pharmacy.pharmacy_management.entity.FulfillmentType;
import com.pharmacy.pharmacy_management.entity.OrderStatus;

public record OrderResponse(
        Long id,
        String orderNumber,
        Long patientId,
        String patientName,
        Long prescriptionId,
        Long deliveryAgentId,
        String deliveryAgentName,
        OrderStatus status,
        FulfillmentType fulfillmentType,
        String deliveryAddress,
        BigDecimal totalAmount,
        long itemCount,
        LocalDateTime createdAt) {
}

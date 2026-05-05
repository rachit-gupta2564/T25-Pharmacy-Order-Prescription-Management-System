package com.pharmacy.pharmacy_management.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        Long orderId,
        Long medicineId,
        String medicineName,
        Integer quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal) {
}

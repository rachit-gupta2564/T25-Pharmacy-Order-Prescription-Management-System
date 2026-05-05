package com.pharmacy.pharmacy_management.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record MedicineResponse(
        Long id,
        String brandName,
        String genericName,
        String description,
        String dosageForm,
        BigDecimal price,
        Integer stockQuantity,
        boolean prescriptionRequired,
        boolean active,
        LocalDateTime createdAt) {
}

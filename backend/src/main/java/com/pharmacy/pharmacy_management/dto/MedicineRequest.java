package com.pharmacy.pharmacy_management.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record MedicineRequest(
        @NotBlank(message = "Brand name is required")
        @Size(max = 120, message = "Brand name must be at most 120 characters")
        String brandName,

        @NotBlank(message = "Generic name is required")
        @Size(max = 120, message = "Generic name must be at most 120 characters")
        String genericName,

        @Size(max = 500, message = "Description must be at most 500 characters")
        String description,

        @Size(max = 80, message = "Dosage form must be at most 80 characters")
        String dosageForm,

        @NotNull(message = "Price is required")
        @DecimalMin(value = "0.0", inclusive = true, message = "Price must be zero or positive")
        BigDecimal price,

        @NotNull(message = "Stock quantity is required")
        @Min(value = 0, message = "Stock quantity must be zero or positive")
        Integer stockQuantity,

        @NotNull(message = "Prescription requirement must be provided")
        Boolean prescriptionRequired,

        Boolean active) {
}

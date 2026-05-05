package com.pharmacy.pharmacy_management.dto;

import jakarta.validation.constraints.Size;

public record PrescriptionDecisionRequest(
        @Size(max = 255, message = "Reason must be at most 255 characters")
        String reason,

        @Size(max = 500, message = "Notes must be at most 500 characters")
        String notes) {
}

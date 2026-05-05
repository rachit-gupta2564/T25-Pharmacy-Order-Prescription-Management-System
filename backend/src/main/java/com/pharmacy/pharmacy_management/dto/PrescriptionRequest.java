package com.pharmacy.pharmacy_management.dto;

import java.time.LocalDate;

import com.pharmacy.pharmacy_management.entity.PrescriptionStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record PrescriptionRequest(
        @NotNull(message = "Patient id is required")
        Long patientId,

        Long verifiedById,

        @NotBlank(message = "Prescription number is required")
        @Size(max = 80, message = "Prescription number must be at most 80 characters")
        String prescriptionNumber,

        @NotBlank(message = "Doctor name is required")
        @Size(max = 120, message = "Doctor name must be at most 120 characters")
        String doctorName,

        @NotBlank(message = "Doctor license number is required")
        @Size(max = 80, message = "Doctor license number must be at most 80 characters")
        String doctorLicenseNumber,

        @NotNull(message = "Issued date is required")
        LocalDate issuedDate,

        @NotNull(message = "Expiry date is required")
        LocalDate expiryDate,

        @NotBlank(message = "Prescription file URL is required")
        @Size(max = 500, message = "Prescription file URL must be at most 500 characters")
        String fileUrl,

        PrescriptionStatus status,

        @Size(max = 255, message = "Rejection reason must be at most 255 characters")
        String rejectionReason,

        @Size(max = 500, message = "Notes must be at most 500 characters")
        String notes) {
}

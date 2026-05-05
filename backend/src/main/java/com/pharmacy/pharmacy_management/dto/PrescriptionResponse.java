package com.pharmacy.pharmacy_management.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.pharmacy.pharmacy_management.entity.PrescriptionStatus;

public record PrescriptionResponse(
        Long id,
        Long patientId,
        String patientName,
        Long verifiedById,
        String verifiedByName,
        String prescriptionNumber,
        String doctorName,
        String doctorLicenseNumber,
        LocalDate issuedDate,
        LocalDate expiryDate,
        String fileUrl,
        PrescriptionStatus status,
        String rejectionReason,
        String notes,
        LocalDateTime createdAt) {
}

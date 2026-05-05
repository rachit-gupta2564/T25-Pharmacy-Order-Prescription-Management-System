package com.pharmacy.pharmacy_management.dto;

import java.time.LocalDate;

import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PrescriptionUploadRequest {

    @NotBlank(message = "Prescription number is required")
    @Size(max = 80, message = "Prescription number must be at most 80 characters")
    private String prescriptionNumber;

    @NotBlank(message = "Doctor name is required")
    @Size(max = 120, message = "Doctor name must be at most 120 characters")
    private String doctorName;

    @NotBlank(message = "Doctor license number is required")
    @Size(max = 80, message = "Doctor license number must be at most 80 characters")
    private String doctorLicenseNumber;

    @NotNull(message = "Issued date is required")
    private LocalDate issuedDate;

    @NotNull(message = "Expiry date is required")
    private LocalDate expiryDate;

    @Size(max = 500, message = "Notes must be at most 500 characters")
    private String notes;

    @NotNull(message = "Prescription file is required")
    private MultipartFile file;

    public String getPrescriptionNumber() {
        return prescriptionNumber;
    }

    public void setPrescriptionNumber(String prescriptionNumber) {
        this.prescriptionNumber = prescriptionNumber;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDoctorLicenseNumber() {
        return doctorLicenseNumber;
    }

    public void setDoctorLicenseNumber(String doctorLicenseNumber) {
        this.doctorLicenseNumber = doctorLicenseNumber;
    }

    public LocalDate getIssuedDate() {
        return issuedDate;
    }

    public void setIssuedDate(LocalDate issuedDate) {
        this.issuedDate = issuedDate;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}

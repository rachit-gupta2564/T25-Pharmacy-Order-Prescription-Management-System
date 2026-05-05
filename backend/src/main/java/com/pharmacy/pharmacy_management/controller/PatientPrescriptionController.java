package com.pharmacy.pharmacy_management.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacy.pharmacy_management.dto.PrescriptionResponse;
import com.pharmacy.pharmacy_management.dto.PrescriptionUploadRequest;
import com.pharmacy.pharmacy_management.service.PrescriptionService;

import jakarta.validation.Valid;

@Validated
@RestController
@RequestMapping("/api/patient/prescriptions")
public class PatientPrescriptionController {

    private final PrescriptionService prescriptionService;

    public PatientPrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @GetMapping
    public List<PrescriptionResponse> findMyPrescriptions() {
        return prescriptionService.findForCurrentPatient();
    }

    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    @ResponseStatus(HttpStatus.CREATED)
    public PrescriptionResponse upload(@Valid @ModelAttribute PrescriptionUploadRequest request) {
        return prescriptionService.uploadForCurrentPatient(request);
    }
}

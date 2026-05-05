package com.pharmacy.pharmacy_management.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacy.pharmacy_management.dto.PrescriptionRequest;
import com.pharmacy.pharmacy_management.dto.PrescriptionResponse;
import com.pharmacy.pharmacy_management.service.PrescriptionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;

    public PrescriptionController(PrescriptionService prescriptionService) {
        this.prescriptionService = prescriptionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PrescriptionResponse create(@Valid @RequestBody PrescriptionRequest request) {
        return prescriptionService.create(request);
    }

    @GetMapping
    public List<PrescriptionResponse> findAll() {
        return prescriptionService.findAll();
    }

    @GetMapping("/{id}")
    public PrescriptionResponse findById(@PathVariable Long id) {
        return prescriptionService.findById(id);
    }

    @PutMapping("/{id}")
    public PrescriptionResponse update(@PathVariable Long id, @Valid @RequestBody PrescriptionRequest request) {
        return prescriptionService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        prescriptionService.delete(id);
    }
}

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

import com.pharmacy.pharmacy_management.dto.MedicineRequest;
import com.pharmacy.pharmacy_management.dto.MedicineResponse;
import com.pharmacy.pharmacy_management.service.MedicineService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/medicines")
public class MedicineController {

    private final MedicineService medicineService;

    public MedicineController(MedicineService medicineService) {
        this.medicineService = medicineService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MedicineResponse create(@Valid @RequestBody MedicineRequest request) {
        return medicineService.create(request);
    }

    @GetMapping
    public List<MedicineResponse> findAll() {
        return medicineService.findAll();
    }

    @GetMapping("/{id}")
    public MedicineResponse findById(@PathVariable Long id) {
        return medicineService.findById(id);
    }

    @PutMapping("/{id}")
    public MedicineResponse update(@PathVariable Long id, @Valid @RequestBody MedicineRequest request) {
        return medicineService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        medicineService.delete(id);
    }
}

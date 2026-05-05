package com.pharmacy.pharmacy_management.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharmacy.pharmacy_management.dto.MedicineRequest;
import com.pharmacy.pharmacy_management.dto.MedicineResponse;
import com.pharmacy.pharmacy_management.entity.Medicine;
import com.pharmacy.pharmacy_management.exception.ResourceNotFoundException;
import com.pharmacy.pharmacy_management.repository.MedicineRepository;

@Service
@Transactional
public class MedicineService {

    private final MedicineRepository medicineRepository;

    public MedicineService(MedicineRepository medicineRepository) {
        this.medicineRepository = medicineRepository;
    }

    public MedicineResponse create(MedicineRequest request) {
        Medicine medicine = Medicine.builder()
                .brandName(request.brandName())
                .genericName(request.genericName())
                .description(request.description())
                .dosageForm(request.dosageForm())
                .price(request.price())
                .stockQuantity(request.stockQuantity())
                .prescriptionRequired(Boolean.TRUE.equals(request.prescriptionRequired()))
                .active(request.active() == null || request.active())
                .build();

        return mapToResponse(medicineRepository.save(medicine));
    }

    @Transactional(readOnly = true)
    public List<MedicineResponse> findAll() {
        return medicineRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public long countLowStock(int threshold) {
        return medicineRepository.findAll().stream()
                .filter(Medicine::isActive)
                .filter(medicine -> medicine.getStockQuantity() <= threshold)
                .count();
    }

    @Transactional(readOnly = true)
    public MedicineResponse findById(Long id) {
        return mapToResponse(getMedicine(id));
    }

    public MedicineResponse update(Long id, MedicineRequest request) {
        Medicine medicine = getMedicine(id);
        medicine.setBrandName(request.brandName());
        medicine.setGenericName(request.genericName());
        medicine.setDescription(request.description());
        medicine.setDosageForm(request.dosageForm());
        medicine.setPrice(request.price());
        medicine.setStockQuantity(request.stockQuantity());
        medicine.setPrescriptionRequired(Boolean.TRUE.equals(request.prescriptionRequired()));
        medicine.setActive(request.active() == null || request.active());
        return mapToResponse(medicineRepository.save(medicine));
    }

    public void delete(Long id) {
        medicineRepository.delete(getMedicine(id));
    }

    @Transactional(readOnly = true)
    public Medicine getMedicine(Long id) {
        return medicineRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Medicine", id));
    }

    private MedicineResponse mapToResponse(Medicine medicine) {
        return new MedicineResponse(
                medicine.getId(),
                medicine.getBrandName(),
                medicine.getGenericName(),
                medicine.getDescription(),
                medicine.getDosageForm(),
                medicine.getPrice(),
                medicine.getStockQuantity(),
                medicine.isPrescriptionRequired(),
                medicine.isActive(),
                medicine.getCreatedAt());
    }
}

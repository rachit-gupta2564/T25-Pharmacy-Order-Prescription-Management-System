package com.pharmacy.pharmacy_management.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.pharmacy_management.entity.Medicine;

public interface MedicineRepository extends JpaRepository<Medicine, Long> {
}

package com.pharmacy.pharmacy_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.pharmacy_management.entity.Prescription;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {

    boolean existsByPrescriptionNumber(String prescriptionNumber);

    List<Prescription> findAllByPatientIdOrderByCreatedAtDesc(Long patientId);
}

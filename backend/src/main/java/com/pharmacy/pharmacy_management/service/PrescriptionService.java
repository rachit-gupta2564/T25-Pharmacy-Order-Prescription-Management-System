package com.pharmacy.pharmacy_management.service;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharmacy.pharmacy_management.dto.PrescriptionRequest;
import com.pharmacy.pharmacy_management.dto.PrescriptionResponse;
import com.pharmacy.pharmacy_management.dto.PrescriptionDecisionRequest;
import com.pharmacy.pharmacy_management.dto.PrescriptionUploadRequest;
import com.pharmacy.pharmacy_management.entity.Prescription;
import com.pharmacy.pharmacy_management.entity.PrescriptionStatus;
import com.pharmacy.pharmacy_management.entity.Role;
import com.pharmacy.pharmacy_management.entity.User;
import com.pharmacy.pharmacy_management.exception.BadRequestException;
import com.pharmacy.pharmacy_management.exception.ResourceNotFoundException;
import com.pharmacy.pharmacy_management.repository.PrescriptionRepository;
import com.pharmacy.pharmacy_management.repository.UserRepository;
import com.pharmacy.pharmacy_management.security.CurrentUserService;

@Service
@Transactional
public class PrescriptionService {

    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    private final CurrentUserService currentUserService;
    private final FileStorageService fileStorageService;

    public PrescriptionService(
            PrescriptionRepository prescriptionRepository,
            UserRepository userRepository,
            CurrentUserService currentUserService,
            FileStorageService fileStorageService) {
        this.prescriptionRepository = prescriptionRepository;
        this.userRepository = userRepository;
        this.currentUserService = currentUserService;
        this.fileStorageService = fileStorageService;
    }

    public PrescriptionResponse create(PrescriptionRequest request) {
        if (prescriptionRepository.existsByPrescriptionNumber(request.prescriptionNumber())) {
            throw new BadRequestException("Prescription number already exists: " + request.prescriptionNumber());
        }

        Prescription prescription = buildEntity(new Prescription(), request);
        return mapToResponse(prescriptionRepository.save(prescription));
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> findAll() {
        return prescriptionRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public PrescriptionResponse findById(Long id) {
        return mapToResponse(getPrescription(id));
    }

    public PrescriptionResponse update(Long id, PrescriptionRequest request) {
        Prescription prescription = getPrescription(id);
        validateUniquePrescriptionNumber(request.prescriptionNumber(), id);
        buildEntity(prescription, request);
        return mapToResponse(prescriptionRepository.save(prescription));
    }

    public void delete(Long id) {
        prescriptionRepository.delete(getPrescription(id));
    }

    public PrescriptionResponse approve(Long id, PrescriptionDecisionRequest request) {
        Prescription prescription = getPrescription(id);
        User pharmacist = currentUserService.getCurrentUser();
        ensurePharmacist(pharmacist);
        prescription.setVerifiedBy(pharmacist);
        prescription.setStatus(PrescriptionStatus.APPROVED);
        prescription.setRejectionReason(null);
        prescription.setNotes(request.notes());
        return mapToResponse(prescriptionRepository.save(prescription));
    }

    public PrescriptionResponse reject(Long id, PrescriptionDecisionRequest request) {
        if (request.reason() == null || request.reason().isBlank()) {
            throw new BadRequestException("Rejection reason is required");
        }

        Prescription prescription = getPrescription(id);
        User pharmacist = currentUserService.getCurrentUser();
        ensurePharmacist(pharmacist);
        prescription.setVerifiedBy(pharmacist);
        prescription.setStatus(PrescriptionStatus.REJECTED);
        prescription.setRejectionReason(request.reason());
        prescription.setNotes(request.notes());
        return mapToResponse(prescriptionRepository.save(prescription));
    }

    @Transactional(readOnly = true)
    public List<PrescriptionResponse> findForCurrentPatient() {
        Long patientId = currentUserService.getCurrentUser().getId();
        return prescriptionRepository.findAllByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    public PrescriptionResponse uploadForCurrentPatient(PrescriptionUploadRequest request) {
        validateUploadDates(request);

        if (prescriptionRepository.existsByPrescriptionNumber(request.getPrescriptionNumber())) {
            throw new BadRequestException("Prescription number already exists: " + request.getPrescriptionNumber());
        }

        User patient = currentUserService.getCurrentUser();
        String storedFilePath = fileStorageService.storePrescription(request.getFile());

        Prescription prescription = Prescription.builder()
                .patient(patient)
                .verifiedBy(null)
                .prescriptionNumber(defaultIfBlank(
                        request.getPrescriptionNumber(),
                        "RX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()))
                .doctorName(request.getDoctorName())
                .doctorLicenseNumber(request.getDoctorLicenseNumber())
                .issuedDate(request.getIssuedDate())
                .expiryDate(request.getExpiryDate())
                .fileUrl(storedFilePath)
                .status(PrescriptionStatus.PENDING)
                .notes(request.getNotes())
                .build();

        return mapToResponse(prescriptionRepository.save(prescription));
    }

    @Transactional(readOnly = true)
    public Prescription getPrescription(Long id) {
        return prescriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", id));
    }

    private Prescription buildEntity(Prescription prescription, PrescriptionRequest request) {
        validateDates(request);
        User patient = resolveUserWithRole(request.patientId(), Role.PATIENT, "Patient");
        User pharmacist = request.verifiedById() == null
                ? null
                : resolveUserWithRole(request.verifiedById(), Role.PHARMACIST, "Pharmacist");

        PrescriptionStatus status = request.status() == null ? PrescriptionStatus.PENDING : request.status();

        if (status == PrescriptionStatus.REJECTED && (request.rejectionReason() == null || request.rejectionReason().isBlank())) {
            throw new BadRequestException("Rejection reason is required when prescription status is REJECTED");
        }

        prescription.setPatient(patient);
        prescription.setVerifiedBy(pharmacist);
        prescription.setPrescriptionNumber(request.prescriptionNumber());
        prescription.setDoctorName(request.doctorName());
        prescription.setDoctorLicenseNumber(request.doctorLicenseNumber());
        prescription.setIssuedDate(request.issuedDate());
        prescription.setExpiryDate(request.expiryDate());
        prescription.setFileUrl(request.fileUrl());
        prescription.setStatus(status);
        prescription.setRejectionReason(request.rejectionReason());
        prescription.setNotes(request.notes());
        return prescription;
    }

    private void validateUniquePrescriptionNumber(String prescriptionNumber, Long currentId) {
        prescriptionRepository.findAll().stream()
                .filter(existing -> existing.getPrescriptionNumber().equalsIgnoreCase(prescriptionNumber))
                .filter(existing -> !existing.getId().equals(currentId))
                .findFirst()
                .ifPresent(existing -> {
                    throw new BadRequestException("Prescription number already exists: " + prescriptionNumber);
                });
    }

    private void validateDates(PrescriptionRequest request) {
        if (request.expiryDate().isBefore(request.issuedDate())) {
            throw new BadRequestException("Expiry date cannot be before issued date");
        }
    }

    private void validateUploadDates(PrescriptionUploadRequest request) {
        if (request.getExpiryDate().isBefore(request.getIssuedDate())) {
            throw new BadRequestException("Expiry date cannot be before issued date");
        }
    }

    private User resolveUserWithRole(Long userId, Role expectedRole, String label) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (user.getRole() != expectedRole) {
            throw new BadRequestException(label + " must have role " + expectedRole.name());
        }

        return user;
    }

    private PrescriptionResponse mapToResponse(Prescription prescription) {
        User verifiedBy = prescription.getVerifiedBy();
        return new PrescriptionResponse(
                prescription.getId(),
                prescription.getPatient().getId(),
                prescription.getPatient().getFullName(),
                verifiedBy == null ? null : verifiedBy.getId(),
                verifiedBy == null ? null : verifiedBy.getFullName(),
                prescription.getPrescriptionNumber(),
                prescription.getDoctorName(),
                prescription.getDoctorLicenseNumber(),
                prescription.getIssuedDate(),
                prescription.getExpiryDate(),
                prescription.getFileUrl(),
                prescription.getStatus(),
                prescription.getRejectionReason(),
                prescription.getNotes(),
                prescription.getCreatedAt());
    }

    private String defaultIfBlank(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private void ensurePharmacist(User user) {
        if (user.getRole() != Role.PHARMACIST) {
            throw new BadRequestException("Only pharmacists can perform this action");
        }
    }
}

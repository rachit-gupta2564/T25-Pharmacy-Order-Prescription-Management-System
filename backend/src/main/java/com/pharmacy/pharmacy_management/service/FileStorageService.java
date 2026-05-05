package com.pharmacy.pharmacy_management.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.pharmacy.pharmacy_management.exception.BadRequestException;

@Service
public class FileStorageService {

    private final Path prescriptionUploadPath = Paths.get("uploads", "prescriptions");

    public String storePrescription(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Prescription file is required");
        }

        String originalFilename = file.getOriginalFilename() == null ? "prescription" : file.getOriginalFilename();
        String safeFilename = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String storedFilename = UUID.randomUUID() + "_" + safeFilename;

        try {
            Files.createDirectories(prescriptionUploadPath);
            Path targetPath = prescriptionUploadPath.resolve(storedFilename).normalize();
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            return targetPath.toString().replace("\\", "/");
        } catch (IOException ex) {
            throw new BadRequestException("Unable to store prescription file");
        }
    }
}

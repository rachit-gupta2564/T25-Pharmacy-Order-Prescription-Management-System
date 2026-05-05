package com.pharmacy.pharmacy_management.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharmacy.pharmacy_management.dto.AdminDashboardResponse;
import com.pharmacy.pharmacy_management.dto.OrderResponse;
import com.pharmacy.pharmacy_management.dto.PrescriptionResponse;
import com.pharmacy.pharmacy_management.entity.PrescriptionStatus;

@Service
@Transactional(readOnly = true)
public class AdminWorkflowService {

    private final PrescriptionService prescriptionService;
    private final OrderService orderService;
    private final MedicineService medicineService;

    public AdminWorkflowService(
            PrescriptionService prescriptionService,
            OrderService orderService,
            MedicineService medicineService) {
        this.prescriptionService = prescriptionService;
        this.orderService = orderService;
        this.medicineService = medicineService;
    }

    public AdminDashboardResponse getDashboard() {
        List<PrescriptionResponse> prescriptions = prescriptionService.findAll();
        List<OrderResponse> orders = orderService.findAll();

        long pendingPrescriptions = prescriptions.stream()
                .filter(item -> item.status() == PrescriptionStatus.PENDING)
                .count();

        return new AdminDashboardResponse(
                pendingPrescriptions,
                orderService.countActiveOrders(),
                medicineService.countLowStock(20),
                prescriptions.stream().limit(5).toList(),
                orders.stream().limit(5).toList());
    }
}

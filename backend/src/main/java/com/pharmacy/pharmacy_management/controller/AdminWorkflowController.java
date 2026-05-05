package com.pharmacy.pharmacy_management.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.pharmacy.pharmacy_management.dto.AdminDashboardResponse;
import com.pharmacy.pharmacy_management.dto.OrderAssignmentRequest;
import com.pharmacy.pharmacy_management.dto.OrderResponse;
import com.pharmacy.pharmacy_management.dto.PrescriptionDecisionRequest;
import com.pharmacy.pharmacy_management.dto.PrescriptionResponse;
import com.pharmacy.pharmacy_management.dto.UserResponse;
import com.pharmacy.pharmacy_management.entity.Role;
import com.pharmacy.pharmacy_management.service.AdminWorkflowService;
import com.pharmacy.pharmacy_management.service.OrderService;
import com.pharmacy.pharmacy_management.service.PrescriptionService;
import com.pharmacy.pharmacy_management.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/admin")
public class AdminWorkflowController {

    private final AdminWorkflowService adminWorkflowService;
    private final PrescriptionService prescriptionService;
    private final OrderService orderService;
    private final UserService userService;

    public AdminWorkflowController(
            AdminWorkflowService adminWorkflowService,
            PrescriptionService prescriptionService,
            OrderService orderService,
            UserService userService) {
        this.adminWorkflowService = adminWorkflowService;
        this.prescriptionService = prescriptionService;
        this.orderService = orderService;
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    public AdminDashboardResponse dashboard() {
        return adminWorkflowService.getDashboard();
    }

    @GetMapping("/delivery-agents")
    public List<UserResponse> deliveryAgents() {
        return userService.findByRole(Role.DELIVERY);
    }

    @PostMapping("/prescriptions/{id}/approve")
    public PrescriptionResponse approvePrescription(
            @PathVariable Long id,
            @Valid @RequestBody PrescriptionDecisionRequest request) {
        return prescriptionService.approve(id, request);
    }

    @PostMapping("/prescriptions/{id}/reject")
    public PrescriptionResponse rejectPrescription(
            @PathVariable Long id,
            @Valid @RequestBody PrescriptionDecisionRequest request) {
        return prescriptionService.reject(id, request);
    }

    @PostMapping("/orders/{id}/assign-delivery")
    @ResponseStatus(HttpStatus.OK)
    public OrderResponse assignDelivery(
            @PathVariable Long id,
            @Valid @RequestBody OrderAssignmentRequest request) {
        return orderService.assignDeliveryAgent(id, request);
    }
}

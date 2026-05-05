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

import com.pharmacy.pharmacy_management.dto.CheckoutRequest;
import com.pharmacy.pharmacy_management.dto.OrderResponse;
import com.pharmacy.pharmacy_management.service.OrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/patient/orders")
public class PatientOrderController {

    private final OrderService orderService;

    public PatientOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public List<OrderResponse> findMyOrders() {
        return orderService.findCurrentPatientOrders();
    }

    @GetMapping("/{id}")
    public OrderResponse findMyOrderById(@PathVariable Long id) {
        return orderService.findCurrentPatientOrderById(id);
    }

    @PostMapping("/checkout")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse checkout(@Valid @RequestBody CheckoutRequest request) {
        return orderService.checkout(request);
    }
}

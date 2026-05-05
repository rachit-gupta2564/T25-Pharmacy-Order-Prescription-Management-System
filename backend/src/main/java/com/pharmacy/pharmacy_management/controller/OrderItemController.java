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

import com.pharmacy.pharmacy_management.dto.OrderItemRequest;
import com.pharmacy.pharmacy_management.dto.OrderItemResponse;
import com.pharmacy.pharmacy_management.service.OrderItemService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    private final OrderItemService orderItemService;

    public OrderItemController(OrderItemService orderItemService) {
        this.orderItemService = orderItemService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderItemResponse create(@Valid @RequestBody OrderItemRequest request) {
        return orderItemService.create(request);
    }

    @GetMapping
    public List<OrderItemResponse> findAll() {
        return orderItemService.findAll();
    }

    @GetMapping("/{id}")
    public OrderItemResponse findById(@PathVariable Long id) {
        return orderItemService.findById(id);
    }

    @PutMapping("/{id}")
    public OrderItemResponse update(@PathVariable Long id, @Valid @RequestBody OrderItemRequest request) {
        return orderItemService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        orderItemService.delete(id);
    }
}

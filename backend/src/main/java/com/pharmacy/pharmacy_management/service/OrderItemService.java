package com.pharmacy.pharmacy_management.service;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharmacy.pharmacy_management.dto.OrderItemRequest;
import com.pharmacy.pharmacy_management.dto.OrderItemResponse;
import com.pharmacy.pharmacy_management.entity.Medicine;
import com.pharmacy.pharmacy_management.entity.Order;
import com.pharmacy.pharmacy_management.entity.OrderItem;
import com.pharmacy.pharmacy_management.exception.ResourceNotFoundException;
import com.pharmacy.pharmacy_management.repository.MedicineRepository;
import com.pharmacy.pharmacy_management.repository.OrderItemRepository;
import com.pharmacy.pharmacy_management.repository.OrderRepository;

@Service
@Transactional
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final OrderRepository orderRepository;
    private final MedicineRepository medicineRepository;
    private final OrderService orderService;

    public OrderItemService(
            OrderItemRepository orderItemRepository,
            OrderRepository orderRepository,
            MedicineRepository medicineRepository,
            OrderService orderService) {
        this.orderItemRepository = orderItemRepository;
        this.orderRepository = orderRepository;
        this.medicineRepository = medicineRepository;
        this.orderService = orderService;
    }

    public OrderItemResponse create(OrderItemRequest request) {
        OrderItem orderItem = buildEntity(new OrderItem(), request);
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);
        orderService.refreshTotal(savedOrderItem.getOrder().getId());
        return mapToResponse(savedOrderItem);
    }

    @Transactional(readOnly = true)
    public List<OrderItemResponse> findAll() {
        return orderItemRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderItemResponse findById(Long id) {
        return mapToResponse(getOrderItem(id));
    }

    public OrderItemResponse update(Long id, OrderItemRequest request) {
        OrderItem orderItem = getOrderItem(id);
        buildEntity(orderItem, request);
        OrderItem savedOrderItem = orderItemRepository.save(orderItem);
        orderService.refreshTotal(savedOrderItem.getOrder().getId());
        return mapToResponse(savedOrderItem);
    }

    public void delete(Long id) {
        OrderItem orderItem = getOrderItem(id);
        Long orderId = orderItem.getOrder().getId();
        orderItemRepository.delete(orderItem);
        orderService.refreshTotal(orderId);
    }

    @Transactional(readOnly = true)
    public OrderItem getOrderItem(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order item", id));
    }

    private OrderItem buildEntity(OrderItem orderItem, OrderItemRequest request) {
        Order order = orderRepository.findById(request.orderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order", request.orderId()));
        Medicine medicine = medicineRepository.findById(request.medicineId())
                .orElseThrow(() -> new ResourceNotFoundException("Medicine", request.medicineId()));

        BigDecimal unitPrice = medicine.getPrice();
        BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(request.quantity()));

        orderItem.setOrder(order);
        orderItem.setMedicine(medicine);
        orderItem.setQuantity(request.quantity());
        orderItem.setUnitPrice(unitPrice);
        orderItem.setLineTotal(lineTotal);
        return orderItem;
    }

    private OrderItemResponse mapToResponse(OrderItem orderItem) {
        return new OrderItemResponse(
                orderItem.getId(),
                orderItem.getOrder().getId(),
                orderItem.getMedicine().getId(),
                orderItem.getMedicine().getBrandName(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getLineTotal());
    }
}

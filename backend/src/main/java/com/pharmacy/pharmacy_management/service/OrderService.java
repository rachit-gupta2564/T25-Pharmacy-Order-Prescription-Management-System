package com.pharmacy.pharmacy_management.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pharmacy.pharmacy_management.dto.CheckoutItemRequest;
import com.pharmacy.pharmacy_management.dto.CheckoutRequest;
import com.pharmacy.pharmacy_management.dto.OrderAssignmentRequest;
import com.pharmacy.pharmacy_management.dto.OrderRequest;
import com.pharmacy.pharmacy_management.dto.OrderResponse;
import com.pharmacy.pharmacy_management.entity.FulfillmentType;
import com.pharmacy.pharmacy_management.entity.Medicine;
import com.pharmacy.pharmacy_management.entity.Order;
import com.pharmacy.pharmacy_management.entity.OrderItem;
import com.pharmacy.pharmacy_management.entity.OrderStatus;
import com.pharmacy.pharmacy_management.entity.Prescription;
import com.pharmacy.pharmacy_management.entity.Role;
import com.pharmacy.pharmacy_management.entity.User;
import com.pharmacy.pharmacy_management.exception.BadRequestException;
import com.pharmacy.pharmacy_management.exception.ResourceNotFoundException;
import com.pharmacy.pharmacy_management.repository.MedicineRepository;
import com.pharmacy.pharmacy_management.repository.OrderItemRepository;
import com.pharmacy.pharmacy_management.repository.OrderRepository;
import com.pharmacy.pharmacy_management.repository.PrescriptionRepository;
import com.pharmacy.pharmacy_management.repository.UserRepository;
import com.pharmacy.pharmacy_management.security.CurrentUserService;

@Service
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final UserRepository userRepository;
    private final OrderItemRepository orderItemRepository;
    private final MedicineRepository medicineRepository;
    private final CurrentUserService currentUserService;

    public OrderService(
            OrderRepository orderRepository,
            PrescriptionRepository prescriptionRepository,
            UserRepository userRepository,
            OrderItemRepository orderItemRepository,
            MedicineRepository medicineRepository,
            CurrentUserService currentUserService) {
        this.orderRepository = orderRepository;
        this.prescriptionRepository = prescriptionRepository;
        this.userRepository = userRepository;
        this.orderItemRepository = orderItemRepository;
        this.medicineRepository = medicineRepository;
        this.currentUserService = currentUserService;
    }

    public OrderResponse create(OrderRequest request) {
        if (orderRepository.existsByOrderNumber(request.orderNumber())) {
            throw new BadRequestException("Order number already exists: " + request.orderNumber());
        }

        Order order = buildEntity(new Order(), request);
        order.setTotalAmount(BigDecimal.ZERO);
        return mapToResponse(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findAll() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse findById(Long id) {
        return mapToResponse(getOrder(id));
    }

    public OrderResponse update(Long id, OrderRequest request) {
        Order order = getOrder(id);
        validateUniqueOrderNumber(request.orderNumber(), id);
        buildEntity(order, request);
        return mapToResponse(orderRepository.save(order));
    }

    public void delete(Long id) {
        orderRepository.delete(getOrder(id));
    }

    public OrderResponse assignDeliveryAgent(Long id, OrderAssignmentRequest request) {
        Order order = getOrder(id);
        User deliveryAgent = resolveUserWithRole(request.deliveryAgentId(), Role.DELIVERY, "Delivery agent");
        order.setDeliveryAgent(deliveryAgent);
        if (order.getStatus() == OrderStatus.PROCESSING || order.getStatus() == OrderStatus.READY_FOR_PICKUP) {
            order.setStatus(OrderStatus.OUT_FOR_DELIVERY);
        }
        return mapToResponse(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public long countActiveOrders() {
        return orderRepository.findAll().stream()
                .filter(order -> order.getStatus() != OrderStatus.DELIVERED && order.getStatus() != OrderStatus.CANCELLED)
                .count();
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findCurrentPatientOrders() {
        Long patientId = currentUserService.getCurrentUser().getId();
        return orderRepository.findAllByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse findCurrentPatientOrderById(Long id) {
        Order order = getOrder(id);
        Long patientId = currentUserService.getCurrentUser().getId();
        if (!order.getPatient().getId().equals(patientId)) {
            throw new ResourceNotFoundException("Order", id);
        }
        return mapToResponse(order);
    }

    public OrderResponse checkout(CheckoutRequest request) {
        User patient = currentUserService.getCurrentUser();
        Prescription prescription = resolvePrescriptionForPatient(request.prescriptionId(), patient);
        validateCheckoutRequest(request, prescription);

        Order order = Order.builder()
                .orderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
                .patient(patient)
                .prescription(prescription)
                .deliveryAgent(null)
                .status(OrderStatus.PENDING_VERIFICATION)
                .fulfillmentType(request.fulfillmentType())
                .deliveryAddress(request.deliveryAddress())
                .items(new ArrayList<>())
                .totalAmount(BigDecimal.ZERO)
                .build();

        for (CheckoutItemRequest itemRequest : request.items()) {
            Medicine medicine = medicineRepository.findById(itemRequest.medicineId())
                    .orElseThrow(() -> new ResourceNotFoundException("Medicine", itemRequest.medicineId()));

            if (!medicine.isActive()) {
                throw new BadRequestException("Medicine is currently unavailable: " + medicine.getBrandName());
            }

            if (medicine.getStockQuantity() < itemRequest.quantity()) {
                throw new BadRequestException("Insufficient stock for medicine: " + medicine.getBrandName());
            }

            if (medicine.isPrescriptionRequired()
                    && (prescription == null || prescription.getStatus() != com.pharmacy.pharmacy_management.entity.PrescriptionStatus.APPROVED)) {
                throw new BadRequestException("An approved prescription is required for " + medicine.getBrandName());
            }

            BigDecimal unitPrice = medicine.getPrice();
            BigDecimal lineTotal = unitPrice.multiply(BigDecimal.valueOf(itemRequest.quantity()));

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .medicine(medicine)
                    .quantity(itemRequest.quantity())
                    .unitPrice(unitPrice)
                    .lineTotal(lineTotal)
                    .build();

            order.getItems().add(orderItem);
            order.setTotalAmount(order.getTotalAmount().add(lineTotal));
        }

        return mapToResponse(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public Order getOrder(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order", id));
    }

    OrderResponse refreshTotal(Long orderId) {
        Order order = getOrder(orderId);
        BigDecimal total = orderItemRepository.sumLineTotalByOrderId(orderId);
        order.setTotalAmount(total);
        return mapToResponse(orderRepository.save(order));
    }

    private Prescription resolvePrescriptionForPatient(Long prescriptionId, User patient) {
        if (prescriptionId == null) {
            return null;
        }

        Prescription prescription = prescriptionRepository.findById(prescriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Prescription", prescriptionId));

        if (!prescription.getPatient().getId().equals(patient.getId())) {
            throw new BadRequestException("Prescription must belong to the authenticated patient");
        }

        return prescription;
    }

    private void validateCheckoutRequest(CheckoutRequest request, Prescription prescription) {
        if (request.fulfillmentType() == FulfillmentType.DELIVERY
                && (request.deliveryAddress() == null || request.deliveryAddress().isBlank())) {
            throw new BadRequestException("Delivery address is required for delivery orders");
        }

        if (prescription != null && prescription.getStatus() == com.pharmacy.pharmacy_management.entity.PrescriptionStatus.REJECTED) {
            throw new BadRequestException("Rejected prescriptions cannot be used for checkout");
        }
    }

    private Order buildEntity(Order order, OrderRequest request) {
        User patient = resolveUserWithRole(request.patientId(), Role.PATIENT, "Patient");
        User deliveryAgent = request.deliveryAgentId() == null
                ? null
                : resolveUserWithRole(request.deliveryAgentId(), Role.DELIVERY, "Delivery agent");
        Prescription prescription = request.prescriptionId() == null
                ? null
                : prescriptionRepository.findById(request.prescriptionId())
                        .orElseThrow(() -> new ResourceNotFoundException("Prescription", request.prescriptionId()));

        if (prescription != null && !prescription.getPatient().getId().equals(patient.getId())) {
            throw new BadRequestException("Prescription must belong to the selected patient");
        }

        if (request.fulfillmentType() == FulfillmentType.DELIVERY
                && (request.deliveryAddress() == null || request.deliveryAddress().isBlank())) {
            throw new BadRequestException("Delivery address is required for delivery orders");
        }

        order.setOrderNumber(request.orderNumber());
        order.setPatient(patient);
        order.setPrescription(prescription);
        order.setDeliveryAgent(deliveryAgent);
        order.setStatus(request.status() == null ? OrderStatus.PENDING_VERIFICATION : request.status());
        order.setFulfillmentType(request.fulfillmentType());
        order.setDeliveryAddress(request.deliveryAddress());
        return order;
    }

    private void validateUniqueOrderNumber(String orderNumber, Long currentId) {
        orderRepository.findAll().stream()
                .filter(existing -> existing.getOrderNumber().equalsIgnoreCase(orderNumber))
                .filter(existing -> !existing.getId().equals(currentId))
                .findFirst()
                .ifPresent(existing -> {
                    throw new BadRequestException("Order number already exists: " + orderNumber);
                });
    }

    private User resolveUserWithRole(Long userId, Role expectedRole, String label) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));

        if (user.getRole() != expectedRole) {
            throw new BadRequestException(label + " must have role " + expectedRole.name());
        }

        return user;
    }

    private OrderResponse mapToResponse(Order order) {
        User deliveryAgent = order.getDeliveryAgent();
        Prescription prescription = order.getPrescription();
        return new OrderResponse(
                order.getId(),
                order.getOrderNumber(),
                order.getPatient().getId(),
                order.getPatient().getFullName(),
                prescription == null ? null : prescription.getId(),
                deliveryAgent == null ? null : deliveryAgent.getId(),
                deliveryAgent == null ? null : deliveryAgent.getFullName(),
                order.getStatus(),
                order.getFulfillmentType(),
                order.getDeliveryAddress(),
                order.getTotalAmount(),
                orderItemRepository.countByOrderId(order.getId()),
                order.getCreatedAt());
    }
}

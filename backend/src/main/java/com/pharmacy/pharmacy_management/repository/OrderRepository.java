package com.pharmacy.pharmacy_management.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pharmacy.pharmacy_management.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    boolean existsByOrderNumber(String orderNumber);

    List<Order> findAllByPatientIdOrderByCreatedAtDesc(Long patientId);
}

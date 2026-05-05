package com.pharmacy.pharmacy_management.repository;

import java.math.BigDecimal;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.pharmacy.pharmacy_management.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    long countByOrderId(Long orderId);

    @Query("select coalesce(sum(item.lineTotal), 0) from OrderItem item where item.order.id = :orderId")
    BigDecimal sumLineTotalByOrderId(@Param("orderId") Long orderId);
}

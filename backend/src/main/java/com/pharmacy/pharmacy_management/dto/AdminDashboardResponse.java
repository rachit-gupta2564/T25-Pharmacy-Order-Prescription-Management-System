package com.pharmacy.pharmacy_management.dto;

import java.util.List;

public record AdminDashboardResponse(
        long pendingPrescriptions,
        long activeOrders,
        long lowStockMedicines,
        List<PrescriptionResponse> recentPrescriptions,
        List<OrderResponse> recentOrders) {
}

package com.pharmacy.pharmacy_management.config;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.pharmacy.pharmacy_management.entity.FulfillmentType;
import com.pharmacy.pharmacy_management.entity.Medicine;
import com.pharmacy.pharmacy_management.entity.Order;
import com.pharmacy.pharmacy_management.entity.OrderItem;
import com.pharmacy.pharmacy_management.entity.OrderStatus;
import com.pharmacy.pharmacy_management.entity.Prescription;
import com.pharmacy.pharmacy_management.entity.PrescriptionStatus;
import com.pharmacy.pharmacy_management.entity.Role;
import com.pharmacy.pharmacy_management.entity.User;
import com.pharmacy.pharmacy_management.repository.MedicineRepository;
import com.pharmacy.pharmacy_management.repository.OrderItemRepository;
import com.pharmacy.pharmacy_management.repository.OrderRepository;
import com.pharmacy.pharmacy_management.repository.PrescriptionRepository;
import com.pharmacy.pharmacy_management.repository.UserRepository;

@Configuration
public class DataSeederConfig {

    @Bean
    public CommandLineRunner seedData(
            UserRepository userRepository,
            MedicineRepository medicineRepository,
            PrescriptionRepository prescriptionRepository,
            OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            User patient = userRepository.save(User.builder()
                    .fullName("Ananya Patient")
                    .email("patient@pharmacy.com")
                    .password(passwordEncoder.encode("Patient@123"))
                    .role(Role.PATIENT)
                    .phoneNumber("9000000001")
                    .enabled(true)
                    .build());

            User pharmacist = userRepository.save(User.builder()
                    .fullName("Priya Pharmacist")
                    .email("pharmacist@pharmacy.com")
                    .password(passwordEncoder.encode("Pharma@123"))
                    .role(Role.PHARMACIST)
                    .phoneNumber("9000000002")
                    .enabled(true)
                    .build());

            User deliveryAgent = userRepository.save(User.builder()
                    .fullName("Arjun Delivery")
                    .email("delivery@pharmacy.com")
                    .password(passwordEncoder.encode("Delivery@123"))
                    .role(Role.DELIVERY)
                    .phoneNumber("9000000003")
                    .enabled(true)
                    .build());

            Medicine medicineOne = medicineRepository.save(Medicine.builder()
                    .brandName("Crocin")
                    .genericName("Paracetamol")
                    .description("Pain relief and fever management")
                    .dosageForm("Tablet")
                    .price(new BigDecimal("35.00"))
                    .stockQuantity(100)
                    .prescriptionRequired(false)
                    .active(true)
                    .build());

            Medicine medicineTwo = medicineRepository.save(Medicine.builder()
                    .brandName("Augmentin")
                    .genericName("Amoxicillin Clavulanate")
                    .description("Antibiotic medication")
                    .dosageForm("Tablet")
                    .price(new BigDecimal("220.00"))
                    .stockQuantity(40)
                    .prescriptionRequired(true)
                    .active(true)
                    .build());

            Medicine medicineThree = medicineRepository.save(Medicine.builder()
                    .brandName("Shelcal")
                    .genericName("Calcium Carbonate")
                    .description("Calcium supplement")
                    .dosageForm("Tablet")
                    .price(new BigDecimal("145.00"))
                    .stockQuantity(55)
                    .prescriptionRequired(false)
                    .active(true)
                    .build());

            Prescription prescription = prescriptionRepository.save(Prescription.builder()
                    .patient(patient)
                    .verifiedBy(pharmacist)
                    .prescriptionNumber("RX-1001")
                    .doctorName("Dr. Meera Rao")
                    .doctorLicenseNumber("DOC-45678")
                    .issuedDate(LocalDate.now().minusDays(4))
                    .expiryDate(LocalDate.now().plusDays(20))
                    .fileUrl("https://example.com/prescriptions/rx-1001.pdf")
                    .status(PrescriptionStatus.APPROVED)
                    .notes("Take after meals")
                    .build());

            Order order = orderRepository.save(Order.builder()
                    .orderNumber("ORD-1001")
                    .patient(patient)
                    .prescription(prescription)
                    .deliveryAgent(deliveryAgent)
                    .status(OrderStatus.PROCESSING)
                    .fulfillmentType(FulfillmentType.DELIVERY)
                    .deliveryAddress("221B MG Road, Bengaluru")
                    .totalAmount(BigDecimal.ZERO)
                    .build());

            orderItemRepository.save(OrderItem.builder()
                    .order(order)
                    .medicine(medicineOne)
                    .quantity(2)
                    .unitPrice(medicineOne.getPrice())
                    .lineTotal(medicineOne.getPrice().multiply(BigDecimal.valueOf(2)))
                    .build());

            orderItemRepository.save(OrderItem.builder()
                    .order(order)
                    .medicine(medicineTwo)
                    .quantity(1)
                    .unitPrice(medicineTwo.getPrice())
                    .lineTotal(medicineTwo.getPrice())
                    .build());

            order.setTotalAmount(orderItemRepository.sumLineTotalByOrderId(order.getId()));
            orderRepository.save(order);
        };
    }
}

package com.pharmacy.pharmacy_management.config;

import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.pharmacy.pharmacy_management.entity.Role;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .httpBasic(Customizer.withDefaults())
                .formLogin(form -> form.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/error").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/admin/**").hasRole(Role.PHARMACIST.name())
                        .requestMatchers(GET, "/api/medicines/**")
                        .hasAnyRole(Role.PATIENT.name(), Role.PHARMACIST.name(), Role.DELIVERY.name())
                        .requestMatchers("/api/patient/**").hasRole(Role.PATIENT.name())
                        .requestMatchers(POST, "/api/medicines/**").hasRole(Role.PHARMACIST.name())
                        .requestMatchers(PUT, "/api/medicines/**").hasRole(Role.PHARMACIST.name())
                        .requestMatchers(DELETE, "/api/medicines/**").hasRole(Role.PHARMACIST.name())
                        .requestMatchers(GET, "/api/prescriptions/**").hasRole(Role.PHARMACIST.name())
                        .requestMatchers(POST, "/api/prescriptions/**")
                        .hasRole(Role.PHARMACIST.name())
                        .requestMatchers(PUT, "/api/prescriptions/**").hasRole(Role.PHARMACIST.name())
                        .requestMatchers(DELETE, "/api/prescriptions/**").hasRole(Role.PHARMACIST.name())
                        .requestMatchers(GET, "/api/orders/**")
                        .hasAnyRole(Role.PHARMACIST.name(), Role.DELIVERY.name())
                        .requestMatchers(POST, "/api/orders/**").hasRole(Role.PHARMACIST.name())
                        .requestMatchers(PUT, "/api/orders/**").hasRole(Role.PHARMACIST.name())
                        .requestMatchers(DELETE, "/api/orders/**").hasRole(Role.PHARMACIST.name())
                        .requestMatchers(GET, "/api/order-items/**")
                        .hasAnyRole(Role.PHARMACIST.name(), Role.DELIVERY.name())
                        .requestMatchers(POST, "/api/order-items/**").hasRole(Role.PHARMACIST.name())
                        .requestMatchers(PUT, "/api/order-items/**").hasRole(Role.PHARMACIST.name())
                        .requestMatchers(DELETE, "/api/order-items/**").hasRole(Role.PHARMACIST.name())
                        .requestMatchers("/api/users/**")
                        .hasRole(Role.PHARMACIST.name())
                        .anyRequest()
                        .authenticated());

        return http.build();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider(
            UserDetailsService userDetailsService,
            PasswordEncoder passwordEncoder) {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder);
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

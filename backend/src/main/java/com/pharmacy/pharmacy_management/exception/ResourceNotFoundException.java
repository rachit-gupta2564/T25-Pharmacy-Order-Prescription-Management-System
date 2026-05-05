package com.pharmacy.pharmacy_management.exception;

public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, Long resourceId) {
        super("%s with id %d was not found".formatted(resourceName, resourceId));
    }
}

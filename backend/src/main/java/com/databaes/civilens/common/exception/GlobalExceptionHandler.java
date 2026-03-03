package com.databaes.civilens.common.exception;

import com.databaes.civilens.common.dto.ErrorResponse;
import com.databaes.civilens.common.dto.ErrorResponse.FieldError;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {

        List<FieldError> fieldErrors = new ArrayList<>();

        ex.getBindingResult().getFieldErrors()
                .forEach(error -> fieldErrors.add(new FieldError(
                        error.getField(),
                        error.getDefaultMessage())));

        ex.getBindingResult().getGlobalErrors()
                .forEach(error -> fieldErrors.add(new FieldError(
                        error.getObjectName(),
                        error.getDefaultMessage())));

        log.warn("Validation failed: {} field error(s)", fieldErrors.size());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Validation failed", "Invalid request parameters",
                fieldErrors);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    public ResponseEntity<ErrorResponse> handleHandlerMethodValidationException(HandlerMethodValidationException ex) {

        List<FieldError> fieldErrors = new ArrayList<>();

        ex.getAllErrors()
                .forEach(error -> fieldErrors.add(new FieldError(
                        error.getArguments() != null && error.getArguments().length > 0
                                ? error.getArguments()[0].toString()
                                : "field",
                        error.getDefaultMessage())));

        log.warn("Handler method validation failed: {} error(s)", fieldErrors.size());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Validation failed", "Invalid request parameters",
                fieldErrors);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFoundException(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), "Resource not found", null);
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(ValidationException ex) {
        log.warn("Validation error: {}", ex.getMessage());
        return buildErrorResponse(HttpStatus.BAD_REQUEST, ex.getMessage(), "Validation error", null);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        String errorMessage = "Invalid JSON format or invalid enum value";

        if (ex.getCause() != null) {
            String causeMessage = ex.getCause().getMessage();
            if (causeMessage != null) {
                errorMessage = cleanErrorMessage(causeMessage);
            }
        }

        log.warn("JSON deserialization error: {}", errorMessage);
        return buildErrorResponse(HttpStatus.BAD_REQUEST, errorMessage, "Invalid request body", null);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception ex) {
        log.error("Unexpected error occurred", ex);
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR,
                ex.getMessage() != null ? ex.getMessage() : "An unexpected error occurred",
                ex.getClass().getSimpleName(),
                null);
    }

    private ResponseEntity<ErrorResponse> buildErrorResponse(HttpStatus status, String message, String error,
                                                             List<FieldError> fieldErrors) {
        ErrorResponse errorResponse = new ErrorResponse(status.value(), message, error, fieldErrors);
        return new ResponseEntity<>(errorResponse, status);
    }

    private String cleanErrorMessage(String message) {
        if (message == null) {
            return "Invalid request";
        }

        return message.replaceAll("\\s+(at \\[Source|\\(through reference chain).*", "").trim();
    }
}

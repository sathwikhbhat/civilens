package com.databaes.civilens.scheme.model;

import com.databaes.civilens.common.enums.core.BenefitType;
import lombok.Data;

import jakarta.validation.constraints.*;

@Data
public class Benefits {

    @NotNull(message = "Benefit type is required")
    private BenefitType type;

    @NotBlank(message = "Benefit description is required")
    @Size(min = 5, max = 1000, message = "Benefit description must be between 5 and 1000 characters")
    private String description;
}

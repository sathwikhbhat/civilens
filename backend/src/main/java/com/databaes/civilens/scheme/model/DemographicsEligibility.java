package com.databaes.civilens.scheme.model;

import com.databaes.civilens.common.enums.core.Category;
import com.databaes.civilens.common.enums.core.Gender;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.util.List;

@Data
public class DemographicsEligibility {

    @Min(value = 0, message = "Minimum age cannot be negative")
    @Max(value = 120, message = "Minimum age cannot exceed 120")
    private Integer minAge;

    @Min(value = 0, message = "Maximum age cannot be negative")
    @Max(value = 120, message = "Maximum age cannot exceed 120")
    private Integer maxAge;

    @NotEmpty(message = "At least one gender must be allowed")
    private List<Gender> allowedGenders;

    @NotEmpty(message = "At least one category must be allowed")
    private List<Category> allowedCategories;

    @Positive(message = "Minimum family size must be positive")
    private Integer minFamilySize;

    @Positive(message = "Maximum family size must be positive")
    private Integer maxFamilySize;
}

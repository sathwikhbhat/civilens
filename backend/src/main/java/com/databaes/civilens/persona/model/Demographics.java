package com.databaes.civilens.persona.model;

import com.databaes.civilens.common.enums.core.Category;
import com.databaes.civilens.common.enums.core.Gender;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Demographics {

    @Min(value = 0, message = "Age cannot be negative")
    @Max(value = 150, message = "Age cannot exceed 150")
    private int age;

    @NotNull(message = "Gender is required")
    private Gender gender;

    @NotNull(message = "Category is required")
    private Category category;

    @Min(value = 1, message = "Family size must be at least 1")
    @Max(value = 50, message = "Family size should not exceed 50")
    private int familySize;
}

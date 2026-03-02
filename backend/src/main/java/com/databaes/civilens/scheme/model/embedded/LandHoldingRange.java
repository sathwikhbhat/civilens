package com.databaes.civilens.scheme.model.embedded;

import com.databaes.civilens.common.enums.farmer.LandUnit;
import lombok.Data;

import jakarta.validation.constraints.*;

@Data
public class LandHoldingRange {

    @NotNull(message = "Minimum land holding is required")
    @Positive(message = "Minimum land holding must be positive")
    private Double min;

    @NotNull(message = "Maximum land holding is required")
    @Positive(message = "Maximum land holding must be positive")
    private Double max;

    @NotNull(message = "Land unit is required")
    private LandUnit unit;
}

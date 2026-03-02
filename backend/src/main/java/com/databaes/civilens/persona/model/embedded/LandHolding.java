package com.databaes.civilens.persona.model.embedded;

import com.databaes.civilens.common.enums.farmer.LandUnit;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class LandHolding {

    @Positive(message = "Land holding value must be positive")
    private double value;

    @NotNull(message = "Land unit is required")
    private LandUnit unit;
}

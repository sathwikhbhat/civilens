package com.databaes.civilens.scheme.model;

import com.databaes.civilens.common.enums.core.AreaType;
import com.databaes.civilens.common.enums.core.IndianState;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class GeographicEligibility {

    @NotEmpty(message = "At least one state must be allowed")
    private List<IndianState> allowedStates;

    @NotEmpty(message = "At least one district must be allowed")
    private List<String> allowedDistricts;

    @NotEmpty(message = "At least one area type must be allowed")
    private List<AreaType> allowedAreaTypes;
}

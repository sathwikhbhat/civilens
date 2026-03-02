package com.databaes.civilens.scheme.model;

import lombok.Data;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

@Data
public class Eligibility {

    @Valid
    @NotNull(message = "Demographics eligibility must be provided")
    private DemographicsEligibility demographics;

    @Valid
    @NotNull(message = "Economic eligibility must be provided")
    private EconomicEligibility economic;

    @Valid
    @NotNull(message = "Geographic eligibility must be provided")
    private GeographicEligibility geographic;

    @Valid
    @NotNull(message = "Occupation eligibility must be provided")
    private OccupationEligibility occupation;
}

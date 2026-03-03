package com.databaes.civilens.scheme.model.occupation;

import com.databaes.civilens.common.enums.farmer.CropCategory;
import com.databaes.civilens.common.enums.farmer.IrrigationType;
import com.databaes.civilens.scheme.model.embedded.LandHoldingRange;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class FarmerEligibility {

    @Valid
    @NotNull(message = "Land holding range is required for farmer eligibility")
    private LandHoldingRange landHolding;

    @NotEmpty(message = "At least one irrigation type must be allowed")
    private List<IrrigationType> allowedIrrigationTypes;

    @NotEmpty(message = "At least one crop category must be allowed")
    private List<CropCategory> allowedPrimaryCropCategories;
}

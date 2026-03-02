package com.databaes.civilens.persona.model.occupation;

import com.databaes.civilens.common.enums.farmer.CropCategory;
import com.databaes.civilens.common.enums.farmer.IrrigationType;
import com.databaes.civilens.persona.model.embedded.LandHolding;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class FarmerDetails extends OccupationDetails {

    @NotNull(message = "Land holding information is required")
    @Valid
    private LandHolding landHolding;

    @NotNull(message = "Irrigation type is required")
    private IrrigationType irrigationType;

    @NotNull(message = "Primary crop category is required")
    private CropCategory primaryCropCategory;
}

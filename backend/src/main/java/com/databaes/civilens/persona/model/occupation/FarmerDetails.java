package com.databaes.civilens.persona.model.occupation;

import com.databaes.civilens.common.enums.farmer.CropCategory;
import com.databaes.civilens.common.enums.farmer.IrrigationType;
import com.databaes.civilens.persona.model.embedded.LandHolding;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Details specific to farmer occupation")
public class FarmerDetails extends OccupationDetails {

    @NotNull
    @Valid
    @Schema(description = "Land holding information including value and unit", requiredMode = Schema.RequiredMode.REQUIRED)
    private LandHolding landHolding;

    @NotNull
    @Schema(description = "Type of irrigation used", requiredMode = Schema.RequiredMode.REQUIRED)
    private IrrigationType irrigationType;

    @NotNull
    @Schema(description = "Primary crop category", requiredMode = Schema.RequiredMode.REQUIRED)
    private CropCategory primaryCropCategory;
}

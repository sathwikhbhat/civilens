package com.databaes.civilens.persona.model;

import com.databaes.civilens.common.enums.core.AreaType;
import com.databaes.civilens.common.enums.core.IndianState;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Geographic {

    @NotNull(message = "State is required")
    private IndianState state;

    @NotBlank(message = "District is required")
    private String district;

    @NotNull(message = "Area type is required")
    private AreaType areaType;
}

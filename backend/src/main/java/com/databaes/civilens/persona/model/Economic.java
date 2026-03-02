package com.databaes.civilens.persona.model;

import com.databaes.civilens.common.enums.core.IncomeBracket;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Economic {

    @NotNull(message = "Income bracket is required")
    private IncomeBracket incomeBracket;

    private boolean bplStatus;
}

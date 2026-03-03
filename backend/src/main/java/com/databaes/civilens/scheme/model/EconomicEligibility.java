package com.databaes.civilens.scheme.model;

import com.databaes.civilens.common.enums.core.IncomeBracket;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class EconomicEligibility {

    @NotEmpty(message = "At least one income bracket must be allowed")
    private List<IncomeBracket> allowedIncomeBrackets;

    @NotNull(message = "BPL requirement status must be specified")
    private Boolean bplRequired;
}

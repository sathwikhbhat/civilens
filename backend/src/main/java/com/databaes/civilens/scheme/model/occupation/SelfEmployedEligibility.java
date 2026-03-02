package com.databaes.civilens.scheme.model.occupation;

import com.databaes.civilens.common.enums.worker.AnnualTurnoverBracket;
import com.databaes.civilens.common.enums.worker.EnterpriseSize;
import com.databaes.civilens.common.enums.worker.Sector;
import lombok.Data;

import jakarta.validation.constraints.*;
import java.util.List;

@Data
public class SelfEmployedEligibility {

    @NotEmpty(message = "At least one sector must be allowed")
    private List<Sector> allowedSectors;

    @Min(value = 0, message = "Minimum years operational cannot be negative")
    private Integer minYearsOperational;

    @Min(value = 0, message = "Maximum years operational cannot be negative")
    private Integer maxYearsOperational;

    @NotEmpty(message = "At least one enterprise size must be allowed")
    private List<EnterpriseSize> allowedEnterpriseSizes;

    @NotEmpty(message = "At least one turnover bracket must be allowed")
    private List<AnnualTurnoverBracket> allowedTurnoverBrackets;
}

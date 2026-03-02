package com.databaes.civilens.persona.model.occupation;

import com.databaes.civilens.common.enums.worker.AnnualTurnoverBracket;
import com.databaes.civilens.common.enums.worker.EnterpriseSize;
import com.databaes.civilens.common.enums.worker.Sector;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SelfEmployedDetails extends OccupationDetails {

    @NotNull(message = "Sector is required")
    private Sector sector;

    @Min(value = 0, message = "Years operational cannot be negative")
    private int yearsOperational;

    @NotNull(message = "Enterprise size is required")
    private EnterpriseSize enterpriseSize;

    @NotNull(message = "Annual turnover bracket is required")
    private AnnualTurnoverBracket annualTurnoverBracket;
}

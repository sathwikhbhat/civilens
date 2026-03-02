package com.databaes.civilens.persona.model.occupation;

import com.databaes.civilens.common.enums.selfemployed.EmploymentCategory;
import com.databaes.civilens.common.enums.selfemployed.IndustryType;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class WorkerDetails extends OccupationDetails {

    @NotNull(message = "Employment category is required")
    private EmploymentCategory employmentCategory;

    @NotNull(message = "Industry type is required")
    private IndustryType industryType;

    @NotNull(message = "Migrant worker status is required")
    @JsonProperty("isMigrantWorker")
    private Boolean migrantWorker;
}

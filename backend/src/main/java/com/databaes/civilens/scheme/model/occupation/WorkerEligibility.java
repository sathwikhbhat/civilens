package com.databaes.civilens.scheme.model.occupation;

import com.databaes.civilens.common.enums.selfemployed.EmploymentCategory;
import com.databaes.civilens.common.enums.selfemployed.IndustryType;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class WorkerEligibility {

    @NotEmpty(message = "At least one employment category must be allowed")
    private List<EmploymentCategory> allowedEmploymentCategories;

    @NotEmpty(message = "At least one industry type must be allowed")
    private List<IndustryType> allowedIndustryTypes;

    @NotNull(message = "Migrant worker requirement status must be specified")
    private Boolean migrantWorkerRequired;
}

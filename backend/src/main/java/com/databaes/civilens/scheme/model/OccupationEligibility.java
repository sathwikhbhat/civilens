package com.databaes.civilens.scheme.model;

import com.databaes.civilens.common.enums.core.OccupationType;
import com.databaes.civilens.scheme.model.occupation.FarmerEligibility;
import com.databaes.civilens.scheme.model.occupation.SelfEmployedEligibility;
import com.databaes.civilens.scheme.model.occupation.StudentEligibility;
import com.databaes.civilens.scheme.model.occupation.WorkerEligibility;
import lombok.Data;

import jakarta.validation.constraints.*;
import jakarta.validation.Valid;
import java.util.List;

@Data
public class OccupationEligibility {

    @NotEmpty(message = "At least one occupation type must be allowed")
    private List<OccupationType> allowedTypes;

    @Valid
    private FarmerEligibility farmerEligibility;

    @Valid
    private WorkerEligibility workerEligibility;

    @Valid
    private StudentEligibility studentEligibility;

    @Valid
    private SelfEmployedEligibility selfEmployedEligibility;
}

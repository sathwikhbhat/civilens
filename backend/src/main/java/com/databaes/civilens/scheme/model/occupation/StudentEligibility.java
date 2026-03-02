package com.databaes.civilens.scheme.model.occupation;

import com.databaes.civilens.common.enums.student.EducationLevel;
import com.databaes.civilens.common.enums.student.InstitutionType;
import com.databaes.civilens.common.enums.student.StreamType;
import lombok.Data;

import jakarta.validation.constraints.*;
import java.util.List;

@Data
public class StudentEligibility {

    @NotEmpty(message = "At least one education level must be allowed")
    private List<EducationLevel> allowedEducationLevels;

    @NotEmpty(message = "At least one institution type must be allowed")
    private List<InstitutionType> allowedInstitutionTypes;

    @NotEmpty(message = "At least one stream must be allowed")
    private List<StreamType> allowedStreams;
}

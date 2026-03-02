package com.databaes.civilens.persona.model.occupation;

import com.databaes.civilens.common.enums.student.EducationLevel;
import com.databaes.civilens.common.enums.student.InstitutionType;
import com.databaes.civilens.common.enums.student.StreamType;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StudentDetails extends OccupationDetails {

    @NotNull(message = "Education level is required")
    private EducationLevel educationLevel;

    @NotNull(message = "Institution type is required")
    private InstitutionType institutionType;

    @NotNull(message = "Stream is required")
    private StreamType stream;
}

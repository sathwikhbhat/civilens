package com.databaes.civilens.persona.model;

import com.databaes.civilens.common.enums.core.OccupationType;
import com.databaes.civilens.persona.model.occupation.*;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class Occupation {

        @NotNull(message = "Occupation type is required")
        private OccupationType type;

        @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXTERNAL_PROPERTY, property = "type")
        @JsonSubTypes({
                        @JsonSubTypes.Type(value = FarmerDetails.class, name = "FARMER"),
                        @JsonSubTypes.Type(value = WorkerDetails.class, name = "WORKER"),
                        @JsonSubTypes.Type(value = StudentDetails.class, name = "STUDENT"),
                        @JsonSubTypes.Type(value = SelfEmployedDetails.class, name = "SELF_EMPLOYED")
        })
        @NotNull(message = "Occupation details are required")
        @Valid
        private OccupationDetails details;
}

package com.databaes.civilens.persona.model.occupation;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(oneOf = {
        FarmerDetails.class,
        WorkerDetails.class,
        StudentDetails.class,
        SelfEmployedDetails.class
}, discriminatorProperty = "type", description = "Occupation-specific details based on the occupation type")
public abstract class OccupationDetails {
}

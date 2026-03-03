package com.databaes.civilens.scheme.model;

import com.databaes.civilens.common.enums.core.ApplicationMode;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Data
@Document(collection = "schemes")
public class Scheme {

    @Id
    private String id;

    @NotBlank(message = "Scheme ID is required")
    private String schemeId;

    @NotBlank(message = "Scheme title is required")
    @Size(min = 3, max = 255, message = "Scheme title must be between 3 and 255 characters")
    private String title;

    @NotBlank(message = "Scheme category is required")
    private String category;

    @NotBlank(message = "Official link is required")
    @Pattern(regexp = "^https?://.+", message = "Official link must be a valid URL")
    private String officialLink;

    @NotBlank(message = "Source portal is required")
    private String sourcePortal;

    @NotBlank(message = "Summary is required")
    @Size(min = 10, max = 500, message = "Summary must be between 10 and 500 characters")
    private String summary;

    @NotBlank(message = "Semantic content is required")
    private String semanticContent;

    @Valid
    private Eligibility eligibility;

    @Valid
    private Benefits benefits;

    @NotEmpty(message = "At least one document is required")
    private List<String> documentsRequired;

    @NotNull(message = "Application mode is required")
    private ApplicationMode applicationMode;

    @NotNull(message = "Active status is required")
    private Boolean isActive;

    private Instant lastUpdated;
}

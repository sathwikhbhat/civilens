package com.databaes.civilens.scheme.controller;

import com.databaes.civilens.scheme.model.Scheme;
import com.databaes.civilens.scheme.service.SchemeServiceImpl;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/*
This endpoint is temporarily created to get an idea on how the JSON would look like. It will be removed soon and replaced with the necessary end points.
 */
@RestController
@RequestMapping("/scheme")
@Tag(name = "Scheme Management", description = "APIs for managing scheme data. NOTE THAT THIS IS A TEMPORARY END POINT. IT WILL BE REMOVED SOON")
public class SchemeController {

    private final SchemeServiceImpl schemeServiceImpl;

    public SchemeController(SchemeServiceImpl schemeServiceImpl) {
        this.schemeServiceImpl = schemeServiceImpl;
    }

    @PostMapping
    @Operation(summary = "Store a list of schemes", description = "Stores the list of schemes with eligibility criteria, benefits, and application information")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Scheme stored successfully", content = @Content),
            @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content)
    })
    public ResponseEntity<Void> storeScheme(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "List of scheme objects to be created", required = true, content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE, schema = @Schema(implementation = Scheme.class), examples = {
                    @ExampleObject(name = "Farmer Scheme", value = """
                            [
                              {
                                "schemeId": "PMKISAN001",
                                "title": "Pradhan Mantri Kisan Samman Nidhi",
                                "category": "FARMER",
                                "officialLink": "https://pmkisan.gov.in",
                                "sourcePortal": "Government of India",
                                "summary": "Direct income support to farmers",
                                "semanticContent": "Agricultural income support program",
                                "documentsRequired": ["Aadhar", "Bank Account", "Land Record"],
                                "applicationMode": "ONLINE",
                                "isActive": true,
                                "eligibility": {
                                  "demographics": {
                                    "minAge": 18,
                                    "maxAge": 75,
                                    "allowedGenders": ["MALE", "FEMALE", "OTHER"],
                                    "allowedCategories": ["GENERAL", "SC", "ST", "OBC"],
                                    "minFamilySize": 1,
                                    "maxFamilySize": 10
                                  },
                                  "economic": {
                                    "allowedIncomeBrackets": ["ZERO_TO_1L", "ONE_TO_3L"],
                                    "bplRequired": false
                                  },
                                  "geographic": {
                                    "allowedStates": ["MAHARASHTRA", "HARYANA", "TAMIL_NADU"],
                                    "allowedDistricts": ["Nashik", "Aurangabad"],
                                    "allowedAreaTypes": ["RURAL", "URBAN"]
                                  },
                                  "occupation": {
                                    "allowedTypes": ["FARMER"],
                                    "farmerEligibility": {
                                      "landHolding": {
                                        "minAcres": 1,
                                        "maxAcres": 50
                                      },
                                      "allowedIrrigationTypes": ["RAINFED", "IRRIGATED"],
                                      "allowedPrimaryCropCategories": ["FOODGRAIN", "CASH_CROP", "HORTICULTURE"]
                                    }
                                  }
                                },
                                "benefits": {
                                  "type": "SUBSIDY",
                                  "description": "₹2000 per acre per season"
                                }
                              }
                            ]
                            """),
                    @ExampleObject(name = "Student Scheme", value = """
                            [
                              {
                                "schemeId": "NMEICT001",
                                "title": "National Mission on Education through ICT",
                                "category": "STUDENT",
                                "officialLink": "https://nmeict.gov.in",
                                "sourcePortal": "Ministry of Education",
                                "summary": "Digital learning resources for students",
                                "semanticContent": "Educational technology support program",
                                "documentsRequired": ["Enrollment Certificate", "Educational ID"],
                                "applicationMode": "ONLINE",
                                "isActive": true,
                                "eligibility": {
                                  "demographics": {
                                    "minAge": 5,
                                    "maxAge": 30,
                                    "allowedGenders": ["MALE", "FEMALE", "OTHER"],
                                    "allowedCategories": ["GENERAL", "SC", "ST", "OBC", "MINORITY"],
                                    "minFamilySize": 1,
                                    "maxFamilySize": 10
                                  },
                                  "economic": {
                                    "allowedIncomeBrackets": ["ZERO_TO_1L", "ONE_TO_3L", "THREE_TO_5L"],
                                    "bplRequired": false
                                  },
                                  "geographic": {
                                    "allowedStates": ["MAHARASHTRA", "DELHI", "TAMIL_NADU", "KARNATAKA"],
                                    "allowedAreaTypes": ["RURAL", "URBAN"]
                                  },
                                  "occupation": {
                                    "allowedTypes": ["STUDENT"],
                                    "studentEligibility": {
                                      "allowedEducationLevels": ["SCHOOL", "DIPLOMA", "UG", "PG"],
                                      "allowedInstitutionTypes": ["GOVERNMENT", "PRIVATE"],
                                      "allowedStreams": ["SCIENCE", "COMMERCE", "ARTS"]
                                    }
                                  }
                                },
                                "benefits": {
                                  "type": "SCHOLARSHIP",
                                  "description": "₹10,000 per annum scholarship"
                                }
                              }
                            ]
                            """),
                    @ExampleObject(name = "Worker Scheme", value = """
                            [
                              {
                                "schemeId": "ATAL001",
                                "title": "ATAL Mission for Rejuvenation and Urban Transformation",
                                "category": "WORKER",
                                "officialLink": "https://atalcentres.niti.gov.in",
                                "sourcePortal": "NITI Aayog",
                                "summary": "Skill development and livelihood support",
                                "semanticContent": "Worker training and employment assistance",
                                "documentsRequired": ["Identity Proof", "Address Proof", "Educational Certificate"],
                                "applicationMode": "ONLINE",
                                "isActive": true,
                                "eligibility": {
                                  "demographics": {
                                    "minAge": 18,
                                    "maxAge": 65,
                                    "allowedGenders": ["MALE", "FEMALE", "OTHER"],
                                    "allowedCategories": ["GENERAL", "SC", "ST", "OBC"],
                                    "minFamilySize": 1,
                                    "maxFamilySize": 8
                                  },
                                  "economic": {
                                    "allowedIncomeBrackets": ["ZERO_TO_1L", "ONE_TO_3L", "THREE_TO_5L"],
                                    "bplRequired": false
                                  },
                                  "geographic": {
                                    "allowedStates": ["MAHARASHTRA", "TAMIL_NADU", "GUJARAT"],
                                    "allowedAreaTypes": ["URBAN"]
                                  },
                                  "occupation": {
                                    "allowedTypes": ["WORKER"],
                                    "workerEligibility": {
                                      "allowedEmploymentCategories": ["ORGANISED", "UNORGANISED"],
                                      "allowedIndustryTypes": ["CONSTRUCTION", "MANUFACTURING", "OTHER"],
                                      "migrantWorkerRequired": false
                                    }
                                  }
                                },
                                "benefits": {
                                  "type": "GRANT",
                                  "description": "Skill training and ₹5000 stipend"
                                }
                              }
                            ]
                            """),
                    @ExampleObject(name = "Self-Employed Scheme", value = """
                            [
                              {
                                "schemeId": "PMEGP001",
                                "title": "Prime Minister Employment Generation Programme",
                                "category": "SELF_EMPLOYED",
                                "officialLink": "https://pmegp.gov.in",
                                "sourcePortal": "Ministry of Micro, Small and Medium Enterprises",
                                "summary": "Subsidy for starting self-employment ventures",
                                "semanticContent": "Entrepreneurial support and financial assistance",
                                "documentsRequired": ["Business Plan", "Aadhar", "Bank Account", "Educational Certificate"],
                                "applicationMode": "ONLINE",
                                "isActive": true,
                                "eligibility": {
                                  "demographics": {
                                    "minAge": 18,
                                    "maxAge": 65,
                                    "allowedGenders": ["MALE", "FEMALE", "OTHER"],
                                    "allowedCategories": ["GENERAL", "SC", "ST", "OBC", "MINORITY"],
                                    "minFamilySize": 1,
                                    "maxFamilySize": 10
                                  },
                                  "economic": {
                                    "allowedIncomeBrackets": ["ZERO_TO_1L", "ONE_TO_3L"],
                                    "bplRequired": false
                                  },
                                  "geographic": {
                                    "allowedStates": ["MAHARASHTRA", "KARNATAKA", "DELHI", "HARYANA"],
                                    "allowedAreaTypes": ["RURAL", "URBAN"]
                                  },
                                  "occupation": {
                                    "allowedTypes": ["SELF_EMPLOYED"],
                                    "selfEmployedEligibility": {
                                      "allowedSectors": ["MANUFACTURING", "SERVICES", "RETAIL", "OTHER"],
                                      "minYearsOperational": 0,
                                      "maxYearsOperational": 5,
                                      "allowedEnterpriseSizes": ["MICRO", "SMALL"],
                                      "allowedTurnoverBrackets": ["ZERO_TO_5L", "FIVE_TO_10L"]
                                    }
                                  }
                                },
                                "benefits": {
                                  "type": "LOAN",
                                  "description": "₹10 lakhs subsided loan at favorable interest rates"
                                }
                              }
                            ]
                            """),
                    @ExampleObject(name = "Multiple Schemes List", value = """
                            [
                              {
                                "schemeId": "PMKISAN001",
                                "title": "Pradhan Mantri Kisan Samman Nidhi",
                                "category": "FARMER",
                                "officialLink": "https://pmkisan.gov.in",
                                "sourcePortal": "Government of India",
                                "summary": "Direct income support to farmers",
                                "semanticContent": "Agricultural income support program",
                                "documentsRequired": ["Aadhar", "Bank Account", "Land Record"],
                                "applicationMode": "ONLINE",
                                "isActive": true,
                                "eligibility": {
                                  "occupation": {
                                    "allowedTypes": ["FARMER"],
                                    "farmerEligibility": {
                                      "landHolding": {
                                        "minAcres": 1,
                                        "maxAcres": 50
                                      },
                                      "allowedIrrigationTypes": ["RAINFED", "IRRIGATED"],
                                      "allowedPrimaryCropCategories": ["FOODGRAIN", "CASH_CROP"]
                                    }
                                  }
                                },
                                "benefits": {
                                  "type": "SUBSIDY",
                                  "description": "₹2000 per acre per season"
                                }
                              },
                              {
                                "schemeId": "NMEICT001",
                                "title": "National Mission on Education through ICT",
                                "category": "STUDENT",
                                "officialLink": "https://nmeict.gov.in",
                                "sourcePortal": "Ministry of Education",
                                "summary": "Digital learning resources for students",
                                "semanticContent": "Educational technology support program",
                                "documentsRequired": ["Enrollment Certificate", "Educational ID"],
                                "applicationMode": "ONLINE",
                                "isActive": true,
                                "eligibility": {
                                  "occupation": {
                                    "allowedTypes": ["STUDENT"],
                                    "studentEligibility": {
                                      "allowedEducationLevels": ["SCHOOL", "DIPLOMA", "UG"],
                                      "allowedInstitutionTypes": ["GOVERNMENT", "PRIVATE"],
                                      "allowedStreams": ["SCIENCE", "COMMERCE", "ARTS"]
                                    }
                                  }
                                },
                                "benefits": {
                                  "type": "SCHOLARSHIP",
                                  "description": "₹10,000 per annum scholarship"
                                }
                              }
                            ]
                            """)
            })) @Valid @RequestBody List<Scheme> schemes) {
        for (Scheme scheme : schemes) {
            schemeServiceImpl.createScheme(scheme);
        }
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}

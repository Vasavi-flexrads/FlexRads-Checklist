import json
from pathlib import Path


def text(template):
    return {"type": "text", "template": template}


def compound(parts, delimiter=" "):
    return {"type": "compound", "parts": parts, "delimiter": delimiter}


def list_spec(field, item, mode="join", delimiter=", ", item_context=None, when_empty=None):
    spec = {"type": "list", "field": field, "mode": mode, "delimiter": delimiter, "item": item}
    if item_context:
        spec["itemContext"] = item_context
    if when_empty:
        spec["whenEmpty"] = when_empty
    return spec


def case_spec(cases):
    return {"type": "case", "cases": cases}


def rule(conditions, output, stop=False):
    data = {"conditions": conditions, "output": output}
    if stop:
        data["stop"] = True
    return data


def foot_config():
    return {
        "study_type": "FOOT",
        "items": [
            {
                "id": "hardware",
                "rules": [
                    rule(
                        [
                            {"field": "hardware", "operator": "equals", "value": "Yes"},
                            {"field": "hardware_types", "operator": "lengthGreaterThan", "value": 0}
                        ],
                        compound(
                            [
                                text("Hardware present: "),
                                list_spec(
                                    "hardware_types",
                                    case_spec(
                                        [
                                            {
                                                "conditions": [{"field": "region", "operator": "exists"}],
                                                "output": "{{option}} in {{region}}"
                                            },
                                            {
                                                "default": True,
                                                "output": "{{option}}"
                                            }
                                        ]
                                    ),
                                    delimiter=", ",
                                    item_context=[
                                        {
                                            "alias": "region",
                                            "optionMap": {
                                                "Arthrodesis and screw fixation": "arthrodesis_region",
                                                "Plate and screw fixation": "plate_screw_region",
                                                "K wire": "kwire_region",
                                                "Screws": "screws_region",
                                                "Staples": "staples_region"
                                            }
                                        }
                                    ]
                                )
                            ],
                            delimiter=""
                        ),
                        stop=True
                    ),
                    rule(
                        [{"field": "hardware", "operator": "equals", "value": "Yes"}],
                        "Hardware present"
                    )
                ]
            },
            {
                "id": "post_surgical_changes",
                "rules": [
                    rule(
                        [{"field": "post_surgical_changes", "operator": "equals", "value": "Yes"}],
                        "Post surgical changes in soft tissue"
                    )
                ]
            },
            {
                "id": "degenerative_changes",
                "rules": [
                    rule(
                        [
                            {"field": "degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "joints", "operator": "lengthGreaterThan", "value": 0}
                        ],
                        list_spec(
                            "joints",
                            case_spec(
                                [
                                    {
                                        "conditions": [{"field": "severity", "operator": "exists"}],
                                        "output": "{{severity}} degenerative changes in {{option}}"
                                    },
                                    {
                                        "default": True,
                                        "output": "Degenerative changes in {{option}}"
                                    }
                                ]
                            ),
                            mode="separate",
                            item_context=[
                                {
                                    "alias": "severity",
                                    "fieldTemplate": "{{optionKey}}_severity"
                                }
                            ]
                        )
                    ),
                    rule(
                        [
                            {"field": "degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "joint_space_narrowing", "operator": "in", "value": ["Present", "Yes"]}
                        ],
                        "Joint space narrowing present"
                    ),
                    rule(
                        [
                            {"field": "degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "osteophytes", "operator": "in", "value": ["Present", "Yes"]}
                        ],
                        "Osteophytes present"
                    ),
                    rule(
                        [
                            {"field": "degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "sclerotic_changes", "operator": "in", "value": ["Present", "Yes"]}
                        ],
                        "Sclerotic changes present"
                    )
                ]
            },
            {
                "id": "deformity",
                "rules": [
                    rule(
                        [
                            {"field": "deformity", "operator": "equals", "value": "Yes"},
                            {"field": "deformity_type", "operator": "equals", "value": "Hallux valgus deformity"},
                            {"field": "hallux_valgus_mtp_changes", "operator": "exists"}
                        ],
                        "Hallux valgus deformity with {{hallux_valgus_mtp_changes|lower}} 1st MTP degenerative changes",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "deformity", "operator": "equals", "value": "Yes"},
                            {"field": "deformity_type", "operator": "equals", "value": "Flexion deformity"},
                            {"field": "flexion_deformity_region", "operator": "exists"}
                        ],
                        "Flexion deformity in {{flexion_deformity_region}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "deformity", "operator": "equals", "value": "Yes"},
                            {"field": "deformity_type", "operator": "exists"}
                        ],
                        "{{deformity_type}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "deformity", "operator": "equals", "value": "Yes"}],
                        "Deformity present"
                    )
                ]
            },
            {
                "id": "calcaneal_spur",
                "rules": [
                    rule(
                        [
                            {"field": "calcaneal_spur", "operator": "equals", "value": "Yes"},
                            {"field": "spur_location", "operator": "lengthGreaterThan", "value": 0}
                        ],
                        "Calcaneal spur ({{spur_location|join(\", \")}})",
                        stop=True
                    ),
                    rule(
                        [{"field": "calcaneal_spur", "operator": "equals", "value": "Yes"}],
                        "Calcaneal spur present"
                    )
                ]
            },
            {
                "id": "amputation",
                "rules": [
                    rule(
                        [
                            {"field": "amputation", "operator": "equals", "value": "Yes"},
                            {"field": "amputation_region", "operator": "exists"}
                        ],
                        "Amputation in {{amputation_region}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "amputation", "operator": "equals", "value": "Yes"}],
                        "Amputation present"
                    )
                ]
            },
            {
                "id": "acute_fracture",
                "rules": [
                    rule(
                        [
                            {"field": "acute_fracture", "operator": "equals", "value": "Yes"},
                            {"field": "fracture_region", "operator": "exists"},
                            {"field": "fracture_type", "operator": "exists"}
                        ],
                        "Acute fracture in {{fracture_region}}, {{fracture_type}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "acute_fracture", "operator": "equals", "value": "Yes"},
                            {"field": "fracture_region", "operator": "exists"}
                        ],
                        "Acute fracture in {{fracture_region}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "acute_fracture", "operator": "equals", "value": "Yes"}],
                        "Acute fracture"
                    )
                ]
            },
            {
                "id": "fracture_followup",
                "rules": [
                    rule(
                        [
                            {"field": "fracture_followup", "operator": "equals", "value": "Yes"},
                            {"field": "followup_type", "operator": "exists"},
                            {"field": "followup_region", "operator": "exists"}
                        ],
                        "{{followup_type}} in {{followup_region}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "fracture_followup", "operator": "equals", "value": "Yes"},
                            {"field": "followup_type", "operator": "exists"}
                        ],
                        "{{followup_type}}",
                        stop=True
                    )
                ]
            },
            {
                "id": "lesion",
                "rules": [
                    rule(
                        [
                            {"field": "lesion", "operator": "equals", "value": "Yes"},
                            {"field": "lesion_region", "operator": "exists"},
                            {"field": "lesion_size", "operator": "exists"},
                            {"field": "lesion_characteristics", "operator": "exists"}
                        ],
                        "Lesion in {{lesion_region}}, size {{lesion_size}}, {{lesion_characteristics}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "lesion", "operator": "equals", "value": "Yes"},
                            {"field": "lesion_region", "operator": "exists"},
                            {"field": "lesion_size", "operator": "exists"}
                        ],
                        "Lesion in {{lesion_region}}, size {{lesion_size}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "lesion", "operator": "equals", "value": "Yes"},
                            {"field": "lesion_region", "operator": "exists"}
                        ],
                        "Lesion in {{lesion_region}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "lesion", "operator": "equals", "value": "Yes"}],
                        "Lesion present"
                    )
                ]
            }
        ]
    }


def hip_config():
    return {
        "study_type": "HIP",
        "items": [
            {
                "id": "hardware",
                "rules": [
                    rule(
                        [
                            {"field": "hardware", "operator": "equals", "value": "Present"},
                            {"field": "hardware_type", "operator": "equals", "value": "Others"},
                            {"field": "hardware_other_description", "operator": "exists"}
                        ],
                        "Hardware present: {{hardware_other_description}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "hardware", "operator": "equals", "value": "Present"},
                            {"field": "hardware_type", "operator": "exists"}
                        ],
                        "Hardware present: {{hardware_type}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "hardware", "operator": "equals", "value": "Present"}],
                        "Hardware present"
                    )
                ]
            },
            {
                "id": "degenerative_changes",
                "rules": [
                    rule(
                        [
                            {"field": "degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "severity", "operator": "exists"}
                        ],
                        "{{severity}} degenerative changes"
                    ),
                    rule(
                        [
                            {"field": "degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "severity", "operator": "notExists"}
                        ],
                        "Degenerative changes present"
                    ),
                    rule(
                        [
                            {"field": "degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "joint_space_narrowing", "operator": "in", "value": ["Present", "Yes"]}
                        ],
                        "Joint space narrowing present"
                    ),
                    rule(
                        [
                            {"field": "degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "osteophytes", "operator": "in", "value": ["Present", "Yes"]}
                        ],
                        "Osteophytes present"
                    ),
                    rule(
                        [
                            {"field": "degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "sclerotic_changes", "operator": "in", "value": ["Present", "Yes"]}
                        ],
                        "Sclerotic changes present"
                    ),
                    rule(
                        [
                            {"field": "degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "subchondral_bone_cyst", "operator": "equals", "value": "Yes"}
                        ],
                        "Subchondral bone cyst present"
                    )
                ]
            },
            {
                "id": "heterotrophic_calcification",
                "rules": [
                    rule(
                        [{"field": "heterotrophic_calcification", "operator": "equals", "value": "Present"}],
                        "Heterotrophic calcification present"
                    )
                ]
            },
            {
                "id": "vascular_calcification",
                "rules": [
                    rule(
                        [{"field": "vascular_calcification", "operator": "equals", "value": "Present"}],
                        "Vascular calcification present"
                    )
                ]
            },
            {
                "id": "acute_fracture",
                "rules": [
                    rule(
                        [
                            {"field": "acute_fracture", "operator": "equals", "value": "Yes"},
                            {"field": "fracture_region", "operator": "exists"},
                            {"field": "fracture_type", "operator": "exists"}
                        ],
                        "Acute fracture in {{fracture_region}}, {{fracture_type}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "acute_fracture", "operator": "equals", "value": "Yes"},
                            {"field": "fracture_region", "operator": "exists"}
                        ],
                        "Acute fracture in {{fracture_region}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "acute_fracture", "operator": "equals", "value": "Yes"}],
                        "Acute fracture"
                    )
                ]
            },
            {
                "id": "fracture_followup",
                "rules": [
                    rule(
                        [
                            {"field": "fracture_followup", "operator": "equals", "value": "Yes"},
                            {"field": "followup_type", "operator": "exists"},
                            {"field": "followup_region", "operator": "exists"}
                        ],
                        "{{followup_type}} in {{followup_region}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "fracture_followup", "operator": "equals", "value": "Yes"},
                            {"field": "followup_type", "operator": "exists"}
                        ],
                        "{{followup_type}}",
                        stop=True
                    )
                ]
            },
            {
                "id": "deformity",
                "rules": [
                    rule(
                        [
                            {"field": "deformity", "operator": "equals", "value": "Yes"},
                            {"field": "deformity_type", "operator": "exists"}
                        ],
                        "{{deformity_type}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "deformity", "operator": "equals", "value": "Yes"}],
                        "Deformity present"
                    )
                ]
            },
            {
                "id": "phleboliths",
                "rules": [
                    rule(
                        [{"field": "phleboliths", "operator": "equals", "value": "Present"}],
                        "Phleboliths present"
                    )
                ]
            },
            {
                "id": "lesion",
                "rules": [
                    rule(
                        [
                            {"field": "lesion", "operator": "equals", "value": "Yes"},
                            {"field": "lesion_region", "operator": "exists"},
                            {"field": "lesion_size", "operator": "exists"},
                            {"field": "lesion_characteristics", "operator": "exists"}
                        ],
                        "Lesion in {{lesion_region}}, size {{lesion_size}}, {{lesion_characteristics}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "lesion", "operator": "equals", "value": "Yes"},
                            {"field": "lesion_region", "operator": "exists"},
                            {"field": "lesion_size", "operator": "exists"}
                        ],
                        "Lesion in {{lesion_region}}, size {{lesion_size}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "lesion", "operator": "equals", "value": "Yes"},
                            {"field": "lesion_region", "operator": "exists"}
                        ],
                        "Lesion in {{lesion_region}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "lesion", "operator": "equals", "value": "Yes"}],
                        "Lesion present"
                    )
                ]
            },
            {
                "id": "dislocation_subluxation",
                "rules": [
                    rule(
                        [{"field": "dislocation_subluxation", "operator": "equals", "value": "Yes"}],
                        "Dislocation/subluxation present"
                    )
                ]
            }
        ]
    }


def shoulder_config():
    return {
        "study_type": "SHOULDER",
        "items": [
            {
                "id": "hardware",
                "rules": [
                    rule(
                        [
                            {"field": "hardware", "operator": "equals", "value": "Present"},
                            {"field": "hardware_type", "operator": "equals", "value": "Others"},
                            {"field": "hardware_other_description", "operator": "exists"}
                        ],
                        "Hardware present: {{hardware_other_description}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "hardware", "operator": "equals", "value": "Present"},
                            {"field": "hardware_type", "operator": "exists"}
                        ],
                        "Hardware present: {{hardware_type}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "hardware", "operator": "equals", "value": "Present"}],
                        "Hardware present"
                    )
                ]
            },
            {
                "id": "post_surgical_changes",
                "rules": [
                    rule(
                        [{"field": "post_surgical_changes", "operator": "equals", "value": "Yes"}],
                        "Post surgical changes in soft tissue"
                    )
                ]
            },
            {
                "id": "degenerative_changes",
                "rules": [
                    rule(
                        [
                            {"field": "degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "joints", "operator": "lengthGreaterThan", "value": 0}
                        ],
                        list_spec(
                            "joints",
                            case_spec(
                                [
                                    {
                                        "conditions": [{"field": "option", "operator": "equals", "value": "Acromioclavicular (AC) joint"}],
                                        "output": compound(
                                            [
                                                case_spec(
                                                    [
                                                        {
                                                            "conditions": [{"field": "ac_severity", "operator": "exists"}],
                                                            "output": "{{ac_severity}} degenerative changes in the acromioclavicular joint"
                                                        },
                                                        {
                                                            "default": True,
                                                            "output": "Degenerative changes in the acromioclavicular joint"
                                                        }
                                                    ]
                                                ),
                                                case_spec(
                                                    [
                                                        {
                                                            "conditions": [
                                                                {
                                                                    "field": "ac_osteophytes",
                                                                    "operator": "equals",
                                                                    "value": "Present"
                                                                }
                                                            ],
                                                            "output": "with osteophytes"
                                                        }
                                                    ]
                                                ),
                                                case_spec(
                                                    [
                                                        {
                                                            "conditions": [{"field": "ac_joint_space_narrowing", "operator": "exists"}],
                                                            "output": "(joint space measurement {{ac_joint_space_narrowing}})"
                                                        }
                                                    ]
                                                )
                                            ],
                                            delimiter=" "
                                        )
                                    },
                                    {
                                        "conditions": [{"field": "option", "operator": "equals", "value": "Glenohumeral joint"}],
                                        "output": compound(
                                            [
                                                case_spec(
                                                    [
                                                        {
                                                            "conditions": [{"field": "glenohumeral_severity", "operator": "exists"}],
                                                            "output": "{{glenohumeral_severity}} degenerative changes in the glenohumeral joint"
                                                        },
                                                        {
                                                            "default": True,
                                                            "output": "Degenerative changes in the glenohumeral joint"
                                                        }
                                                    ]
                                                ),
                                                case_spec(
                                                    [
                                                        {
                                                            "conditions": [
                                                                {
                                                                    "field": "glenohumeral_osteophytes",
                                                                    "operator": "equals",
                                                                    "value": "Present"
                                                                }
                                                            ],
                                                            "output": "with osteophytes"
                                                        }
                                                    ]
                                                )
                                            ],
                                            delimiter=" "
                                        )
                                    }
                                ]
                            ),
                            mode="separate",
                            item_context=[
                                {
                                    "alias": "ac_severity",
                                    "optionMap": {"Acromioclavicular (AC) joint": "ac_severity"}
                                },
                                {
                                    "alias": "ac_osteophytes",
                                    "optionMap": {"Acromioclavicular (AC) joint": "ac_osteophytes"}
                                },
                                {
                                    "alias": "ac_joint_space_narrowing",
                                    "optionMap": {"Acromioclavicular (AC) joint": "ac_joint_space_narrowing"}
                                },
                                {
                                    "alias": "glenohumeral_severity",
                                    "optionMap": {"Glenohumeral joint": "glenohumeral_severity"}
                                },
                                {
                                    "alias": "glenohumeral_osteophytes",
                                    "optionMap": {"Glenohumeral joint": "glenohumeral_osteophytes"}
                                }
                            ]
                        )
                    )
                ]
            },
            {
                "id": "acute_fracture",
                "rules": [
                    rule(
                        [
                            {"field": "acute_fracture", "operator": "equals", "value": "Yes"},
                            {"field": "fracture_region", "operator": "exists"},
                            {"field": "fracture_type", "operator": "exists"}
                        ],
                        "Acute fracture in {{fracture_region}}, {{fracture_type}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "acute_fracture", "operator": "equals", "value": "Yes"},
                            {"field": "fracture_region", "operator": "exists"}
                        ],
                        "Acute fracture in {{fracture_region}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "acute_fracture", "operator": "equals", "value": "Yes"}],
                        "Acute fracture"
                    )
                ]
            },
            {
                "id": "fracture_followup",
                "rules": [
                    rule(
                        [
                            {"field": "fracture_followup", "operator": "equals", "value": "Yes"},
                            {"field": "followup_type", "operator": "exists"},
                            {"field": "followup_region", "operator": "exists"}
                        ],
                        "{{followup_type}} in {{followup_region}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "fracture_followup", "operator": "equals", "value": "Yes"},
                            {"field": "followup_type", "operator": "exists"}
                        ],
                        "{{followup_type}}",
                        stop=True
                    )
                ]
            },
            {
                "id": "rotator_cuff_calcification",
                "rules": [
                    rule(
                        [{"field": "rotator_cuff_calcification", "operator": "equals", "value": "Present"}],
                        "Rotator cuff calcification present"
                    )
                ]
            },
            {
                "id": "lesion",
                "rules": [
                    rule(
                        [
                            {"field": "lesion", "operator": "equals", "value": "Yes"},
                            {"field": "lesion_region", "operator": "exists"},
                            {"field": "lesion_size", "operator": "exists"},
                            {"field": "lesion_characteristics", "operator": "exists"}
                        ],
                        "Lesion in {{lesion_region}}, size {{lesion_size}}, {{lesion_characteristics}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "lesion", "operator": "equals", "value": "Yes"},
                            {"field": "lesion_region", "operator": "exists"},
                            {"field": "lesion_size", "operator": "exists"}
                        ],
                        "Lesion in {{lesion_region}}, size {{lesion_size}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "lesion", "operator": "equals", "value": "Yes"},
                            {"field": "lesion_region", "operator": "exists"}
                        ],
                        "Lesion in {{lesion_region}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "lesion", "operator": "equals", "value": "Yes"}],
                        "Lesion present"
                    )
                ]
            },
            {
                "id": "dislocation_subluxation",
                "rules": [
                    rule(
                        [{"field": "dislocation_subluxation", "operator": "equals", "value": "Yes"}],
                        "Dislocation/subluxation present"
                    )
                ]
            },
            {
                "id": "ac_joint_separation",
                "rules": [
                    rule(
                        [
                            {"field": "ac_joint_separation", "operator": "equals", "value": "Yes"},
                            {"field": "ac_separation_grade", "operator": "exists"},
                            {"field": "ac_separation_measurement", "operator": "exists"}
                        ],
                        "AC joint separation grade {{ac_separation_grade}} (measurement {{ac_separation_measurement}})",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "ac_joint_separation", "operator": "equals", "value": "Yes"},
                            {"field": "ac_separation_grade", "operator": "exists"}
                        ],
                        "AC joint separation grade {{ac_separation_grade}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "ac_joint_separation", "operator": "equals", "value": "Yes"}],
                        "AC joint separation present"
                    )
                ]
            }
        ]
    }


def knee_config():
    return {
        "study_type": "KNEE",
        "items": [
            {
                "id": "hardware",
                "rules": [
                    rule(
                        [
                            {"field": "hardware", "operator": "equals", "value": "Present"},
                            {"field": "hardware_type", "operator": "equals", "value": "Others"},
                            {"field": "hardware_other_description", "operator": "exists"}
                        ],
                        "Hardware present: {{hardware_other_description}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "hardware", "operator": "equals", "value": "Present"},
                            {"field": "hardware_type", "operator": "exists"}
                        ],
                        "Hardware present: {{hardware_type}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "hardware", "operator": "equals", "value": "Present"}],
                        "Hardware present"
                    )
                ]
            },
            {
                "id": "post_surgical_changes",
                "rules": [
                    rule(
                        [{"field": "post_surgical_changes", "operator": "equals", "value": "Yes"}],
                        "Post surgical changes in soft tissue"
                    )
                ]
            },
            {
                "id": "degenerative_changes",
                "rules": [
                    rule(
                        [
                            {"field": "degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "compartments", "operator": "lengthGreaterThan", "value": 0}
                        ],
                        list_spec(
                            "compartments",
                            compound(
                                [
                                    case_spec(
                                        [
                                            {
                                                "conditions": [{"field": "severity", "operator": "exists"}],
                                                "output": "{{severity}} degenerative changes in the {{option|lower}} compartment"
                                            },
                                            {
                                                "default": True,
                                                "output": "Degenerative changes in the {{option|lower}} compartment"
                                            }
                                        ]
                                    ),
                                    case_spec(
                                        [
                                            {
                                                "conditions": [
                                                    {
                                                        "field": "osteophytes",
                                                        "operator": "equals",
                                                        "value": "Present"
                                                    }
                                                ],
                                                "output": "with osteophytes"
                                            }
                                        ]
                                    )
                                ],
                                delimiter=" "
                            ),
                            mode="separate",
                            item_context=[
                                {
                                    "alias": "severity",
                                    "optionMap": {
                                        "Medial": "medial_severity",
                                        "Lateral": "lateral_severity",
                                        "Patellofemoral": "patellofemoral_severity"
                                    }
                                },
                                {
                                    "alias": "osteophytes",
                                    "optionMap": {
                                        "Medial": "medial_osteophytes",
                                        "Lateral": "lateral_osteophytes",
                                        "Patellofemoral": "patellofemoral_osteophytes"
                                    }
                                }
                            ],
                            when_empty=None,
                        )
                    )
                ]
            },
            {
                "id": "deformity",
                "rules": [
                    rule(
                        [
                            {"field": "deformity", "operator": "equals", "value": "Yes"},
                            {"field": "deformity_type", "operator": "exists"}
                        ],
                        "{{deformity_type}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "deformity", "operator": "equals", "value": "Yes"}],
                        "Deformity present"
                    )
                ]
            },
            {
                "id": "acute_fracture",
                "rules": [
                    rule(
                        [
                            {"field": "acute_fracture", "operator": "equals", "value": "Yes"},
                            {"field": "fracture_region", "operator": "exists"},
                            {"field": "fracture_type", "operator": "exists"}
                        ],
                        "Acute fracture in {{fracture_region}}, {{fracture_type}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "acute_fracture", "operator": "equals", "value": "Yes"},
                            {"field": "fracture_region", "operator": "exists"}
                        ],
                        "Acute fracture in {{fracture_region}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "acute_fracture", "operator": "equals", "value": "Yes"}],
                        "Acute fracture"
                    )
                ]
            },
            {
                "id": "fracture_followup",
                "rules": [
                    rule(
                        [
                            {"field": "fracture_followup", "operator": "equals", "value": "Yes"},
                            {"field": "followup_type", "operator": "exists"},
                            {"field": "followup_region", "operator": "exists"}
                        ],
                        "{{followup_type}} in {{followup_region}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "fracture_followup", "operator": "equals", "value": "Yes"},
                            {"field": "followup_type", "operator": "exists"}
                        ],
                        "{{followup_type}}",
                        stop=True
                    )
                ]
            },
            {
                "id": "joint_effusion",
                "rules": [
                    rule(
                        [{"field": "joint_effusion", "operator": "equals", "value": "Present"}],
                        "Joint effusion present"
                    )
                ]
            },
            {
                "id": "vascular_calcification",
                "rules": [
                    rule(
                        [{"field": "vascular_calcification", "operator": "equals", "value": "Present"}],
                        "Vascular calcification present"
                    )
                ]
            },
            {
                "id": "chondrocalcinosis",
                "rules": [
                    rule(
                        [{"field": "chondrocalcinosis", "operator": "equals", "value": "Present"}],
                        "Chondrocalcinosis present"
                    )
                ]
            },
            {
                "id": "lesion",
                "rules": [
                    rule(
                        [
                            {"field": "lesion", "operator": "equals", "value": "Yes"},
                            {"field": "lesion_region", "operator": "exists"},
                            {"field": "lesion_size", "operator": "exists"},
                            {"field": "lesion_characteristics", "operator": "exists"}
                        ],
                        "Lesion in {{lesion_region}}, size {{lesion_size}}, {{lesion_characteristics}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "lesion", "operator": "equals", "value": "Yes"},
                            {"field": "lesion_region", "operator": "exists"},
                            {"field": "lesion_size", "operator": "exists"}
                        ],
                        "Lesion in {{lesion_region}}, size {{lesion_size}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "lesion", "operator": "equals", "value": "Yes"},
                            {"field": "lesion_region", "operator": "exists"}
                        ],
                        "Lesion in {{lesion_region}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "lesion", "operator": "equals", "value": "Yes"}],
                        "Lesion present"
                    )
                ]
            }
        ]
    }


def spine_config():
    return {
        "study_type": "SPINE",
        "items": [
            {
                "id": "hardware",
                "rules": [
                    rule(
                        [
                            {"field": "hardware", "operator": "equals", "value": "Yes"},
                            {"field": "hardware_details", "operator": "exists"}
                        ],
                        "Hardware present: {{hardware_details}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "hardware", "operator": "equals", "value": "Yes"}],
                        "Hardware present"
                    )
                ]
            },
            {
                "id": "lordosis",
                "rules": [
                    rule(
                        [
                            {"field": "lordosis", "operator": "equals", "value": "Yes"},
                            {"field": "lordosis_type", "operator": "exists"}
                        ],
                        "Lordosis: {{lordosis_type}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "lordosis", "operator": "equals", "value": "Yes"}],
                        "Lordosis present"
                    )
                ]
            },
            {
                "id": "scoliosis",
                "rules": [
                    rule(
                        [
                            {"field": "scoliosis", "operator": "equals", "value": "Yes"},
                            {"field": "scoliosis_type", "operator": "exists"},
                            {"field": "scoliosis_center", "operator": "exists"}
                        ],
                        "Scoliosis: {{scoliosis_type}} (centered at {{scoliosis_center}})",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "scoliosis", "operator": "equals", "value": "Yes"},
                            {"field": "scoliosis_type", "operator": "exists"}
                        ],
                        "Scoliosis: {{scoliosis_type}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "scoliosis", "operator": "equals", "value": "Yes"}],
                        "Scoliosis present"
                    )
                ]
            },
            {
                "id": "multilevel_degenerative_changes",
                "rules": [
                    rule(
                        [
                            {"field": "multilevel_degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "degenerative_severity", "operator": "exists"},
                            {"field": "degenerative_pronounced_at", "operator": "exists"}
                        ],
                        "{{degenerative_severity}} multilevel degenerative changes pronounced at {{degenerative_pronounced_at}}"
                    ),
                    rule(
                        [
                            {"field": "multilevel_degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "degenerative_severity", "operator": "exists"},
                            {"field": "degenerative_pronounced_at", "operator": "notExists"}
                        ],
                        "{{degenerative_severity}} multilevel degenerative changes"
                    ),
                    rule(
                        [
                            {"field": "multilevel_degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "degenerative_severity", "operator": "notExists"},
                            {"field": "degenerative_pronounced_at", "operator": "notExists"}
                        ],
                        "Multilevel degenerative changes present"
                    ),
                    rule(
                        [
                            {"field": "multilevel_degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "facet_arthritis_severity", "operator": "exists"},
                            {"field": "facet_arthritis_location", "operator": "exists"}
                        ],
                        "{{facet_arthritis_severity}} facet arthritis at {{facet_arthritis_location}}"
                    ),
                    rule(
                        [
                            {"field": "multilevel_degenerative_changes", "operator": "equals", "value": "Yes"},
                            {"field": "facet_arthritis_severity", "operator": "exists"}
                        ],
                        "{{facet_arthritis_severity}} facet arthritis"
                    )
                ]
            },
            {
                "id": "fracture",
                "rules": [
                    rule(
                        [
                            {"field": "fracture", "operator": "equals", "value": "Yes"},
                            {"field": "fracture_type", "operator": "exists"},
                            {"field": "fracture_vertebral_body", "operator": "exists"}
                        ],
                        "Vertebral fracture: {{fracture_type}} at {{fracture_vertebral_body}}",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "fracture", "operator": "equals", "value": "Yes"},
                            {"field": "fracture_type", "operator": "exists"}
                        ],
                        "Vertebral fracture: {{fracture_type}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "fracture", "operator": "equals", "value": "Yes"}],
                        "Vertebral fracture present"
                    )
                ]
            },
            {
                "id": "anterolisthesis",
                "rules": [
                    rule(
                        [
                            {"field": "anterolisthesis", "operator": "equals", "value": "Present"},
                            {"field": "anterolisthesis_details", "operator": "exists"}
                        ],
                        "Anterolisthesis present: {{anterolisthesis_details}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "anterolisthesis", "operator": "equals", "value": "Present"}],
                        "Anterolisthesis present"
                    )
                ]
            },
            {
                "id": "motion_flexion_extension",
                "rules": [
                    rule(
                        [
                            {"field": "motion_flexion_extension", "operator": "equals", "value": "Present"},
                            {"field": "motion_measurement", "operator": "exists"},
                            {"field": "motion_vertebral_body", "operator": "exists"}
                        ],
                        "Abnormal motion at {{motion_vertebral_body}} (measurement {{motion_measurement}})",
                        stop=True
                    ),
                    rule(
                        [
                            {"field": "motion_flexion_extension", "operator": "equals", "value": "Present"},
                            {"field": "motion_vertebral_body", "operator": "exists"}
                        ],
                        "Abnormal motion at {{motion_vertebral_body}}",
                        stop=True
                    ),
                    rule(
                        [{"field": "motion_flexion_extension", "operator": "equals", "value": "Present"}],
                        "Abnormal motion on flexion/extension"
                    )
                ]
            }
        ]
    }


def write_config(config):
    target = Path(__file__).resolve().parents[1] / 'src' / 'data' / 'reportConfig.json'
    target.write_text(json.dumps(config, indent=2), encoding='utf-8')


report_config = {
    "studies": [
        foot_config(),
        hip_config(),
        shoulder_config(),
        knee_config(),
        spine_config()
    ]
}


if __name__ == '__main__':
    write_config(report_config)

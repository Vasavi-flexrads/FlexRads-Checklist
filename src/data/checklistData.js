export const footChecklistData = {
  study_type: 'Foot',
  has_laterality: true,
  checklist_items: [
    {
      id: 'hardware',
      label: 'Hardware',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'hardware_types',
            label: 'Hardware Types (multi-select)',
            type: 'checkbox',
            options: [
              'Arthrodesis and screw fixation',
              'Plate and screw fixation',
              'K wire',
              'Screws',
              'Staples'
            ]
          },
          {
            id: 'arthrodesis_region',
            label: 'Arthrodesis and screw fixation - Region',
            type: 'text',
            placeholder: 'e.g., 1st MTP joint',
            show_when: 'hardware_types_includes_Arthrodesis and screw fixation'
          },
          {
            id: 'plate_screw_region',
            label: 'Plate and screw fixation - Region',
            type: 'text',
            placeholder: 'e.g., Midfoot',
            show_when: 'hardware_types_includes_Plate and screw fixation'
          },
          {
            id: 'kwire_region',
            label: 'K wire - Region',
            type: 'text',
            placeholder: 'e.g., 5th metatarsal',
            show_when: 'hardware_types_includes_K wire'
          },
          {
            id: 'screws_region',
            label: 'Screws - Region',
            type: 'text',
            placeholder: 'e.g., Calcaneus',
            show_when: 'hardware_types_includes_Screws'
          },
          {
            id: 'staples_region',
            label: 'Staples - Region',
            type: 'text',
            placeholder: 'e.g., Forefoot',
            show_when: 'hardware_types_includes_Staples'
          }
        ]
      }
    },
    {
      id: 'post_surgical_changes',
      label: 'Post surgical soft tissue changes',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'degenerative_changes',
      label: 'Degenerative changes',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'joints',
            label: 'Affected Joints (multi-select)',
            type: 'checkbox',
            options: [
              'PIP',
              'DIP',
              'IP',
              'MTP',
              'TMT',
              'Naviculocuniform joint',
              'Cubonavicular joint',
              'Talonavicular joint',
              'Calcaneo cuboid joint',
              'Subtalar joint'
            ]
          },
          {
            id: 'joint_space_narrowing',
            label: 'Joint space narrowing',
            type: 'radio',
            options: ['Present', 'Absent']
          },
          {
            id: 'osteophytes',
            label: 'Osteophytes',
            type: 'radio',
            options: ['Present', 'Absent']
          },
          {
            id: 'sclerotic_changes',
            label: 'Sclerotic changes',
            type: 'radio',
            options: ['Present', 'Absent']
          }
        ]
      }
    },
    {
      id: 'deformity',
      label: 'Deformity',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'deformity_type',
            label: 'Deformity Type',
            type: 'radio',
            options: [
              'Hallux valgus deformity',
              'Pes planus deformity',
              'Flexion deformity',
              'Charcot foot'
            ],
            conditional: {
              condition: 'Hallux valgus deformity',
              sub_items: [
                {
                  id: 'hallux_valgus_mtp_changes',
                  label: '1st MTP degenerative changes (for Hallux valgus)',
                  type: 'radio',
                  options: ['Mild', 'Moderate', 'Severe']
                }
              ]
            }
          },
          {
            id: 'flexion_deformity_region',
            label: 'Flexion deformity - Region',
            type: 'text',
            placeholder: 'e.g., 2nd toe',
            show_when: 'deformity_type_equals_Flexion deformity'
          }
        ]
      }
    },
    {
      id: 'calcaneal_spur',
      label: 'Calcaneal spur',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'spur_location',
            label: 'Spur Location (multi-select)',
            type: 'checkbox',
            options: ['Plantar', 'Dorsal']
          }
        ]
      }
    },
    {
      id: 'amputation',
      label: 'Amputation',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'amputation_region',
            label: 'Amputation Region',
            type: 'text',
            placeholder: 'e.g., 5th toe, Forefoot'
          }
        ]
      }
    },
    {
      id: 'acute_fracture',
      label: 'Acute fracture',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'fracture_region',
            label: 'Region',
            type: 'text',
            placeholder: 'e.g., 5th metatarsal'
          },
          {
            id: 'fracture_type',
            label: 'Type',
            type: 'text',
            placeholder: 'e.g., Jones fracture, displaced'
          }
        ]
      }
    },
    {
      id: 'fracture_followup',
      label: 'Fracture followup',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'followup_type',
            label: 'Followup Type',
            type: 'radio',
            options: ['Old healed fracture', 'Healing fracture'],
            conditional_any: {
              sub_items: [
                {
                  id: 'followup_region',
                  label: 'Region',
                  type: 'text',
                  placeholder: 'e.g., Calcaneus'
                }
              ]
            }
          }
        ]
      }
    },
    {
      id: 'lesion',
      label: 'Lesion',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'lesion_region',
            label: 'Region',
            type: 'text',
            placeholder: 'e.g., Calcaneus'
          },
          {
            id: 'lesion_size',
            label: 'Size',
            type: 'text',
            placeholder: 'e.g., 2x3 cm'
          },
          {
            id: 'lesion_characteristics',
            label: 'Characteristics',
            type: 'text',
            placeholder: 'e.g., Sclerotic, lytic'
          }
        ]
      }
    }
  ]
}

export const hipChecklistData = {
  study_type: 'Hip',
  has_laterality: true,
  checklist_items: [
    {
      id: 'hardware',
      label: 'Hardware',
      type: 'radio',
      options: ['Present', 'Absent'],
      conditional: {
        condition: 'Present',
        sub_items: [
          {
            id: 'hardware_type',
            label: 'Hardware Type',
            type: 'radio',
            options: [
              'Total hip arthroplasty (THA)',
              'Hemi hip arthroplasty',
              'Intermedullary screw and nail fixation',
              'IUD',
              'Others'
            ],
            conditional: {
              condition: 'Others',
              sub_items: [
                {
                  id: 'hardware_other_description',
                  label: 'Specify other hardware',
                  type: 'text',
                  placeholder: 'e.g., Screws, plates'
                }
              ]
            }
          }
        ]
      }
    },
    {
      id: 'degenerative_changes',
      label: 'Degenerative changes',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'severity',
            label: 'Severity',
            type: 'radio',
            options: ['Mild', 'Moderate', 'Severe']
          },
          {
            id: 'joint_space_narrowing',
            label: 'Joint space narrowing',
            type: 'radio',
            options: ['Yes', 'No']
          },
          {
            id: 'osteophytes',
            label: 'Osteophytes',
            type: 'radio',
            options: ['Yes', 'No']
          },
          {
            id: 'sclerotic_changes',
            label: 'Sclerotic changes',
            type: 'radio',
            options: ['Yes', 'No']
          },
          {
            id: 'subchondral_bone_cyst',
            label: 'Subchondral bone cyst',
            type: 'radio',
            options: ['Yes', 'No']
          }
        ]
      }
    },
    {
      id: 'heterotrophic_calcification',
      label: 'Heterotrophic calcification',
      type: 'radio',
      options: ['Present', 'Absent']
    },
    {
      id: 'vascular_calcification',
      label: 'Vascular calcification',
      type: 'radio',
      options: ['Present', 'Absent']
    },
    {
      id: 'acute_fracture',
      label: 'Acute fracture',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'fracture_region',
            label: 'Region',
            type: 'text',
            placeholder: 'e.g., Femoral neck'
          },
          {
            id: 'fracture_type',
            label: 'Type',
            type: 'text',
            placeholder: 'e.g., Comminuted, displaced'
          }
        ]
      }
    },
    {
      id: 'fracture_followup',
      label: 'Fracture followup',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'followup_type',
            label: 'Followup Type',
            type: 'radio',
            options: ['Old healed fracture', 'Healing fracture'],
            conditional_any: {
              sub_items: [
                {
                  id: 'followup_region',
                  label: 'Region',
                  type: 'text',
                  placeholder: 'e.g., Greater trochanter'
                }
              ]
            }
          }
        ]
      }
    },
    {
      id: 'deformity',
      label: 'Deformity',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'deformity_type',
            label: 'Deformity Type',
            type: 'radio',
            options: ['Pincer deformity', 'CAM deformity']
          }
        ]
      }
    },
    {
      id: 'phleboliths',
      label: 'Phleboliths',
      type: 'radio',
      options: ['Present', 'Absent']
    },
    {
      id: 'lesion',
      label: 'Lesion',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'lesion_region',
            label: 'Region',
            type: 'text',
            placeholder: 'e.g., Femoral head'
          },
          {
            id: 'lesion_size',
            label: 'Size',
            type: 'text',
            placeholder: 'e.g., 2x3 cm'
          },
          {
            id: 'lesion_characteristics',
            label: 'Characteristics',
            type: 'text',
            placeholder: 'e.g., Sclerotic, lytic'
          }
        ]
      }
    },
    {
      id: 'dislocation_subluxation',
      label: 'Dislocation / Subluxation',
      type: 'radio',
      options: ['Yes', 'No']
    }
  ]
}

export const shoulderChecklistData = {
  study_type: 'Shoulder',
  has_laterality: true,
  checklist_items: [
    {
      id: 'hardware',
      label: 'Hardware',
      type: 'radio',
      options: ['Present', 'Absent'],
      conditional: {
        condition: 'Present',
        sub_items: [
          {
            id: 'hardware_type',
            label: 'Hardware Type',
            type: 'radio',
            options: [
              'Reversed shoulder arthroplasty',
              'Plate and screw fixation',
              'Rotator cuff repair',
              'Others'
            ],
            conditional: {
              condition: 'Others',
              sub_items: [
                {
                  id: 'hardware_other_description',
                  label: 'Specify other hardware',
                  type: 'text',
                  placeholder: 'e.g., suture anchors, wires'
                }
              ]
            }
          }
        ]
      }
    },
    {
      id: 'post_surgical_changes',
      label: 'Post surgical changes in soft tissue',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'degenerative_changes',
      label: 'Degenerative changes',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'joints',
            label: 'Joints (multi-select)',
            type: 'checkbox',
            options: ['Acromioclavicular (AC) joint', 'Glenohumeral joint']
          },
          {
            id: 'ac_severity',
            label: 'AC Joint Severity',
            type: 'radio',
            options: ['Mild', 'Moderate', 'Severe'],
            show_when: 'joints_includes_Acromioclavicular (AC) joint'
          },
          {
            id: 'ac_osteophytes',
            label: 'AC Joint Osteophytes',
            type: 'radio',
            options: ['Present', 'Absent'],
            show_when: 'joints_includes_Acromioclavicular (AC) joint'
          },
          {
            id: 'ac_joint_space_narrowing',
            label: 'AC Joint Space Widening (measurement)',
            type: 'text',
            placeholder: 'e.g., 2mm',
            show_when: 'joints_includes_Acromioclavicular (AC) joint'
          },
          {
            id: 'glenohumeral_severity',
            label: 'Glenohumeral Joint Severity',
            type: 'radio',
            options: ['Mild', 'Moderate', 'Severe'],
            show_when: 'joints_includes_Glenohumeral joint'
          },
          {
            id: 'glenohumeral_osteophytes',
            label: 'Glenohumeral Joint Osteophytes',
            type: 'radio',
            options: ['Present', 'Absent'],
            show_when: 'joints_includes_Glenohumeral joint'
          }
        ]
      }
    },
    {
      id: 'acute_fracture',
      label: 'Acute fracture',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'fracture_type',
            label: 'Type',
            type: 'text',
            placeholder: 'e.g., Comminuted, displaced'
          },
          {
            id: 'fracture_region',
            label: 'Region',
            type: 'text',
            placeholder: 'e.g., Proximal humerus'
          }
        ]
      }
    },
    {
      id: 'fracture_followup',
      label: 'Fracture followup',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'followup_type',
            label: 'Followup Type',
            type: 'radio',
            options: ['Old healed fracture', 'Healing fracture'],
            conditional_any: {
              sub_items: [
                {
                  id: 'followup_region',
                  label: 'Region',
                  type: 'text',
                  placeholder: 'e.g., Scapula, Clavicle'
                }
              ]
            }
          }
        ]
      }
    },
    {
      id: 'rotator_cuff_calcification',
      label: 'Rotator cuff calcification',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'lesion',
      label: 'Lesion',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'lesion_region',
            label: 'Region',
            type: 'text',
            placeholder: 'e.g., Humeral head'
          },
          {
            id: 'lesion_size',
            label: 'Size',
            type: 'text',
            placeholder: 'e.g., 2x3 cm'
          },
          {
            id: 'lesion_characteristics',
            label: 'Characteristics',
            type: 'text',
            placeholder: 'e.g., Sclerotic, lytic'
          }
        ]
      }
    },
    {
      id: 'dislocation_subluxation',
      label: 'Dislocation / Subluxation',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'ac_joint_separation',
      label: 'AC joint separation',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'ac_separation_grade',
            label: 'Grade',
            type: 'radio',
            options: ['Grade 1', 'Grade 2', 'Grade 3'],
            conditional_any: {
              sub_items: [
                {
                  id: 'ac_separation_measurement',
                  label: 'Measurement',
                  type: 'text',
                  placeholder: 'e.g., 5mm displacement'
                }
              ]
            }
          }
        ]
      }
    }
  ]
}

export const kneeChecklistData = {
  study_type: 'Knee',
  has_laterality: true,
  checklist_items: [
    {
      id: 'hardware',
      label: 'Hardware',
      type: 'radio',
      options: ['Present', 'Absent'],
      conditional: {
        condition: 'Present',
        sub_items: [
          {
            id: 'hardware_type',
            label: 'Hardware Type',
            type: 'radio',
            options: [
              'Total knee replacement (TKR)',
              'Partial knee replacement (PKR)',
              'Hemi knee replacement (HKR)',
              'ACL reconstruction',
              'Others'
            ],
            conditional: {
              condition: 'Others',
              sub_items: [
                {
                  id: 'hardware_other_description',
                  label: 'Specify other hardware',
                  type: 'text',
                  placeholder: 'e.g., Plate & screw fixation'
                }
              ]
            }
          }
        ]
      }
    },
    {
      id: 'post_surgical_changes',
      label: 'Post surgical changes in soft tissue',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'degenerative_changes',
      label: 'Degenerative changes',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'compartments',
            label: 'Compartments (multi-select)',
            type: 'checkbox',
            options: ['Medial', 'Lateral', 'Patellofemoral']
          },
          {
            id: 'medial_severity',
            label: 'Medial Compartment Severity',
            type: 'radio',
            options: ['Mild', 'Moderate', 'Severe'],
            show_when: 'compartments_includes_Medial'
          },
          {
            id: 'medial_osteophytes',
            label: 'Medial Compartment Osteophytes',
            type: 'radio',
            options: ['Present', 'Absent'],
            show_when: 'compartments_includes_Medial'
          },
          {
            id: 'lateral_severity',
            label: 'Lateral Compartment Severity',
            type: 'radio',
            options: ['Mild', 'Moderate', 'Severe'],
            show_when: 'compartments_includes_Lateral'
          },
          {
            id: 'lateral_osteophytes',
            label: 'Lateral Compartment Osteophytes',
            type: 'radio',
            options: ['Present', 'Absent'],
            show_when: 'compartments_includes_Lateral'
          },
          {
            id: 'patellofemoral_severity',
            label: 'Patellofemoral Compartment Severity',
            type: 'radio',
            options: ['Mild', 'Moderate', 'Severe'],
            show_when: 'compartments_includes_Patellofemoral'
          },
          {
            id: 'patellofemoral_osteophytes',
            label: 'Patellofemoral Compartment Osteophytes',
            type: 'radio',
            options: ['Present', 'Absent'],
            show_when: 'compartments_includes_Patellofemoral'
          }
        ]
      }
    },
    {
      id: 'deformity',
      label: 'Deformity',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'deformity_type',
            label: 'Deformity Type',
            type: 'radio',
            options: ['Varus deformity', 'Valgus deformity']
          }
        ]
      }
    },
    {
      id: 'acute_fracture',
      label: 'Acute fracture',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'fracture_region',
            label: 'Region',
            type: 'text',
            placeholder: 'e.g., Distal femur'
          },
          {
            id: 'fracture_type',
            label: 'Type',
            type: 'text',
            placeholder: 'e.g., Comminuted, displaced'
          }
        ]
      }
    },
    {
      id: 'fracture_followup',
      label: 'Fracture followup',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'followup_type',
            label: 'Followup Type',
            type: 'radio',
            options: ['Old healed fracture', 'Healing fracture'],
            conditional_any: {
              sub_items: [
                {
                  id: 'followup_region',
                  label: 'Region',
                  type: 'text',
                  placeholder: 'e.g., Proximal tibia'
                }
              ]
            }
          }
        ]
      }
    },
    {
      id: 'joint_effusion',
      label: 'Joint effusion',
      type: 'radio',
      options: ['None', 'Mild', 'Moderate', 'Severe']
    },
    {
      id: 'vascular_calcification',
      label: 'Vascular calcification',
      type: 'radio',
      options: ['Present', 'Absent']
    },
    {
      id: 'chondrocalcinosis',
      label: 'Chondrocalcinosis',
      type: 'radio',
      options: ['Yes', 'No']
    },
    {
      id: 'lesion',
      label: 'Lesion',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'lesion_region',
            label: 'Region',
            type: 'text',
            placeholder: 'e.g., Distal femur'
          },
          {
            id: 'lesion_size',
            label: 'Size',
            type: 'text',
            placeholder: 'e.g., 2x3 cm'
          },
          {
            id: 'lesion_characteristics',
            label: 'Characteristics',
            type: 'text',
            placeholder: 'e.g., Sclerotic, lytic'
          }
        ]
      }
    }
  ]
}

export const spineChecklistData = {
  study_type: 'Spine',
  has_laterality: false,
  has_spine_region: true,
  spine_regions: ['Cervical', 'Dorsal', 'Lumbar'],
  checklist_items: [
    {
      id: 'hardware',
      label: 'Hardware',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'hardware_details',
            label: 'Hardware Type and Region',
            type: 'text',
            placeholder: 'e.g., Posterior cervical fusion C3-C6'
          }
        ]
      }
    },
    {
      id: 'lordosis',
      label: 'Lordosis',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'lordosis_type',
            label: 'Lordosis Type',
            type: 'radio',
            options: ['Hyperlordosis', 'Hypolordosis', 'Straightening', 'Kyphosis']
          }
        ]
      }
    },
    {
      id: 'scoliosis',
      label: 'Scoliosis',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'scoliosis_type',
            label: 'Scoliosis Type',
            type: 'radio',
            options: ['Dextro', 'Levo']
          },
          {
            id: 'scoliosis_center',
            label: 'Centered at vertebral body',
            type: 'text',
            placeholder: 'e.g., T7-T8',
            show_when: 'scoliosis_type_not_empty'
          }
        ]
      }
    },
    {
      id: 'multilevel_degenerative_changes',
      label: 'Multilevel degenerative changes',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'degenerative_severity',
            label: 'Severity',
            type: 'radio',
            options: ['Mild', 'Moderate', 'Severe']
          },
          {
            id: 'degenerative_pronounced_at',
            label: 'More pronounced at vertebral body',
            type: 'text',
            placeholder: 'e.g., L4-L5'
          },
          {
            id: 'facet_arthritis_severity',
            label: 'Facet arthritis severity',
            type: 'radio',
            options: ['Mild', 'Moderate', 'Severe']
          },
          {
            id: 'facet_arthritis_location',
            label: 'Facet arthritis vertebral body',
            type: 'text',
            placeholder: 'e.g., L3-L4, L4-L5'
          }
        ]
      }
    },
    {
      id: 'fracture',
      label: 'Fracture',
      type: 'radio',
      options: ['Yes', 'No'],
      conditional: {
        condition: 'Yes',
        sub_items: [
          {
            id: 'fracture_type',
            label: 'Fracture type',
            type: 'text',
            placeholder: 'e.g., Compression fracture'
          },
          {
            id: 'fracture_vertebral_body',
            label: 'Vertebral body',
            type: 'text',
            placeholder: 'e.g., L1'
          }
        ]
      }
    },
    {
      id: 'anterolisthesis',
      label: 'Anterolisthesis',
      type: 'radio',
      options: ['Present', 'Absent'],
      conditional: {
        condition: 'Present',
        sub_items: [
          {
            id: 'anterolisthesis_details',
            label: 'Anterolisthesis details',
            type: 'text',
            placeholder: 'e.g., L4 on L5'
          }
        ]
      }
    },
    {
      id: 'motion_flexion_extension',
      label: 'No motion on flexion extension view',
      type: 'radio',
      options: ['Present', 'Absent'],
      conditional: {
        condition: 'Present',
        sub_items: [
          {
            id: 'motion_measurement',
            label: 'Measurement',
            type: 'text',
            placeholder: 'e.g., 2mm'
          },
          {
            id: 'motion_vertebral_body',
            label: 'Vertebral body',
            type: 'text',
            placeholder: 'e.g., C5-C6'
          }
        ]
      }
    }
  ]
}

// Placeholder data for other studies (to be defined later)
export const studyData = {
  knee: kneeChecklistData,
  shoulder: shoulderChecklistData,
  hip: hipChecklistData,
  foot: footChecklistData,
  spine: spineChecklistData,
  'cervical-spine': {
    study_type: 'Cervical Spine',
    checklist_items: [],
    impression_options: []
  },
  'dorsal-spine': {
    study_type: 'Dorsal Spine',
    checklist_items: [],
    impression_options: []
  },
  'lumbar-spine': {
    study_type: 'Lumbar Spine',
    checklist_items: [],
    impression_options: []
  },
  'whole-spine': {
    study_type: 'Whole Spine',
    checklist_items: [],
    impression_options: []
  }
}
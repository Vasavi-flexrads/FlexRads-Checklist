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

// Placeholder data for other studies (to be defined later)
export const studyData = {
  knee: kneeChecklistData,
  shoulder: {
    study_type: 'Shoulder',
    checklist_items: [],
    impression_options: []
  },
  hip: {
    study_type: 'Hip',
    checklist_items: [],
    impression_options: []
  },
  foot: {
    study_type: 'Foot',
    checklist_items: [],
    impression_options: []
  },
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
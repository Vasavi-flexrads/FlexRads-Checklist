import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { ArrowLeft, Copy, FileText, History } from 'lucide-react'
import ChecklistForm from '../../components/forms/ChecklistForm'
import content from '../../data/content.json'

const ChecklistPage = () => {
  const { studyType } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  
  const [clinicalHistory, setClinicalHistory] = useState('')
  const [selectedFindings, setSelectedFindings] = useState({
    laterality: 'Right',
    formData: { right: {} }
  })
  const [generatedReport, setGeneratedReport] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  const currentStudyData = content.find(item => item.study_type.toUpperCase() === studyType.toUpperCase())

  const handleSelectionChange = useCallback((key, selection) => {
    setSelectedFindings(prev => ({
      ...prev,
      [key]: selection
    }))
  }, [])

  // Helper function to generate findings from templates
  const generateFindingFromTemplate = (itemId, value, sideData, templates) => {
    const template = templates[itemId]
    if (!template) return null

    // Determine which template variant to use based on available data
    let templateKey = value.toLowerCase()
    let templateText = template[templateKey]

    // Handle specific cases with additional data
    if (itemId === 'hardware') {
      if (sideData.hardware_details) {
        templateText = template.yes?.replace('{hardware_details}', sideData.hardware_details)
      } else if (sideData.hardware_types && sideData.hardware_types.length > 0) {
        const hardwareDetails = sideData.hardware_types.map(hardware => {
          const regionKey = hardware.toLowerCase().replace(/[()\s-]/g, '_') + '_region'
          const region = sideData[regionKey]
          return region ? `${hardware} in ${region}` : hardware
        })
        templateText = template.types?.replace('{types}', hardwareDetails.join(', '))
      } else if (sideData.hardware_type) {
        if (sideData.hardware_type === 'Others' && sideData.hardware_other_description) {
          templateText = template.others?.replace('{other_description}', sideData.hardware_other_description)
        } else {
          templateText = template.present?.replace('{type}', sideData.hardware_type)
        }
      }
    } else if (itemId === 'calcaneal_spur') {
      if (sideData.spur_location && sideData.spur_location.length > 0) {
        templateText = template.yes_with_location?.replace('{locations}', sideData.spur_location.join(', '))
      } else {
        templateText = template.yes
      }
    } else if (itemId === 'amputation') {
      if (sideData.amputation_region) {
        templateText = template.yes_with_region?.replace('{region}', sideData.amputation_region)
      } else {
        templateText = template.yes
      }
    } else if (itemId === 'deformity') {
      if (sideData.deformity_type === 'Hallux valgus deformity' && sideData.hallux_valgus_mtp_changes) {
        templateText = template.hallux_valgus_with_changes
          ?.replace('{deformity_type}', sideData.deformity_type)
          ?.replace('{mtp_changes}', sideData.hallux_valgus_mtp_changes.toLowerCase())
      } else if (sideData.deformity_type === 'Flexion deformity' && sideData.flexion_deformity_region) {
        templateText = template.flexion_with_region
          ?.replace('{deformity_type}', sideData.deformity_type)
          ?.replace('{region}', sideData.flexion_deformity_region)
      } else if (sideData.deformity_type) {
        templateText = template.default?.replace('{deformity_type}', sideData.deformity_type)
      }
    } else if (itemId === 'acute_fracture') {
      if (sideData.fracture_region && sideData.fracture_type) {
        templateText = template.yes_with_region_type
          ?.replace('{region}', sideData.fracture_region)
          ?.replace('{type}', sideData.fracture_type)
      } else if (sideData.fracture_region) {
        templateText = template.yes_with_region?.replace('{region}', sideData.fracture_region)
      } else {
        templateText = template.yes
      }
    } else if (itemId === 'fracture_followup') {
      if (sideData.followup_type && sideData.followup_region) {
        templateText = template.yes
          ?.replace('{followup_type}', sideData.followup_type)
          ?.replace('{region}', sideData.followup_region)
      }
    } else if (itemId === 'lesion') {
      if (sideData.lesion_region && sideData.lesion_size && sideData.lesion_characteristics) {
        templateText = template.yes_with_details
          ?.replace('{region}', sideData.lesion_region)
          ?.replace('{size}', sideData.lesion_size)
          ?.replace('{characteristics}', sideData.lesion_characteristics)
      } else if (sideData.lesion_region && sideData.lesion_size) {
        templateText = template.yes_with_region_size
          ?.replace('{region}', sideData.lesion_region)
          ?.replace('{size}', sideData.lesion_size)
      } else if (sideData.lesion_region) {
        templateText = template.yes_with_region?.replace('{region}', sideData.lesion_region)
      } else {
        templateText = template.yes
      }
    } else if (itemId === 'ac_joint_separation') {
      if (sideData.ac_separation_grade && sideData.ac_separation_measurement) {
        templateText = template.yes_with_grade_measurement
          ?.replace('{grade}', sideData.ac_separation_grade)
          ?.replace('{measurement}', sideData.ac_separation_measurement)
      } else if (sideData.ac_separation_grade) {
        templateText = template.yes_with_grade?.replace('{grade}', sideData.ac_separation_grade)
      } else {
        templateText = template.yes
      }
    } else if (itemId === 'scoliosis') {
      if (sideData.scoliosis_type && sideData.scoliosis_center) {
        templateText = template.yes_with_center
          ?.replace('{scoliosis_type}', sideData.scoliosis_type)
          ?.replace('{scoliosis_center}', sideData.scoliosis_center)
      } else if (sideData.scoliosis_type) {
        templateText = template.yes?.replace('{scoliosis_type}', sideData.scoliosis_type)
      }
    } else if (itemId === 'multilevel_degenerative_changes') {
      if (sideData.degenerative_severity && sideData.degenerative_pronounced_at) {
        templateText = template.yes_with_severity_pronounced
          ?.replace('{severity}', sideData.degenerative_severity)
          ?.replace('{pronounced_at}', sideData.degenerative_pronounced_at)
      } else if (sideData.degenerative_severity) {
        templateText = template.yes_with_severity?.replace('{severity}', sideData.degenerative_severity)
      } else {
        templateText = template.yes
      }
    } else if (itemId === 'fracture') {
      if (sideData.fracture_type && sideData.fracture_vertebral_body) {
        templateText = template.yes_with_type_body
          ?.replace('{fracture_type}', sideData.fracture_type)
          ?.replace('{vertebral_body}', sideData.fracture_vertebral_body)
      } else if (sideData.fracture_type) {
        templateText = template.yes_with_type?.replace('{fracture_type}', sideData.fracture_type)
      } else {
        templateText = template.yes
      }
    } else if (itemId === 'anterolisthesis') {
      if (sideData.anterolisthesis_details) {
        templateText = template.present_with_details?.replace('{anterolisthesis_details}', sideData.anterolisthesis_details)
      } else {
        templateText = template.present
      }
    } else if (itemId === 'motion_flexion_extension') {
      if (sideData.motion_measurement && sideData.motion_vertebral_body) {
        templateText = template.present_with_measurement_body
          ?.replace('{measurement}', sideData.motion_measurement)
          ?.replace('{vertebral_body}', sideData.motion_vertebral_body)
      } else if (sideData.motion_vertebral_body) {
        templateText = template.present_with_body?.replace('{vertebral_body}', sideData.motion_vertebral_body)
      } else {
        templateText = template.present
      }
    } else if (itemId === 'lordosis') {
      if (sideData.lordosis_type) {
        templateText = template.yes?.replace('{lordosis_type}', sideData.lordosis_type)
      }
    }

    return templateText
  }

  const generateReport = useCallback(() => {
    const laterality = selectedFindings.laterality
    const spineRegion = selectedFindings.spineRegion
    const formData = selectedFindings.formData || {}
    
    let report = ''
    
    if (currentStudyData) {
      const hasSpineRegion = currentStudyData?.imaging_findings?.some(item => item.label === 'Spine Region')
      const hasLaterality = currentStudyData?.imaging_findings?.some(item => item.label === 'Laterality')
      
      if (hasSpineRegion) {
        report += `X-RAY ${spineRegion?.toUpperCase()} ${currentStudyData.study_type.toUpperCase()}\n\n`
      } else if (hasLaterality && laterality === 'Bilateral') {
        report += `X-RAY BILATERAL ${currentStudyData.study_type.toUpperCase()}\n\n`
      } else if (hasLaterality) {
        report += `X-RAY ${laterality?.toUpperCase()} ${currentStudyData.study_type.toUpperCase()}\n\n`
      } else {
        report += `X-RAY ${currentStudyData.study_type.toUpperCase()}\n\n`
      }
    }

    if (clinicalHistory.trim()) {
      report += `CLINICAL HISTORY:\n${clinicalHistory.trim()}\n\n`
    }
    
    report += 'FINDINGS:\n'
    
    const generateSideFindings = (side, sideLabel) => {
      const sideData = formData[side]
      if (!sideData) return []
      
      const findings = []
      const templates = currentStudyData?.findings_templates || {}
      
      // Process each checklist item
      currentStudyData.checklist_items?.forEach((item, index) => {
        const value = sideData[item.id]
        if (!value) return

        // Try to generate finding from template first
        const templateFinding = generateFindingFromTemplate(item.id, value, sideData, templates)
        if (templateFinding) {
          findings.push(templateFinding)
          return
        }
        
        // Handle facet arthritis separately for spine (not in templates yet)
        if (currentStudyData.study_type === 'SPINE' && item.id === 'multilevel_degenerative_changes' && value === 'Yes') {
          const facetSeverity = sideData.facet_arthritis_severity
          const facetLocation = sideData.facet_arthritis_location
          
          if (facetSeverity && facetLocation) {
            findings.push(`${facetSeverity} facet arthritis at ${facetLocation}`)
          } else if (facetSeverity) {
            findings.push(`${facetSeverity} facet arthritis`)
          }
        }
        // Fallback for items not covered by templates
        if (item.id === 'post_surgical_changes' && value === 'Yes') {
          findings.push('Post surgical changes in soft tissue')
        }
        
        // Handle degenerative changes dynamically
        if (item.id === 'degenerative_changes' && value === 'Yes') {
          const degenerativeItem = currentStudyData.checklist_items.find(ci => ci.id === 'degenerative_changes')
          if (degenerativeItem?.conditional?.sub_items) {
            const subItems = degenerativeItem.conditional.sub_items
            
            // Handle joints/compartments selection
            const jointsItem = subItems.find(sub => sub.id === 'joints')
            const compartmentsItem = subItems.find(sub => sub.id === 'compartments')
            
            if (jointsItem) {
              const selectedJoints = sideData.joints || []
              if (selectedJoints.length > 0) {
                const jointFindings = []
                
                selectedJoints.forEach(joint => {
                  const jointKey = joint.toLowerCase().replace(/[()\s-]/g, '_')
                  const severity = sideData[`${jointKey}_severity`]
                  const osteophytes = sideData[`${jointKey}_osteophytes`]
                  
                  let jointText = ''
                  if (severity) {
                    jointText = `${severity} degenerative changes in ${joint}`
                  } else {
                    jointText = `Degenerative changes in ${joint}`
                  }
                  
                  if (osteophytes === 'Present') {
                    jointText += ' with osteophytes'
                  }
                  
                  jointFindings.push(jointText)
                })
                
                if (jointFindings.length > 0) {
                  findings.push(jointFindings.join(', '))
                }
              }
            }
            
            if (compartmentsItem) {
              const selectedCompartments = sideData.compartments || []
              if (selectedCompartments.length > 0) {
                const compartmentFindings = []
                
                selectedCompartments.forEach(compartment => {
                  const severity = sideData[`${compartment.toLowerCase()}_severity`]
                  const osteophytes = sideData[`${compartment.toLowerCase()}_osteophytes`]
                  
                  let compartmentText = ''
                  if (severity) {
                    compartmentText = `${severity} degenerative changes in ${compartment.toLowerCase()} compartment`
                  } else {
                    compartmentText = `Degenerative changes in ${compartment.toLowerCase()} compartment`
                  }
                  
                  if (osteophytes === 'Present') {
                    compartmentText += ' with osteophytes'
                  }
                  
                  compartmentFindings.push(compartmentText)
                })
                
                if (compartmentFindings.length > 0) {
                  findings.push(compartmentFindings.join(', '))
                }
              }
            }
            
            // Handle common degenerative features
            const commonFeatures = []
            const jointSpaceNarrowing = sideData.joint_space_narrowing
            const osteophytes = sideData.osteophytes
            const scleroticChanges = sideData.sclerotic_changes
            const subchondralBoneCyst = sideData.subchondral_bone_cyst
            const severity = sideData.severity
            
            if (jointSpaceNarrowing === 'Present' || jointSpaceNarrowing === 'Yes') {
              commonFeatures.push('joint space narrowing')
            }
            if (osteophytes === 'Present' || osteophytes === 'Yes') {
              commonFeatures.push('osteophytes')
            }
            if (scleroticChanges === 'Present' || scleroticChanges === 'Yes') {
              commonFeatures.push('sclerotic changes')
            }
            if (subchondralBoneCyst === 'Yes') {
              commonFeatures.push('subchondral bone cyst')
            }
            
            // If no specific joints/compartments but has common features, create general finding
            if (commonFeatures.length > 0 && (!jointsItem || !sideData.joints?.length) && (!compartmentsItem || !sideData.compartments?.length)) {
              let degenerativeText = ''
              if (severity) {
                degenerativeText = `${severity} degenerative changes`
              } else {
                degenerativeText = 'Degenerative changes'
              }
              
              if (commonFeatures.length > 0) {
                degenerativeText += ` with ${commonFeatures.join(', ')}`
              }
              
              findings.push(degenerativeText)
            } else if (commonFeatures.length > 0) {
              // Add common features as separate findings
              commonFeatures.forEach(feature => findings.push(feature))
            } else if ((!jointsItem || !sideData.joints?.length) && (!compartmentsItem || !sideData.compartments?.length) && severity) {
              // NEW: If only severity is provided, still output a general degenerative change
              findings.push(`${severity} degenerative changes`)
            }
          }
        }
      })
      
      return findings
    }
    
    const hasSpineRegion = currentStudyData?.imaging_findings?.some(item => item.label === 'Spine Region')
    const hasLaterality = currentStudyData?.imaging_findings?.some(item => item.label === 'Laterality')
    
    if (hasSpineRegion) {
      // Handle spine region-based reporting
      const region = spineRegion?.toLowerCase()
      const findings = generateSideFindings(region, spineRegion)
      
      if (findings.length > 0) {
        findings.forEach((finding, index) => {
          report += `${index + 1}. ${finding}\n`
        })
      } else {
        report += 'No significant abnormalities detected.\n'
      }
    } else if (hasLaterality && laterality === 'Bilateral') {
      const rightFindings = generateSideFindings('right', 'Right')
      const leftFindings = generateSideFindings('left', 'Left')
      
      if (rightFindings.length > 0) {
        report += `\nRight ${currentStudyData.study_type.toLowerCase()}:\n`
        rightFindings.forEach((finding, index) => {
          report += `${index + 1}. ${finding}\n`
        })
      }
      
      if (leftFindings.length > 0) {
        report += `\nLeft ${currentStudyData.study_type.toLowerCase()}:\n`
        leftFindings.forEach((finding, index) => {
          report += `${index + 1}. ${finding}\n`
        })
      }
      
      if (rightFindings.length === 0 && leftFindings.length === 0) {
        report += `No significant abnormalities detected in bilateral ${currentStudyData.study_type.toLowerCase()}s.\n`
      }
    } else {
      const side = laterality?.toLowerCase()
      const findings = generateSideFindings(side, laterality)
      
      if (findings.length > 0) {
        findings.forEach((finding, index) => {
          report += `${index + 1}. ${finding}\n`
        })
      } else {
        report += 'No significant abnormalities detected.\n'
      }
    }
    
    setGeneratedReport(report)
  }, [selectedFindings, clinicalHistory, currentStudyData])

  useEffect(() => {
    generateReport()
  }, [generateReport])

  const copyToClipboard = async () => {
    if (!generatedReport.trim()) {
      alert('No report content to copy')
      return
    }
    
    try {
      // Modern approach with navigator.clipboard
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(generatedReport)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea')
        textArea.value = generatedReport
        textArea.style.position = 'fixed'
        textArea.style.left = '-999999px'
        textArea.style.top = '-999999px'
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        
        try {
          document.execCommand('copy')
          setCopySuccess(true)
          setTimeout(() => setCopySuccess(false), 2000)
        } catch (err) {
          console.error('Fallback copy failed:', err)
          alert('Unable to copy to clipboard. Please manually select and copy the text.')
        } finally {
          document.body.removeChild(textArea)
        }
      }
    } catch (err) {
      console.error('Copy to clipboard failed:', err)
      alert('Unable to copy to clipboard. Please manually select and copy the text.')
    }
  }

  if (!currentStudyData) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='medical-card text-center'>
          <h2 className={`text-xl font-semibold ${theme.colors.text.primary} mb-2`}>
            Study Not Found
          </h2>
          <p className={`${theme.colors.text.secondary} mb-4`}>
            The requested study type \"{studyType}\" is not available.
          </p>
          <button
            onClick={() => navigate('/xray')}
            className='btn-gradient'
          >
            Back to Studies
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className='h-screen overflow-hidden'>
      <header className={`${theme.colors.surface} shadow-lg border-b ${theme.colors.border}`}>
        <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-2'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => navigate('/xray')}
                className='p-2 rounded-lg hover:bg-gray-100 transition-colors'
              >
                <ArrowLeft className={`h-6 w-6 ${theme.colors.text.primary}`} />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${theme.colors.text.primary}`}>
                  {currentStudyData.study_type} X-Ray Report
                </h1>
                <p className={`text-sm ${theme.colors.text.secondary}`}>
                  Complete the checklist to generate your report
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>

      <main className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-120px)]'>
          <div className='space-y-6 overflow-y-auto pr-2'>
            <div className='medical-card'>
              <div className='flex items-center space-x-2 mb-4'>
                <History className={`h-5 w-5 ${theme.colors.text.primary}`} />
                <h2 className={`text-lg font-semibold ${theme.colors.text.primary}`}>
                  Clinical History
                </h2>
              </div>
              <textarea
                className='medical-textarea h-24'
                placeholder='Enter the clinical history and reason for the study...'
                value={clinicalHistory}
                onChange={(e) => setClinicalHistory(e.target.value)}
              />
            </div>

            <div>
              <div className='flex items-center space-x-2 mb-4'>
                <FileText className={`h-5 w-5 ${theme.colors.text.primary}`} />
                <h2 className={`text-lg font-semibold ${theme.colors.text.primary}`}>
                  Imaging Findings
                </h2>
              </div>
              <ChecklistForm 
                studyData={currentStudyData}
                onSelectionChange={handleSelectionChange}
                selectedFindings={selectedFindings}
              />
            </div>
          </div>

          <div className='space-y-6 sticky top-8 h-fit'>
            <div className='medical-card'>
              <div className='flex items-center justify-between mb-4'>
                <h2 className={`text-lg font-semibold ${theme.colors.text.primary}`}>
                  Generated Report
                </h2>
                <button
                  onClick={copyToClipboard}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    copySuccess
                      ? 'bg-green-600 text-white'
                      : `${theme.colors.button.primary} hover:glow-orange`
                  }`}
                >
                  <Copy className='h-4 w-4' />
                  <span>{copySuccess ? 'Copied!' : 'Copy Report'}</span>
                </button>
              </div>
              
              <div className={`${theme.colors.surface} border ${theme.colors.border} rounded-lg p-4 min-h-96`}>
                <pre className={`whitespace-pre-wrap text-sm ${theme.colors.text.primary} font-mono leading-relaxed`}>
                  {generatedReport || 'Report will be generated as you make selections...'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default ChecklistPage
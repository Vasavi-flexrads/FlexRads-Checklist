import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { ArrowLeft, Copy, FileText, History } from 'lucide-react'
import ChecklistForm from '../../components/forms/ChecklistForm'
import { studyData } from '../../data/checklistData'

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

  const currentStudyData = studyData[studyType]

  const handleSelectionChange = useCallback((key, selection) => {
    setSelectedFindings(prev => ({
      ...prev,
      [key]: selection
    }))
  }, [])

  const generateReport = useCallback(() => {
    const laterality = selectedFindings.laterality
    const spineRegion = selectedFindings.spineRegion
    const formData = selectedFindings.formData || {}
    
    let report = ''
    
    if (currentStudyData) {
      if (currentStudyData.has_spine_region) {
        report += `X-RAY ${spineRegion?.toUpperCase()} ${currentStudyData.study_type.toUpperCase()}\n\n`
      } else if (laterality === 'Bilateral') {
        report += `X-RAY BILATERAL ${currentStudyData.study_type.toUpperCase()}\n\n`
      } else {
        report += `X-RAY ${laterality?.toUpperCase()} ${currentStudyData.study_type.toUpperCase()}\n\n`
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
      
      // Process each checklist item
      currentStudyData.checklist_items?.forEach((item, index) => {
        const value = sideData[item.id]
        if (!value) return
        
        // Spine-specific findings
        if (currentStudyData.study_type === 'Spine') {
          if (item.id === 'hardware' && value === 'Yes') {
            const hardwareDetails = sideData.hardware_details
            if (hardwareDetails) {
              findings.push(`Hardware present: ${hardwareDetails}`)
            }
          }
          
          if (item.id === 'lordosis' && value === 'Yes') {
            const lordosisType = sideData.lordosis_type
            if (lordosisType) {
              findings.push(`${lordosisType} present`)
            }
          }
          
          if (item.id === 'scoliosis' && value === 'Yes') {
            const scoliosisType = sideData.scoliosis_type
            const scoliosisCenter = sideData.scoliosis_center
            let scoliosisText = `${scoliosisType} scoliosis`
            if (scoliosisCenter) {
              scoliosisText += ` centered at ${scoliosisCenter}`
            }
            findings.push(scoliosisText)
          }
          
          if (item.id === 'multilevel_degenerative_changes' && value === 'Yes') {
            const severity = sideData.degenerative_severity
            const pronouncedAt = sideData.degenerative_pronounced_at
            const facetSeverity = sideData.facet_arthritis_severity
            const facetLocation = sideData.facet_arthritis_location
            
            let degenerativeText = 'Multilevel degenerative changes'
            if (severity) {
              degenerativeText = `${severity} multilevel degenerative changes`
            }
            if (pronouncedAt) {
              degenerativeText += `, more pronounced at ${pronouncedAt}`
            }
            findings.push(degenerativeText)
            
            if (facetSeverity && facetLocation) {
              findings.push(`${facetSeverity} facet arthritis at ${facetLocation}`)
            } else if (facetSeverity) {
              findings.push(`${facetSeverity} facet arthritis`)
            }
          }
          
          if (item.id === 'fracture' && value === 'Yes') {
            const fractureType = sideData.fracture_type
            const vertebralBody = sideData.fracture_vertebral_body
            let fractureText = 'Fracture'
            if (fractureType) fractureText = fractureType
            if (vertebralBody) fractureText += ` at ${vertebralBody}`
            findings.push(fractureText)
          }
          
          if (item.id === 'anterolisthesis' && value === 'Present') {
            const anterolisthesisDetails = sideData.anterolisthesis_details
            if (anterolisthesisDetails) {
              findings.push(`Anterolisthesis: ${anterolisthesisDetails}`)
            } else {
              findings.push('Anterolisthesis present')
            }
          }
          
          if (item.id === 'motion_flexion_extension' && value === 'Present') {
            const measurement = sideData.motion_measurement
            const vertebralBody = sideData.motion_vertebral_body
            let motionText = 'No motion on flexion extension view'
            if (measurement && vertebralBody) {
              motionText += `: ${measurement} at ${vertebralBody}`
            } else if (vertebralBody) {
              motionText += ` at ${vertebralBody}`
            }
            findings.push(motionText)
          }
        }
        // Hardware findings (for non-spine studies)
        else if (item.id === 'hardware') {
          if (currentStudyData.study_type === 'Foot' && value === 'Yes') {
            const hardwareTypes = sideData.hardware_types
            if (hardwareTypes && hardwareTypes.length > 0) {
              const hardwareDetails = []
              
              hardwareTypes.forEach(hardware => {
                let region = ''
                switch (hardware) {
                  case 'Arthrodesis and screw fixation':
                    region = sideData.arthrodesis_region
                    break
                  case 'Plate and screw fixation':
                    region = sideData.plate_screw_region
                    break
                  case 'K wire':
                    region = sideData.kwire_region
                    break
                  case 'Screws':
                    region = sideData.screws_region
                    break
                  case 'Staples':
                    region = sideData.staples_region
                    break
                }
                
                let hardwareText = hardware
                if (region) hardwareText += ` in ${region}`
                hardwareDetails.push(hardwareText)
              })
              
              if (hardwareDetails.length > 0) {
                findings.push(`Hardware present: ${hardwareDetails.join(', ')}`)
              }
            }
          } else if (value === 'Present' || value === 'Yes') {
            // Handle other study types (hip, shoulder, knee)
            const hardwareType = sideData.hardware_type
            if (hardwareType) {
              if (hardwareType === 'Others') {
                const otherDescription = sideData.hardware_other_description
                if (otherDescription) {
                  findings.push(`Hardware present: ${otherDescription}`)
                }
              } else {
                findings.push(`Hardware present: ${hardwareType}`)
              }
            }
          }
        }
        
        if (item.id === 'post_surgical_changes' && value === 'Yes') {
          findings.push('Post surgical changes in soft tissue')
        }
        
        if (item.id === 'degenerative_changes' && value === 'Yes') {
          // Handle foot-specific joints
          if (currentStudyData.study_type === 'Foot') {
            const joints = sideData.joints
            if (joints && joints.length > 0) {
              const jointFindings = []
              
              joints.forEach(joint => {
                const jointKey = joint.toLowerCase().replace(/[()\s-]/g, '_')
                const severity = sideData[`${jointKey}_severity`]
                
                let jointText = ''
                if (severity) {
                  jointText = `${severity} degenerative changes in ${joint}`
                } else {
                  jointText = `Degenerative changes in ${joint}`
                }
                
                jointFindings.push(jointText)
              })
              
              if (jointFindings.length > 0) {
                findings.push(jointFindings.join(', '))
              }
              
              // Add common features without "Additional features" label
              const features = []
              const jointSpaceNarrowing = sideData.joint_space_narrowing
              const osteophytes = sideData.osteophytes
              const scleroticChanges = sideData.sclerotic_changes
              
              if (jointSpaceNarrowing === 'Present') features.push('joint space narrowing present')
              if (osteophytes === 'Present') features.push('osteophytes present')
              if (scleroticChanges === 'Present') features.push('sclerotic changes present')
              
              if (features.length > 0) {
                features.forEach(feature => findings.push(feature))
              }
            }
          }
          // Handle hip-specific degenerative changes
          else if (currentStudyData.study_type === 'Hip') {
            const severity = sideData.severity
            const jointSpaceNarrowing = sideData.joint_space_narrowing
            const osteophytes = sideData.osteophytes
            const scleroticChanges = sideData.sclerotic_changes
            const subchondralBoneCyst = sideData.subchondral_bone_cyst
            
            let degenerativeText = ''
            if (severity) {
              degenerativeText += `${severity} degenerative changes`
            } else {
              degenerativeText += 'Degenerative changes'
            }
            
            const features = []
            if (jointSpaceNarrowing === 'Yes') features.push('joint space narrowing')
            if (osteophytes === 'Yes') features.push('osteophytes')
            if (scleroticChanges === 'Yes') features.push('sclerotic changes')
            if (subchondralBoneCyst === 'Yes') features.push('subchondral bone cyst')
            
            if (features.length > 0) {
              degenerativeText += ` with ${features.join(', ')}`
            }
            
            findings.push(degenerativeText)
          }
          // Handle shoulder-specific joints
          else if (currentStudyData.study_type === 'Shoulder') {
            const joints = sideData.joints
            if (joints && joints.length > 0) {
              const jointFindings = []
              
              joints.forEach(joint => {
                let jointText = ''
                if (joint.includes('AC') || joint.includes('Acromioclavicular')) {
                  const severity = sideData.ac_severity
                  const osteophytes = sideData.ac_osteophytes
                  const jointSpaceWidening = sideData.ac_joint_space_narrowing
                  
                  if (severity) {
                    jointText += `${severity} degenerative changes in AC joint`
                  } else {
                    jointText += 'Degenerative changes in AC joint'
                  }
                  
                  if (osteophytes === 'Present') {
                    jointText += ' with osteophytes'
                  }
                  
                  if (jointSpaceWidening) {
                    jointText += `, joint space widening ${jointSpaceWidening}`
                  }
                } else if (joint.includes('Glenohumeral')) {
                  const severity = sideData.glenohumeral_severity
                  const osteophytes = sideData.glenohumeral_osteophytes
                  
                  if (severity) {
                    jointText += `${severity} degenerative changes in glenohumeral joint`
                  } else {
                    jointText += 'Degenerative changes in glenohumeral joint'
                  }
                  
                  if (osteophytes === 'Present') {
                    jointText += ' with osteophytes'
                  }
                }
                
                if (jointText) {
                  jointFindings.push(jointText)
                }
              })
              
              if (jointFindings.length > 0) {
                findings.push(jointFindings.join(', '))
              }
            }
          } else {
            // Handle knee-specific compartments
            const compartments = sideData.compartments
            if (compartments && compartments.length > 0) {
              const compartmentFindings = []
              
              compartments.forEach(compartment => {
                const severity = sideData[`${compartment.toLowerCase()}_severity`]
                const osteophytes = sideData[`${compartment.toLowerCase()}_osteophytes`]
                
                let compartmentText = ''
                if (severity) {
                  compartmentText += `${severity} degenerative changes in ${compartment.toLowerCase()} compartment`
                } else {
                  compartmentText += `Degenerative changes in ${compartment.toLowerCase()} compartment`
                }
                
                if (osteophytes === 'Present') {
                  compartmentText += ' with osteophytes'
                }
                
                compartmentFindings.push(compartmentText)
              })
              
              // Join multiple compartments with comma and space
              const finalText = compartmentFindings.join(', ')
              findings.push(finalText)
            }
          }
        }
        
        // Foot-specific findings
        if (item.id === 'calcaneal_spur' && value === 'Yes') {
          const spurLocation = sideData.spur_location
          if (spurLocation && spurLocation.length > 0) {
            findings.push(`Calcaneal spur (${spurLocation.join(', ')})`)
          } else {
            findings.push('Calcaneal spur present')
          }
        }
        
        if (item.id === 'amputation' && value === 'Yes') {
          const region = sideData.amputation_region
          if (region) {
            findings.push(`Amputation in ${region}`)
          } else {
            findings.push('Amputation present')
          }
        }
        
        if (item.id === 'deformity' && value === 'Yes') {
          const deformityType = sideData.deformity_type
          if (deformityType) {
            if (currentStudyData.study_type === 'Foot') {
              if (deformityType === 'Hallux valgus deformity') {
                const mtpChanges = sideData.hallux_valgus_mtp_changes
                if (mtpChanges) {
                  findings.push(`${deformityType} with ${mtpChanges.toLowerCase()} 1st MTP degenerative changes`)
                } else {
                  findings.push(deformityType)
                }
              } else if (deformityType === 'Flexion deformity') {
                const region = sideData.flexion_deformity_region
                if (region) {
                  findings.push(`${deformityType} in ${region}`)
                } else {
                  findings.push(deformityType)
                }
              } else {
                findings.push(deformityType)
              }
            } else {
              // Handle hip, knee, shoulder deformities
              findings.push(deformityType)
            }
          }
        }
        
        // Hip-specific findings
        if (item.id === 'heterotrophic_calcification' && value === 'Present') {
          findings.push('Heterotrophic calcification present')
        }
        
        if (item.id === 'phleboliths' && value === 'Present') {
          findings.push('Phleboliths present')
        }
        
        // Shoulder-specific findings
        if (item.id === 'rotator_cuff_calcification' && value === 'Yes') {
          findings.push('Rotator cuff calcification present')
        }
        
        if (item.id === 'dislocation_subluxation' && value === 'Yes') {
          findings.push('Dislocation/subluxation present')
        }
        
        if (item.id === 'ac_joint_separation' && value === 'Yes') {
          const grade = sideData.ac_separation_grade
          const measurement = sideData.ac_separation_measurement
          
          let separationText = 'AC joint separation'
          if (grade) separationText += ` (${grade})`
          if (measurement) separationText += `, ${measurement}`
          findings.push(separationText)
        }
        
        if (item.id === 'acute_fracture' && value === 'Yes') {
          const region = sideData.fracture_region
          const type = sideData.fracture_type
          let fractureText = 'Acute fracture'
          if (region) fractureText += ` in ${region}`
          if (type) fractureText += `, ${type}`
          findings.push(fractureText)
        }
        
        if (item.id === 'fracture_followup' && value === 'Yes') {
          const followupType = sideData.followup_type
          const region = sideData.followup_region
          if (followupType && region) {
            findings.push(`${followupType} in ${region}`)
          }
        }
        
        // Knee-specific findings
        if (item.id === 'joint_effusion' && value !== 'None' && currentStudyData.study_type === 'Knee') {
          findings.push(`${value} joint effusion`)
        }
        
        if (item.id === 'chondrocalcinosis' && value === 'Yes' && currentStudyData.study_type === 'Knee') {
          findings.push('Chondrocalcinosis present')
        }
        
        // Common findings across multiple study types
        if (item.id === 'vascular_calcification' && value === 'Present') {
          findings.push('Vascular calcification present')
        }
        
        if (item.id === 'lesion' && value === 'Yes') {
          const region = sideData.lesion_region
          const size = sideData.lesion_size
          const characteristics = sideData.lesion_characteristics
          
          let lesionText = 'Lesion'
          if (region) lesionText += ` in ${region}`
          if (size) lesionText += `, size ${size}`
          if (characteristics) lesionText += `, ${characteristics}`
          findings.push(lesionText)
        }
      })
      
      return findings
    }
    
    if (currentStudyData.has_spine_region) {
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
    } else if (laterality === 'Bilateral') {
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
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
    const formData = selectedFindings.formData || {}
    
    let report = ''
    
    if (currentStudyData) {
      if (laterality === 'Bilateral') {
        report += `X-RAY BILATERAL KNEE\n\n`
      } else {
        report += `X-RAY ${laterality?.toUpperCase()} KNEE\n\n`
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
        
        // Only include positive findings
        if (item.id === 'hardware' && value === 'Present') {
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
        
        if (item.id === 'post_surgical_changes' && value === 'Yes') {
          findings.push('Post surgical changes in soft tissue')
        }
        
        if (item.id === 'degenerative_changes' && value === 'Yes') {
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
        
        if (item.id === 'deformity' && value === 'Yes') {
          const deformityType = sideData.deformity_type
          if (deformityType) {
            findings.push(deformityType)
          }
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
        
        if (item.id === 'joint_effusion' && value !== 'None') {
          findings.push(`${value} joint effusion`)
        }
        
        if (item.id === 'vascular_calcification' && value === 'Present') {
          findings.push('Vascular calcification present')
        }
        
        if (item.id === 'chondrocalcinosis' && value === 'Yes') {
          findings.push('Chondrocalcinosis present')
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
    
    if (laterality === 'Bilateral') {
      const rightFindings = generateSideFindings('right', 'Right')
      const leftFindings = generateSideFindings('left', 'Left')
      
      if (rightFindings.length > 0) {
        report += '\nRight knee:\n'
        rightFindings.forEach((finding, index) => {
          report += `${index + 1}. ${finding}\n`
        })
      }
      
      if (leftFindings.length > 0) {
        report += '\nLeft knee:\n'
        leftFindings.forEach((finding, index) => {
          report += `${index + 1}. ${finding}\n`
        })
      }
      
      if (rightFindings.length === 0 && leftFindings.length === 0) {
        report += 'No significant abnormalities detected in bilateral knees.\n'
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
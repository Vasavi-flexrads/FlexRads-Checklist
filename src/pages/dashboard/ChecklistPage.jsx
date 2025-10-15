import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { ArrowLeft, Copy, FileText, History } from 'lucide-react'
import ChecklistForm from '../../components/forms/ChecklistForm'
import content from '../../data/content.json'
import { buildFindingsForSide } from '../../utils/reportBuilder'

const ChecklistPage = () => {
  const { studyType } = useParams()
  const navigate = useNavigate()
  const { theme } = useTheme()
  
  const [clinicalHistory, setClinicalHistory] = useState('')
  const [selectedFindings, setSelectedFindings] = useState({
    laterality: '',
    spineRegion: '',
    formData: {}
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

  const generateReport = useCallback(() => {
    if (!currentStudyData) {
      setGeneratedReport('')
      return
    }

    const laterality = selectedFindings.laterality
    const spineRegion = selectedFindings.spineRegion
    const formData = selectedFindings.formData || {}

    const hasSpineRegion = currentStudyData?.imaging_findings?.some((item) => item.label === 'Spine Region')
    const hasLaterality = currentStudyData?.imaging_findings?.some((item) => item.label === 'Laterality')

    const studyName = currentStudyData.study_type?.toUpperCase?.() || ''
    let headerContext = studyName

    if (hasSpineRegion && spineRegion) {
      headerContext = `${spineRegion.toUpperCase()} ${studyName}`
    } else if (hasLaterality && laterality) {
      headerContext = laterality === 'Bilateral' ? `BILATERAL ${studyName}` : `${laterality.toUpperCase()} ${studyName}`
    }

    let report = `X-RAY ${headerContext}\n\n`

    const trimmedHistory = clinicalHistory.trim()
    if (trimmedHistory) {
      report += `CLINICAL HISTORY:\n${trimmedHistory}\n\n`
    }

    report += 'FINDINGS:\n'

    const globalContext = {
      laterality,
      spineRegion,
      studyType: currentStudyData.study_type,
      studyLabel: currentStudyData.study_type
    }

    const formatFindings = (list) => list.map((finding, index) => `${index + 1}. ${finding}`).join('\n')

    if (hasSpineRegion) {
      const regionKey = (spineRegion || '').toLowerCase()
      const sideData = formData[regionKey] || {}
      const findings = buildFindingsForSide(currentStudyData.study_type, sideData, {
        ...globalContext,
        side: regionKey,
        sideLabel: spineRegion
      })

      if (findings.length > 0) {
        report += `${formatFindings(findings)}\n`
      } else {
        report += 'No significant abnormalities detected.\n'
      }
    } else if (hasLaterality && laterality === 'Bilateral') {
      const rightFindings = buildFindingsForSide(
        currentStudyData.study_type,
        formData.right || {},
        { ...globalContext, side: 'right', sideLabel: 'Right' }
      )
      const leftFindings = buildFindingsForSide(
        currentStudyData.study_type,
        formData.left || {},
        { ...globalContext, side: 'left', sideLabel: 'Left' }
      )

      if (rightFindings.length > 0) {
        report += `\nRight ${currentStudyData.study_type.toLowerCase()}:\n${formatFindings(rightFindings)}\n`
      }

      if (leftFindings.length > 0) {
        report += `\nLeft ${currentStudyData.study_type.toLowerCase()}:\n${formatFindings(leftFindings)}\n`
      }

      if (rightFindings.length === 0 && leftFindings.length === 0) {
        report += `No significant abnormalities detected in bilateral ${currentStudyData.study_type.toLowerCase()}s.\n`
      }
    } else {
      const fallbackKeys = Object.keys(formData)
      const sideKey = hasLaterality && laterality ? laterality.toLowerCase() : fallbackKeys[0]
      const sideData = (sideKey && formData[sideKey]) || formData || {}
      const sideLabel = hasLaterality && laterality ? laterality : spineRegion || currentStudyData.study_type

      const findings = buildFindingsForSide(
        currentStudyData.study_type,
        sideData,
        { ...globalContext, side: sideKey, sideLabel }
      )

      if (findings.length > 0) {
        report += `${formatFindings(findings)}\n`
      } else {
        report += 'No significant abnormalities detected.\n'
      }
    }

    setGeneratedReport(report.trimEnd())
  }, [clinicalHistory, currentStudyData, selectedFindings])

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
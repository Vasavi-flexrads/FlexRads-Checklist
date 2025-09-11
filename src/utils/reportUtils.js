// Utility functions for report generation

export const generateReportHeader = (studyType) => {
  return `${studyType.toUpperCase()} X-RAY REPORT\n\n`
}

export const formatClinicalHistory = (history) => {
  if (!history || !history.trim()) return ''
  return `CLINICAL HISTORY:\n${history.trim()}\n\n`
}

export const formatFindings = (selectedFindings) => {
  let findings = 'FINDINGS:\n'
  
  if (Object.keys(selectedFindings).length === 0) {
    findings += 'No findings selected.\n'
    return findings
  }
  
  // Group findings by category
  const findingsByCategory = {}
  Object.values(selectedFindings).forEach(finding => {
    if (!findingsByCategory[finding.category]) {
      findingsByCategory[finding.category] = []
    }
    findingsByCategory[finding.category].push(`${finding.item}: ${finding.finding}`)
  })
  
  Object.entries(findingsByCategory).forEach(([category, categoryFindings]) => {
    findings += `\n${category}:\n`
    categoryFindings.forEach(finding => {
      findings += `- ${finding}\n`
    })
  })
  
  return findings
}

export const formatImpression = (selectedImpressions) => {
  let impression = '\nIMPRESSION:\n'
  
  if (selectedImpressions.length === 0) {
    impression += 'No impression selected.'
  } else {
    selectedImpressions.forEach((imp, index) => {
      impression += `${index + 1}. ${imp}\n`
    })
  }
  
  return impression
}

export const generateCompleteReport = (studyType, clinicalHistory, selectedFindings, selectedImpressions) => {
  let report = ''
  
  report += generateReportHeader(studyType)
  report += formatClinicalHistory(clinicalHistory)
  report += formatFindings(selectedFindings)
  report += formatImpression(selectedImpressions)
  
  return report
}

// Copy to clipboard utility
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return { success: true }
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return { success: false, error: err }
  }
}

// Validation utilities
export const validateReport = (clinicalHistory, selectedFindings, selectedImpressions) => {
  const warnings = []
  
  if (!clinicalHistory || !clinicalHistory.trim()) {
    warnings.push('Clinical history is empty')
  }
  
  if (Object.keys(selectedFindings).length === 0) {
    warnings.push('No findings selected')
  }
  
  if (selectedImpressions.length === 0) {
    warnings.push('No impression selected')
  }
  
  return warnings
}
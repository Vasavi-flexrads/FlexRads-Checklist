import { useState, useEffect } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

const ChecklistForm = ({ studyData, onSelectionChange, selectedFindings }) => {
  const { theme } = useTheme()
  const [laterality, setLaterality] = useState('Right')
  const [spineRegion, setSpineRegion] = useState('Cervical')
  const [formData, setFormData] = useState({})
  const [expandedSections, setExpandedSections] = useState({})

  // Early return if no study data or checklist items available
  if (!studyData || !studyData?.checklist_items || studyData.checklist_items.length === 0) {
    return (
      <div className='medical-card'>
        <p className={`${theme.colors.text.secondary} text-center`}>
          Checklist data is not available for this study yet.
        </p>
      </div>
    )
  }

  useEffect(() => {
    // Initialize form data based on study type
    const hasLaterality = studyData?.imaging_findings?.some(item => item.label === 'Laterality')
    const hasSpineRegion = studyData?.imaging_findings?.some(item => item.label === 'Spine Region')
    
    if (hasLaterality) {
      const initialData = {}
      if (laterality === 'Bilateral') {
        initialData.right = {}
        initialData.left = {}
      } else {
        initialData[laterality.toLowerCase()] = {}
      }
      setFormData(initialData)
    } else if (hasSpineRegion) {
      // Initialize spine data
      const initialData = {}
      initialData[spineRegion.toLowerCase()] = {}
      setFormData(initialData)
    }
  }, [laterality, spineRegion, studyData])

  // Separate useEffect to handle parent component updates
  useEffect(() => {
    const hasLaterality = studyData?.imaging_findings?.some(item => item.label === 'Laterality')
    const hasSpineRegion = studyData?.imaging_findings?.some(item => item.label === 'Spine Region')
    
    if (hasLaterality) {
      onSelectionChange('laterality', laterality)
    } else if (hasSpineRegion) {
      onSelectionChange('spineRegion', spineRegion)
    }
    onSelectionChange('formData', formData)
  }, [laterality, spineRegion, formData, onSelectionChange])

  const handleLateralityChange = (value) => {
    setLaterality(value)
    // Reset form data when laterality changes
    const newData = {}
    if (value === 'Bilateral') {
      newData.right = {}
      newData.left = {}
    } else {
      newData[value.toLowerCase()] = {}
    }
    setFormData(newData)
  }

  const handleSpineRegionChange = (value) => {
    setSpineRegion(value)
    // Reset form data when spine region changes
    const newData = {}
    newData[value.toLowerCase()] = {}
    setFormData(newData)
  }

  const handleInputChange = (side, itemId, value, subItemId = null) => {
    setFormData(prev => {
      const newData = { ...prev }
      if (!newData[side]) newData[side] = {}
      
      if (subItemId) {
        if (!newData[side][itemId]) newData[side][itemId] = {}
        newData[side][itemId][subItemId] = value
      } else {
        newData[side][itemId] = value
      }
      
      // onSelectionChange call is now handled in useEffect
      return newData
    })
  }

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  // Check if a sub-item should be shown based on show_when condition
  const checkShowWhen = (subItem, side) => {
    if (!subItem.show_when) return true
    
    const condition = subItem.show_when
    const sideData = formData[side] || {}
    
    if (condition.includes('_includes_')) {
      const [fieldName, value] = condition.split('_includes_')
      const fieldValue = sideData[fieldName]
      return Array.isArray(fieldValue) && fieldValue.includes(value)
    }
    
    if (condition.includes('_equals_')) {
      const [fieldName, value] = condition.split('_equals_')
      return sideData[fieldName] === value
    }
    
    if (condition.includes('_not_empty')) {
      const fieldName = condition.replace('_not_empty', '')
      const fieldValue = sideData[fieldName]
      return fieldValue && fieldValue.trim() !== ''
    }
    
    return true
  }

  const renderInput = (item, side, parentValue = null) => {
    const currentValue = formData[side]?.[item.id] || ''
    
    switch (item.type) {
      case 'radio':
        return (
          <div className='space-y-2'>
            {item.options.map((option) => {
              const isSelected = currentValue === option
              return (
                <button
                  key={option}
                  type='button'
                  onClick={() => handleInputChange(side, item.id, option)}
                  className={`flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200 w-full text-left ${
                    isSelected
                      ? `${theme.colors.button.primary} border-transparent shadow-lg`
                      : `${theme.colors.surface} ${theme.colors.border} hover:border-orange-500/50`
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-white bg-white/20'
                      : 'border-gray-500'
                  }`}>
                    {isSelected && <div className='w-2 h-2 rounded-full bg-white' />}
                  </div>
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-white' : theme.colors.text.primary
                  }`}>
                    {option}
                  </span>
                </button>
              )
            })}
          </div>
        )

      case 'checkbox':
        return (
          <div className='space-y-2'>
            {item.options.map((option) => {
              const selectedOptions = currentValue || []
              const isSelected = selectedOptions.includes(option)
              return (
                <button
                  key={option}
                  type='button'
                  onClick={() => {
                    const newSelection = isSelected
                      ? selectedOptions.filter(item => item !== option)
                      : [...selectedOptions, option]
                    handleInputChange(side, item.id, newSelection)
                  }}
                  className={`flex items-center space-x-2 p-3 rounded-lg border transition-all duration-200 w-full text-left ${
                    isSelected
                      ? `${theme.colors.button.primary} border-transparent shadow-lg`
                      : `${theme.colors.surface} ${theme.colors.border} hover:border-orange-500/50`
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-white bg-white/20'
                      : 'border-gray-500'
                  }`}>
                    {isSelected && <Check className='h-3 w-3 text-white' />}
                  </div>
                  <span className={`text-sm font-medium ${
                    isSelected ? 'text-white' : theme.colors.text.primary
                  }`}>
                    {option}
                  </span>
                </button>
              )
            })}
          </div>
        )

      case 'text':
        return (
          <input
            type='text'
            placeholder={item.placeholder || ''}
            value={currentValue}
            onChange={(e) => handleInputChange(side, item.id, e.target.value)}
            className='medical-input'
          />
        )

      default:
        return null
    }
  }

  // Render compartment-specific degenerative changes questions
  const renderDegenerativeChangesSection = (side, selectedCompartments) => {
    const sectionKey = `${side}_degenerative_changes`
    const isExpanded = expandedSections[sectionKey] !== false // Default to expanded
    
    return (
      <div className='border border-orange-500/20 rounded-lg overflow-hidden'>
        <button
          type='button'
          onClick={() => toggleSection(sectionKey)}
          className='w-full p-4 text-left flex items-center justify-between bg-orange-900/20 hover:bg-orange-900/30 transition-all duration-200'
        >
          <h4 className={`font-medium ${theme.colors.text.primary}`}>
            Compartment-specific assessments
          </h4>
          {isExpanded ? (
            <ChevronUp className='h-4 w-4 text-orange-500' />
          ) : (
            <ChevronDown className='h-4 w-4 text-orange-500' />
          )}
        </button>
        
        {isExpanded && (
          <div className='p-4 bg-gray-800/10 border-t border-orange-500/20 space-y-6'>
            {selectedCompartments.map(compartment => (
              <div key={compartment} className='space-y-4'>
                <h5 className={`text-sm font-semibold ${theme.colors.text.accent} border-b border-orange-500/20 pb-1`}>
                  {compartment} Compartment
                </h5>
                
                <div className='ml-4 space-y-3'>
                  <div>
                    <label className={`block text-xs font-medium ${theme.colors.text.primary} mb-2`}>
                      {compartment} Compartment Severity
                    </label>
                    {renderInput({
                      id: `${compartment.toLowerCase()}_severity`,
                      type: 'radio',
                      options: ['Mild', 'Moderate', 'Severe']
                    }, side)}
                  </div>
                  
                  <div>
                    <label className={`block text-xs font-medium ${theme.colors.text.primary} mb-2`}>
                      {compartment} Compartment Osteophytes
                    </label>
                    {renderInput({
                      id: `${compartment.toLowerCase()}_osteophytes`,
                      type: 'radio',
                      options: ['Present', 'Absent']
                    }, side)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Render joint-specific degenerative changes questions for shoulder
  const renderShoulderDegenerativeChangesSection = (side, selectedJoints) => {
    const sectionKey = `${side}_shoulder_degenerative_changes`
    const isExpanded = expandedSections[sectionKey] !== false // Default to expanded
    
    return (
      <div className='border border-orange-500/20 rounded-lg overflow-hidden'>
        <button
          type='button'
          onClick={() => toggleSection(sectionKey)}
          className='w-full p-4 text-left flex items-center justify-between bg-orange-900/20 hover:bg-orange-900/30 transition-all duration-200'
        >
          <h4 className={`font-medium ${theme.colors.text.primary}`}>
            Joint-specific assessments
          </h4>
          {isExpanded ? (
            <ChevronUp className='h-4 w-4 text-orange-500' />
          ) : (
            <ChevronDown className='h-4 w-4 text-orange-500' />
          )}
        </button>
        
        {isExpanded && (
          <div className='p-4 bg-gray-800/10 border-t border-orange-500/20 space-y-6'>
            {selectedJoints.map(joint => (
              <div key={joint} className='space-y-4'>
                <h5 className={`text-sm font-semibold ${theme.colors.text.accent} border-b border-orange-500/20 pb-1`}>
                  {joint}
                </h5>
                
                <div className='ml-4 space-y-3'>
                  {joint.includes('AC') || joint.includes('Acromioclavicular') ? (
                    <>
                      <div>
                        <label className={`block text-xs font-medium ${theme.colors.text.primary} mb-2`}>
                          AC Joint Severity
                        </label>
                        {renderInput({
                          id: 'ac_severity',
                          type: 'radio',
                          options: ['Mild', 'Moderate', 'Severe']
                        }, side)}
                      </div>
                      
                      <div>
                        <label className={`block text-xs font-medium ${theme.colors.text.primary} mb-2`}>
                          AC Joint Osteophytes
                        </label>
                        {renderInput({
                          id: 'ac_osteophytes',
                          type: 'radio',
                          options: ['Present', 'Absent']
                        }, side)}
                      </div>
                      
                      <div>
                        <label className={`block text-xs font-medium ${theme.colors.text.primary} mb-2`}>
                          AC Joint Space Widening (measurement)
                        </label>
                        {renderInput({
                          id: 'ac_joint_space_narrowing',
                          type: 'text',
                          placeholder: 'e.g., 2mm'
                        }, side)}
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className={`block text-xs font-medium ${theme.colors.text.primary} mb-2`}>
                          Glenohumeral Joint Severity
                        </label>
                        {renderInput({
                          id: 'glenohumeral_severity',
                          type: 'radio',
                          options: ['Mild', 'Moderate', 'Severe']
                        }, side)}
                      </div>
                      
                      <div>
                        <label className={`block text-xs font-medium ${theme.colors.text.primary} mb-2`}>
                          Glenohumeral Joint Osteophytes
                        </label>
                        {renderInput({
                          id: 'glenohumeral_osteophytes',
                          type: 'radio',
                          options: ['Present', 'Absent']
                        }, side)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Render joint-specific degenerative changes questions for foot
  const renderFootDegenerativeChangesSection = (side, selectedJoints) => {
    const sectionKey = `${side}_foot_degenerative_changes`
    const isExpanded = expandedSections[sectionKey] !== false // Default to expanded
    
    return (
      <div className='border border-orange-500/20 rounded-lg overflow-hidden'>
        <button
          type='button'
          onClick={() => toggleSection(sectionKey)}
          className='w-full p-4 text-left flex items-center justify-between bg-orange-900/20 hover:bg-orange-900/30 transition-all duration-200'
        >
          <h4 className={`font-medium ${theme.colors.text.primary}`}>
            Joint-specific severity assessments
          </h4>
          {isExpanded ? (
            <ChevronUp className='h-4 w-4 text-orange-500' />
          ) : (
            <ChevronDown className='h-4 w-4 text-orange-500' />
          )}
        </button>
        
        {isExpanded && (
          <div className='p-4 bg-gray-800/10 border-t border-orange-500/20 space-y-6'>
            {selectedJoints.map(joint => (
              <div key={joint} className='space-y-4'>
                <h5 className={`text-sm font-semibold ${theme.colors.text.accent} border-b border-orange-500/20 pb-1`}>
                  {joint} Severity
                </h5>
                
                <div className='ml-4'>
                  {renderInput({
                    id: `${joint.toLowerCase().replace(/[()\s-]/g, '_')}_severity`,
                    type: 'radio',
                    options: ['Mild', 'Moderate', 'Severe']
                  }, side)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Render mandatory degenerative changes questions for foot
  const renderFootMandatoryDegenerativeQuestions = (side) => {
    return (
      <div className='mt-6 space-y-4'>
        <h4 className={`text-sm font-medium ${theme.colors.text.primary} mb-3 border-b border-orange-500/20 pb-2`}>
          Mandatory assessments:
        </h4>
        
        <div className='space-y-4'>
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
              Joint space narrowing
            </label>
            {renderInput({
              id: 'joint_space_narrowing',
              type: 'radio',
              options: ['Present', 'Absent']
            }, side)}
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
              Osteophytes
            </label>
            {renderInput({
              id: 'osteophytes',
              type: 'radio',
              options: ['Present', 'Absent']
            }, side)}
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
              Sclerotic changes
            </label>
            {renderInput({
              id: 'sclerotic_changes',
              type: 'radio',
              options: ['Present', 'Absent']
            }, side)}
          </div>
        </div>
      </div>
    )
  }

  // Render fracture followup section
  const renderFractureFollowupSection = (side, followupType) => {
    const sectionKey = `${side}_fracture_followup`
    const isExpanded = expandedSections[sectionKey] !== false
    const region = formData[side]?.followup_region
    const hasValues = region

    return (
      <div className='border border-orange-500/20 rounded-lg overflow-hidden mt-4'>
        <button
          type='button'
          onClick={() => toggleSection(sectionKey)}
          className={`w-full p-4 text-left flex items-center justify-between transition-all duration-200 ${
            hasValues
              ? 'bg-orange-900/30 border-orange-500/40'
              : 'bg-gray-800/30 hover:bg-gray-800/50'
          }`}
        >
          <div>
            <h4 className={`font-medium ${theme.colors.text.primary}`}>
              {followupType} Details
            </h4>
            {hasValues && (
              <div className='text-sm text-orange-400 mt-1'>
                Region: {region}
              </div>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className='h-4 w-4 text-orange-500' />
          ) : (
            <ChevronDown className='h-4 w-4 text-orange-500' />
          )}
        </button>
        
        {isExpanded && (
          <div className='p-4 bg-gray-800/20 border-t border-orange-500/20'>
            <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
              Region
            </label>
            {renderInput({
              id: 'followup_region',
              type: 'text',
              placeholder: 'e.g., Scapula, Clavicle'
            }, side)}
          </div>
        )}
      </div>
    )
  }

  // Render AC joint separation measurement section
  const renderAcSeparationSection = (side, grade) => {
    const sectionKey = `${side}_ac_separation`
    const isExpanded = expandedSections[sectionKey] !== false
    const measurement = formData[side]?.ac_separation_measurement
    const hasValues = measurement

    return (
      <div className='border border-orange-500/20 rounded-lg overflow-hidden mt-4'>
        <button
          type='button'
          onClick={() => toggleSection(sectionKey)}
          className={`w-full p-4 text-left flex items-center justify-between transition-all duration-200 ${
            hasValues
              ? 'bg-orange-900/30 border-orange-500/40'
              : 'bg-gray-800/30 hover:bg-gray-800/50'
          }`}
        >
          <div>
            <h4 className={`font-medium ${theme.colors.text.primary}`}>
              {grade} Details
            </h4>
            {hasValues && (
              <div className='text-sm text-orange-400 mt-1'>
                Measurement: {measurement}
              </div>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className='h-4 w-4 text-orange-500' />
          ) : (
            <ChevronDown className='h-4 w-4 text-orange-500' />
          )}
        </button>
        
        {isExpanded && (
          <div className='p-4 bg-gray-800/20 border-t border-orange-500/20'>
            <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
              Measurement
            </label>
            {renderInput({
              id: 'ac_separation_measurement',
              type: 'text',
              placeholder: 'e.g., 5mm displacement'
            }, side)}
          </div>
        )}
      </div>
    )
  }

  // Dynamic degenerative changes conditional rendering
  const renderDegenerativeChangesConditional = (item, side) => {
    const subItems = item.conditional.sub_items
    const jointsItem = subItems.find(sub => sub.id === 'joints')
    const compartmentsItem = subItems.find(sub => sub.id === 'compartments')
    
    // Handle joints (for foot and shoulder)
    if (jointsItem) {
      const selectedJoints = formData[side]?.joints || []
      return (
        <div className='ml-6 mt-4 space-y-4 border-l-2 border-orange-500/30 pl-4'>
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
              {jointsItem.label}
            </label>
            {renderInput(jointsItem, side)}
          </div>
          
          {selectedJoints.length > 0 && (
            <div className='mt-4'>
              <h4 className={`text-sm font-medium ${theme.colors.text.primary} mb-3`}>
                Joint-specific assessments:
              </h4>
              {renderShoulderDegenerativeChangesSection(side, selectedJoints)}
            </div>
          )}
          
          {/* Always show mandatory questions when degenerative changes = Yes (for foot) */}
          {renderFootMandatoryDegenerativeQuestions(side)}
          
          {/* Render other sub-items that are not joints */}
          {subItems.map((subItem) => {
            if (!checkShowWhen(subItem, side)) return null
            
            const subValue = formData[side]?.[subItem.id]
            return (
              <div key={subItem.id}>
                <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
                  {subItem.label}
                </label>
                {renderInput({ ...subItem, id: subItem.id }, side)}
                {renderConditionalItems(subItem, side, subValue)}
              </div>
            )
          })}
        </div>
      )
    }
    
    // Handle compartments (for knee)
    if (compartmentsItem) {
      const selectedCompartments = formData[side]?.compartments || []
      return (
        <div className='ml-6 mt-4 space-y-4 border-l-2 border-orange-500/30 pl-4'>
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
              {compartmentsItem.label}
            </label>
            {renderInput(compartmentsItem, side)}
          </div>
          
          {selectedCompartments.length > 0 && (
            <div className='mt-4'>
              <h4 className={`text-sm font-medium ${theme.colors.text.primary} mb-3`}>
                Compartment-specific assessments:
              </h4>
              {renderDegenerativeChangesSection(side, selectedCompartments)}
            </div>
          )}
          
          {/* Render other sub-items that are not compartments */}
          {subItems.map((subItem) => {
            if (subItem.id === 'compartments' || !checkShowWhen(subItem, side)) return null
            
            const subValue = formData[side]?.[subItem.id]
            return (
              <div key={subItem.id}>
                <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
                  {subItem.label}
                </label>
                {renderInput({ ...subItem, id: subItem.id }, side)}
                {renderConditionalItems(subItem, side, subValue)}
              </div>
            )
          })}
        </div>
      )
    }
    
    // Default rendering for other degenerative changes sub-items (like hip)
    return (
      <div className='ml-6 mt-4 space-y-4 border-l-2 border-orange-500/30 pl-4'>
        {subItems.map((subItem) => {
          if (!checkShowWhen(subItem, side)) return null
          
          const subValue = formData[side]?.[subItem.id]
          return (
            <div key={subItem.id}>
              <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
                {subItem.label}
              </label>
              {renderInput({ ...subItem, id: subItem.id }, side)}
              {renderConditionalItems(subItem, side, subValue)}
            </div>
          )
        })}
      </div>
    )
  }

  // Dynamic fracture followup conditional rendering
  const renderFractureFollowupConditional = (item, side) => {
    const followupTypeItem = item.conditional.sub_items.find(sub => sub.id === 'followup_type')
    if (followupTypeItem) {
      const selectedFollowupType = formData[side]?.followup_type
      
      return (
        <div className='ml-6 mt-4 space-y-4 border-l-2 border-orange-500/30 pl-4'>
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
              {followupTypeItem.label}
            </label>
            {renderInput(followupTypeItem, side)}
          </div>
          
          {selectedFollowupType && (
            <div className='mt-4'>
              <h4 className={`text-sm font-medium ${theme.colors.text.primary} mb-3`}>
                Followup details:
              </h4>
              {renderFractureFollowupSection(side, selectedFollowupType)}
            </div>
          )}
        </div>
      )
    }
    return null
  }

  // Dynamic AC joint separation conditional rendering
  const renderAcSeparationConditional = (item, side) => {
    const gradeItem = item.conditional.sub_items.find(sub => sub.id === 'ac_separation_grade')
    if (gradeItem) {
      const selectedGrade = formData[side]?.ac_separation_grade
      
      return (
        <div className='ml-6 mt-4 space-y-4 border-l-2 border-orange-500/30 pl-4'>
          <div>
            <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
              {gradeItem.label}
            </label>
            {renderInput(gradeItem, side)}
          </div>
          
          {selectedGrade && (
            <div className='mt-4'>
              <h4 className={`text-sm font-medium ${theme.colors.text.primary} mb-3`}>
                Grade details:
              </h4>
              {renderAcSeparationSection(side, selectedGrade)}
            </div>
          )}
        </div>
      )
    }
    return null
  }

  const renderConditionalItems = (item, side, currentValue) => {
    if (!item.conditional || !currentValue) return null
    
    if (item.conditional.condition && currentValue === item.conditional.condition) {
      // Dynamic degenerative changes handling
      if (item.id === 'degenerative_changes') {
        return renderDegenerativeChangesConditional(item, side)
      }
      
      // Dynamic fracture followup handling
      if (item.id === 'fracture_followup') {
        return renderFractureFollowupConditional(item, side)
      }
      
      // Dynamic AC joint separation handling
      if (item.id === 'ac_joint_separation') {
        return renderAcSeparationConditional(item, side)
      }
      
      // Default conditional rendering for other items
      return (
        <div className='ml-6 mt-4 space-y-4 border-l-2 border-orange-500/30 pl-4'>
          {item.conditional.sub_items.map((subItem) => {
            // Skip items that don't meet show_when conditions
            if (!checkShowWhen(subItem, side)) {
              return null
            }
            
            const subValue = formData[side]?.[subItem.id]
            return (
              <div key={subItem.id}>
                <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
                  {subItem.label}
                </label>
                {renderInput({ ...subItem, id: subItem.id }, side)}
                {renderConditionalItems(subItem, side, subValue)}
              </div>
            )
          })}
        </div>
      )
    }

    // Handle conditional_any (for followup type - if any option is selected)
    if (item.conditional_any && currentValue) {
      return (
        <div className='ml-6 mt-4 space-y-4 border-l-2 border-orange-500/30 pl-4'>
          {item.conditional_any.sub_items.map((subItem) => {
            const subValue = formData[side]?.[subItem.id]
            return (
              <div key={subItem.id}>
                <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
                  {subItem.label}
                </label>
                {renderInput({ ...subItem, id: subItem.id }, side)}
              </div>
            )
          })}
        </div>
      )
    }

    return null
  }

  const renderSideChecklist = (side, sideLabel) => (
    <div className='space-y-6'>
      <h3 className={`text-xl font-bold ${theme.colors.text.accent} border-b border-orange-500/30 pb-2`}>
        {sideLabel} {studyData.study_type.toLowerCase()} Checklist Items:
      </h3>
      {studyData?.checklist_items?.map((item, index) => {
        const currentValue = formData[side]?.[item.id]
        return (
          <div key={item.id} className='medical-card'>
            <div className='space-y-4'>
              <label className={`block text-lg font-semibold ${theme.colors.text.primary}`}>
                {index + 1}. {item.label}
              </label>
              {renderInput(item, side)}
              {renderConditionalItems(item, side, currentValue, null)}
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className='space-y-8'>
      {/* Laterality Selection */}
      {studyData?.imaging_findings?.some(item => item.label === 'Laterality') && (
        <div className='medical-card'>
          <label className={`block text-lg font-semibold ${theme.colors.text.primary} mb-4`}>
            Laterality:
          </label>
          <div className='flex space-x-4'>
            {['Right', 'Left', 'Bilateral'].map((option) => {
              const isSelected = laterality === option
              return (
                <button
                  key={option}
                  type='button'
                  onClick={() => handleLateralityChange(option)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? `${theme.colors.button.primary} border-transparent shadow-lg`
                      : `${theme.colors.surface} ${theme.colors.border} hover:border-orange-500/50`
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-white bg-white/20'
                      : 'border-gray-500'
                  }`}>
                    {isSelected && <div className='w-2 h-2 rounded-full bg-white' />}
                  </div>
                  <span className={`font-medium ${
                    isSelected ? 'text-white' : theme.colors.text.primary
                  }`}>
                    {option}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Spine Region Selection */}
      {studyData?.imaging_findings?.some(item => item.label === 'Spine Region') && (
        <div className='medical-card'>
          <label className={`block text-lg font-semibold ${theme.colors.text.primary} mb-4`}>
            Spine Region:
          </label>
          <div className='flex space-x-4'>
            {studyData?.imaging_findings?.find(item => item.label === 'Spine Region')?.options?.map((option) => {
              const isSelected = spineRegion === option
              return (
                <button
                  key={option}
                  type='button'
                  onClick={() => handleSpineRegionChange(option)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? `${theme.colors.button.primary} border-transparent shadow-lg`
                      : `${theme.colors.surface} ${theme.colors.border} hover:border-orange-500/50`
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    isSelected
                      ? 'border-white bg-white/20'
                      : 'border-gray-500'
                  }`}>
                    {isSelected && <div className='w-2 h-2 rounded-full bg-white' />}
                  </div>
                  <span className={`font-medium ${
                    isSelected ? 'text-white' : theme.colors.text.primary
                  }`}>
                    {option}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Checklist Items */}
      {studyData?.imaging_findings?.some(item => item.label === 'Laterality') && laterality === 'Bilateral' ? (
        <div className='space-y-12'>
          {renderSideChecklist('right', 'Right')}
          {renderSideChecklist('left', 'Left')}
        </div>
      ) : studyData?.imaging_findings?.some(item => item.label === 'Laterality') ? (
        renderSideChecklist(laterality.toLowerCase(), laterality)
      ) : studyData?.imaging_findings?.some(item => item.label === 'Spine Region') ? (
        renderSideChecklist(spineRegion.toLowerCase(), spineRegion)
      ) : null}
    </div>
  )
}

export default ChecklistForm
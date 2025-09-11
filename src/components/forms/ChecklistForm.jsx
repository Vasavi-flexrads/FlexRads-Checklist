import { useState, useEffect, useCallback } from 'react'
import { useTheme } from '../../contexts/ThemeContext'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'

const ChecklistForm = ({ studyData, onSelectionChange, selectedFindings }) => {
  const { theme } = useTheme()
  const [laterality, setLaterality] = useState('Right')
  const [formData, setFormData] = useState({})
  const [expandedSections, setExpandedSections] = useState({})

  // Early return if no study data or checklist items available
  if (!studyData || !studyData.checklist_items || studyData.checklist_items.length === 0) {
    return (
      <div className='medical-card'>
        <p className={`${theme.colors.text.secondary} text-center`}>
          Checklist data is not available for this study yet.
        </p>
      </div>
    )
  }

  useEffect(() => {
    // Initialize form data based on laterality
    if (studyData?.has_laterality) {
      const initialData = {}
      if (laterality === 'Bilateral') {
        initialData.right = {}
        initialData.left = {}
      } else {
        initialData[laterality.toLowerCase()] = {}
      }
      setFormData(initialData)
    }
  }, [laterality, studyData])

  // Separate useEffect to handle parent component updates
  useEffect(() => {
    onSelectionChange('laterality', laterality)
    onSelectionChange('formData', formData)
  }, [laterality, formData, onSelectionChange])

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
    // onSelectionChange calls are now handled in useEffect
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

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }))
  }

  const renderDegenerativeChangesSection = (side, compartments) => {
    if (!compartments || compartments.length === 0) return null

    return (
      <div className='space-y-4'>
        {compartments.map((compartment) => {
          const sectionKey = `${side}_${compartment.toLowerCase()}`
          const isExpanded = expandedSections[sectionKey]
          const severity = formData[side]?.[`${compartment.toLowerCase()}_severity`]
          const osteophytes = formData[side]?.[`${compartment.toLowerCase()}_osteophytes`]
          const hasValues = severity || osteophytes

          return (
            <div key={compartment} className='border border-orange-500/20 rounded-lg overflow-hidden'>
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
                    {compartment} Compartment
                  </h4>
                  {hasValues && (
                    <div className='text-sm text-orange-400 mt-1'>
                      {severity && `Severity: ${severity}`}
                      {severity && osteophytes && ' • '}
                      {osteophytes && `Osteophytes: ${osteophytes}`}
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
                <div className='p-4 bg-gray-800/20 border-t border-orange-500/20 space-y-4'>
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
                      Severity
                    </label>
                    {renderInput({
                      id: `${compartment.toLowerCase()}_severity`,
                      type: 'radio',
                      options: ['Mild', 'Moderate', 'Severe']
                    }, side)}
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
                      Osteophytes
                    </label>
                    {renderInput({
                      id: `${compartment.toLowerCase()}_osteophytes`,
                      type: 'radio',
                      options: ['Present', 'Absent']
                    }, side)}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  const renderFractureFollowupSection = (side, followupType) => {
    if (!followupType) return null

    const sectionKey = `${side}_fracture_followup`
    const isExpanded = expandedSections[sectionKey]
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
              placeholder: 'e.g., Proximal tibia'
            }, side)}
          </div>
        )}
      </div>
    )
  }

  const renderConditionalItems = (item, side, currentValue, parentItem = null) => {
    if (!item.conditional || !currentValue) return null

    // Handle regular conditional logic (parent → child)
    if (item.conditional.condition && currentValue === item.conditional.condition) {
      // Special handling for degenerative changes
      if (item.id === 'degenerative_changes') {
        const compartmentsItem = item.conditional.sub_items.find(subItem => subItem.id === 'compartments')
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
                    Followup assessments:
                  </h4>
                  {renderDegenerativeChangesSection(side, selectedCompartments)}
                </div>
              )}
            </div>
          )
        }
      }
      
      // Special handling for fracture followup
      if (item.id === 'fracture_followup') {
        const followupTypeItem = item.conditional.sub_items.find(subItem => subItem.id === 'followup_type')
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
      }
      
      // Default conditional rendering for other items
      return (
        <div className='ml-6 mt-4 space-y-4 border-l-2 border-orange-500/30 pl-4'>
          {item.conditional.sub_items.map((subItem) => {
            const subValue = formData[side]?.[subItem.id]
            
            // Skip compartment-specific items for degenerative changes (handled above)
            if (item.id === 'degenerative_changes' && (subItem.id === 'compartments' || subItem.show_when)) {
              return null
            }
            
            // Skip followup-specific items for fracture followup (handled above)
            if (item.id === 'fracture_followup' && (subItem.id === 'followup_type' || subItem.conditional_any)) {
              return null
            }
            
            return (
              <div key={subItem.id}>
                <label className={`block text-sm font-medium ${theme.colors.text.primary} mb-2`}>
                  {subItem.label}
                </label>
                {renderInput({ ...subItem, id: subItem.id }, side)}
                {renderConditionalItems(subItem, side, subValue, item)}
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
        {sideLabel} Knee Checklist Items:
      </h3>
      {studyData.checklist_items.map((item, index) => {
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
      {studyData.has_laterality && (
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

      {/* Checklist Items */}
      {laterality === 'Bilateral' ? (
        <div className='space-y-12'>
          {renderSideChecklist('right', 'Right')}
          {renderSideChecklist('left', 'Left')}
        </div>
      ) : (
        renderSideChecklist(laterality.toLowerCase(), laterality)
      )}
    </div>
  )
}

export default ChecklistForm
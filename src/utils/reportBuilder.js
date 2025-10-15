import reportConfig from '../data/reportConfig.json'

const configMap = new Map(
  (reportConfig.studies || []).map((study) => [study.study_type.toUpperCase(), study])
)

const sanitizeKey = (value) => {
  if (!value || typeof value !== 'string') return ''
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '')
}

const getPathValue = (obj, path) => {
  if (!path || !obj) return undefined
  const segments = path.split('.')
  let current = obj
  for (const segment of segments) {
    if (current == null) return undefined
    current = current[segment]
  }
  return current
}

const getFieldValue = (field, data, context) => {
  if (!field) return undefined
  const ctxValue = getPathValue(context, field)
  if (ctxValue !== undefined) return ctxValue
  return getPathValue(data, field)
}

const stringFilters = {
  lower: (value) => (typeof value === 'string' ? value.toLowerCase() : value),
  upper: (value) => (typeof value === 'string' ? value.toUpperCase() : value),
  capitalize: (value) => {
    if (typeof value !== 'string' || value.length === 0) return value
    return value.charAt(0).toUpperCase() + value.slice(1)
  },
  title: (value) => {
    if (typeof value !== 'string') return value
    return value
      .split(' ')
      .filter(Boolean)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  },
  trim: (value) => (typeof value === 'string' ? value.trim() : value)
}

const applyFilter = (value, filterExpression) => {
  const filter = filterExpression.trim()
  if (!filter) return value

  const fnName = filter.replace(/\(.*\)$/, '')
  const argsMatch = filter.match(/\((.*)\)$/)
  let args = []
  if (argsMatch) {
    const raw = argsMatch[1].trim()
    if (raw) {
      const isQuoted = (raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))
      if (isQuoted) {
        args = [raw.slice(1, -1)]
      } else {
        args = raw.split(',').map((a) => a.trim())
      }
    }
  }

  switch (fnName) {
    case 'lower':
    case 'upper':
    case 'capitalize':
    case 'title':
    case 'trim':
      return stringFilters[fnName](value)
    case 'default':
      return value == null || value === '' ? args[0] ?? '' : value
    case 'suffix':
      return value == null || value === '' ? '' : `${value}${args[0] ?? ''}`
    case 'prefix':
      return value == null || value === '' ? '' : `${args[0] ?? ''}${value}`
    case 'join':
      return Array.isArray(value) ? value.join(args[0] ?? ', ') : value
    default:
      return value
  }
}

const renderTemplate = (template, data, context) => {
  if (!template || typeof template !== 'string') return ''
  return template.replace(/{{\s*([^}]+)\s*}}/g, (_, expression) => {
    const parts = expression.split('|').map((part) => part.trim()).filter(Boolean)
    if (parts.length === 0) return ''

    const field = parts[0]
    let value = getFieldValue(field, data, context)

    for (let i = 1; i < parts.length; i += 1) {
      value = applyFilter(value, parts[i])
    }

    if (value == null) return ''
    return String(value)
  })
}

const evaluateCondition = (condition, data, context) => {
  if (!condition) return true

  if (condition.all) {
    return condition.all.every((child) => evaluateCondition(child, data, context))
  }

  if (condition.any) {
    return condition.any.some((child) => evaluateCondition(child, data, context))
  }

  const { field, operator = 'equals' } = condition
  const value = getFieldValue(field, data, context)
  const expected = condition.value

  switch (operator) {
    case 'equals':
      return value === expected
    case 'notEquals':
      return value !== expected
    case 'in':
      return Array.isArray(expected) ? expected.includes(value) : false
    case 'notIn':
      return Array.isArray(expected) ? !expected.includes(value) : true
    case 'exists':
      if (Array.isArray(value)) return value.length > 0
      return value !== null && value !== undefined && value !== ''
    case 'notExists':
      if (Array.isArray(value)) return value.length === 0
      return value === null || value === undefined || value === ''
    case 'includes':
      return Array.isArray(value) ? value.includes(expected) : false
    case 'lengthGreaterThan':
      if (!Array.isArray(value)) return false
      return value.length > (typeof expected === 'number' ? expected : 0)
    case 'truthy':
      return !!value
    case 'falsy':
      return !value
    default:
      return false
  }
}

const evaluateConditions = (conditions = [], data, context) => {
  if (!conditions || conditions.length === 0) return true
  return conditions.every((condition) => evaluateCondition(condition, data, context))
}

const resolveContextEntry = (entry, option, optionKey, data, context) => {
  if (!entry || !entry.alias) return {}

  let value

  if (entry.field) {
    value = getFieldValue(entry.field, data, context)
  } else if (entry.fieldTemplate) {
    const fieldName = renderTemplate(entry.fieldTemplate, {
      option,
      optionKey
    }, {})
    value = getFieldValue(fieldName, data, context)
  } else if (entry.optionMap) {
    const fieldName = entry.optionMap[option]
    if (fieldName) {
      value = getFieldValue(fieldName, data, context)
    }
  } else if (entry.value !== undefined) {
    value = entry.value
  }

  if (entry.transform && typeof value === 'string') {
    const transformer = stringFilters[entry.transform]
    if (transformer) {
      value = transformer(value)
    }
  }

  return { [entry.alias]: value }
}

const ensureArray = (value) => {
  if (value == null) return []
  return Array.isArray(value) ? value : [value]
}

const renderCaseSpec = (spec, data, context) => {
  for (const item of spec.cases || []) {
    if (item.default || evaluateConditions(item.conditions, data, context)) {
      return renderOutputSpec(item.output, data, context)
    }
  }
  return []
}

const renderListSpec = (spec, data, context) => {
  const rawList = getFieldValue(spec.field, data, context)
  const values = Array.isArray(rawList) ? rawList : []

  if (values.length === 0) {
    if (spec.whenEmpty) {
      return renderOutputSpec(spec.whenEmpty, data, context)
    }
    return []
  }

  const results = []

  values.forEach((option, index) => {
    const optionKey = sanitizeKey(option)
    let itemContext = {
      ...context,
      option,
      optionKey,
      index
    }

    if (Array.isArray(spec.itemContext)) {
      spec.itemContext.forEach((entry) => {
        itemContext = {
          ...itemContext,
          ...resolveContextEntry(entry, option, optionKey, data, context)
        }
      })
    }

    if (!evaluateConditions(spec.itemConditions, data, itemContext)) {
      return
    }

    const output = renderOutputSpec(spec.item, data, itemContext)
    if (Array.isArray(output)) {
      const text = output.join(' ').trim()
      if (text) {
        results.push(text)
      }
    } else if (output) {
      const text = String(output).trim()
      if (text) {
        results.push(text)
      }
    }
  })

  if (results.length === 0) {
    if (spec.whenEmpty) {
      return renderOutputSpec(spec.whenEmpty, data, context)
    }
    return []
  }

  if (spec.mode === 'separate') {
    return results
  }

  const delimiter = spec.delimiter !== undefined ? spec.delimiter : ', '
  return [results.join(delimiter)]
}

const renderCompoundSpec = (spec, data, context) => {
  const parts = []
  for (const part of spec.parts || []) {
    const rendered = renderOutputSpec(part, data, context)
    if (Array.isArray(rendered)) {
      const text = rendered.join(' ')
      if (text.trim()) parts.push(text)
    } else if (rendered) {
      if (String(rendered).trim()) parts.push(String(rendered))
    }
  }

  const delimiter = spec.delimiter !== undefined ? spec.delimiter : ' '
  if (parts.length === 0) return []
  return [parts.join(delimiter)]
}

const renderOutputSpec = (spec, data, context) => {
  if (spec == null) return []

  if (typeof spec === 'string') {
    return [renderTemplate(spec, data, context)]
  }

  if (typeof spec !== 'object') return []

  switch (spec.type) {
    case 'text':
    case 'template':
      return [renderTemplate(spec.template, data, context)]
    case 'compound':
      return renderCompoundSpec(spec, data, context)
    case 'list':
      return renderListSpec(spec, data, context)
    case 'case':
      return renderCaseSpec(spec, data, context)
    default:
      return []
  }
}

const evaluateRule = (rule, data, context) => {
  if (!evaluateConditions(rule.conditions, data, context)) return []
  return renderOutputSpec(rule.output, data, context)
}

export const buildFindingsForSide = (studyType, sideData, globalContext = {}) => {
  const studyRules = configMap.get(studyType.toUpperCase())
  if (!studyRules || !Array.isArray(studyRules.items)) return []

  const findings = []

  for (const item of studyRules.items) {
    const data = { ...(sideData || {}) }
    if (item.context) {
      Object.entries(item.context).forEach(([key, value]) => {
        data[key] = getFieldValue(value, sideData, globalContext)
      })
    }

    const rules = ensureArray(item.rules).filter(Boolean)
    for (const rule of rules) {
      const outputs = evaluateRule(rule, data, { ...globalContext, itemId: item.id })
      if (outputs.length > 0) {
        outputs.forEach((output) => {
          const trimmed = output?.trim()
          if (trimmed) {
            findings.push(trimmed)
          }
        })
        if (rule.stop) {
          break
        }
      }
    }
  }

  return findings
}

export const getStudyReportConfig = (studyType) => configMap.get(studyType.toUpperCase())

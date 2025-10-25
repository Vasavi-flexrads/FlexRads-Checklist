import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { ArrowLeft, ChevronRight } from 'lucide-react'

const XrayStudySelection = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const studies = [
    {
      id: 'knee',
      name: 'Knee',
      icon: '🦵',
    },
    {
      id: 'shoulder',
      name: 'Shoulder',
      icon: '💪',
    },
    {
      id: 'hip',
      name: 'Hip',
      icon: '🦴',
    },
    {
      id: 'foot',
      name: 'Foot',
      icon: '🦶',
    },
    {
      id: 'spine',
      name: 'Spine',
      icon: '🦴',
    },
    {
      id: 'hand',
      name: 'Hand',
      icon: '✋',
    },
  ]

  const handleStudySelect = (studyId) => {
    navigate(`/checklist/${studyId}`)
  }

  return (
    <div className={`min-h-screen`}>
      {/* Header */}
      <header className={`${theme.colors.surface} shadow-lg border-b ${theme.colors.border}`}>
        <div className={`max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8`}>
          <div className={`flex justify-between items-center py-2`}>
            <div className={`flex items-center space-x-4`}>
              <button
                onClick={() => navigate('/dashboard')}
                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors`}
              >
                <ArrowLeft className={`h-6 w-6 ${theme.colors.text.primary}`} />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${theme.colors.text.primary}`}>
                  X-Ray Studies
                </h1>
                <p className={`text-sm ${theme.colors.text.secondary}`}>
                  Select the specific X-ray study type
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={`max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12`}>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6`}>
          {studies.map((study) => (
            <div
              key={study.id}
              className={`medical-card cursor-pointer hover:scale-105 fade-in`}
              onClick={() => handleStudySelect(study.id)}
            >
              <div className={`text-center`}>
                <div className={`text-4xl mb-3`}>{study.icon}</div>
                <h3 className={`text-lg font-semibold ${theme.colors.text.primary} mb-4`}>
                  {study.name}
                </h3>
                <div className={`flex items-center justify-center text-blue-600`}>
                  <span className={`text-sm font-medium`}>Start Report</span>
                  <ChevronRight className={`h-4 w-4 ml-1`} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default XrayStudySelection
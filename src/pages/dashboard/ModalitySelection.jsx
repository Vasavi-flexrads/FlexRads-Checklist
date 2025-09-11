import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { LogOut } from 'lucide-react'

const ModalitySelection = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const { signOut } = useAuth()

  const handleModalitySelect = (modality) => {
    if (modality === 'xray') {
      navigate('/xray')
    }
    // Other modalities are disabled for now
  }

  const handleSignOut = async () => {
    await signOut()
  }

  const modalities = [
    {
      id: 'xray',
      name: 'X-Ray',
      icon: '🦴',
      enabled: true,
    },
    {
      id: 'ct',
      name: 'CT Scan',
      icon: '🔄',
      enabled: false,
    },
    {
      id: 'mri',
      name: 'MRI',
      icon: '🧲',
      enabled: false,
    },
  ]

  return (
    <div className='min-h-screen'>
      {/* Header */}
      <header className={`${theme.colors.surface} shadow-lg`}>
        <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center py-6'>
            <div className='flex items-center space-x-4'>
              <div>
                <h1 className={`text-2xl font-bold ${theme.colors.text.primary}`}>
                  FlexRads Checklist
                </h1>
                <p className={`text-sm ${theme.colors.text.secondary}`}>
                  Select an imaging modality to begin
                </p>
              </div>
            </div>
            
            <div className='flex items-center'>
              <button
                onClick={handleSignOut}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${theme.colors.button.secondary} transition-all duration-200`}
              >
                <LogOut className='h-4 w-4' />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='text-center mb-12'>
          <h2 className={`text-3xl font-bold ${theme.colors.text.primary} mb-4`}>
            Choose Imaging Modality
          </h2>
          <p className={`text-lg ${theme.colors.text.secondary}`}>
            Select the type of imaging study you want to create a report for
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {modalities.map((modality) => (
            <div
              key={modality.id}
              className={`medical-card relative overflow-hidden ${
                modality.enabled ? 'cursor-pointer hover:scale-105 hover:glow-orange' : 'opacity-50 cursor-not-allowed'
              } fade-in`}
              onClick={() => modality.enabled && handleModalitySelect(modality.id)}
            >
              {!modality.enabled && (
                <div className='absolute top-4 right-4 bg-yellow-900/20 border border-yellow-500/30 text-yellow-400 px-2 py-1 rounded-full text-xs font-medium'>
                  Coming Soon
                </div>
              )}
              
              <div className='text-center'>
                <div className='text-6xl mb-4'>{modality.icon}</div>
                <h3 className={`text-xl font-semibold ${theme.colors.text.primary} mb-2`}>
                  {modality.name}
                </h3>
              </div>
              
              {modality.enabled && (
                <div className={`mt-6 w-full py-2 px-4 rounded-lg text-center font-medium ${theme.colors.button.primary}`}>
                  Select {modality.name}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default ModalitySelection
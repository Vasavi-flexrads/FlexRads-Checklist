import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import { Eye, EyeOff, LogIn } from 'lucide-react'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()
  const { theme } = useTheme()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div className='text-center'>
          <h2 className={`text-3xl font-extrabold ${theme.colors.text.primary}`}>
            FlexRads Checklist
          </h2>
        </div>
        
        <div className={`${theme.colors.surface} rounded-xl shadow-2xl p-8`}>
          <form className='space-y-6' onSubmit={handleSubmit}>
            {error && (
              <div className='bg-red-900/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg'>
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor='email' className={`block text-sm font-medium ${theme.colors.text.primary}`}>
                Email Address
              </label>
              <input
                id='email'
                name='email'
                type='email'
                autoComplete='email'
                required
                className={`medical-input mt-1 ${theme.colors.surface} ${theme.colors.text.primary} border-gray-600 focus:border-gray-500 focus:ring-gray-500`}
                placeholder='Enter your email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor='password' className={`block text-sm font-medium ${theme.colors.text.primary}`}>
                Password
              </label>
              <div className='relative mt-1'>
                <input
                  id='password'
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  required
                  className={`medical-input pr-12 ${theme.colors.surface} ${theme.colors.text.primary} border-gray-600 focus:border-gray-500 focus:ring-gray-500`}
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type='button'
                  className='absolute inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-5 w-5 text-gray-400' />
                  ) : (
                    <Eye className='h-5 w-5 text-gray-400' />
                  )}
                </button>
              </div>
            </div>
            
            <div>
              <button
                type='submit'
                disabled={loading}
                className={`group relative w-full flex justify-center py-3 px-4 ${theme.colors.button.primary} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 rounded-lg font-medium shadow-lg`}
              >
                <span className='absolute left-0 inset-y-0 flex items-center pl-3'>
                  <LogIn className='h-5 w-5' aria-hidden='true' />
                </span>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
            
            
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
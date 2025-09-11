import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({})

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

const theme = {
  name: 'flexrads',
  colors: {
    primary: 'bg-gradient-to-r from-orange-500 to-red-500',
    secondary: 'bg-gradient-to-r from-orange-400 to-orange-600',
    accent: 'bg-orange-500',
    background: 'bg-gradient-to-br from-gray-900 to-stone-900',
    surface: 'bg-gray-800/90 backdrop-blur-sm border border-gray-700/50',
    text: {
      primary: 'text-gray-100',
      secondary: 'text-gray-300',
      inverse: 'text-gray-900',
      accent: 'text-orange-400',
    },
    border: 'border-gray-700',
    hover: 'hover:from-orange-600 hover:to-red-600',
    button: {
      primary: 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white',
      secondary: 'bg-gray-700 hover:bg-gray-600 text-gray-100',
    }
  }
}

export const ThemeProvider = ({ children }) => {
  const value = {
    theme,
  }

  return (
    <ThemeContext.Provider value={value}>
      <div className='min-h-screen transition-all duration-300 bg-gradient-to-br from-gray-900 via-stone-900 to-gray-900'>
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
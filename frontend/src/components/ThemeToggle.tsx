import React from 'react'
import { IconButton, Tooltip, useTheme as useMuiTheme } from '@mui/material'
import { LightMode, DarkMode } from '@mui/icons-material'
import { useTheme } from '../contexts/ThemeContext'

const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme()
  const muiTheme = useMuiTheme()

  return (
    <Tooltip title={mode === 'light' ? 'Koyu temaya geç' : 'Galaxy temasına geç'} arrow>
      <IconButton
        onClick={toggleTheme}
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          color: mode === 'light' ? muiTheme.palette.text.primary : '#ffffff',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'rgba(255, 255, 255, 0.2)',
            transform: 'scale(1.1) rotate(180deg)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
          },
        }}
        size="large"
      >
        {mode === 'light' ? (
          <DarkMode sx={{ fontSize: 24 }} />
        ) : (
          <LightMode sx={{ fontSize: 24 }} />
        )}
      </IconButton>
    </Tooltip>
  )
}

export default ThemeToggle

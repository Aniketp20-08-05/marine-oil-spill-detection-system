import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useThemeMode } from '../context/ThemeContext'
import React from 'react'

const TestComponent = () => {
  const { theme, toggleTheme } = useThemeMode()
  return (
    <div>
      <span data-testid="theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  )
}

describe('ThemeContext', () => {
  it('should toggle theme from dark to light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )
    
    const themeText = screen.getByTestId('theme')
    const button = screen.getByText('Toggle')
    
    expect(themeText.textContent).toBe('dark')
    
    fireEvent.click(button)
    expect(themeText.textContent).toBe('light')
    
    fireEvent.click(button)
    expect(themeText.textContent).toBe('dark')
  })
})

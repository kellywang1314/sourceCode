import React, { createContext, useContext, useMemo, useState } from 'react'

export type ThemeName = 'light' | 'dark'

export interface ThemeContextValue {
    themeName: ThemeName
    toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue>()

/**
 * ThemeProvider
 * 提供主题上下文，允许子组件读取并切换主题
 * @param {{ children: React.ReactNode }} props 组件子节点
 * @returns {JSX.Element} 上下文提供者组件
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeName, setThemeName] = useState<ThemeName>('light')

    const toggleTheme = () => {
        setThemeName(t => (t === 'light' ? 'dark' : 'light'))
    }

    const value = useMemo<ThemeContextValue>(() => ({ themeName, toggleTheme }), [themeName])
    return <ThemeContext.Provider value={ value }> { children } </ThemeContext.Provider>
}

/**
 * useTheme
 * 读取主题上下文，返回当前主题名与切换函数
 * @returns {ThemeContextValue} 主题上下文值
 */
export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext)
    if (!ctx) throw new Error('useTheme 必须在 ThemeProvider 内使用')
    return ctx
}

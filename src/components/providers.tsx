'use client'

import { TamaguiProvider, TamaguiProviderProps } from 'tamagui'
import { useServerInsertedHTML } from 'next/navigation'
import { NextThemeProvider, useRootTheme } from '@tamagui/next-theme'
import tamaguiConfig from '../../tamagui.config'

export function Providers({ children, ...props }: TamaguiProviderProps) {
  const [theme, setTheme] = useRootTheme()

  useServerInsertedHTML(() => {
    return <style dangerouslySetInnerHTML={{ __html: tamaguiConfig.getCSS() }} />
  })

  return (
    <NextThemeProvider
      onChangeTheme={(next) => {
        setTheme(next as any)
      }}
    >
      <TamaguiProvider
        config={tamaguiConfig}
        disableInjectCSS
        defaultTheme={theme}
        {...props}
      >
        {children}
      </TamaguiProvider>
    </NextThemeProvider>
  )
}

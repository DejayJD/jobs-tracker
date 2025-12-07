import type { NextConfig } from "next";
import { withTamagui } from '@tamagui/next-plugin'

const nextConfig: NextConfig = {
  transpilePackages: ['tamagui', '@tamagui/config'],
};

export default withTamagui(nextConfig, {
  config: './tamagui.config.ts',
  components: ['tamagui'],
})

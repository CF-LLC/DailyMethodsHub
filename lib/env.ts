export interface EnvConfig {
  appName: string
  appUrl: string
}

export const env: EnvConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Daily Methods Hub',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}

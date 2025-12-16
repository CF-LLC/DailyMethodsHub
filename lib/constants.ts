export const APP_NAME = 'Daily Methods Hub'
export const APP_DESCRIPTION = 'Discover and manage daily earning methods'

export const CATEGORIES = [
  'Survey',
  'Cashback',
  'Task',
  'Referral',
  'Investment',
  'Other',
] as const

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  METHODS: '/methods',
  SETTINGS: '/settings',
} as const

export const API_ENDPOINTS = {
  METHODS: '/api/methods',
} as const

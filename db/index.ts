import { Method, CreateMethodInput, UpdateMethodInput } from '@/types'
import { generateId } from '@/lib/utils'

// In-memory storage (replace with actual database in production)
let methods: Method[] = [
  {
    id: '1',
    user_id: 'system',
    title: 'Complete Daily Surveys',
    description: 'Earn money by completing quick surveys from verified partners. Most surveys take 5-10 minutes.',
    category: 'Survey',
    earnings: '$5-$15',
    difficulty: 'Easy',
    time_required: '10-15 min',
    link: null,
    referral_code: null,
    icon_url: null,
    is_active: true,
    is_public: false,
    created_at: new Date('2024-01-01').toISOString(),
    updated_at: new Date('2024-01-01').toISOString(),
  },
  {
    id: '2',
    user_id: 'system',
    title: 'Cashback Shopping',
    description: 'Get cashback on your everyday purchases through our partner retailers. Stack with existing deals!',
    category: 'Cashback',
    earnings: '2-10%',
    difficulty: 'Easy',
    time_required: '5 min',
    link: null,
    referral_code: null,
    icon_url: null,
    is_active: true,
    is_public: false,
    created_at: new Date('2024-01-02').toISOString(),
    updated_at: new Date('2024-01-02').toISOString(),
  },
  {
    id: '3',
    user_id: 'system',
    title: 'Freelance Micro Tasks',
    description: 'Complete small tasks like data entry, categorization, and content moderation for quick earnings.',
    category: 'Task',
    earnings: '$10-$30',
    difficulty: 'Medium',
    time_required: '30-60 min',
    link: null,
    referral_code: null,
    icon_url: null,
    is_active: true,
    is_public: false,
    created_at: new Date('2024-01-03').toISOString(),
    updated_at: new Date('2024-01-03').toISOString(),
  },
  {
    id: '4',
    user_id: 'system',
    title: 'Referral Program',
    description: 'Invite friends and earn a percentage of their earnings. Build passive income through referrals.',
    category: 'Referral',
    earnings: '$20-$50',
    difficulty: 'Easy',
    time_required: '15 min',
    link: null,
    referral_code: null,
    icon_url: null,
    is_active: true,
    is_public: false,
    created_at: new Date('2024-01-04').toISOString(),
    updated_at: new Date('2024-01-04').toISOString(),
  },
]

export const db = {
  methods: {
    async getAll(): Promise<Method[]> {
      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100))
      return [...methods].sort((a, b) => 
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
    },

    async getById(id: string): Promise<Method | null> {
      await new Promise((resolve) => setTimeout(resolve, 50))
      return methods.find((m) => m.id === id) || null
    },

    async create(input: CreateMethodInput): Promise<Method> {
      await new Promise((resolve) => setTimeout(resolve, 100))
      const newMethod: Method = {
        id: generateId(),
        user_id: 'system',
        title: input.title,
        description: input.description,
        category: input.category,
        earnings: input.earnings,
        difficulty: input.difficulty,
        time_required: input.timeRequired || '',
        link: input.link || null,
        referral_code: null,
        icon_url: input.iconUrl || null,
        is_active: input.isActive ?? true,
        is_public: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      methods.push(newMethod)
      return newMethod
    },

    async update(input: UpdateMethodInput): Promise<Method | null> {
      await new Promise((resolve) => setTimeout(resolve, 100))
      const index = methods.findIndex((m) => m.id === input.id)
      if (index === -1) return null

      const existingMethod = methods[index]
      const updated: Method = {
        ...existingMethod,
        title: input.title ?? existingMethod.title,
        description: input.description ?? existingMethod.description,
        category: input.category ?? existingMethod.category,
        earnings: input.earnings ?? existingMethod.earnings,
        difficulty: input.difficulty ?? existingMethod.difficulty,
        time_required: input.timeRequired ?? existingMethod.time_required,
        link: input.link !== undefined ? input.link : existingMethod.link,
        icon_url: input.iconUrl !== undefined ? input.iconUrl : existingMethod.icon_url,
        is_active: input.isActive ?? existingMethod.is_active,
        updated_at: new Date().toISOString(),
      }
      methods[index] = updated
      return updated
    },

    async delete(id: string): Promise<boolean> {
      await new Promise((resolve) => setTimeout(resolve, 100))
      const index = methods.findIndex((m) => m.id === id)
      if (index === -1) return false

      methods.splice(index, 1)
      return true
    },

    async getByCategory(category: string): Promise<Method[]> {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return methods.filter((m) => m.category === category && m.is_active)
    },

    async getActive(): Promise<Method[]> {
      await new Promise((resolve) => setTimeout(resolve, 100))
      return methods.filter((m) => m.is_active)
    },
  },
}

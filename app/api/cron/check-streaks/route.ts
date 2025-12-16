import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { checkStreakStatus } from '@/app/actions/streaks'
import { createNotification } from '@/app/actions/notifications'

// Use service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SECRET_DEFAULT_KEY!
)

export async function GET(request: NextRequest) {
  try {
    // Verify the cron secret for security
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all users
    const { data: users, error: usersError } = await supabaseAdmin.auth.admin.listUsers()

    if (usersError) {
      console.error('Failed to fetch users:', usersError)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    const results = {
      checked: 0,
      notified: 0,
      errors: [] as string[],
    }

    // Check streak status for each user
    for (const user of users.users) {
      try {
        results.checked++

        // Check if user needs a reminder
        const { data: streakStatus } = await checkStreakStatus()
        
        if (streakStatus?.needsReminder && streakStatus.daysMissed > 0) {
          // Create a notification for the user
          const title = streakStatus.daysMissed === 1
            ? 'Don\'t break the chain!'
            : `${streakStatus.daysMissed} days since your last entry`

          const message = streakStatus.daysMissed === 1
            ? 'You haven\'t logged any earnings today. Keep your streak alive!'
            : `It's been ${streakStatus.daysMissed} days since your last earnings entry. Log your earnings to restart your streak!`

          const notificationResult = await createNotification(
            user.id,
            title,
            message,
            'warning'
          )

          if (notificationResult.success) {
            results.notified++
          } else {
            results.errors.push(`Failed to notify user ${user.id}: ${notificationResult.error}`)
          }
        }
      } catch (error) {
        results.errors.push(`Error processing user ${user.id}: ${error}`)
      }
    }

    console.log('Streak check completed:', results)

    return NextResponse.json({
      success: true,
      message: 'Streak check completed',
      results,
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/methods - List all methods
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const isActive = searchParams.get('isActive')

    let query = supabase
      .from('methods')
      .select('*')
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty as 'Easy' | 'Medium' | 'Hard')
    }

    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true')
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

// POST /api/methods - Create a new method (admin only)
export async function POST(request: NextRequest) {
  try {
    // Require admin access
    await requireAdmin()

    const supabase = await createClient()
    const body = await request.json()

    const { data, error } = await (supabase
      .from('methods') as any)
      .insert({
        title: body.title,
        description: body.description,
        category: body.category,
        earnings: body.earnings,
        difficulty: body.difficulty,
        time_required: body.timeRequired || body.time_required,
        link: body.link || null,
        icon_url: body.iconUrl || body.icon_url || null,
        is_active: body.isActive ?? body.is_active ?? true,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        data,
        message: 'Method created successfully',
      },
      { status: 201 }
    )
  } catch (error: any) {
    if (error.message === 'Unauthorized') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
    if (error.message.includes('Forbidden')) {
      return NextResponse.json(
        { success: false, error: 'Admin access required' },
        { status: 403 }
      )
    }
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle2, Clock, ExternalLink, Timer, TrendingUp, Zap } from 'lucide-react'
import { completeTask } from '@/app/actions/tasks'
import { useRouter } from 'next/navigation'

interface Task {
  id: string
  title: string
  description: string
  category: string
  earnings: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  time_required: string
  link: string | null
  isAvailable: boolean
  nextAvailable: Date | null
  timeUntilAvailable: number
  earningsValue: number
  lastCompleted: Date | null
}

interface AvailableTasksProps {
  tasks: Task[]
}

function formatTimeRemaining(ms: number): string {
  const minutes = Math.floor(ms / 60000)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m`
  return 'Now'
}

export function AvailableTasks({ tasks }: AvailableTasksProps) {
  const router = useRouter()
  const [completing, setCompleting] = useState<string | null>(null)

  const availableTasks = tasks.filter(t => t.isAvailable)
  const upcomingTasks = tasks.filter(t => !t.isAvailable).slice(0, 3)

  const handleComplete = async (taskId: string, link: string | null) => {
    setCompleting(taskId)
    
    // Open link if it exists
    if (link) {
      window.open(link, '_blank')
    }

    // Mark as complete
    const result = await completeTask(taskId)
    
    if (result.success) {
      router.refresh()
    } else {
      console.error('Failed to complete task:', result.error)
    }
    
    setCompleting(null)
  }

  if (tasks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <CardTitle>Available Tasks</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-purple-100 p-3 mb-3">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              No tasks yet
            </p>
            <p className="text-xs text-muted-foreground mb-6 max-w-sm">
              Add earning methods to see your daily tasks here
            </p>
            <Link href="/methods?action=new">
              <Button>Add Your First Method</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            <CardTitle>Available Tasks</CardTitle>
          </div>
          <Badge variant="secondary" className="gap-1">
            {availableTasks.length} ready
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Complete tasks to earn. Sorted by time required, then earnings.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Available Tasks */}
          {availableTasks.length > 0 ? (
            availableTasks.map((task) => (
              <div
                key={task.id}
                className="group relative flex items-center gap-4 rounded-xl border border-green-200 bg-green-50/50 p-4 transition-all hover:border-green-300 hover:shadow-md"
              >
                {/* Green indicator */}
                <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl bg-green-500" />
                
                <div className="flex-1 pl-2">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{task.title}</h3>
                      <Badge variant="success" className="gap-1 text-xs">
                        <CheckCircle2 className="h-3 w-3" />
                        Ready
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md font-medium bg-blue-100 text-blue-700 border border-blue-200">
                      {task.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {task.time_required}
                    </span>
                    <span className="font-semibold text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {task.earnings}
                    </span>
                    <span className={`px-2 py-1 rounded-md ${
                      task.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                      task.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {task.difficulty}
                    </span>
                  </div>
                </div>
                
                <Button
                  size="sm"
                  onClick={() => handleComplete(task.id, task.link)}
                  disabled={completing === task.id}
                  className="gap-1 bg-green-600 hover:bg-green-700 shrink-0"
                >
                  {completing === task.id ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Complete
                    </>
                  )}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-sm text-muted-foreground">
              <Timer className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p>All tasks completed! Check back later.</p>
            </div>
          )}

          {/* Upcoming Tasks */}
          {upcomingTasks.length > 0 && (
            <>
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Coming Up
                </h4>
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-4 rounded-xl border border-gray-200 bg-gray-50/50 p-3 mb-2"
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-medium text-gray-700 text-sm">{task.title}</h3>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeRemaining(task.timeUntilAvailable)}
                        </span>
                        <span>{task.earnings}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-xs">
                      <Timer className="h-3 w-3 mr-1" />
                      {formatTimeRemaining(task.timeUntilAvailable)}
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

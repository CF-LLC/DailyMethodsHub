import { Method } from '@/types'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Clock, TrendingUp, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MethodCardProps {
  method: Method
  onEdit?: (method: Method) => void
  onDelete?: (id: string) => void
  showActions?: boolean
}

export function MethodCard({ 
  method, 
  onEdit, 
  onDelete,
  showActions = false 
}: MethodCardProps) {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    Medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    Hard: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }

  return (
    <Card className="group h-full transition-all hover:shadow-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl">{method.title}</CardTitle>
            <CardDescription className="mt-2">
              {method.description}
            </CardDescription>
          </div>
          <span
            className={cn(
              'rounded-full px-2 py-1 text-xs font-medium',
              difficultyColors[method.difficulty]
            )}
          >
            {method.difficulty}
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Earnings</p>
              <p className="text-sm font-medium">{method.earnings}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Time</p>
              <p className="text-sm font-medium">{method.timeRequired || method.time_required || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Category</p>
              <p className="text-sm font-medium">{method.category}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'h-2 w-2 rounded-full',
              (method.isActive ?? method.is_active) ? 'bg-green-500' : 'bg-gray-300'
            )}
          />
          <span className="text-xs text-muted-foreground">
            {(method.isActive ?? method.is_active) ? 'Active' : 'Inactive'}
          </span>
        </div>
      </CardContent>

      {showActions && (
        <CardFooter className="gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onEdit?.(method)}
          >
            Edit
          </Button>
          <Button
            variant="destructive"
            className="flex-1"
            onClick={() => onDelete?.(method.id)}
          >
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

import { Suspense } from 'react'
import { SupabaseStatusDashboard } from './SupabaseStatusDashboard'

export const metadata = {
  title: 'Supabase Status | BetLink Dev',
  description: 'Monitor Supabase connection and database status',
}

export default function SupabaseStatusPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          🗄️ Supabase Status Dashboard
        </h1>
        
        <Suspense fallback={<LoadingSkeleton />}>
          <SupabaseStatusDashboard />
        </Suspense>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div data-testid="loading-indicator" className="space-y-6">
      {/* Connection Status Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
        <div className="h-24 bg-gray-200 rounded-lg animate-pulse" />
      </div>
      
      {/* Tables Section Skeleton */}
      <div>
        <div className="h-8 w-48 bg-gray-200 rounded mb-4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  )
}
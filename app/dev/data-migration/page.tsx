import { Suspense } from 'react';
import { DataMigrationDashboard } from '@/components/dev/data-migration-dashboard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

export default function DataMigrationPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">📊 Data Migration Status</h1>
      
      <Suspense fallback={
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner />
        </div>
      }>
        <DataMigrationDashboard />
      </Suspense>
    </div>
  );
}
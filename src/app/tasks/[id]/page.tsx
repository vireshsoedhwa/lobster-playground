'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { mockTasks } from '@/lib/mockData';

export default function TaskDetailPage() {
  const params = useParams();
  const task = mockTasks.find(t => t.id === params.id);

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Task Not Found</h1>
          <Link href="/tasks" className="text-blue-600 hover:text-blue-800">← Back to Tasks</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/tasks" className="text-blue-600 hover:text-blue-800">← Back</Link>
            <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card title="Task Details">
          <dl className="space-y-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd><StatusBadge status={task.status} /></dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Priority</dt>
              <dd className="text-gray-900 capitalize">{task.priority}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Assigned Agent</dt>
              <dd className="text-gray-900">{task.agent || 'Unassigned'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="text-gray-900">{task.createdAt.toLocaleString()}</dd>
            </div>
          </dl>
        </Card>
      </main>
    </div>
  );
}

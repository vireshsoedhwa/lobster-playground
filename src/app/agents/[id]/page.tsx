'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { mockAgents } from '@/lib/mockData';

export default function AgentDetailPage() {
  const params = useParams();
  const agent = mockAgents.find(a => a.id === params.id);

  if (!agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Agent Not Found</h1>
          <Link href="/agents" className="text-blue-600 hover:text-blue-800">← Back to Agents</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/agents" className="text-blue-600 hover:text-blue-800">← Back</Link>
            <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
            <StatusBadge status={agent.status} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Details">
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="text-gray-900">{agent.role}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd><StatusBadge status={agent.status} /></dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Current Task</dt>
                <dd className="text-gray-900">{agent.currentTask || 'None'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Repository</dt>
                <dd className="text-gray-900">{agent.repo || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Last Heartbeat</dt>
                <dd className="text-gray-900">{agent.lastHeartbeat.toLocaleString()}</dd>
              </div>
            </dl>
          </Card>
        </div>
      </main>
    </div>
  );
}

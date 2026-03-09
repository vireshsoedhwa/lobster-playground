import Link from 'next/link';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { mockSystemStatus, mockAgents, mockTasks } from '@/lib/mockData';

export default function SystemPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">← Back</Link>
            <h1 className="text-2xl font-bold text-gray-900">System Status</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <Card title="Health" className="text-center">
            <StatusBadge status={mockSystemStatus.health} />
          </Card>
          <Card title="Total Agents" className="text-center">
            <p className="text-3xl font-bold">{mockSystemStatus.totalAgents}</p>
          </Card>
          <Card title="Uptime" className="text-center">
            <p className="text-2xl font-bold">{mockSystemStatus.uptime}</p>
          </Card>
          <Card title="Last Update" className="text-center">
            <p className="text-lg font-medium">{mockSystemStatus.lastUpdate.toLocaleTimeString()}</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Agent Status Breakdown">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active</span>
                <span className="font-bold text-green-600">{mockSystemStatus.activeAgents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Idle</span>
                <span className="font-bold text-yellow-600">{mockSystemStatus.idleAgents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Offline</span>
                <span className="font-bold text-gray-600">{mockSystemStatus.offlineAgents}</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/agents" className="text-blue-600 hover:text-blue-800">View all agents →</Link>
            </div>
          </Card>

          <Card title="Task Summary">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">In Progress</span>
                <span className="font-bold text-blue-600">
                  {mockTasks.filter(t => t.status === 'in_progress').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-bold text-gray-600">
                  {mockTasks.filter(t => t.status === 'pending').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-bold text-green-600">
                  {mockTasks.filter(t => t.status === 'completed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Failed</span>
                <span className="font-bold text-red-600">
                  {mockTasks.filter(t => t.status === 'failed').length}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <Link href="/tasks" className="text-blue-600 hover:text-blue-800">View all tasks →</Link>
            </div>
          </Card>
        </div>

        <div className="mt-6">
          <Card title="All Agents">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {mockAgents.map(agent => (
                <div key={agent.id} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{agent.name}</span>
                    <StatusBadge status={agent.status} />
                  </div>
                  <p className="text-sm text-gray-500">{agent.role}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

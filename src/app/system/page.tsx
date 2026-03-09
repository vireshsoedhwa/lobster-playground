import Link from 'next/link';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { Agent, Task, SystemStatus } from '@/types';

// Force dynamic rendering to prevent build-time gateway calls
export const dynamic = 'force-dynamic';

async function getAgents(): Promise<Agent[]> {
  try {
    const res = await fetch('/api/agents', { 
      cache: 'no-store',
      next: { revalidate: 10 } 
    });
    if (!res.ok) throw new Error('Failed to fetch agents');
    return res.json();
  } catch {
    return [];
  }
}

async function getTasks(): Promise<Task[]> {
  try {
    const res = await fetch('/api/sessions', { 
      cache: 'no-store',
      next: { revalidate: 10 } 
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  } catch {
    return [];
  }
}

async function getSystemStatus(): Promise<SystemStatus | null> {
  try {
    const res = await fetch('/api/status', { 
      cache: 'no-store',
      next: { revalidate: 10 } 
    });
    if (!res.ok) throw new Error('Failed to fetch status');
    return res.json();
  } catch {
    return null;
  }
}

export default async function SystemPage() {
  const [agents, tasks, systemStatus] = await Promise.all([
    getAgents(),
    getTasks(),
    getSystemStatus(),
  ]);

  const displayStatus = systemStatus || {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'active').length,
    idleAgents: agents.filter(a => a.status === 'idle').length,
    offlineAgents: agents.filter(a => a.status === 'offline').length,
    health: agents.length > 0 ? 'healthy' as const : 'degraded' as const,
    uptime: 'N/A',
    lastUpdate: new Date(),
  };

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
            <StatusBadge status={displayStatus.health} />
          </Card>
          <Card title="Total Agents" className="text-center">
            <p className="text-3xl font-bold">{displayStatus.totalAgents}</p>
          </Card>
          <Card title="Uptime" className="text-center">
            <p className="text-2xl font-bold">{displayStatus.uptime}</p>
          </Card>
          <Card title="Last Update" className="text-center">
            <p className="text-lg font-medium">
              {displayStatus.lastUpdate ? new Date(displayStatus.lastUpdate).toLocaleTimeString() : 'N/A'}
            </p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Agent Status Breakdown">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Active</span>
                <span className="font-bold text-green-600">{displayStatus.activeAgents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Idle</span>
                <span className="font-bold text-yellow-600">{displayStatus.idleAgents}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Offline</span>
                <span className="font-bold text-gray-600">{displayStatus.offlineAgents}</span>
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
                  {tasks.filter(t => t.status === 'in_progress').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending</span>
                <span className="font-bold text-gray-600">
                  {tasks.filter(t => t.status === 'pending').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completed</span>
                <span className="font-bold text-green-600">
                  {tasks.filter(t => t.status === 'completed').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Failed</span>
                <span className="font-bold text-red-600">
                  {tasks.filter(t => t.status === 'failed').length}
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
            {agents.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {agents.map(agent => (
                  <div key={agent.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{agent.name}</span>
                      <StatusBadge status={agent.status} />
                    </div>
                    <p className="text-sm text-gray-500">{agent.role}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-4">No agents found. Make sure the OpenClaw gateway is running.</p>
            )}
          </Card>
        </div>
      </main>
    </div>
  );
}

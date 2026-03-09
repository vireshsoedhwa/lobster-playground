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

export default async function Dashboard() {
  const [agents, tasks, systemStatus] = await Promise.all([
    getAgents(),
    getTasks(),
    getSystemStatus(),
  ]);

  const activeTasks = tasks.filter(t => t.status === 'in_progress');
  const recentAgents = agents.slice(0, 4);

  // Fallback to safe defaults if API fails
  const displayStatus = systemStatus || {
    totalAgents: agents.length,
    activeAgents: agents.filter(a => a.status === 'active').length,
    idleAgents: agents.filter(a => a.status === 'idle').length,
    offlineAgents: agents.filter(a => a.status === 'offline').length,
    health: agents.length > 0 ? 'healthy' : 'degraded' as const,
    uptime: 'N/A',
    lastUpdate: new Date(),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Mission Control</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card title="Total Agents" className="text-center">
            <p className="text-4xl font-bold text-gray-900">{displayStatus.totalAgents}</p>
          </Card>
          <Card title="Active" className="text-center">
            <p className="text-4xl font-bold text-green-600">{displayStatus.activeAgents}</p>
          </Card>
          <Card title="Tasks In Progress" className="text-center">
            <p className="text-4xl font-bold text-blue-600">{activeTasks.length}</p>
          </Card>
          <Card title="System Health" className="text-center">
            <StatusBadge status={displayStatus.health} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Tasks */}
          <Card title="Active Tasks">
            <div className="space-y-3">
              {activeTasks.length > 0 ? (
                activeTasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{task.title}</p>
                      <p className="text-sm text-gray-500">Agent: {task.agent || 'Unassigned'}</p>
                    </div>
                    <StatusBadge status={task.status} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No active tasks</p>
              )}
            </div>
            <Link href="/tasks" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              View all tasks →
            </Link>
          </Card>

          {/* Agents Overview */}
          <Card title="Agents">
            <div className="space-y-3">
              {recentAgents.length > 0 ? (
                recentAgents.map(agent => (
                  <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{agent.name}</p>
                      <p className="text-sm text-gray-500">{agent.role}</p>
                    </div>
                    <StatusBadge status={agent.status} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No agents found</p>
              )}
            </div>
            <Link href="/agents" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              View all agents →
            </Link>
          </Card>
        </div>

        {/* System Status */}
        <div className="mt-6">
          <Card title="System Status">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-500">Uptime</p>
                <p className="font-medium">{displayStatus.uptime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Idle Agents</p>
                <p className="font-medium">{displayStatus.idleAgents}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Offline Agents</p>
                <p className="font-medium">{displayStatus.offlineAgents}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Last Update</p>
                <p className="font-medium">{displayStatus.lastUpdate ? new Date(displayStatus.lastUpdate).toLocaleTimeString() : 'N/A'}</p>
              </div>
            </div>
            <Link href="/system" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              View system details →
            </Link>
          </Card>
        </div>
      </main>
    </div>
  );
}

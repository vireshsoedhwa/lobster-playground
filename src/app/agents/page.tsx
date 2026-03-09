import Link from 'next/link';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';
import { Agent } from '@/types';

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

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">← Back</Link>
            <h1 className="text-2xl font-bold text-gray-900">Agents</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Card title="All Agents">
          {agents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Task</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Heartbeat</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agents.map(agent => (
                    <tr key={agent.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{agent.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{agent.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={agent.status} /></td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{agent.currentTask || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {agent.lastHeartbeat ? new Date(agent.lastHeartbeat).toLocaleTimeString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link href={`/agents/${agent.id}`} className="text-blue-600 hover:text-blue-800">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 py-4">No agents found. Make sure the OpenClaw gateway is running.</p>
          )}
        </Card>
      </main>
    </div>
  );
}

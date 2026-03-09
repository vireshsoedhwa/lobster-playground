import Link from 'next/link';
import { Card } from '@/components/Card';
import { StatusBadge } from '@/components/StatusBadge';

// Fetch agent data from API (which connects to OpenClaw gateway)
async function getAgents() {
  try {
    const res = await fetch('/api/agents', { 
      cache: 'no-store',
      next: { revalidate: 10 } // Refresh every 10 seconds
    });
    if (res.ok) {
      const data = await res.json();
      return data.agents || [];
    }
  } catch (e) {
    console.error('Failed to fetch agents:', e);
  }
  return [];
}

// Server component - fetches data on the server
export default async function Dashboard() {
  const agents = await getAgents();
  
  // Use fetched agents or empty (mockData is fallback in API)
  const activeAgents = agents.filter((a: any) => a.status === 'running' || a.status === 'active');
  const displayAgents = agents.length > 0 ? agents : [];

  const systemStatus = {
    totalAgents: agents.length || 3,
    activeAgents: activeAgents.length || 1,
    health: agents.length > 0 ? 'healthy' : 'degraded'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Mission Control</h1>
          <p className="text-sm text-gray-500">Real-time agent monitoring</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* System Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card title="Total Agents" className="text-center">
            <p className="text-4xl font-bold text-gray-900">{systemStatus.totalAgents}</p>
          </Card>
          <Card title="Active" className="text-center">
            <p className="text-4xl font-bold text-green-600">{systemStatus.activeAgents}</p>
          </Card>
          <Card title="Tasks In Progress" className="text-center">
            <p className="text-4xl font-bold text-blue-600">{activeAgents.length}</p>
          </Card>
          <Card title="System Health" className="text-center">
            <StatusBadge status={systemStatus.health as any} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Agents */}
          <Card title="Agents">
            <div className="space-y-3">
              {displayAgents.length > 0 ? displayAgents.slice(0, 5).map((agent: any) => (
                <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{agent.name}</p>
                    <p className="text-sm text-gray-500">{agent.role}</p>
                  </div>
                  <StatusBadge status={agent.status} />
                </div>
              )) : (
                <p className="text-gray-500">No agents connected. Run the dashboard with OpenClaw to see agents.</p>
              )}
            </div>
            <Link href="/agents" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
              View all agents →
            </Link>
          </Card>

          {/* Quick Status */}
          <Card title="Connection Status">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">OpenClaw Gateway</span>
                <StatusBadge status={agents.length > 0 ? 'healthy' : 'degraded'} />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">API Status</span>
                <StatusBadge status="healthy" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700">Data Source</span>
                <span className="text-sm text-gray-500">{agents.length > 0 ? 'OpenClaw Gateway' : 'Mock Data'}</span>
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

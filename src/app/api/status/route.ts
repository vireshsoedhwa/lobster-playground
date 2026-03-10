import { NextResponse } from 'next/server';
import { callGateway, HealthResponse } from '@/lib/gateway';
import { SystemStatus } from '@/types';

export async function GET() {
  try {
    const health = await callGateway<HealthResponse>('health');
    
    // Calculate system status from health response
    const totalAgents = health.agents.length;
    const activeAgents = health.agents.filter(
      (agent) => agent.sessions.recent.some((s) => s.age < 5 * 60 * 1000)
    ).length;
    const idleAgents = health.agents.filter(
      (agent) => agent.heartbeat.enabled && !agent.sessions.recent.some((s) => s.age < 5 * 60 * 1000)
    ).length;
    const offlineAgents = totalAgents - activeAgents - idleAgents;
    
    // Determine health based on channels and agents
    let healthStatus: SystemStatus['health'] = 'healthy';
    const channelsRunning = Object.values(health.channels).filter(
      (ch: any) => ch.running
    ).length;
    const channelsConfigured = Object.keys(health.channels).length;
    
    if (channelsConfigured > 0 && channelsRunning === 0) {
      healthStatus = 'degraded';
    } else if (activeAgents === 0 && totalAgents > 0) {
      healthStatus = 'degraded';
    }
    
    const systemStatus: SystemStatus = {
      totalAgents,
      activeAgents,
      idleAgents,
      offlineAgents,
      health: healthStatus,
      uptime: 'N/A', // Would need gateway uptime tracking
      lastUpdate: new Date(health.ts),
    };
    
    return NextResponse.json(systemStatus);
  } catch (error) {
    console.error('Failed to fetch system status:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system status from gateway' },
      { status: 500 }
    );
  }
}

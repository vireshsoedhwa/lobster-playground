import { NextResponse } from 'next/server';
import { callGateway, HealthResponse, GatewayAgent } from '@/lib/gateway';
import { Agent } from '@/types';

export async function GET() {
  try {
    const health = await callGateway<HealthResponse>('health');
    
    // Transform gateway agents to dashboard format
    const agents: Agent[] = health.agents.map((agent: GatewayAgent) => {
      // Determine status based on session activity and heartbeat
      const hasRecentSessions = agent.sessions.recent.some(
        (session) => session.age < 5 * 60 * 1000 // 5 minutes
      );
      const hasActiveHeartbeat = agent.heartbeat.enabled;
      
      let status: Agent['status'] = 'idle';
      if (hasRecentSessions) {
        status = 'active';
      } else if (hasActiveHeartbeat) {
        status = 'idle';
      } else {
        status = 'offline';
      }
      
      return {
        id: agent.agentId,
        name: agent.name || agent.agentId,
        role: agent.isDefault ? 'Main Agent' : 'Sub-agent',
        status,
        currentTask: undefined, // Would need more complex session analysis
        lastHeartbeat: new Date(Date.now() - (agent.sessions.recent[0]?.age || 0)),
      };
    });
    
    return NextResponse.json(agents);
  } catch (error) {
    console.error('Failed to fetch agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents from gateway' },
      { status: 500 }
    );
  }
}

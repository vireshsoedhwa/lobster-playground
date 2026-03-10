// API route to fetch agents from OpenClaw gateway
import { NextResponse } from 'next/server';
import { callGateway, HealthResponse, GatewayAgent } from '@/lib/gateway';
import { Agent } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'ws://127.0.0.1:18789';
  
  // Try primary gateway endpoint first
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
        currentTask: undefined,
        lastHeartbeat: new Date(Date.now() - (agent.sessions.recent[0]?.age || 0)),
      };
    });
    
    return NextResponse.json(agents);
  } catch (gatewayError) {
    console.log('Primary gateway unavailable, trying sessions API:', gatewayError);
  }
  
  // Fallback to sessions API
  try {
    const response = await fetch(`${gatewayUrl}/api/sessions`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Gateway returned ${response.status}`);
    }

    const data = await response.json();
    
    const agents = Array.isArray(data) ? data.map((session: any) => ({
      id: session.sessionKey || session.id || 'unknown',
      name: session.label || session.agentId || 'Unknown Agent',
      role: session.agentId === 'scully' ? 'Coding Agent' : 
            session.agentId === 'jotaro' ? 'Deployment Agent' : 
            session.agentId === 'main' ? 'Orchestrator' : 'Agent',
      status: session.active ? 'active' : 'idle',
      currentTask: session.currentTask || session.task || 'No active task',
      lastHeartbeat: session.lastActive || session.startedAt || new Date().toISOString(),
      workspace: session.workspace || '',
    })) : [];

    return NextResponse.json(agents);
  } catch (error) {
    console.error('Failed to fetch from OpenClaw gateway:', error);
    return NextResponse.json({ agents: [] });
  }
}

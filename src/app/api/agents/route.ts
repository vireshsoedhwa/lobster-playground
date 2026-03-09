// API route to fetch agents from OpenClaw gateway
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:18789';
    
    // Try to fetch sessions from OpenClaw gateway
    const response = await fetch(`${gatewayUrl}/api/sessions`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Timeout after 5 seconds
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Gateway returned ${response.status}`);
    }

    const data = await response.json();
    
    // Transform OpenClaw session data to our agent format
    const agents = Array.isArray(data) ? data.map((session: any) => ({
      id: session.sessionKey || session.id || 'unknown',
      name: session.label || session.agentId || 'Unknown Agent',
      role: session.agentId === 'scully' ? 'Coding Agent' : 
            session.agentId === 'jotaro' ? 'Deployment Agent' : 
            session.agentId === 'main' ? 'Orchestrator' : 'Agent',
      status: session.active ? 'running' : 'idle',
      currentTask: session.currentTask || session.task || 'No active task',
      lastHeartbeat: session.lastActive || session.startedAt || new Date().toISOString(),
      workspace: session.workspace || '',
    })) : [];

    return NextResponse.json({ agents });
  } catch (error) {
    console.error('Failed to fetch from OpenClaw gateway:', error);
    
    // Return empty array if gateway is unavailable
    return NextResponse.json({ 
      agents: [],
      error: 'OpenClaw gateway unavailable, using fallback data'
    });
  }
}

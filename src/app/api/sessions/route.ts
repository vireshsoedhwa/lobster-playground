import { NextResponse } from 'next/server';
import { callGateway, StatusResponse, GatewaySession } from '@/lib/gateway';
import { Task } from '@/types';

export async function GET() {
  try {
    const status = await callGateway<StatusResponse>('status');
    
    // Transform gateway sessions to dashboard tasks format
    // Each session becomes a task entry
    const tasks: Task[] = status.sessions.recent.map((session: GatewaySession) => {
      const priority: Task['priority'] = session.flags?.includes('system') ? 'high' : 'medium';
      
      // Determine task status based on session activity
      let taskStatus: Task['status'];
      if (session.age < 5 * 60 * 1000) {
        taskStatus = 'in_progress';
      } else if (session.totalTokens && session.totalTokens > 0) {
        taskStatus = 'completed';
      } else {
        taskStatus = 'pending';
      }
      
      // Extract a meaningful title from session key
      const keyParts = session.key.split(':');
      const channelInfo = keyParts.length > 2 ? keyParts.slice(2).join(':') : session.key;
      
      return {
        id: session.sessionId,
        title: `${channelInfo} (${session.model})`,
        agent: session.agentId,
        status: taskStatus,
        priority,
        createdAt: new Date(Date.now() - session.age),
      };
    });
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Failed to fetch sessions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sessions from gateway' },
      { status: 500 }
    );
  }
}

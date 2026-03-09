// Types for the Mission Control Dashboard

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'busy' | 'offline';
  currentTask?: string;
  repo?: string;
  lastHeartbeat: Date;
}

export interface Task {
  id: string;
  title: string;
  agent?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
}

export interface SystemStatus {
  totalAgents: number;
  activeAgents: number;
  idleAgents: number;
  offlineAgents: number;
  health: 'healthy' | 'degraded' | 'unhealthy';
  uptime: string;
  lastUpdate: Date;
}

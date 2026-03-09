import { Agent, Task, SystemStatus } from '@/types';

// Mock Agents Data - Fallback when OpenClaw gateway is unavailable
export const mockAgents: Agent[] = [
  {
    id: 'main',
    name: 'Mulder',
    role: 'Orchestrator',
    status: 'active',
    currentTask: 'Coordinating agents',
    repo: 'N/A',
    lastHeartbeat: new Date(),
  },
  {
    id: 'scully',
    name: 'Scully',
    role: 'Coding Agent',
    status: 'idle',
    repo: 'vireshsoedhwa/lobster-playground',
    lastHeartbeat: new Date(),
  },
  {
    id: 'jotaro',
    name: 'Jotaro',
    role: 'Deployment Agent',
    status: 'idle',
    repo: 'vireshsoedhwa/lobster-playground',
    lastHeartbeat: new Date(),
  },
];

// Mock Tasks Data
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Build Mission Control Dashboard',
    agent: 'Scully',
    status: 'completed',
    priority: 'high',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'task-2',
    title: 'Deploy Mission Control with Docker',
    agent: 'Jotaro',
    status: 'in_progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
];

// Mock System Status
export const mockSystemStatus: SystemStatus = {
  totalAgents: 3,
  activeAgents: 1,
  idleAgents: 2,
  offlineAgents: 0,
  health: 'healthy',
  uptime: '1 day',
  lastUpdate: new Date(),
};

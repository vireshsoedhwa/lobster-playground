import { Agent, Task, SystemStatus } from '@/types';

// Mock Agents Data
export const mockAgents: Agent[] = [
  {
    id: 'agent-1',
    name: 'Scully',
    role: 'Assistant',
    status: 'active',
    currentTask: 'Building Mission Control Dashboard',
    repo: 'vireshsoedhwa/lobster-playground',
    lastHeartbeat: new Date(),
  },
  {
    id: 'agent-2',
    name: 'Archer',
    role: 'Investigator',
    status: 'idle',
    lastHeartbeat: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: 'agent-3',
    name: 'Lana',
    role: 'Developer',
    status: 'busy',
    currentTask: 'Code review',
    repo: 'example/other-repo',
    lastHeartbeat: new Date(Date.now() - 2 * 60 * 1000),
  },
  {
    id: 'agent-4',
    name: 'Kreiger',
    role: 'Analyzer',
    status: 'offline',
    lastHeartbeat: new Date(Date.now() - 60 * 60 * 1000),
  },
];

// Mock Tasks Data
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Build Mission Control Dashboard',
    agent: 'Scully',
    status: 'in_progress',
    priority: 'high',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'task-2',
    title: 'Fix authentication bug',
    agent: 'Lana',
    status: 'in_progress',
    priority: 'critical',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: 'task-3',
    title: 'Update documentation',
    agent: 'Archer',
    status: 'pending',
    priority: 'low',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'task-4',
    title: 'Deploy to production',
    agent: 'Scully',
    status: 'completed',
    priority: 'high',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: 'task-5',
    title: 'Security audit',
    status: 'pending',
    priority: 'medium',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
];

// Mock System Status
export const mockSystemStatus: SystemStatus = {
  totalAgents: 4,
  activeAgents: 1,
  idleAgents: 1,
  offlineAgents: 1,
  health: 'healthy',
  uptime: '14 days, 6 hours',
  lastUpdate: new Date(),
};

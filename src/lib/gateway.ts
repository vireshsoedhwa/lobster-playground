// Gateway client for connecting to OpenClaw WebSocket Gateway

const GATEWAY_URL = process.env.GATEWAY_URL || 'http://localhost:18789';

interface GatewayRequest {
  type: 'req';
  id: string;
  method: string;
  params?: Record<string, unknown>;
}

interface GatewayResponse {
  type: 'res';
  id: string;
  ok: boolean;
  payload?: unknown;
  error?: {
    message: string;
    code?: string;
  };
}

let ws: WebSocket | null = null;
let requestId = 0;

function generateId(): string {
  return `req-${++requestId}-${Date.now()}`;
}

export async function callGateway<T>(method: string, params?: Record<string, unknown>): Promise<T> {
  // For server-side calls, we'll use HTTP to call the gateway CLI
  // This is simpler than implementing full WebSocket on the server
  const { execSync } = await import('child_process');
  
  const cmd = `openclaw gateway call ${method} --json --params '${JSON.stringify(params || {})}' --url ${GATEWAY_URL.replace('ws://', 'ws://').replace('http://', 'ws://')}`;
  
  try {
    const output = execSync(cmd, { 
      encoding: 'utf8',
      timeout: 10000 
    });
    
    const response = JSON.parse(output);
    if (response.ok) {
      return response as T;
    }
    throw new Error(response.error?.message || 'Gateway call failed');
  } catch (error) {
    console.error(`Gateway call ${method} failed:`, error);
    throw error;
  }
}

export interface GatewayAgent {
  agentId: string;
  name?: string;
  isDefault: boolean;
  heartbeat: {
    enabled: boolean;
    every: string;
    everyMs: number | null;
    prompt: string;
    target: string;
    ackMaxChars: number;
  };
  sessions: {
    path: string;
    count: number;
    recent: Array<{
      key: string;
      updatedAt: number;
      age: number;
    }>;
  };
}

export interface GatewaySession {
  agentId: string;
  key: string;
  kind: string;
  sessionId: string;
  updatedAt: number;
  age: number;
  totalTokens: number | null;
  totalTokensFresh: boolean;
  model: string;
  contextTokens: number;
  flags: string[];
}

export interface HealthResponse {
  ok: boolean;
  ts: number;
  durationMs: number;
  channels: Record<string, unknown>;
  heartbeatSeconds: number;
  defaultAgentId: string;
  agents: GatewayAgent[];
  sessions: {
    path: string;
    count: number;
    recent: Array<{
      key: string;
      updatedAt: number;
      age: number;
    }>;
  };
}

export interface StatusResponse {
  heartbeat: {
    defaultAgentId: string;
    agents: Array<{
      agentId: string;
      enabled: boolean;
      every: string;
      everyMs: number | null;
    }>;
  };
  sessions: {
    paths: string[];
    count: number;
    defaults: {
      model: string;
      contextTokens: number;
    };
    recent: GatewaySession[];
    byAgent: Array<{
      agentId: string;
      path: string;
      count: number;
      recent: GatewaySession[];
    }>;
  };
}

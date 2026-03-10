// Gateway client for connecting to OpenClaw WebSocket Gateway

const GATEWAY_URL = process.env.GATEWAY_URL || 'ws://localhost:18789';

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

let ws: any = null;
let requestId = 0;

function generateId(): string {
  return `req-${++requestId}-${Date.now()}`;
}

// Call gateway via WebSocket - works in container
async function callGatewayWebSocket<T>(method: string, params?: Record<string, unknown>): Promise<T> {
  return new Promise((resolve, reject) => {
    // Dynamic import ws for client-side or use native WebSocket
    let socket: WebSocket;
    
    try {
      // Use native WebSocket for server-side (Next.js API routes run server-side)
      // In container, this connects to the gateway via host network
      socket = new WebSocket(GATEWAY_URL);
    } catch (e) {
      reject(new Error('WebSocket not available'));
      return;
    }
    
    const requestId = generateId();
    const request: GatewayRequest = {
      type: 'req',
      id: requestId,
      method,
      params: params || {},
    };
    
    const timeout = setTimeout(() => {
      socket.close();
      reject(new Error(`Gateway call ${method} timed out`));
    }, 10000);
    
    socket.onopen = () => {
      socket.send(JSON.stringify(request));
    };
    
    socket.onmessage = (event) => {
      try {
        const response: GatewayResponse = JSON.parse(event.data);
        clearTimeout(timeout);
        
        if (response.id === requestId) {
          if (response.ok) {
            resolve(response.payload as T);
          } else {
            reject(new Error(response.error?.message || `Gateway error for ${method}`));
          }
          socket.close();
        }
      } catch (e) {
        clearTimeout(timeout);
        socket.close();
        reject(e);
      }
    };
    
    socket.onerror = (e) => {
      clearTimeout(timeout);
      reject(new Error(`WebSocket error calling ${method}`));
    };
  });
}

// Fallback: Try CLI-based call (works on host machine)
async function callGatewayCLI<T>(method: string, params?: Record<string, unknown>): Promise<T> {
  const { execSync } = await import('child_process');
  
  const args = params ? `--params '${JSON.stringify(params)}'` : '';
  const cmd = `openclaw gateway call ${method} --json ${args}`;
  
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
    console.error(`Gateway CLI call ${method} failed:`, error);
    throw error;
  }
}

export async function callGateway<T>(method: string, params?: Record<string, unknown>): Promise<T> {
  // Try WebSocket first (works in container)
  try {
    return await callGatewayWebSocket<T>(method, params);
  } catch (wsError) {
    console.log(`WebSocket call failed, trying CLI: ${wsError}`);
    // Fallback to CLI (host machine only)
    return await callGatewayCLI<T>(method, params);
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

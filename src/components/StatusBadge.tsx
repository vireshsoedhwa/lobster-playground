interface StatusBadgeProps {
  status: 'active' | 'idle' | 'busy' | 'offline' | 'pending' | 'in_progress' | 'completed' | 'failed' | 'healthy' | 'degraded' | 'unhealthy';
}

const statusStyles: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  idle: 'bg-yellow-100 text-yellow-800',
  busy: 'bg-orange-100 text-orange-800',
  offline: 'bg-gray-100 text-gray-800',
  pending: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  healthy: 'bg-green-100 text-green-800',
  degraded: 'bg-yellow-100 text-yellow-800',
  unhealthy: 'bg-red-100 text-red-800',
};

const statusLabels: Record<string, string> = {
  active: 'Active',
  idle: 'Idle',
  busy: 'Busy',
  offline: 'Offline',
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
  failed: 'Failed',
  healthy: 'Healthy',
  degraded: 'Degraded',
  unhealthy: 'Unhealthy',
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-800';
  const label = statusLabels[status] || status;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}

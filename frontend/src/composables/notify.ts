export interface NotifyPayload {
  title: string;
  message?: string;
}

export function useNotify() {
  const { add } = useToast();

  return {
    success: ({ title, message }: NotifyPayload) => add({ title, description: message, color: 'success' }),
    error: ({ title, message }: NotifyPayload) => add({ title, description: message, color: 'error' }),
    warn: ({ title, message }: NotifyPayload) => add({ title, description: message, color: 'warning' }),
    normal: ({ title, message }: NotifyPayload) => add({ title, description: message, color: 'neutral' }),
  };
}
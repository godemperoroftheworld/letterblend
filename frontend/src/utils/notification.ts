import type { Ref } from 'vue';
import { onBeforeUnmount, onMounted, ref } from 'vue';

export interface Notification {
  title: string;
  message: string;
  type: 'warn' | 'error' | 'normal' | 'success';
  id: number;
}

type StrippedNotification = Omit<Notification, 'id' | 'type'>;
type NotificationConsumer = (notification: Notification) => void;

export default class Notifier {
  private static _instance: Notifier;

  private readonly listeners: Map<number, NotificationConsumer> = new Map();
  private id: number = 0;
  private consumerId: number = 0;

  static instance() {
    if (!this._instance) {
      this._instance = new Notifier();
    }
    return this._instance;
  }

  private constructor() {}

  addListener(callback: (notification: Notification) => void) {
    this.listeners.set(this.consumerId++, callback);
    return this.consumerId - 1;
  }

  removeListener(listener: number | undefined) {
    if (listener !== undefined) {
      this.listeners.delete(listener);
    }
  }

  warn(notification: StrippedNotification) {
    this.notify({
      ...notification,
      type: 'warn',
      id: this.id++,
    });
  }

  error(notification: StrippedNotification) {
    this.notify({
      ...notification,
      type: 'error',
      id: this.id++,
    });
  }

  normal(notification: StrippedNotification) {
    this.notify({
      ...notification,
      type: 'normal',
      id: this.id++,
    });
  }

  success(notification: StrippedNotification) {
    this.notify({
      ...notification,
      type: 'success',
      id: this.id++,
    });
  }

  private notify(notification: Notification) {
    this.listeners.forEach((listener) => listener(notification));
  }
}

interface UseNotificationResponse {
  notifications: Ref<ReadonlyArray<Notification>>;
  removeNotification: (notification: Notification) => void;
}

export function useNotifications(
  callback?: (notification: Notification) => void,
): UseNotificationResponse {
  const notifier = Notifier.instance();
  const notifications = ref<Notification[]>([]);
  let listener: number;

  function removeNotification(notification: Notification) {
    const idx = notifications.value.indexOf(notification);
    if (idx >= 0) {
      notifications.value.splice(idx, 1);
    }
  }

  onMounted(() => {
    listener = notifier.addListener((notification) => {
      notifications.value.push(notification);
      setTimeout(() => removeNotification(notification), 5000);
      if (callback) {
        callback(notification);
      }
    });
  });
  onBeforeUnmount(() => {
    notifier.removeListener(listener);
  });

  return { notifications, removeNotification };
}

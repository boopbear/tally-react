import { BasicStatusResponse } from "../constants";
import { IUser } from "./user";

export type Severity = 'success' | 'error' | 'info' | 'warning';

export interface Message {
  id: number;
  description: string;
}

export interface Mention extends Message {
  userName: string;
  userIcon: string;
  place: string;
  href: string;
}

export type NotificationContent = Mention | Message;

export type NotificationType = 'info' | 'mention' | 'success' | 'warning' | 'error';

interface NotificationSeverity {
  id: number;
  name: NotificationType;
}

export const notificationsSeverities: NotificationSeverity[] = [
  {
    id: 0,
    name: 'info',
  },
  {
    id: 1,
    name: 'success',
  },
  {
    id: 2,
    name: 'warning',
  },
  {
    id: 3,
    name: 'error',
  },
  {
    id: 4,
    name: 'mention',
  },
];

export const defineColorBySeverity = (severity: NotificationType | undefined, rgb = false): string => {
  const postfix = rgb ? 'rgb-color' : 'color';
  switch (severity) {
    case 'error':
    case 'warning':
    case 'success':
      return `var(--${severity}-${postfix})`;
    case 'info':
    default:
      return `var(--primary-${postfix})`;
  }
};

export interface INotification {
  id?: number;
  title?: string;
  description?: string;
  createdAt?: Date;
  createdBy?: IUser;
}

export interface INotificationUserAction {
  id?: number;
  viewed?: boolean;
  hidden?: boolean;
  notification?: INotification;
}

export interface INotificationUserActionResponse extends BasicStatusResponse {
  notificationUserActions?: INotificationUserAction[]
}
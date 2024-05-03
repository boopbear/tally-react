/**
 * The above TypeScript code defines functions for opening info and error notifications using Ant
 * Design's notification component.
 * @param {OpenNotification} data - The `data` parameter in the `openInfoNotification` and
 * `openErrorNotification` functions is an object that contains the following properties:
 */
import { NotificationInstance, NotificationPlacement } from "antd/es/notification/interface";

interface OpenNotification {
    api: NotificationInstance;
    placement: NotificationPlacement;
    message: string;
    description: string;
}

export const openInfoNotification = (data: OpenNotification) => {
    data.api.info({
        message: data.message,
        description: data.description,
        placement: data.placement,
    });
};

export const openErrorNotification = (data: OpenNotification) => {
    data.api.error({
        message: data.message,
        description: data.description,
        placement: data.placement,
    });
};
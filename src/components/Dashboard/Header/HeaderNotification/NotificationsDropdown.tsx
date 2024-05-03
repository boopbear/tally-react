import React, { useState } from "react";
import { BellFilled } from "@ant-design/icons";
import { Dropdown } from "../../../common/Dropdown/Dropdown";
import { HeaderActionWrapper } from "../Header.styles";
import { NotificationsOverlay } from "./NotificationsOverlay/NotificationsOverlay";
import {
  INotificationUserAction,
  INotificationUserActionResponse,
} from "../../../../interfaces/notification";
import { Button } from "./NotificationButton/NotificationButton";
import { Badge } from "./Badge/Badge";
import {
  BasicStatusResponse,
  ENDPOINTS,
  RES_STATUS,
} from "../../../../constants";
import { client } from "../../../../api/client";

export const NotificationsDropdown: React.FC = () => {
  const [notificationUserActions, setNotificationUserActions] = useState<
    INotificationUserAction[]
  >([]);
  const [hasOpenNotifs, sethasOpenNotifs] = useState(false);

  const getNotifications = React.useCallback(async () => {
    const endpoint = ENDPOINTS.notification.getUserNotifications;

    try {
      const result = await client<INotificationUserActionResponse>(endpoint);

      if (result.status !== RES_STATUS.success) {
        throw new Error(result.message);
      } else {
        if (result.notificationUserActions?.some((n) => !n.viewed)) {
          sethasOpenNotifs(true);
        }
        setNotificationUserActions(result.notificationUserActions || []);
      }
    } catch (err: any) {
      console.log(err);
    }
  }, []);

  React.useEffect(() => {
    getNotifications();
    setInterval(() => getNotifications(), 30000);
  }, [getNotifications]);

  const markViewNotification = React.useCallback(async (ids?: number[]) => {
    if (ids == null || ids.length < 1) {
      return;
    }

    const endpoint = ENDPOINTS.notification.markViewNotifications;
    try {
      const formData = new FormData();
      for (let i = 0; i < ids.length; i++) {
        formData.append("notifUserActionIds", ids[i].toString());
      }

      await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });
    } catch (err: any) {
      console.log(err);
    }
  }, []);

  return (
    <Dropdown
      trigger={["click"]}
      overlay={
        <NotificationsOverlay
          notificationUserActions={notificationUserActions}
          setNotificationUserActions={setNotificationUserActions}
        />
      }
      onOpenChange={(open) => {
        if (open) {
          const notYetViewedNotifs = notificationUserActions
            .filter((n) => n != null && !n.viewed)
            .map((n) => n.id);
          const validIds = notYetViewedNotifs.filter((f): f is number => !!f);
          markViewNotification(validIds);
          sethasOpenNotifs(false);
        }
      }}
    >
      <HeaderActionWrapper>
        <Button
          type={"text"}
          icon={
            <Badge dot={hasOpenNotifs}>
              <BellFilled className="header-icons" />
            </Badge>
          }
          className="mx-2"
        />
      </HeaderActionWrapper>
    </Dropdown>
  );
};

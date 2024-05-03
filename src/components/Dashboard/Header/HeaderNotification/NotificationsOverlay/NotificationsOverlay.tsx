import React, { useMemo } from "react";
import { Button, Col, Row, Space } from "antd";
import { INotificationUserAction } from "../../../../../interfaces/notification";
import * as S from "./NotificationsOverlay.styles";
import dayjs from "dayjs";
import { DeleteFilled } from "@ant-design/icons";
import {
  BasicStatusResponse,
  ENDPOINTS,
  RES_STATUS,
} from "../../../../../constants";
import { client } from "../../../../../api/client";

interface NotificationsOverlayProps {
  notificationUserActions: INotificationUserAction[];
  setNotificationUserActions: React.Dispatch<
    React.SetStateAction<INotificationUserAction[]>
  >;
}

export const NotificationsOverlay: React.FC<NotificationsOverlayProps> = ({
  notificationUserActions,
  setNotificationUserActions,
}) => {
  const hideNotification = React.useCallback(
    async (id?: number) => {
      const endpoint = ENDPOINTS.notification.hideNotification;
      try {
        const formData = new FormData();
        formData.append("notifUserActionId", id?.toString() || "");

        const result = await client<BasicStatusResponse>(endpoint, {
          body: formData,
          method: "POST",
          autoSetHeader: true,
        });
        if (result.status !== RES_STATUS.success) {
          throw new Error(result.message);
        } else {
          setNotificationUserActions(
            notificationUserActions.filter((nua) => nua.id !== id)
          );
        }
      } catch (err: any) {
        console.log(err);
      }
    },
    [notificationUserActions, setNotificationUserActions]
  );

  const noticesList = useMemo(
    () =>
      notificationUserActions.map((notifUserAction, index) => {
        return (
          <S.SpaceWrapper key={index} align="start" size="middle">
            <Space direction="vertical" style={{ gap: "4px" }}>
              <S.NotifHeaderRow className="col-12">
                <Col className="col-10 col-sm-11">
                  <Space direction="vertical" style={{ gap: "1px" }}>
                    <S.Title>{notifUserAction.notification?.title}</S.Title>
                    <S.TimeStamp>
                      {notifUserAction.notification?.createdAt !== undefined
                        ? dayjs(notifUserAction.notification?.createdAt).format(
                            "DD/MM/YYYY h:mm A"
                          )
                        : "N/A"}
                    </S.TimeStamp>
                  </Space>
                </Col>

                <Col className="col-2 col-sm-1">
                  <Button
                    icon={<DeleteFilled />}
                    onClick={() => hideNotification(notifUserAction.id)}
                  ></Button>
                </Col>
              </S.NotifHeaderRow>

              <S.Description>
                {notifUserAction.notification?.description}
              </S.Description>
            </Space>
          </S.SpaceWrapper>
        );
      }),
    [hideNotification, notificationUserActions]
  );

  return (
    <S.NoticesOverlayMenu mode="inline">
      {notificationUserActions.length > 0 ? (
        <Space direction="vertical" size={4}>
          {noticesList}
        </Space>
      ) : (
        <S.Text className="p-5">No notification yet</S.Text>
      )}
    </S.NoticesOverlayMenu>
  );
};

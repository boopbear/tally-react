import React from "react";
import { Button, Col, Row, Space } from "antd";
import { DeleteFilled } from "@ant-design/icons";
import * as S from "./Notification.styles";

interface NotificationProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  createdAt?: React.ReactNode;
}

export const Notification: React.FC<NotificationProps> = ({
  title,
  description,
  createdAt,
}) => {
  return (
    <S.SpaceWrapper align="start" size="middle">
      <Space direction="vertical" style={{ gap: "4px" }}>
        <Row className="col-12">
          <Col className="col-11">
            <Space direction="vertical" style={{ gap: "1px" }}>
              <S.Title>{title}</S.Title>
              <small>{createdAt}</small>
            </Space>
          </Col>

          <Col className="col-1">
            <Button icon={<DeleteFilled />}></Button>
          </Col>
        </Row>

        <S.Description>{description}</S.Description>
      </Space>
    </S.SpaceWrapper>
  );
};

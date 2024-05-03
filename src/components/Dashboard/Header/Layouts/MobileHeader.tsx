import React from "react";
import { Col, Row } from "antd";
import * as S from "../Header.styles";
import { NotificationsDropdown } from "../HeaderNotification/NotificationsDropdown";
import HeaderTitle from "../HeaderContent/HeaderTitle";

interface MobileHeaderProps {
  toggleSider: () => void;
  isSiderOpened: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  toggleSider,
  isSiderOpened,
}) => {
  return (
    <Row justify="space-between" align="middle">
      <Col>
        <Row>
          <S.BurgerCol>
            <S.MobileBurger onClick={toggleSider} isCross={isSiderOpened} />
          </S.BurgerCol>
          <Col>
            <HeaderTitle />
          </Col>
        </Row>
      </Col>

      <Col>
        <Row align="middle">
          <Col>
            <NotificationsDropdown />
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

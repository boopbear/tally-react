import React from "react";
import { Col, Row } from "antd";
import * as S from "../Header.styles";
import { NotificationsDropdown } from "../HeaderNotification/NotificationsDropdown";
import HeaderTitle from "../HeaderContent/HeaderTitle";
import Moment from "moment";

export const DesktopHeader: React.FC = () => {
  const [dateState, setDateState] = React.useState(new Date());

  React.useEffect(() => {
    setInterval(() => setDateState(new Date()), 30000);
  }, []);

  return (
    <Row justify={"start"} align="middle">
      <Col>
        <HeaderTitle />
      </Col>

      <Col style={{ marginLeft: "auto", marginRight: "2rem" }}>
        <Row align="middle" justify="end" gutter={[10, 10]}>
          <Col>
            <NotificationsDropdown />
          </Col>
          <Col style={{ lineHeight: "normal", }}>
            <div className="p-0">{Moment(dateState).format("hh:mm A")}</div>
            <div className="p-0">{Moment(dateState).format("DD/MM/YYYY")}</div>
          </Col>
        </Row>
      </Col>

      <Col></Col>
    </Row>
  );
};

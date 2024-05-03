import { Col, Row } from "antd";
import styled from "styled-components";

export const LogsTableRowHeader = styled(Row)`
  background: #fafafa;
  width: 100%;
`;

export const LogsTableRowContent = styled(Row)`
  width: 100%;
  
  &:hover {
    background: #fafafa;
  }
`;

export const LogsTableColTitle = styled(Col)`
  width: 35%;
  border: 1px solid #f0f0f0;
  padding: 8px !important;
`;

export const LogsTableColContent = styled(Col)`
  width: 65%;
  border: 1px solid #f0f0f0;
  padding: 8px !important;
`;

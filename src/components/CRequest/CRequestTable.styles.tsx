import { Col, Row } from "antd";
import styled from "styled-components";

export const CRequestTableRowHeader = styled(Row)`
  background: #fafafa;
  width: 100%;
`;

export const CRequestTableRowContent = styled(Row)`
  width: 100%;
  
  &:hover {
    background: #fafafa;
  }
`;

export const CRequestTableColTitle = styled(Col)`
  width: 35%;
  border: 1px solid #f0f0f0;
  padding: 8px !important;
`;

export const CRequestTableColContent = styled(Col)`
  width: 65%;
  border: 1px solid #f0f0f0;
  padding: 8px !important;
`;

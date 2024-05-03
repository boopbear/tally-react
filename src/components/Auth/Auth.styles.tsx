import styled from 'styled-components';
import { Checkbox, Button, Card } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import loginBackground from '../../assets/LoginPage2-2.png';
import loginBackgroundMobile from '../../assets/ustmobile.png';

import { BORDER_RADIUS, media } from "../../styles/constants";

export const AuthWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
 
`;

export const AuthBackgroundWrapper = styled.div`
  width: 100%;
  height: 100%;
  background: url(${loginBackgroundMobile});
  background-size: cover !important;
  position: relative;

  @media only screen and ${media.sm} {
    background: url(${loginBackground});
  }
`;

export const AuthContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  min-width: 300px;
`;

export const AuthFormWrapper = styled.div`
  padding: 2.5rem;
  width: 31.75rem;
  overflow: auto;
  background-color: rgba(var(--background-rgb-color), 1);
  border-radius: ${BORDER_RADIUS};

  @media only screen and ${media.xs} {
    padding: 2.5rem 1.25rem;
    width: 20.75rem !important;
    max-height: calc(100vh - 3rem);
  }

  @media only screen and ${media.md} {
    padding: 2.5rem;
    width: 41.75rem;
    max-height: calc(100vh - 3rem);
  }
`;

export const AuthCard = styled(Card)`
  border-top: 10px solid var(--border-color);
`;

export const AuthHeaderTitle = styled.h2<{ alignment?: string }>`
  text-align: ${(prop) => prop.alignment || "left"} !important;
`;

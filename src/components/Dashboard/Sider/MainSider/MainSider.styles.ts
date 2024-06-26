import styled, { css } from 'styled-components';
import { Button, Layout } from 'antd';
import { Link } from 'react-router-dom';
import { media, LAYOUT } from '../../../../styles/constants';
import bgImg from "../../../../assets/sidebar.png";

export const Sider = styled(Layout.Sider)`
  background-image: url(${bgImg}) !important;
  background-size: cover !important;
  position: fixed !important;
  overflow: visible;
  z-index: 5;
  min-height: 100vh;
  max-height: 100vh;

  color: var(--text-secondary-color);

  @media only screen and ${media.xl} {
    position: unset !important;
  }
`;

export const CollapseButton = styled(Button) <{ $isCollapsed: boolean }>`
  background: var(--collapse-background-color);

  border: 1px solid var(--border-color);
  transition: all 0.2s ease;
  position: absolute;
  right: 0.5rem;

  ${(props) =>
    props.$isCollapsed &&
    css`
      right: -1rem;
    `}

  color: var(--text-secondary-color);

  &:hover {
    color: var(--text-secondary-color);
    background: var(--primary-color);
    border: 1px solid var(--border-color);
  }

  &:focus {
    color: var(--text-secondary-color);
    background: var(--primary-color);
    border: 1px solid var(--border-color);
  }
`;

export const SiderContent = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - ${LAYOUT.mobile.headerHeight});

  @media only screen and ${media.md} {
    max-height: calc(100vh - ${LAYOUT.desktop.headerHeight});
  }
`;

export const SiderLogoLink = styled(Link)`
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  flex-direction: column;
`;

export const SiderLogoDiv = styled.div`
  height: ${LAYOUT.mobile.headerHeight};
  padding: ${LAYOUT.mobile.headerPadding};
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and ${media.md} {
    height: auto;
    padding-top: ${LAYOUT.desktop.paddingVertical};
    padding-bottom: ${LAYOUT.desktop.paddingVertical};
  }
`;

export const SiderLogoImg = styled.img`
  height: ${LAYOUT.mobile.dashboardLogoHeight};
  width: ${LAYOUT.mobile.dashboardLogoHeight};

  @media only screen and ${media.xl} {
    height: ${LAYOUT.desktop.dashboardLogoHeight};
    width: ${LAYOUT.desktop.dashboardLogoHeight};
  }
`;

export const BrandSpan = styled.span`
  margin: 0 1rem;
  font-weight: 700;
  font-size: 1.125rem;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.5em;
  display: none;

  @media only screen and ${media.xl} {
    display: block;
  }
`;

import styled from "styled-components";
import { Layout } from "antd";
import { LAYOUT, media } from "../../styles/constants";

const { Content } = Layout;

export const LayoutMaster = styled(Layout)` 
  height: 100vh;
`;

export const LayoutMain = styled(Layout)`
  @media only screen and ${media.md} {
    margin-left: 80px;
  }

  @media only screen and ${media.xl} {
    margin-left: unset;
  }
`;

export const LayoutContent = styled(Content)`
  padding: ${LAYOUT.mobile.paddingVertical} ${LAYOUT.mobile.paddingHorizontal};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--primary-background-color);

  @media only screen and ${media.md} {
    padding: ${LAYOUT.desktop.paddingVertical}
      ${LAYOUT.desktop.paddingHorizontal};
  }
`;

export const MainHeader = styled(Layout.Header)`
  background-color: var(--primary-color);
  text-color: var(--text-primary-color);
  padding-inline: 20px;

  @media only screen and ${media.md} {
    padding: ${LAYOUT.desktop.paddingVertical}
      ${LAYOUT.desktop.paddingHorizontal};
    height: ${LAYOUT.desktop.headerHeight};
  }
`;

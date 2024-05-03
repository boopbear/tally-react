import styled from 'styled-components';
import { Menu as AntMenu } from 'antd';
import { FONT_SIZE } from '../../../../styles/constants';

export const Menu = styled(AntMenu)`
  background: transparent;
  border-right: 0;

  a {
    width: 100%;
    display: block;
  }

  .ant-menu-item,
  .ant-menu-submenu {
    font-size: ${FONT_SIZE.xs};
  }

  .ant-menu-item-icon {
    width: 1.25rem;
  }

  .ant-menu-submenu-expand-icon,
  .ant-menu-submenu-arrow,
  span[role='img'],
  a,
  .ant-menu-item,
  .ant-menu-submenu {
    color: white;
    fill: white;
  }

  .ant-menu-item:hover,
  .ant-menu-submenu-title:hover {
    .ant-menu-submenu-expand-icon,
    .ant-menu-submenu-arrow,
    span[role='img'],
    a,
    .ant-menu-item-icon,
    .ant-menu-title-content, {
      color:  #FCBF15;
      fill: white;
      
  
    }
  }

  .ant-menu-submenu-selected {
    .ant-menu-submenu-title {
      color: white;

      .ant-menu-submenu-expand-icon,
      .ant-menu-submenu-arrow,
      span[role='img'] {
        color: white;
        fill: white;
      }
    }
  }

  .ant-menu-item-selected {
    background-color: #FCBF15 !important;

    .ant-menu-submenu-expand-icon,
    .ant-menu-submenu-arrow,
    span[role='img'],
    .ant-menu-item-icon,
    a {
      color: black;
      fill: white;
    }
  }

  .ant-menu-item-active,
  .ant-menu-submenu-active .ant-menu-submenu-title {
    background-color: #212529 !important;
  }
`;

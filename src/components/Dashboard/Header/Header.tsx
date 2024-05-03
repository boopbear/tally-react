import React from 'react';
import { useResponsive } from '../../../hooks/useResponsive';
import { DesktopHeader } from './Layouts/DesktopHeader';
import { MobileHeader } from './Layouts/MobileHeader';

interface HeaderProps {
  toggleSider: () => void;
  isSiderOpened: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSider, isSiderOpened }) => {
  const { isTablet } = useResponsive();

  return isTablet ? (
    <DesktopHeader />
  ) : (
    <MobileHeader toggleSider={toggleSider} isSiderOpened={isSiderOpened} />
  );
};

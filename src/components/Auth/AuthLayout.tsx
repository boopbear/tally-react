import React from 'react';
import { Outlet } from 'react-router-dom';
import * as S from './Auth.styles';

const AuthLayout: React.FC = () => {
  return (
    <S.AuthWrapper>
      <S.AuthBackgroundWrapper>
        <S.AuthContainerWrapper>
          <Outlet />
        </S.AuthContainerWrapper>
      </S.AuthBackgroundWrapper>
    </S.AuthWrapper>
  );
};

export default AuthLayout;

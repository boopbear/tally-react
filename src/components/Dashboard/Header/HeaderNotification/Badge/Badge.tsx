import React from 'react';
import { BadgeProps as AntBadgeProps, Badge as AntdBadge } from 'antd';
import * as S from './Badge.styles';
import { NotificationType } from '../../../../../interfaces/notification';

export const { Ribbon } = AntdBadge;

interface BadgeProps extends AntBadgeProps {
  className?: string;
  severity?: NotificationType;
}

export const Badge: React.FC<BadgeProps> = ({ className, severity, children, ...props }) => (
  <S.Badge className={className} {...(severity && { severity })} {...props}>
    {children}
  </S.Badge>
);

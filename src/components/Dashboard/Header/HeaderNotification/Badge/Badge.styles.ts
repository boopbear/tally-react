import { Badge as AntBadge } from 'antd';
import styled from 'styled-components';
import { NotificationType, defineColorBySeverity } from '../../../../../interfaces/notification';

interface BadgeProps {
  severity?: NotificationType;
}

export const Badge = styled(AntBadge)<BadgeProps>`
  color: inherit;

  & .ant-badge-count {
    background: ${(props) => defineColorBySeverity(props.severity)};
  }
`;

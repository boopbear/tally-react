import { Avatar, Space, Typography } from 'antd';
import styled from 'styled-components';
import { media } from '../../../../../styles/constants';

export const NotificationIcon = styled(Avatar)``;

export const Title = styled(Typography.Text)`
  font-size: 0.7rem;
  font-weight: 600;

  @media only screen and ${media.md} {
    font-size: 0.875rem;
  }
`;

export const Description = styled(Typography.Text)`
  font-size: 0.7rem;

  @media only screen and ${media.md} {
    font-size: 0.875rem;
  }
`;

export const SpaceWrapper = styled(Space)`
  line-height: 1;
  background-color: var(--background-color);
  padding: 0.5rem;
  border: 1px solid black;
  border-radius: 8px;
`;

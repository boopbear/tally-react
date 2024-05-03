import styled from 'styled-components';
import { Divider, Row, Space, Typography } from 'antd';
import { DropdownMenu } from '../../Header.styles';
import { Button as AntButton } from 'antd';
import { media } from '../../../../../styles/constants';

export const MenuRow = styled(Row).withConfig({
  shouldForwardProp: (prop) => !['eventKey', 'warnKey'].includes(prop),
})``;

export const NoticesOverlayMenu = styled(DropdownMenu)`
  padding: 12px 16px;
  min-width: 18rem !important;
  border-right: 0;
  overflow-y: auto;
  max-height: 450px;

  @media only screen and ${media.md} {
    min-width: 25rem !important;
  }
`;

export const SplitDivider = styled(Divider)`
  margin: 0 0.5rem;
`;

export const LinkBtn = styled(AntButton)`
  &.ant-btn {
    padding: 0;
    font-size: 0.875rem;
    height: unset;
    line-height: unset;
  }
`;

export const Btn = styled(AntButton)`
  width: 100%;
`;

export const Text = styled(Typography.Text)`
  display: block;
  text-align: center;
`;

export const Title = styled(Typography.Text)`
  font-weight: 600;
  line-height: 1;
  margin-right: 4px;

  @media only screen and ${media.md} {
    font-size: 0.875rem;
  }
`;

export const TimeStamp = styled.span`
  font-size: 0.7rem;
`;

export const Description = styled(Typography.Text)`
  font-size: 0.75rem;

  @media only screen and ${media.md} {
    font-size: 0.875rem;
  }
`;

export const SpaceWrapper = styled(Space)`
  line-height: 1;
  background-color: var(--background-color);
  padding: 0.5rem;
  border: 2px solid black;
  border-radius: 8px;
  min-width: 18rem !important;

  @media only screen and ${media.md} {
    min-width: 25rem !important;
  }
`;

export const NotifHeaderRow = styled(Row)`
  min-width: 18rem !important;

  @media only screen and ${media.md} {
    min-width: 25rem !important;
  }
`;
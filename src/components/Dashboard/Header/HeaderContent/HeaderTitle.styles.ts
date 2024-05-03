import styled from 'styled-components';
import { Col } from 'antd';
import { media } from '../../../../styles/constants';

export const HeaderHeading = styled.span`
  font-size: 16px;
  white-space: nowrap;

  @media only screen and ${media.md} {
    font-size: 24px;
    max-width: fit-content;
  }
`;

export const HeaderHeadingCol = styled(Col)`
  max-width: 12rem;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  @media only screen and ${media.xs} {
    max-width: fit-content;
  }
`;
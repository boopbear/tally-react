import { Button } from 'antd';
import styled from 'styled-components';
import { media } from '../../../styles/constants';

interface TabContentStyleProps {
  isSubButton?: boolean;
}

export const TabContainer = styled.div`
  margin-bottom: 0.5em;
`;

export const TabHeader4 = styled.h4`
  
`;

export const TabSubHeader = styled.h6`
  text-align: end;
`;

export const TabButton = styled(Button)<TabContentStyleProps>`
  border-style: none;
  background: #212529;
  color: white;
  text-decoration: ${(props) => props.isSubButton ? "underline" : ""};
  font-size: 1rem;
  padding: 0 1em;

  &:hover {
    color: #212529 !important;
    background: #FCBF15;
  } // THIS PART


  @media only screen and ${media.md} {
    font-size: 1.25rem;
  }
`;

export const TabSpan = styled.span`
  
`;

export const TabFormItem = styled.div`
  & > * {
    margin-bottom: 0.5em;
  }
`;
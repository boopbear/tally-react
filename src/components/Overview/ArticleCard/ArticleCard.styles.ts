import styled from 'styled-components';
import { Typography, Image } from 'antd';
import { BORDER_RADIUS, FONT_SIZE, FONT_WEIGHT, media } from '../../../styles/constants';

export const Header = styled.div`
  height: 5.5rem;
  margin-left: 1rem;
  display: flex;
  align-items: center;
`;

export const AuthorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 0.625rem;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 1.25rem;
  position: relative;
  max-width: 100%;
  box-shadow: var(--box-shadow);
  border-radius: ${BORDER_RADIUS};
  transition: 0.3s;

  background: var(--secondary-background-color);

  &:hover {
    box-shadow: var(--box-shadow-hover);
  }
`;

export const Author = styled.div`
  font-size: ${FONT_SIZE.lg};
  font-weight: ${FONT_WEIGHT.bold};
  color: var(--text-main-color);
  line-height: 1.5625rem;
`;

export const InfoWrapper = styled.div`
  padding: 1.25rem;

  @media only screen and ${media.xl} {
    padding: 1rem;
  }

  @media only screen and ${media.xxl} {
    padding: 1.85rem;
  }
`;

export const InfoHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;

  @media only screen and ${media.md} {
    margin-bottom: 0.625rem;
  }

  @media only screen and ${media.xxl} {
    margin-bottom: 1.25rem;
  }
`;

export const Title = styled.div`
  font-size: ${FONT_SIZE.xl};
  font-weight: ${FONT_WEIGHT.semibold};
  width: 80%;
  line-height: 1.375rem;

  color: var(--text-main-color);

  @media only screen and ${media.md} {
    font-size: ${FONT_SIZE.xxl};
  }
`;

export const DateTime = styled(Typography.Text)`
  font-size: ${FONT_SIZE.xs};
  color: var(--text-main-color);
  line-height: 1.25rem;
`;

export const Description = styled.div`
  font-size: ${FONT_SIZE.xs};
  color: var(--text-main-color);

  @media only screen and ${media.xxl} {
    font-size: 1rem;
  }
`;

export const ArticleImage = styled(Image)`
  object-fit: contain !important;
`;

export const AttachmentWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.625rem;
  padding: 1.25rem;
`;

export const ArticleActionWrapper = styled(InfoWrapper)`
  text-align: end;
`;

export const ArticleAction = styled.button<{buttonColor?: string}>`
  color: var(--text-primary-color);
  text-decoration: underline;
  border: none; 
  background: ${props => props.buttonColor || "var(--secondary-background-color)"};
  margin-left: 1em;
  border-radius: 7px;
  min-width: 4em;

  @media only screen and ${media.md} {
    font-size: ${FONT_SIZE.lg};
  }

  & > span {
    vertical-align: middle;
  }
`;
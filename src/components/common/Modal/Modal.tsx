import React from 'react';
import { Modal as AntdModal, ModalProps as AntModalProps } from 'antd';
import * as S from './Modal.styles';

interface ModalSizes {
  small: string;
  medium: string;
  large: string;
}

export const modalSizes: ModalSizes = {
  small: '400px',
  medium: '600px',
  large: '800px',
};

export const { info: InfoModal, success: SuccessModal, warning: WarningModal, error: ErrorModal } = AntdModal;

interface ModalProps extends AntModalProps {
  size?: 'small' | 'medium' | 'large';
}

export const Modal: React.FC<ModalProps> = ({ size = 'medium', children, ...props }) => {
  const modalSize = Object.entries(modalSizes).find((sz) => sz[0] === size)?.[1];

  return (
    <S.Modal getContainer={false} width={modalSize} {...props}>
      {children}
    </S.Modal>
  );
};

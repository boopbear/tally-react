import { Modal } from "antd";
import React from "react";
import { IModalProps } from "../../interfaces/overview";
import { Loading } from "../common/Loading";

const ModalStatusUser: React.FC<IModalProps> = ({
  title,
  isModalOpen,
  setModalOpen,
  mainForm: form,
  submitting,
  onFinish,
}) => {
  return (
    <Modal
      title={title}
      open={isModalOpen}
      onOk={() => onFinish && onFinish({ id: form?.getFieldValue("id") })}
      onCancel={() => setModalOpen(false)}
      okButtonProps={{ disabled: submitting }}
      cancelButtonProps={{ hidden: submitting }}
    >
      {submitting && <Loading className="p-5" />}
    </Modal>
  );
};

export default ModalStatusUser;

import { Modal, message } from "antd";
import React from "react";
import { IModalProps } from "../../../interfaces/overview";
import { Loading } from "../../common/Loading";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../../constants";
import { client } from "../../../api/client";
import { ILogs } from "../../../interfaces/logs";

const ModalDestroyLogs: React.FC<IModalProps> = ({
  title = "Permanently delete logs shown",
  overloadOnFinish = () => {},
  isModalOpen,
  setModalOpen,
  mainForm: form,
}) => {
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values: ILogs[]) => {
    setModalOpen(true);
    const endpoint = ENDPOINTS.log.destroyLogs;

    try {
      const formData = new FormData();
      for (var i = 0; i < values.length; i++) {
        formData.append("logId", values[i].id?.toString() || "");
      }

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });

      if (result.status !== RES_STATUS.success) {
        throw new Error("failed");
      } else {
        overloadOnFinish();
        setSubmitting(false);
        onCancel();
      }
    } catch (err: any) {
      message.error(err.message);
      setSubmitting(false);
      setModalOpen(false);
      console.log(err);
    }
  };

  const onCancel = () => {
    setModalOpen(false);
  };

  return (
    <Modal
      title={title}
      open={isModalOpen}
      onOk={() => onFinish(form?.getFieldValue("logs"))}
      onCancel={() => onCancel()}
      okButtonProps={{ disabled: submitting }}
      cancelButtonProps={{ hidden: submitting }}
    >
      {submitting && <Loading className="p-5" />}
    </Modal>
  );
};

export default ModalDestroyLogs;

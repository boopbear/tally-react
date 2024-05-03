import { Modal, message } from "antd";
import React from "react";
import { IModalProps } from "../../../interfaces/overview";
import { Loading } from "../../common/Loading";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../../constants";
import { IInventoryAsset } from "../../../interfaces/inventory";
import { client } from "../../../api/client";

const ModalArchiveAsset: React.FC<IModalProps> = ({
  title = "Archive asset",
  overloadOnFinish = () => {},
  isModalOpen,
  setModalOpen,
  mainForm: form,
}) => {
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values: IInventoryAsset) => {
    setModalOpen(true);
    const endpoint = ENDPOINTS.inventory.archiveAsset;

    try {
      const formData = new FormData();
      formData.append("assetId", values.id?.toString() || "");

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
    form?.resetFields();
  };

  return (
    <Modal
      title={title}
      open={isModalOpen}
      onOk={() => onFinish({ id: form?.getFieldValue("id") })}
      onCancel={() => onCancel()}
      okButtonProps={{ disabled: submitting }}
      cancelButtonProps={{ hidden: submitting }}
    >
      {submitting && <Loading className="p-5" />}
    </Modal>
  );
};

export default ModalArchiveAsset;

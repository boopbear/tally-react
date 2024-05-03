import { Button, Form, Modal, message } from "antd";
import React from "react";
import { IModalProps } from "../../../interfaces/overview";
import { Loading } from "../../common/Loading";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../../constants";
import { IInventoryAsset } from "../../../interfaces/inventory";
import { client } from "../../../api/client";
import TextArea from "antd/es/input/TextArea";

const ModalDestroyAsset: React.FC<IModalProps> = ({
  title = "Permanently delete asset",
  overloadOnFinish = () => {},
  isModalOpen,
  setModalOpen,
  mainForm,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: IInventoryAsset) => {
    setModalOpen(true);
    const endpoint = ENDPOINTS.inventory.destroyAsset;

    try {
      const formData = new FormData();
      formData.append("assetId", values.id?.toString() || "");
      formData.append("reasonDestroy", values.reasonDestroy || "");

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

  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
    return;
  };

  const onCancel = () => {
    setModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title={title}
      open={isModalOpen}
      onCancel={() => onCancel()}
      footer={[
        !submitting && (
          <Button key="cancel" htmlType="reset" onClick={() => onCancel()}>
            Cancel
          </Button>
        ),
        <Button
          form="assetDestroyForm"
          key="submit"
          type="primary"
          htmlType="submit"
          disabled={submitting}
        >
          Delete
        </Button>,
      ]}
      afterOpenChange={(open) => {
        form.setFieldsValue({ ...mainForm?.getFieldsValue(true) });
      }}
    >
      {!submitting ? (
        <Form
          name="assetDestroyForm"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<IInventoryAsset> name="id" hidden={true} />
          <Form.Item<IInventoryAsset>
            name="reasonDestroy"
            label="Reason"
            rules={[{ required: true, message: "This field is required" }]}
          >
            <TextArea placeholder="Type here..." />
          </Form.Item>
        </Form>
      ) : (
        <Loading className="p-5" />
      )}
    </Modal>
  );
};

export default ModalDestroyAsset;

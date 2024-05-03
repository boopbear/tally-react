import { Button, Form, Modal, message } from "antd";
import React from "react";
import { IModalProps } from "../../../../interfaces/overview";
import { IWarehouseLog } from "../../../../interfaces/warehouse";
import {
  BasicStatusResponse,
  ENDPOINTS,
  RES_STATUS,
} from "../../../../constants";
import { client } from "../../../../api/client";
import { Loading } from "../../../common/Loading";
import TextArea from "antd/es/input/TextArea";

const ModalHideRequisition: React.FC<IModalProps> = ({
  title = "Permanently remove requisition log",
  overloadOnFinish = () => {},
  isModalOpen,
  setModalOpen,
  mainForm,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: IWarehouseLog) => {
    setModalOpen(true);
    const endpoint = ENDPOINTS.warehouse.hideTransact;
    try {
      const formData = new FormData();
      formData.append("requisitionId", values.id?.toString() || "");
      formData.append("reasonHide", values.reasonHide || "");

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });
      if (result.status !== RES_STATUS.success) {
        throw new Error(result.message);
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
          form="requisitionHideForm"
          key="submit"
          type="primary"
          htmlType="submit"
          disabled={submitting}
        >
          Remove
        </Button>,
      ]}
      afterOpenChange={(open) => {
        form.setFieldsValue({ ...mainForm?.getFieldsValue(true) });
      }}
    >
      {!submitting ? (
        <Form
          name="requisitionHideForm"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<IWarehouseLog> name="id" hidden={true} />
          <Form.Item<IWarehouseLog>
            name="reasonHide"
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

export default ModalHideRequisition;

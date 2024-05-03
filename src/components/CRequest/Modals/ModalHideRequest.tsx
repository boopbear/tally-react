import { Button, Form, Modal, message } from "antd";
import React from "react";
import { IModalProps } from "../../../interfaces/overview";
import { Loading } from "../../common/Loading";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../../constants";
import { client } from "../../../api/client";
import { ICRequest } from "../../../interfaces/crequest";

const ModalHideRequest: React.FC<IModalProps> = ({
  title = "Confirm remove request?",
  overloadOnFinish = () => {},
  isModalOpen,
  setModalOpen,
  mainForm,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: ICRequest) => {
    setModalOpen(true);
    const endpoint = ENDPOINTS.request.hideRequest;

    try {
      const formData = new FormData();
      formData.append("requestId", values.id?.toString() || "");

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
      onCancel={() => setModalOpen(false)}
      footer={[
        !submitting && (
          <Button key="cancel" htmlType="reset" onClick={() => onCancel()}>
            Back
          </Button>
        ),
        <Button
          form="hideRequestForm"
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
          name="hideRequestForm"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<ICRequest> name="id" hidden></Form.Item>
        </Form>
      ) : (
        <Loading className="p-5" />
      )}
    </Modal>
  );
};

export default ModalHideRequest;

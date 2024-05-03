import { Button, Form, Modal, message } from "antd";
import React from "react";
import { IModalProps } from "../../../interfaces/overview";
import { Loading } from "../../common/Loading";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../../constants";
import { client } from "../../../api/client";
import { ICRequest } from "../../../interfaces/crequest";
import TextArea from "antd/es/input/TextArea";

const ModalDenyRequest: React.FC<IModalProps> = ({
  title = "Confirm deny request?",
  overloadOnFinish = () => {},
  isModalOpen,
  setModalOpen,
  mainForm,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: ICRequest) => {
    setModalOpen(true);
    const endpoint = ENDPOINTS.request.respondAssetRequest;

    try {
      const formData = new FormData();
      formData.append("requestId", values.id.toString() || "");
      formData.append("requestTypeId", values.eventType.toString() || "");
      formData.append("approvedStatus", "false");
      formData.append("reasonDenied", values.reasonDenied || "");

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
    form?.resetFields();
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
          form="denyRequestForm"
          key="submit"
          type="primary"
          htmlType="submit"
          disabled={submitting}
        >
          Deny
        </Button>,
      ]}
      afterOpenChange={(open) => {
        form.setFieldsValue({ ...mainForm?.getFieldsValue(true) });
      }}
    >
      {!submitting ? (
        <Form
          name="denyRequestForm"
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item<ICRequest> name="id" hidden></Form.Item>
          <Form.Item<ICRequest> name="eventType" hidden></Form.Item>
          <Form.Item<ICRequest>
            name="reasonDenied"
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

export default ModalDenyRequest;

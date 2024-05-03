import { Button, Form, Modal, Select, message } from "antd";
import React from "react";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../../constants";
import { client } from "../../../api/client";
import { Loading } from "../../common/Loading";
import { IModalPropsInventory } from "../../../interfaces/overview";
import { IFormCRequest } from "../../../interfaces/crequest";
import TextArea from "antd/es/input/TextArea";

const ModalCurrentInventoryRequest: React.FC<IModalPropsInventory> = ({
  title = "Request approval to view Current Inventory",
  isModalOpen,
  setModalOpen,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: IFormCRequest) => {
    setSubmitting(true);
    const endpoint = ENDPOINTS.request.createAssetRequest;

    try {
      const formData = new FormData();
      formData.append("requestType", "1");
      formData.append("message", values.message || "");
      formData.append(
        "getCurrentHardCopy",
        values.getCurrentHardCopy || "false"
      );

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });

      if (result.status !== RES_STATUS.success) {
        throw new Error(result.message);
      } else {
        message.success("You have submitted a request");
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
    <>
      <Modal
        title={title}
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          !submitting && (
            <Button key="cancel" htmlType="reset" onClick={() => onCancel()}>
              Cancel
            </Button>
          ),
          <Button
            form="requestCurrentInventoryForm"
            key="submit"
            type="primary"
            htmlType="submit"
            disabled={submitting}
          >
            Request
          </Button>,
        ]}
      >
        {!submitting ? (
          <Form
            name="requestCurrentInventoryForm"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<IFormCRequest>
              name="message"
              rules={[{ required: true, message: "This field is required" }]}
              label="Message"
            >
              <TextArea placeholder="Start typing..." />
            </Form.Item>
            <Form.Item<IFormCRequest>
              name="getCurrentHardCopy"
              label="Request hard copy of current inventory?"
            >
              <Select
                defaultValue="false"
                options={[
                  { value: "true", label: "Yes" },
                  { value: "false", label: "No" },
                ]}
              />
            </Form.Item>
          </Form>
        ) : (
          <Loading className="p-5" />
        )}
      </Modal>
    </>
  );
};

export default ModalCurrentInventoryRequest;

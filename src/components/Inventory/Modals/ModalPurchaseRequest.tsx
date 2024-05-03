import { Button, Form, Input, Modal, message } from "antd";
import React from "react";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../../constants";
import { client } from "../../../api/client";
import { Loading } from "../../common/Loading";
import { IModalPropsInventory } from "../../../interfaces/overview";
import { IFormCRequest } from "../../../interfaces/crequest";

const ModalPurchaseRequest: React.FC<IModalPropsInventory> = ({
  title = "Purchase Asset?",
  mainForm,
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
      formData.append("requestType", "3");
      formData.append("assetId", values.inventoryAsset?.id?.toString() || "");
      formData.append("requestingUnitName", values.requestingUnitName || "");
      formData.append("affiliation", values.affiliation || "");
      formData.append("position", values.position || "");
      formData.append("biddingPrice", values.biddingPrice || "");

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
    form?.resetFields();
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
            form="requestPurchaseForm"
            key="submit"
            type="primary"
            htmlType="submit"
            disabled={submitting}
          >
            Request
          </Button>,
        ]}
        afterOpenChange={(open) => {
          form.setFieldsValue(mainForm?.getFieldsValue(true));
        }}
      >
        {!submitting ? (
          <Form
            name="requestPurchaseForm"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<IFormCRequest>
              name={["inventoryAsset"]}
              hidden
            ></Form.Item>
            <Form.Item<IFormCRequest>
              name="requestingUnitName"
              rules={[{ required: true, message: "This field is required" }]}
              label="Requester name"
            >
              <Input placeholder="Requester name" />
            </Form.Item>
            <Form.Item<IFormCRequest>
              name="affiliation"
              rules={[{ required: true, message: "This field is required" }]}
              label="Affiliation"
            >
              <Input placeholder="Affiliation" />
            </Form.Item>
            <Form.Item<IFormCRequest>
              name="position"
              rules={[{ required: true, message: "This field is required" }]}
              label="Position"
            >
              <Input placeholder="Position" />
            </Form.Item>
            <Form.Item<IFormCRequest>
              name="biddingPrice"
              rules={[{ required: true, message: "This field is required" }]}
              label="Bidding price"
            >
              <Input placeholder="Bidding price" />
            </Form.Item>
          </Form>
        ) : (
          <Loading className="p-5" />
        )}
      </Modal>
    </>
  );
};

export default ModalPurchaseRequest;

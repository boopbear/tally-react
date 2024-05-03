import {
  Button,
  Form,
  Input,
  Modal,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import React from "react";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../../constants";
import { client } from "../../../api/client";
import { Loading } from "../../common/Loading";
import { IModalPropsInventory } from "../../../interfaces/overview";
import { IFormCRequest } from "../../../interfaces/crequest";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";

const ModalDonateRequest: React.FC<IModalPropsInventory> = ({
  title = "Donate Asset?",
  mainForm,
  isModalOpen,
  setModalOpen,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: IFormCRequest) => {
    setSubmitting(true);
    const endpoint = ENDPOINTS.request.createAssetRequest;
    const uploaded = values.attachments || [];

    try {
      const formData = new FormData();
      formData.append("requestType", "4");
      formData.append("assetId", values.inventoryAsset?.id?.toString() || "");
      formData.append("beneficiaryName", values.beneficiaryName || "");
      formData.append("beneficiaryAddress", values.beneficiaryAddress || "");
      for (let i = 0; i < uploaded.length; i++) {
        formData.append("attachment", uploaded[i].originFileObj || "");
      }

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

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: "*/*",
    listType: "text",
    beforeUpload: (file) => {
      const isLess15M = file.size / 1024 / 1024 <= 15;
      if (!isLess15M) {
        message.error(`${file.name} has exceeded the file size limit of 15MB`);
      }
      return isLess15M || Upload.LIST_IGNORE;
    },
    onChange(info) {
      if (info.file.status === "uploading") {
        info.file.status = "done";
      }
      form.setFieldValue("attachments", [...info.fileList]);
    },
    customRequest({ onSuccess }) {
      setTimeout(() => {
        onSuccess && onSuccess("ok");
      }, 0);
    },
    onRemove(file) {
      form.setFieldValue(
        "attachments",
        (form.getFieldValue("attachments") as UploadFile<any>[]).filter(
          (pic) => pic.uid !== file.uid
        )
      );
    },
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
            form="requestDonateForm"
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
            name="requestDonateForm"
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
              name="beneficiaryName"
              rules={[{ required: true, message: "This field is required" }]}
              label="Beneficiary name"
            >
              <Input placeholder="Beneficiary name" />
            </Form.Item>
            <Form.Item<IFormCRequest>
              name="beneficiaryAddress"
              rules={[{ required: true, message: "This field is required" }]}
              label="Address"
            >
              <Input placeholder="Address" />
            </Form.Item>
            <Form.Item<IFormCRequest>
              name="attachments"
              label="Letter of Request"
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag a file to this area to upload
                </p>
              </Dragger>
            </Form.Item>
          </Form>
        ) : (
          <Loading className="p-5" />
        )}
      </Modal>
    </>
  );
};

export default ModalDonateRequest;

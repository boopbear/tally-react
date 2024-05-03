import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import React from "react";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../constants";
import { client } from "../../api/client";
import { Loading } from "../common/Loading";
import { IModalPropsInventory } from "../../interfaces/overview";
import { IUserProfile } from "../../interfaces/user";
import { Attachment } from "../../interfaces/inventory";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";

interface IUserProfileForm extends IUserProfile {
  attachments: Attachment[];
}

const ModalUpdateProfile: React.FC<IModalPropsInventory> = ({
  isModalOpen,
  setModalOpen,
  overloadOnFinish = () => {},
  mainForm: form,
  existingUploads,
  setExistingUploads,
}) => {
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values: IUserProfileForm) => {
    setSubmitting(true);
    const endpoint = ENDPOINTS.user.updateUserProfile;
    const uploaded = values.attachments || [];

    try {
      const formData = new FormData();
      formData.append("userId", values.userId?.toString() || "");
      formData.append("familyName", values.familyName || "");
      formData.append("givenName", values.givenName || "");
      formData.append("employeeNumber", values.employeeNumber || "");
      formData.append("birthDate", values.birthDate?.toISOString() || "");
      for (let i = 0; i < uploaded.length; i++) {
        formData.append("attachment", uploaded[i].originFileObj || "");
        formData.append(
          "retainedAttachmentId",
          uploaded[i].id?.toString() || ""
        );
      }

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

  const uploadProps: UploadProps = {
    name: "file",
    multiple: false,
    maxCount: 1,
    accept: "image/*",
    listType: "picture",
    beforeUpload: (file) => {
      const isLess10M = file.size / 1024 / 1024 <= 10;
      if (!isLess10M) {
        message.error(`${file.name} has exceeded the file size limit of 10MB`);
      }
      return isLess10M || Upload.LIST_IGNORE;
    },
    onChange(info) {
      if (info.file.status === "uploading") {
        info.file.status = "done";
      }
      form?.setFieldValue("attachments", [...info.fileList]);
      setExistingUploads && setExistingUploads([...info.fileList]);
    },
    customRequest({ onSuccess }) {
      setTimeout(() => {
        onSuccess && onSuccess("ok");
      }, 0);
    },
    onRemove(file) {
      form?.setFieldValue(
        "attachments",
        (form?.getFieldValue("attachments") as UploadFile<any>[]).filter(
          (pic) => pic.uid !== file.uid
        )
      );
      setExistingUploads &&
        setExistingUploads((existingUploads) =>
          existingUploads.filter((pic) => pic.uid !== file.uid)
        );
    },
  };

  return (
    <>
      <Modal
        title={"Update profile"}
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        footer={[
          !submitting && (
            <Button key="cancel" htmlType="reset" onClick={() => onCancel()}>
              Cancel
            </Button>
          ),
          <Button
            form="userProfileForm"
            key="submit"
            type="primary"
            htmlType="submit"
            disabled={submitting}
          >
            Submit
          </Button>,
        ]}
      >
        {!submitting ? (
          <Form
            name="userProfileForm"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<IUserProfileForm> name="userId" hidden={true} />
            <Form.Item<IUserProfileForm>
              name="givenName"
              rules={[{ required: true, message: "This field is required" }]}
              label="First name"
            >
              <Input placeholder="First name" />
            </Form.Item>
            <Form.Item<IUserProfileForm>
              name="familyName"
              rules={[{ required: true, message: "This field is required" }]}
              label="Last name"
            >
              <Input placeholder="Last name" />
            </Form.Item>
            <Form.Item<IUserProfileForm>
              name="employeeNumber"
              label="Employee Number"
            >
              <Input placeholder="Employee Number" />
            </Form.Item>
            <Form.Item<IUserProfileForm>
              name="birthDate"
              rules={[{ required: true, message: "This field is required" }]}
              label="Birthday"
            >
              <DatePicker />
            </Form.Item>
            <Form.Item<IUserProfileForm>
              name="attachments"
              label="Picture"
              valuePropName="files"
            >
              <Dragger {...uploadProps} fileList={existingUploads}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag a picture to this area to upload
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

export default ModalUpdateProfile;

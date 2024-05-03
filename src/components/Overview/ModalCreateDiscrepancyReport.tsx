import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import React from "react";
import TextEditor from "../common/TextEditor/TextEditor";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { IArticle } from "../../interfaces/overview";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../constants";
import { client } from "../../api/client";
import { Loading } from "../common/Loading";
import { IModalProps } from "../../interfaces/overview";

const ModalCreateDiscrepancyReport: React.FC<IModalProps> = ({
  title,
  isModalOpen,
  setModalOpen,
  overloadOnFinish = () => {},
  userOptions,
}) => {
  const [paragraph, setParagraph] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [uploadedPics, setUploadedPics] = React.useState<UploadFile<any>[]>([]);
  const [form] = Form.useForm();

  const onFinish = async (values: IArticle) => {
    setSubmitting(true);
    const endpoint = ENDPOINTS.discrepancyReport.createReport;

    try {
      const files = uploadedPics.map((pic) => {
        return pic.originFileObj;
      });
      const formData = new FormData();
      formData.append("title", values.title || "");
      formData.append("paragraph", values.paragraph || "");
      for (let i = 0; i < files.length; i++) {
        formData.append("attachment", files[i] || "");
      }
      const userEmails = values.sharedWithUserEmails;
      if (userEmails) {
        for (let i = 0; i < userEmails.length; i++) {
          formData.append("sharedWithUserEmails[]", userEmails[i]);
        }
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
    } catch (err) {
      message.error("Something went wrong");
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
    setUploadedPics([]);
    form.resetFields();
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    maxCount: 3,
    accept: "image/*",
    listType: "picture",
    beforeUpload: (file) => {
      const isLess10M = file.size / 1024 / 1024 <= 5;
      if (!isLess10M) {
        message.error(`${file.name} has exceeded the file size limit of 5MB`);
      }
      return isLess10M || Upload.LIST_IGNORE;
    },
    onChange(info) {
      if (info.file.status === "uploading") {
        info.file.status = "done";
      }
      setUploadedPics([...info.fileList]);
    },
    customRequest({ onSuccess }) {
      setTimeout(() => {
        onSuccess && onSuccess("ok");
      }, 0);
    },
    onRemove(file) {
      setUploadedPics((pics) => pics.filter((pic) => pic.uid !== file.uid));
    },
  };

  const handleChange = (values: string[]) => {
    console.log(values);
    return values;
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
            form="reportCreateForm"
            key="submit"
            type="primary"
            htmlType="submit"
            disabled={submitting}
          >
            Post
          </Button>,
        ]}
      >
        {!submitting ? (
          <Form
            name="reportCreateForm"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<IArticle>
              name="sharedWithUserEmails"
              label="Send to:"
              getValueFromEvent={handleChange}
            >
              <Select
                mode="multiple"
                allowClear
                style={{ width: "100%" }}
                placeholder="Please select"
                onChange={handleChange}
                options={userOptions}
              />
            </Form.Item>
            <Form.Item<IArticle>
              name="title"
              rules={[{ required: true, message: "This field is required" }]}
              label="Title"
            >
              <Input placeholder="Title" />
            </Form.Item>
            <Form.Item<IArticle>
              name="paragraph"
              rules={[{ required: true, message: "This field is required" }]}
              label="Description"
            >
              <TextEditor value={paragraph} onChange={setParagraph} />
            </Form.Item>
            {/* issue: using valuePropName only returns pics on last upload event */}
            <Form.Item name="attachments" label="Uploads" valuePropName="files">
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag files to this area to upload
                </p>
              </Dragger>
              <p className="mt-2">Maximum of 3 images.</p>
            </Form.Item>
          </Form>
        ) : (
          <Loading className="p-5" />
        )}
      </Modal>
    </>
  );
};

export default ModalCreateDiscrepancyReport;

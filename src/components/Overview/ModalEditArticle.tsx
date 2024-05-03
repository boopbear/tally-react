import { Button, Form, Input, Modal, Select } from "antd";
import React from "react";
import TextEditor from "../common/TextEditor/TextEditor";
import { IArticle } from "../../interfaces/overview";
import { Loading } from "../common/Loading";
import { IModalProps } from "../../interfaces/overview";

const ModalEditArticle: React.FC<IModalProps> = ({
  title,
  isModalOpen,
  setModalOpen,
  mainForm: form,
  submitting,
  onFinish,
  onFinishFailed,
  onCancel,
  hasShareSelection = false,
  userOptions,
}) => {
  const [paragraph, setParagraph] = React.useState(form?.getFieldValue("paragraph"));

  const handleChange = (values: string[]) => {
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
            <Button key="cancel" htmlType="reset" onClick={onCancel}>
              Cancel
            </Button>
          ),
          <Button
            form="articleEditForm"
            key="submit"
            type="primary"
            htmlType="submit"
            disabled={submitting}
          >
            Update
          </Button>,
        ]}
      >
        {!submitting ? (
          <Form
            name="articleEditForm"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<IArticle> name="id" hidden={true} />
            {hasShareSelection && (
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
            )}
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
          </Form>
        ) : (
          <Loading className="p-5" />
        )}
      </Modal>
    </>
  );
};

export default ModalEditArticle;

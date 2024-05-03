import { Button, Form, Input, Modal, Select, message } from "antd";
import React from "react";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../../constants";
import { client } from "../../../api/client";
import { Loading } from "../../common/Loading";
import { IModalPropsInventory } from "../../../interfaces/overview";
import { IFormCRequest } from "../../../interfaces/crequest";
import TextArea from "antd/es/input/TextArea";

const ModalTurnOverRequest: React.FC<IModalPropsInventory> = ({
  title = "Turnover Asset?",
  mainForm,
  isModalOpen,
  setModalOpen,
  departmentOptions,
  departments,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: IFormCRequest) => {
    setSubmitting(true);
    const endpoint = ENDPOINTS.request.createAssetRequest;

    try {
      const formData = new FormData();
      formData.append("requestType", "2");
      formData.append("assetId", values.inventoryAsset?.id?.toString() || "");
      formData.append("requestingUnitName", values.requestingUnitName || "");
      formData.append("departmentId", values.department?.id?.toString() || "");
      formData.append("location", values.location || "");

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

  const onChangeSelectDepartment = (value: string) => {
    form.setFieldValue(
      "location",
      departments?.find((d) => d.id === parseInt(value))?.location || "None"
    );
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
            form="requestTurnOverForm"
            key="submit"
            type="primary"
            htmlType="submit"
            disabled={submitting}
          >
            Request
          </Button>,
        ]}
        afterOpenChange={(open) => {
          form.setFieldsValue({ ...mainForm?.getFieldsValue(true) });
        }}
      >
        {!submitting ? (
          <Form
            name="requestTurnOverForm"
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
              label="Requesting Unit"
            >
              <Input placeholder="Requesting Unit" />
            </Form.Item>
            <Form.Item<IFormCRequest>
              name={["department", "id"]}
              rules={[{ required: true, message: "This field is required" }]}
              label="Unit/Department"
            >
              <Select
                allowClear
                showSearch
                placeholder="Select a unit/department"
                filterOption={(
                  input: string,
                  option?: { label: string; value: string }
                ) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={departmentOptions?.options}
                loading={departmentOptions?.loading}
                onChange={onChangeSelectDepartment}
              />
            </Form.Item>
            <Form.Item<IFormCRequest> name="location" label="Location">
              <TextArea placeholder="Type here..." />
            </Form.Item>
          </Form>
        ) : (
          <Loading className="p-5" />
        )}
      </Modal>
    </>
  );
};

export default ModalTurnOverRequest;

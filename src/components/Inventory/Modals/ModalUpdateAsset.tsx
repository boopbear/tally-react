import {
  Button,
  DatePicker,
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
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../../constants";
import { client } from "../../../api/client";
import { Loading } from "../../common/Loading";
import {
  IModalPropsInventory,
  IOptionsProp,
} from "../../../interfaces/overview";
import { IInventoryAsset } from "../../../interfaces/inventory";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const ModalUpdateAsset: React.FC<IModalPropsInventory> = ({
  title = "Update asset",
  isModalOpen,
  setModalOpen,
  overloadOnFinish = () => {},
  mainForm,
  departmentOptions,
  departments,
  assetCategoryOptions,
  existingUploads,
  setExistingUploads,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  const [assetStatusOptions, setAssetStatusOptions] =
    React.useState<IOptionsProp>(
      assetCategoryOptions?.assetStatusOption?.find(
        (o) => o.keyRef === form?.getFieldValue(["inventoryCategory", "id"])
      ) || {}
    );

  const onFinish = async (values: IInventoryAsset) => {
    setSubmitting(true);
    const endpoint = ENDPOINTS.inventory.updateAsset;
    const uploadedAtts = values.attachments || [];

    try {
      const formData = new FormData();
      formData.append("assetId", values.id.toString() || "");
      formData.append("assetCode", values.assetCode || "");
      formData.append("description", values.description || "");
      formData.append(
        "inventoryCategoryId",
        values.inventoryCategory?.id?.toString() ||
          (assetCategoryOptions?.categoryOption?.options || [])[0]?.value
      );
      formData.append("serialNumber", values.serialNumber || "");
      formData.append(
        "assetStatusId",
        values.assetStatus?.id?.toString() || ""
      );
      formData.append("departmentId", values.department?.id?.toString() || "");
      formData.append("location", values.location || "");
      formData.append("owner", values.owner || "");
      formData.append("endUser", values.endUser || "");
      formData.append("dateReceived", values.dateReceived?.toISOString() || "");
      formData.append("poNumber", values.poNumber || "");
      for (let i = 0; i < uploadedAtts.length; i++) {
        formData.append("attachment", uploadedAtts[i].originFileObj || "");
        formData.append(
          "retainedAttachmentId",
          uploadedAtts[i].id?.toString() || ""
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
    form.resetFields();
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
      form.setFieldValue("attachments", [...info.fileList]);
      setExistingUploads && setExistingUploads([...info.fileList]);
    },
    customRequest({ onSuccess }) {
      setTimeout(() => {
        onSuccess && onSuccess("ok");
      }, 0);
    },
    onRemove(file) {
      form.setFieldValue(
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

  const onChangeSelectCategory = (value: string) => {
    const selectedId = parseInt(value);
    setAssetStatusOptions(
      assetCategoryOptions?.assetStatusOption?.find(
        (o) => o.keyRef === selectedId
      ) || {}
    );
    form.setFieldValue(["assetStatus", "id"], null);
    form.setFieldValue(["assetStatus", "name"], null);
    form.setFieldValue(["inventoryCategory", "id"], selectedId);
  };

  const onChangeSelectStatus = (value: string) => {
    form.setFieldValue(["assetStatus", "id"], parseInt(value));
  };

  const onChangeSelectDepartment = (value: string) => {
    const selectedId = parseInt(value);
    form.setFieldValue(
      "location",
      departments?.find((d) => d.id === selectedId)?.location || "None"
    );
    form.setFieldValue(["department", "id"], selectedId);
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
            form="assetUpdateForm"
            key="submit"
            type="primary"
            htmlType="submit"
            disabled={submitting}
          >
            Update
          </Button>,
        ]}
        afterOpenChange={(open: boolean) => {
          form.setFieldsValue({ ...mainForm?.getFieldsValue(true) });
          setAssetStatusOptions(
            assetCategoryOptions?.assetStatusOption?.find(
              (o) =>
                o.keyRef === form?.getFieldValue(["inventoryCategory", "id"])
            ) || {}
          );
        }}
      >
        {!submitting ? (
          <Form
            name="assetUpdateForm"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<IInventoryAsset> name="id" hidden={true} />
            <Form.Item<IInventoryAsset>
              name="assetCode"
              rules={[{ required: true, message: "This field is required" }]}
              label="Asset Code"
            >
              <Input placeholder="Asset Code" />
            </Form.Item>
            <Form.Item<IInventoryAsset> name="description" label="Description">
              <Input placeholder="Description" />
            </Form.Item>
            <Form.Item<IInventoryAsset>
              name="serialNumber"
              label="Serial Number"
            >
              <Input placeholder="Serial Number" />
            </Form.Item>
            <Form.Item<IInventoryAsset>
              name={["inventoryCategory", "id"]}
              hidden={true}
            />
            <Form.Item<IInventoryAsset>
              name={["inventoryCategory", "name"]}
              rules={[{ required: true, message: "This field is required" }]}
              label="Item Category"
            >
              <Select
                allowClear
                showSearch
                placeholder="Select a category"
                filterOption={(
                  input: string,
                  option?: { label: string; value: string }
                ) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={assetCategoryOptions?.categoryOption?.options?.filter(
                  (o) => o.key !== ""
                )}
                loading={assetCategoryOptions?.categoryOption?.loading}
                onChange={onChangeSelectCategory}
              />
            </Form.Item>
            <Form.Item<IInventoryAsset>
              name={["assetStatus", "id"]}
              hidden={true}
              getValueFromEvent={onChangeSelectStatus}
            />
            <Form.Item<IInventoryAsset>
              name={["assetStatus", "name"]}
              label="Status"
            >
              <Select
                allowClear
                showSearch
                placeholder="Select a status"
                filterOption={(
                  input: string,
                  option?: { label: string; value: string }
                ) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={assetStatusOptions?.options?.filter(
                  (o) => o.key !== ""
                )}
                loading={assetStatusOptions?.loading}
                onChange={onChangeSelectStatus}
              />
            </Form.Item>
            <Form.Item<IInventoryAsset>
              name={["department", "id"]}
              hidden={true}
              getValueFromEvent={onChangeSelectDepartment}
            />
            <Form.Item<IInventoryAsset>
              name={["department", "name"]}
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
            <Form.Item<IInventoryAsset> name="location" label="Location">
              <TextArea placeholder="Type here..." />
            </Form.Item>
            <Form.Item<IInventoryAsset>
              name="owner"
              rules={[{ required: true, message: "This field is required" }]}
              label="Owner name"
            >
              <Input placeholder="Owner name" />
            </Form.Item>
            <Form.Item<IInventoryAsset> name="endUser" label="End user name">
              <Input placeholder="End user name" />
            </Form.Item>
            <Form.Item<IInventoryAsset>
              name="dateReceived"
              label="Date received"
            >
              <DatePicker />
            </Form.Item>
            <Form.Item<IInventoryAsset> name="poNumber" label="PO Number">
              <Input placeholder="PO Number" />
            </Form.Item>
            <Form.Item<IInventoryAsset>
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

export default ModalUpdateAsset;

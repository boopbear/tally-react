import {
  Button,
  Form,
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
import {
  IInventoryAsset,
  IInventoryAssetImport,
} from "../../../interfaces/inventory";
import Dragger from "antd/es/upload/Dragger";
import { InboxOutlined } from "@ant-design/icons";
import { usePapaParse } from "react-papaparse";
import dayjs from "dayjs";

const ModalImportAssets: React.FC<IModalPropsInventory> = ({
  title = "Import CSV",
  isModalOpen,
  setModalOpen,
  overloadOnFinish = () => {},
  departments,
  assetCategoryOptions,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();
  const { readString } = usePapaParse();

  const onFinish = async (values: IInventoryAsset) => {
    setSubmitting(true);
    const endpoint = ENDPOINTS.inventory.createAsset;
    const uploaded = values.attachments || [];

    const reader = new FileReader();

    reader.onload = (e) => {
      readString(e.target?.result as string, {
        worker: true,
        header: true,
        complete: async (results) => {
          const resultArray: IInventoryAssetImport[] = results.data.map(
            (result: any) => {
              const categoryName = (result.category || "").toLowerCase().trim();
              const statusLabel = (result.status || "").toLowerCase().trim();
              const departmentName = (result.departmentName || "")
                .toLowerCase()
                .trim();

              const inventoryCategoryOption =
                assetCategoryOptions?.categoryOption?.options?.find((o) =>
                  o.label.toLowerCase().includes(categoryName)
                );
              const assetStatusOption = assetCategoryOptions?.assetStatusOption
                ?.find(
                  (o) =>
                    o.keyRef === parseInt(inventoryCategoryOption?.value || "")
                )
                ?.options?.find((o) =>
                  o.label.toLowerCase().includes(statusLabel)
                );

              const tempday = dayjs(result.dateReceived, "DD/MM/YYYY");

              return {
                ...result,
                inventoryCategory: {
                  id: inventoryCategoryOption?.value,
                },
                assetStatus: {
                  id: assetStatusOption?.value,
                },
                department: departments?.find((d) =>
                  d.name?.toLowerCase().includes(departmentName)
                ),
                dateReceived: tempday.isValid() ? tempday : null,
              };
            }
          );

          const validAssets = resultArray.filter(
            (r) =>
              r.assetCode != null &&
              r.assetCode !== "" &&
              r.inventoryCategory != null &&
              r.department != null
          );

          try {
            const promises: any[] = [];

            for (let index = 0; index < validAssets.length; index++) {
              const validAsset = validAssets[index];
              console.log(validAsset);
              const formData = new FormData();
              formData.append("assetCode", validAsset.assetCode || "");
              formData.append("description", validAsset.description || "");
              formData.append(
                "inventoryCategoryId",
                validAsset.inventoryCategory?.id?.toString() ||
                  (assetCategoryOptions?.categoryOption?.options || [])[0]
                    ?.value
              );
              formData.append("serialNumber", validAsset.serialNumber || "");
              formData.append(
                "assetStatusId",
                validAsset.assetStatus?.id?.toString() || ""
              );
              formData.append(
                "departmentId",
                validAsset.department?.id?.toString() || ""
              );
              formData.append("owner", validAsset.owner || "");
              formData.append("endUser", validAsset.endUser || "");
              formData.append(
                "dateReceived",
                validAsset.dateReceived?.toISOString() || ""
              );
              formData.append("poNumber", validAsset.poNumber || "");

              const response = await client<BasicStatusResponse>(endpoint, {
                body: formData,
                method: "POST",
                autoSetHeader: true,
              });

              promises.push(response);
            }

            Promise.all(promises)
              .then((tasks) => {
                const failedTask = (tasks as BasicStatusResponse[]).find(
                  (t) => t.status !== RES_STATUS.success
                );

                if (failedTask) {
                  throw new Error(failedTask.message);
                } else {
                  overloadOnFinish();
                  setSubmitting(false);
                  onCancel();
                }
              })
              .catch((reason) => {
                console.log(reason);
              });
          } catch (err: any) {
            message.error(err.message);
            setSubmitting(false);
            setModalOpen(false);
            console.log(err);
          }
        },
      });
    };

    reader.readAsText(uploaded[0].originFileObj as File);
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
    accept: ".csv",
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
            form="assetImportForm"
            key="submit"
            type="primary"
            htmlType="submit"
            disabled={submitting}
          >
            Add
          </Button>,
        ]}
      >
        {!submitting ? (
          <Form
            name="assetImportForm"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<IInventoryAsset>
              name="attachments"
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Dragger {...uploadProps}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">
                  Click or drag a CSV file to this area to upload
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

export default ModalImportAssets;

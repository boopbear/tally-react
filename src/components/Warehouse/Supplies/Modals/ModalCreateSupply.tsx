import { Button, Form, Input, InputNumber, Modal, Select, message } from "antd";
import React from "react";
import { IModalPropsWarehouse } from "../../../../interfaces/overview";
import { IWarehouseItem } from "../../../../interfaces/warehouse";
import {
  BasicStatusResponse,
  ENDPOINTS,
  RES_STATUS,
} from "../../../../constants";
import { client } from "../../../../api/client";
import { Loading } from "../../../common/Loading";

const ModalCreateSupply: React.FC<IModalPropsWarehouse> = ({
  title = "New supply",
  isModalOpen,
  setModalOpen,
  overloadOnFinish = () => {},
  categories,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: IWarehouseItem) => {
    setSubmitting(true);
    const endpoint = ENDPOINTS.warehouse.createItem;

    try {
      const formData = new FormData();
      formData.append("itemCode", values.itemCode || "");
      formData.append("description", values.description || "");
      formData.append("oum", values.oum || "");
      formData.append("totalQty", (values.totalQty || 0).toString());
      formData.append("location", values.location || "");
      formData.append("pendingOrder", values.pendingOrder || "");
      formData.append("poNumber", values.poNumber || "");
      formData.append("categoryId", (values.categoryId || 1).toString());

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
            form="supplyCreateForm"
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
            name="supplyCreateForm"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<IWarehouseItem>
              name="itemCode"
              rules={[{ required: true, message: "This field is required" }]}
              label="Item Code"
            >
              <Input placeholder="Item Code" />
            </Form.Item>
            <Form.Item<IWarehouseItem> name="description" label="Description">
              <Input placeholder="Description" />
            </Form.Item>
            <Form.Item<IWarehouseItem>
              name="oum"
              label="OUM"
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Input placeholder="OUM" />
            </Form.Item>
            <Form.Item<IWarehouseItem>
              name="totalQty"
              label="Total Quantity"
              rules={[{ required: true, message: "This field is required" }]}
            >
              <InputNumber type="number" min={0} placeholder="0" />
            </Form.Item>
            <Form.Item<IWarehouseItem> name="location" label="Location">
              <Input placeholder="Location" />
            </Form.Item>
            <Form.Item<IWarehouseItem>
              name="pendingOrder"
              label="Pending Order"
            >
              <Input placeholder="Pending Order" />
            </Form.Item>
            <Form.Item<IWarehouseItem> name="poNumber" label="PO Number">
              <Input placeholder="PO Number" />
            </Form.Item>
            <Form.Item<IWarehouseItem>
              name="categoryId"
              label="Product Type"
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Product Type"
                filterOption={(
                  input: string,
                  option?: { label: string; value: string }
                ) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={(categories || []).map((ic) => ({
                  label: ic.name || "",
                  value: ic.id?.toString() || "",
                }))}
                loading={false}
                style={{ minWidth: "10rem" }}
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

export default ModalCreateSupply;

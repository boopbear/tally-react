import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Space,
  message,
} from "antd";
import React from "react";
import { IModalPropsWarehouse } from "../../../../interfaces/overview";
import { IWarehouseLog } from "../../../../interfaces/warehouse";
import {
  BasicStatusResponse,
  ENDPOINTS,
  RES_STATUS,
} from "../../../../constants";
import { client } from "../../../../api/client";
import { Loading } from "../../../common/Loading";

const ModalCreateRequisition: React.FC<IModalPropsWarehouse> = ({
  title = "Supply requisition",
  isModalOpen,
  setModalOpen,
  overloadOnFinish = () => {},
  items,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedItemOUM, setSelectedItemOUM] = React.useState<
    string | undefined
  >();
  const [form] = Form.useForm();

  const onFinish = async (values: IWarehouseLog) => {
    setSubmitting(true);
    const endpoint = ENDPOINTS.warehouse.transactItem;

    try {
      const formData = new FormData();
      formData.append("itemId", values.itemId?.toString() || "");
      formData.append("quantity", values.quantity?.toString() || "0");
      formData.append("dateReceived", values.dateReceived?.toISOString() || "");
      formData.append("affiliation", values.affiliation || "");
      formData.append("reason", values.reason || "");

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
    setSelectedItemOUM(undefined);
  };

  const onChangeSelectSupply = (value: string) => {
    const selectedId = parseInt(value);
    const selectedItem = items?.find((i) => i.id === selectedId);
    form?.setFieldValue("description", selectedItem?.description);
    setSelectedItemOUM(selectedItem?.oum);
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
            form="requisitionCreateForm"
            key="submit"
            type="primary"
            htmlType="submit"
            disabled={submitting}
          >
            Encode
          </Button>,
        ]}
      >
        {!submitting ? (
          <Form
            name="requisitionCreateForm"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<IWarehouseLog>
              name="itemId"
              label="Item Code"
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Select
                allowClear
                showSearch
                placeholder="Search"
                filterOption={(
                  input: string,
                  option?: { label: string; value: string }
                ) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={(items || []).map((i) => ({
                  label: i.itemCode || "",
                  value: i.id?.toString() || "",
                }))}
                loading={false}
                onChange={onChangeSelectSupply}
                style={{ minWidth: "10rem" }}
              />
            </Form.Item>
            <Form.Item<IWarehouseLog> name="description" label="Description">
              <Input
                placeholder="Description"
                disabled
                style={{ color: "black" }}
              />
            </Form.Item>
            <Space>
              <Form.Item<IWarehouseLog>
                name="quantity"
                label="Quantity"
                rules={[{ required: true, message: "This field is required" }]}
              >
                <InputNumber type="number" min={0} placeholder="0" />
              </Form.Item>
              <span> &nbsp;{selectedItemOUM}</span>
            </Space>
            <Form.Item<IWarehouseLog>
              name="dateReceived"
              rules={[{ required: true, message: "This field is required" }]}
              label="Date of Supply Requisition"
            >
              <DatePicker />
            </Form.Item>
            <Form.Item<IWarehouseLog>
              name="affiliation"
              label="College/Office/Department"
            >
              <Input placeholder="College/Office/Department" />
            </Form.Item>
            <Form.Item<IWarehouseLog>
              name="reason"
              label="Reason / Job request Number"
            >
              <Input placeholder="Reason / Job request Number" />
            </Form.Item>
          </Form>
        ) : (
          <Loading className="p-5" />
        )}
      </Modal>
    </>
  );
};

export default ModalCreateRequisition;

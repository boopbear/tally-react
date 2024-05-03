import { Form, Input, Select } from "antd";
import React from "react";
import { IFormTransactAsset } from "../../../interfaces/inventory";
import TextArea from "antd/es/input/TextArea";
import { OTHERS, reasonOptions } from "../../../constants";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const TradeInAsset: React.FC = () => {
  const [showOtherReason, setShowOtherReason] = React.useState(false);

  const onChangeSelectReason = (value: string) => {
    if (value === OTHERS) {
      setShowOtherReason(true);
    } else {
      setShowOtherReason(false);
    }
  };

  return (
    <>
      <Form.Item<IFormTransactAsset>
        name="supplierName"
        rules={[{ required: true, message: "This field is required" }]}
        label="Supplier"
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item<IFormTransactAsset>
        name="reason"
        rules={[{ required: true, message: "This field is required" }]}
        label="Reason"
      >
        <Select
          allowClear
          showSearch
          placeholder="Reason"
          filterOption={(
            input: string,
            option?: { label: string; value: string }
          ) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={reasonOptions}
          loading={false}
          onChange={onChangeSelectReason}
        />
      </Form.Item>
      {showOtherReason && (
        <Form.Item<IFormTransactAsset>
          name="otherReason"
          rules={[{ required: true, message: "This field is required" }]}
          label="Other reason"
        >
          <TextArea placeholder="Start typing..." />
        </Form.Item>
      )}
      <Form.Item<IFormTransactAsset>
        name="remarks"
        rules={[{ required: true, message: "This field is required" }]}
        label="Remarks"
      >
        <TextArea placeholder="Start typing..." />
      </Form.Item>
      <small style={{ color: "darkred" }}>
        <ExclamationCircleOutlined />
        &nbsp;This will automatically delete record of the asset. Any logs should still remain.
      </small>
    </>
  );
};

export default TradeInAsset;

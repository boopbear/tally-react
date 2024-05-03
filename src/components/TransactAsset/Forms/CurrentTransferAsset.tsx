import { Form, Input } from "antd";
import React from "react";
import { IFormTransactAsset } from "../../../interfaces/inventory";

const CurrentTransferAsset: React.FC = () => {
  return (
    <>
      <Form.Item<IFormTransactAsset>
        name="owner"
        rules={[{ required: true, message: "This field is required" }]}
        label="Transfer to"
      >
        <Input placeholder="New owner name" />
      </Form.Item>
    </>
  );
};

export default CurrentTransferAsset;

import { Form, Input } from "antd";
import React from "react";
import { IFormTransactAsset } from "../../../interfaces/inventory";
import TextArea from "antd/es/input/TextArea";

const DonateAsset: React.FC = () => {
  return (
    <>
      <Form.Item<IFormTransactAsset>
        name="beneficiaryName"
        rules={[{ required: true, message: "This field is required" }]}
        label="Beneficiary"
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item<IFormTransactAsset>
        name="beneficiaryAddress"
        rules={[{ required: true, message: "This field is required" }]}
        label="Address"
      >
        <Input placeholder="Address" />
      </Form.Item>
      <Form.Item<IFormTransactAsset> name="pmfNo" label="PMF no.">
        <Input placeholder="PMF no." />
      </Form.Item>
      <Form.Item<IFormTransactAsset>
        name="remarks"
        rules={[{ required: true, message: "This field is required" }]}
        label="Remarks"
      >
        <TextArea placeholder="Start typing..." />
      </Form.Item>
    </>
  );
};

export default DonateAsset;

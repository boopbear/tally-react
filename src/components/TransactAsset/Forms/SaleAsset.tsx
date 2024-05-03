import { Form, Input } from "antd";
import React from "react";
import { IFormTransactAsset } from "../../../interfaces/inventory";

const SaleAsset: React.FC = () => {
  return (
    <>
      <Form.Item<IFormTransactAsset>
        name="soldToMemberName"
        rules={[{ required: true, message: "This field is required" }]}
        label="Sold to"
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item<IFormTransactAsset>
        name="soldToMemberIdNo"
        rules={[{ required: true, message: "This field is required" }]}
        label="UST ID no."
      >
        <Input placeholder="ID" />
      </Form.Item>
      <Form.Item<IFormTransactAsset>
        name="soldToMemberAffiliation"
        label="Affiliation"
      >
        <Input placeholder="Affiliation" />
      </Form.Item>
      <Form.Item<IFormTransactAsset>
        name="soldToMemberPosition"
        label="Position"
      >
        <Input placeholder="Position" />
      </Form.Item>
      <Form.Item<IFormTransactAsset>
        name="salePrice"
        rules={[{ required: true, message: "This field is required" }]}
        label="Price"
      >
        <Input placeholder="Price" />
      </Form.Item>
      <Form.Item<IFormTransactAsset> name="soldReceiptNo" label="Receipt no.">
        <Input placeholder="Receipt no." />
      </Form.Item>
    </>
  );
};

export default SaleAsset;

import { Form, Input } from "antd";
import React from "react";
import { IFormTransactAsset } from "../../../interfaces/inventory";
import TextArea from "antd/es/input/TextArea";

const ScrapAsset: React.FC = () => {
  return (
    <>
      <Form.Item<IFormTransactAsset>
        name="scrapBuyerName"
        rules={[{ required: true, message: "This field is required" }]}
        label="Scrap Buyer"
      >
        <Input placeholder="Name" />
      </Form.Item>
      <Form.Item<IFormTransactAsset> name="scrapReceiptNo" label="Receipt No.">
        <Input placeholder="Receipt No." />
      </Form.Item>
      <Form.Item<IFormTransactAsset> name="scrapSSFNo" label="SSF No.">
        <Input placeholder="SSF No." />
      </Form.Item>
    </>
  );
};

export default ScrapAsset;

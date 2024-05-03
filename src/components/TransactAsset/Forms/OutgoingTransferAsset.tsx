import { Form, FormInstance, Input, Select } from "antd";
import React from "react";
import { IFormTransactAsset } from "../../../interfaces/inventory";
import { IOptionsProp } from "../../../interfaces/overview";
import { IDepartment } from "../../../interfaces/user";
import TextArea from "antd/es/input/TextArea";

interface IOutgoingTransferAssetProps {
  form?: FormInstance<any>;
  departmentOptions?: IOptionsProp;
  departments?: IDepartment[];
}

const OutgoingTransferAsset: React.FC<IOutgoingTransferAssetProps> = ({
  form,
  departments,
  departmentOptions,
}) => {
  const onChangeSelectDepartment = (value: string) => {
    form?.setFieldValue(
      "location",
      departments?.find((d) => d.id === parseInt(value))?.location || "None"
    );
  };

  return (
    <>
      <Form.Item<IFormTransactAsset>
        name="owner"
        rules={[{ required: true, message: "This field is required" }]}
        label="Transfer to"
      >
        <Input placeholder="New owner name" />
      </Form.Item>
      <Form.Item<IFormTransactAsset>
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
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
          options={departmentOptions?.options}
          loading={departmentOptions?.loading}
          onChange={onChangeSelectDepartment}
        />
      </Form.Item>
      <Form.Item<IFormTransactAsset> name="location" label="Location">
        <TextArea placeholder="Type here..." />
      </Form.Item>
    </>
  );
};

export default OutgoingTransferAsset;

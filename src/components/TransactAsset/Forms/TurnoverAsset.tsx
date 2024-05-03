import { Form, FormInstance, Input, Select } from "antd";
import React from "react";
import { IFormTransactAsset } from "../../../interfaces/inventory";
import TextArea from "antd/es/input/TextArea";
import { OTHERS, reasonOptions } from "../../../constants";
import { IOptionsProp } from "../../../interfaces/overview";
import { IDepartment } from "../../../interfaces/user";

interface ITurnoverAssetProps {
  form?: FormInstance<any>;
  departmentOptions?: IOptionsProp;
  departments?: IDepartment[];
}

const TurnoverAsset: React.FC<ITurnoverAssetProps> = ({
  form,
  departments,
  departmentOptions,
}) => {
  const [showOtherReason, setShowOtherReason] = React.useState(false);

  const onChangeSelectDepartment = (value: string) => {
    form?.setFieldValue(
      "location",
      departments?.find((d) => d.id === parseInt(value))?.location || "None"
    );
  };

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
    </>
  );
};

export default TurnoverAsset;

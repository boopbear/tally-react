/* This TypeScript code snippet is importing the `IDropdownItem` interface from a file located at
"../../interfaces/inventory". It then defines a constant `cDepartmentsIsArchivedOptions` which is an
array of objects. Each object represents an option for a dropdown menu and has three properties:
`key`, `label`, and `value`. The options provided are for a dropdown menu that allows the user to
select between "Active" and "Archived" departments, with corresponding boolean values for each
option. */
import { Button, Form, Input, Modal, message , Select} from "antd";
import React from "react";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../constants";
import { client } from "../../api/client";
import { Loading } from "../common/Loading";
import { IModalProps } from "../../interfaces/overview";
import { IDepartment } from "../../interfaces/user";
import TextArea from "antd/es/input/TextArea";

const ModalUpdateDepartment: React.FC<IModalProps> = ({
  title,
  isModalOpen,
  setModalOpen,
  overloadOnFinish = () => {},
  mainForm: form,
}) => {
  const [submitting, setSubmitting] = React.useState(false);

  const onFinish = async (values: IDepartment) => {
    setSubmitting(true);
    const endpoint = ENDPOINTS.department.updateDepartment;

    try {
      const formData = new FormData();
      formData.append("departmentId", values.id.toString() || "");
      formData.append("name", values.name || "");
      formData.append("location", values.location || "");

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
    form?.resetFields();
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
            form="departmentUpdateForm"
            key="submit"
            type="primary"
            htmlType="submit"
            disabled={submitting}
          >
            Submit
          </Button>,
        ]}
      >
        {!submitting ? (
          <Form
            name="departmentUpdateForm"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<IDepartment> name="id" hidden={true} />
            <Form.Item<IDepartment>
              name="name"
              rules={[{ required: true, message: "This field is required" }]}
              label="Name"
            >
              <Input placeholder="Name" />
            </Form.Item>
            <Form.Item<IDepartment>
  name="location"
  rules={[{ required: true, message: "This field is required" }]}
  label="Address"
>
  <Select placeholder="Select location" >
    <Select.Option value="Albertus Magnus Building">Albertus Magnus Building</Select.Option>
    <Select.Option value="UST Carpark">UST Carpark</Select.Option>
    <Select.Option value="Beato Angelico Building">Beato Angelico Building</Select.Option>
    <Select.Option value="Benavides Building">Benavides Building</Select.Option>
    <Select.Option value="Blessed Pier Giorgio Frassati, O.P. Building">Blessed Pier Giorgio Frassati, O.P. Building</Select.Option>
    <Select.Option value="Buenaventura Garcia Paredes, O.P. Building">Buenaventura Garcia Paredes, O.P. Building</Select.Option>
    <Select.Option value="Central Laboratory">Central Laboratory</Select.Option>
    <Select.Option value="Main Building">Main Building</Select.Option>
    <Select.Option value="Roque Ruaño Building">Roque Ruaño Building</Select.Option>
    <Select.Option value="St. Martin de Porres Building">St. Martin de Porres Building</Select.Option>
    <Select.Option value="St. Raymund de Peñafort Building">St. Raymund de Peñafort Building</Select.Option>
    <Select.Option value="UST Tan Yan Kee Student Center">UST Tan Yan Kee Student Center</Select.Option>
    <Select.Option value="Miguel de Benavides Library">Miguel de Benavides Library</Select.Option>
    <Select.Option value="Thomas Aquinas Research Complex">Thomas Aquinas Research Complex</Select.Option>
    <Select.Option value="Quadricentennial Pavilion">Quadricentennial Pavilion</Select.Option>
    <Select.Option value="Central Seminary Building">Central Seminary Building</Select.Option>
    <Select.Option value="UST Health Service">UST Health Service</Select.Option>
  </Select>
</Form.Item>
          </Form>
        ) : (
          <Loading className="p-5" />
        )}
      </Modal>
    </>
  );
};

export default ModalUpdateDepartment;

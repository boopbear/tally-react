import {
  Button,
  DatePicker,
  Divider,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  message,
} from "antd";
import React from "react";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../constants";
import { client } from "../../api/client";
import { Loading } from "../common/Loading";
import { IModalProps } from "../../interfaces/overview";
import { IUser } from "../../interfaces/user";

const ModalUpdateUser: React.FC<IModalProps> = ({
  title,
  isModalOpen,
  setModalOpen,
  overloadOnFinish = () => {},
  mainForm: form,
  departmentOptions,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState<
    "SUPER_ADMIN" | "OFFICE_ADMIN"
  >("OFFICE_ADMIN");

  const onFinish = async (values: IUser) => {
    setSubmitting(true);
    const endpoint = ENDPOINTS.user.updateUser;

    const customSettingsDataFormSuperAdmin = {
      hasCurrentInventoryAccess: "true",
      hasTurnOverAssetPermission:
        values.customSettingsData?.hasTurnOverAssetPermission || "false",
      hasPurchaseAssetPermission:
        values.customSettingsData?.hasPurchaseAssetPermission || "false",
      hasDonationAssetPermission:
        values.customSettingsData?.hasDonationAssetPermission || "false",
    };

    const customSettingsDataFormOfficeAdmin = {
      hasCurrentInventoryAccess:
        values.customSettingsData?.hasCurrentInventoryAccess || "false",
      hasTurnOverAssetPermission: "true",
      hasPurchaseAssetPermission: "true",
      hasDonationAssetPermission: "true",
    };

    const customSettingsDataFormFinal =
      values.role === "SUPER_ADMIN"
        ? customSettingsDataFormSuperAdmin
        : customSettingsDataFormOfficeAdmin;

    try {
      const formData = new FormData();
      formData.append("userId", values.id.toString() || "");
      formData.append("familyName", values.profile?.familyName || "");
      formData.append("givenName", values.profile?.givenName || "");
      formData.append("employeeNumber", values.profile?.employeeNumber || "");
      formData.append("email", values.email || "");
      formData.append(
        "birthDate",
        values.profile?.birthDate?.toISOString() || ""
      );
      formData.append("role", values.role || "OFFICE_ADMIN");
      // name value here is the id of the department
      // TO-DO get Id from select value instead of id passing as name
      formData.append(
        "departmentId",
        values.department?.name?.toString() || ""
      );
      formData.append(
        "customSettingsData",
        JSON.stringify(customSettingsDataFormFinal)
      );

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

  const onChangeSelectDepartment = (value: any) => {
    return value;
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
            form="userUpdateForm"
            key="submit"
            type="primary"
            htmlType="submit"
            disabled={submitting}
          >
            Submit
          </Button>,
        ]}
        afterOpenChange={() => setSelectedRole(form?.getFieldValue("role"))}
      >
        {!submitting ? (
          <Form
            name="userUpdateForm"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<IUser> name="id" hidden={true} />
            <Form.Item<IUser>
              name={["profile", "givenName"]}
              rules={[{ required: true, message: "This field is required" }]}
              label="First name"
            >
              <Input placeholder="First name" />
            </Form.Item>
            <Form.Item<IUser>
              name={["profile", "familyName"]}
              rules={[{ required: true, message: "This field is required" }]}
              label="Last name"
            >
              <Input placeholder="Last name" />
            </Form.Item>
            <Form.Item<IUser>
              name={["profile", "employeeNumber"]}
              rules={[{ required: true, message: "This field is required" }]}
              label="Employee Number"
            >
              <Input placeholder="Employee Number" />
            </Form.Item>
            <Form.Item<IUser>
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "This is an invalid email",
                },
              ]}
              label="Email"
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item<IUser>
              name={["profile", "birthDate"]}
              rules={[{ required: true, message: "This field is required" }]}
              label="Birthday"
            >
              <DatePicker />
            </Form.Item>
            <Form.Item<IUser>
              name={["department", "id"]}
              hidden={true}
              getValueFromEvent={onChangeSelectDepartment}
            />
            <Form.Item<IUser>
              name={["department", "name"]}
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
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={departmentOptions?.options}
                loading={departmentOptions?.loading}
                onChange={onChangeSelectDepartment}
              />
            </Form.Item>
            <Form.Item<IUser> name="role" label="Role">
              <Select
                options={[
                  { value: "SUPER_ADMIN", label: "Super admin" },
                  { value: "OFFICE_ADMIN", label: "Office admin" },
                ]}
                onChange={(value) => setSelectedRole(value)}
              />
            </Form.Item>
            {selectedRole === "SUPER_ADMIN" && (
              <>
                <Divider
                  orientation="left"
                  orientationMargin="0"
                  className="pt-3"
                  style={{ borderBlockStart: "0 rgba(5, 5, 5)" }}
                >
                  Super admin custom settings
                </Divider>
                <Form.Item<IUser>
                  name={["customSettingsData", "hasCurrentInventoryAccess"]}
                  hidden
                ></Form.Item>
                <Form.Item<IUser>
                  name={["customSettingsData", "hasTurnOverAssetPermission"]}
                  label="Enable Turn-over Asset Form"
                >
                  <Radio.Group>
                    <Radio value="true">Yes</Radio>
                    <Radio value="false">No</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item<IUser>
                  name={["customSettingsData", "hasPurchaseAssetPermission"]}
                  label="Enable Purchase Asset Form"
                >
                  <Radio.Group>
                    <Radio value="true">Yes</Radio>
                    <Radio value="false">No</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item<IUser>
                  name={["customSettingsData", "hasDonationAssetPermission"]}
                  label="Enable Donation Asset Form"
                >
                  <Radio.Group>
                    <Radio value="true">Yes</Radio>
                    <Radio value="false">No</Radio>
                  </Radio.Group>
                </Form.Item>
              </>
            )}
          </Form>
        ) : (
          <Loading className="p-5" />
        )}
      </Modal>
    </>
  );
};

export default ModalUpdateUser;

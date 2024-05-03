import React from "react";
import {
  EditOutlined,
  MinusOutlined,
  ReloadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { Button, FormInstance, Space } from "antd";
import { IUser } from "../../../interfaces/user";
import dayjs from "dayjs";

export interface CUserTableProp {
  data?: IUser[];
  showColumnIds?: string[];
  loading?: boolean;
  form?: FormInstance<any>;
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setArchiveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUnarchiveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesktopCUsersTable: React.FC<CUserTableProp> = ({
  data,
  loading,
  form,
  setEditModalOpen,
  setArchiveModalOpen,
  setUnarchiveModalOpen,
  setHideModalOpen,
}) => {
  const columnsDesktop: ColumnsType<IUser> = [
    {
      title: "Employee Number",
      dataIndex: ["profile", "employeeNumber"],
      key: "employeeNumber",
    },
    {
      title: "Name",
      dataIndex: ["profile", "fullName"],
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Unit/Department",
      dataIndex: ["department", "name"],
      key: "departmentName",
    },
    {
      title: "Role",
      key: "role",
      render: (_, { role }) => (
        <Space>
          {role != null
            ? role === "SUPER_ADMIN"
              ? "Super Admin"
              : "Office Admin"
            : ""}
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action-option",
      render: (user: IUser) => (
        <Space size="middle">
          {!user.isArchived ? (
            <>
              <Button
                onClick={() => {
                  form?.setFieldsValue({
                    ...user,
                    customSettingsData: {
                      hasTurnOverAssetPermission:
                        user.customSettingsData?.hasTurnOverAssetPermission ||
                        "false",
                      hasPurchaseAssetPermission:
                        user.customSettingsData?.hasPurchaseAssetPermission ||
                        "false",
                      hasDonationAssetPermission:
                        user.customSettingsData?.hasDonationAssetPermission ||
                        "false",
                    },
                    profile: {
                      ...user.profile,
                      birthDate: user.profile?.birthDate
                        ? dayjs(user.profile?.birthDate)
                        : undefined,
                    },
                  });
                  setEditModalOpen(true);
                }}
                className="action1"
              >
                <EditOutlined />
              </Button>
              <Button
                onClick={() => {
                  form?.setFieldsValue({ id: user.id });
                  setArchiveModalOpen(true);
                }}
                className="action2"
              >
                <MinusOutlined />
              </Button>
            </>
          ) : (
            <>
              <Button
                onClick={() => {
                  form?.setFieldsValue({ id: user.id });
                  setUnarchiveModalOpen(true);
                }}
                className="action1"
              >
                <ReloadOutlined />
              </Button>
              <Button
                onClick={() => {
                  form?.resetFields();
                  form?.setFieldsValue({
                    id: user.id,
                  });
                  setHideModalOpen(true);
                }}
                className="action2"
              >
                <CloseOutlined />
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table
      loading={loading}
      className="w-100 my-3 pb-3"
      columns={columnsDesktop}
      dataSource={data}
      style={{ overflow: "auto" }}
      scroll={{ x: 'max-content' }}
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
};

export default DesktopCUsersTable;

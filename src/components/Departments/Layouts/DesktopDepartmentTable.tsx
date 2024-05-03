import React from "react";
import {
  EditOutlined,
  MinusOutlined,
  ReloadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { Button, FormInstance, Space } from "antd";
import { IDepartment } from "../../../interfaces/user";

export interface DepartmentTableProp {
  data?: IDepartment[];
  showColumnIds?: string[];
  loading?: boolean;
  form?: FormInstance<any>;
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setArchiveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUnarchiveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesktopDepartmentsTable: React.FC<DepartmentTableProp> = ({
  data,
  loading,
  form,
  setEditModalOpen,
  setArchiveModalOpen,
  setUnarchiveModalOpen,
  setHideModalOpen,
}) => {
  const columnsDesktop: ColumnsType<IDepartment> = [
    {
      title: "Units",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (_, { location }) => (
        <Space style={{ whiteSpace: "pre-line" }}>{location}</Space>
      ),
    },
    {
      title: "Action",
      key: "action-option",
      render: (department: IDepartment) => (
        <Space size="middle">
          {!department.isArchived ? (
            <>
              <Button
                onClick={() => {
                  form?.setFieldsValue(department);
                  setEditModalOpen(true);
                }}
                className="action1"
              >
                <EditOutlined />
              </Button>
              <Button
                onClick={() => {
                  form?.setFieldsValue({ id: department.id });
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
                  form?.setFieldsValue({ id: department.id });
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
                    id: department.id,
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
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
};

export default DesktopDepartmentsTable;

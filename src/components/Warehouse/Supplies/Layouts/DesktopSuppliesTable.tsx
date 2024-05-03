import React from "react";
import { EditOutlined, CloseOutlined, RedoOutlined } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { Button, FormInstance, Row, Space } from "antd";
import { IWarehouseItem } from "../../../../interfaces/warehouse";

export interface IWarehouseTableProp {
  data?: IWarehouseItem[];
  loading?: boolean;
  form?: FormInstance<any>;
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setArchiveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUnarchiveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesktopSuppliesTable: React.FC<IWarehouseTableProp> = ({
  data,
  loading,
  form,
  setEditModalOpen,
  setArchiveModalOpen,
  setUnarchiveModalOpen,
  setHideModalOpen,
}) => {
  const columnsDesktop: ColumnsType<IWarehouseItem> = [
    {
      title: "Item Code",
      dataIndex: "itemCode",
      key: "itemCode",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "OUM",
      dataIndex: "oum",
      key: "oum",
    },
    {
      title: "Total Qty",
      dataIndex: "totalQty",
      key: "totalQty",
    },
    {
      title: "Rem. Qty",
      key: "remQty",
      render: (_, { totalQty, remQty }) => {
        const isHalfAndBelow = (totalQty || 0) / 2 >= (remQty || 0);
        return (
          <Space style={isHalfAndBelow ? { color: "red" } : {}}>{remQty}</Space>
        );
      },
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Pending Order",
      dataIndex: "pendingOrder",
      key: "pendingOrder",
    },
    {
      title: "PO Number",
      dataIndex: "poNumber",
      key: "poNumber",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, supply) => (
        <>
          <Row>
            <Space size="middle">
              {!supply.isArchived ? (
                <>
                  <Button
                    onClick={() => {
                      form?.resetFields();
                      form?.setFieldsValue({
                        ...supply,
                      });
                      setEditModalOpen(true);
                    }}
                    className="action1"
                  >
                    <EditOutlined />
                  </Button>
                  <Button
                    onClick={() => {
                      form?.resetFields();
                      form?.setFieldsValue({
                        id: supply.id,
                      });
                      setArchiveModalOpen(true);
                    }}
                    className="action2"
                  >
                    <CloseOutlined />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      form?.resetFields();
                      form?.setFieldsValue({
                        id: supply.id,
                      });
                      setUnarchiveModalOpen(true);
                    }}
                    className="action1"
                  >
                    <RedoOutlined />
                  </Button>
                  <Button
                    onClick={() => {
                      form?.resetFields();
                      form?.setFieldsValue({
                        id: supply.id,
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
          </Row>
        </>
      ),
    },
  ];

  return (
    <Table
      className="w-100 my-3 pb-3"
      columns={columnsDesktop}
      dataSource={data}
      loading={loading}
      style={{ overflow: "auto" }}
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
};

export default DesktopSuppliesTable;

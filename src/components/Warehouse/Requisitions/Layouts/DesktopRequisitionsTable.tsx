import React from "react";
import Table, { ColumnsType } from "antd/es/table";
import { IWarehouseLog } from "../../../../interfaces/warehouse";
import { ReloadOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { Button, FormInstance, Space } from "antd";

export interface IWarehouseLogsTableProp {
  data?: IWarehouseLog[];
  loading?: boolean;
  form?: FormInstance<any>;
  setArchiveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUnarchiveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHideModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DesktopRequisitionsTable: React.FC<IWarehouseLogsTableProp> = ({
  data,
  loading,
  form,
  setArchiveModalOpen,
  setUnarchiveModalOpen,
  setHideModalOpen,
}) => {
  const columnsDesktop: ColumnsType<IWarehouseLog> = [
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
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Date of Supply Requisition",
      dataIndex: "dateReceived",
      key: "dateReceived",
      render: (_, { createdAt, dateReceived }) => (
        <center>
          <div>
            <u>
              <b>
                {dateReceived != null
                  ? dayjs(dateReceived).format("DD/MM/YYYY")
                  : "N/A"}
              </b>
            </u>
          </div>
          <div>
            <small>
              {createdAt != null
                ? dayjs(createdAt).format("DD/MM/YYYY")
                : "N/A"}
            </small>
          </div>
        </center>
      ),
    },
    {
      title: "Affiliation",
      dataIndex: "affiliation",
      key: "affiliation",
    },
    {
      title: "Reason / JR Number",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Action",
      key: "action-option-2",
      render: (log: IWarehouseLog) => (
        <Space size="middle">
          {!log.isArchived ? (
            <>
              <Button
                onClick={() => {
                  form?.setFieldsValue({ id: log.id });
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
                  form?.setFieldsValue({ id: log.id });
                  setUnarchiveModalOpen(true);
                }}
                className="action1"
              >
                <ReloadOutlined />
              </Button>
              <Button
                onClick={() => {
                  form?.setFieldsValue({
                    id: log.id,
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

export default DesktopRequisitionsTable;

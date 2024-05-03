import { Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import { ILogs } from "../../../interfaces/logs";
import dayjs from "dayjs";
import json from "json-keys-sort";

export interface ILogsProp {
  data?: ILogs[];
  showColumnIds?: string[];
  loading?: boolean;
}

const columnsDesktop: ColumnsType<ILogs> = [
  {
    title: "Asset Code",
    dataIndex: ["inventoryAsset", "assetCode"],
    key: "assetCode",
    render: (_, { inventoryAsset, assetCodeBackup }) => (
      <Space>
        {inventoryAsset != null
          ? inventoryAsset?.assetCode
          : assetCodeBackup != null
          ? assetCodeBackup
          : "Unknown"}
      </Space>
    ),
  },
  {
    title: "User",
    dataIndex: ["responsible", "profile", "fullName"],
    key: "fullName",
  },
  {
    title: "Category",
    dataIndex: "category",
    key: "category",
    render: (_, { inventoryCategory }) => (
      <Space>
        {inventoryCategory != null ? inventoryCategory?.name : "Unknown"}
      </Space>
    ),
  },
  {
    title: "Timestamp",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (_, { createdAt }) => (
      <Space>
        {createdAt !== undefined
          ? dayjs(createdAt).format("DD/MM/YYYY h:mm A")
          : "N/A"}
      </Space>
    ),
  },
  {
    title: "Details",
    key: "details",
    render: (_, { details }) => {
      const entries = Object.entries(json.sort(details || {}, true));
      const listItems = entries
        .filter(
          ([key]) =>
            !(
              key.toLowerCase().includes("reason") ||
              key.toLowerCase().includes("remark")
            )
        )
        .map(([key, value]) => (
          <li>
            {key}: {value}
          </li>
        ));
      return (
        <small>
          <ul
            className="mb-0 ps-1"
            style={{ listStylePosition: "inside", whiteSpace: "pre-line" }}
          >
            {listItems}
          </ul>
        </small>
      );
    },
  },
  {
    title: "Remarks/Reason",
    key: "reason",
    render: (_, { details }) => {
      const entries = Object.entries(details || {});
      const listItems = entries
        .filter(
          ([key]) =>
            key.toLowerCase().includes("reason") ||
            key.toLowerCase().includes("remark")
        )
        .map(([key, value]) => (
          <li style={{ whiteSpace: "pre-line" }}>
            {key}: {value}
          </li>
        ));
      return (
        <small>
          <ul className="mb-0 ps-1" style={{ listStylePosition: "inside" }}>
            {listItems}
          </ul>
        </small>
      );
    },
  },
];

const DesktopLogsTable: React.FC<ILogsProp> = ({ data, loading }) => {
  return (
    <Table
      className="w-100 my-3 pb-3"
      columns={columnsDesktop}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default DesktopLogsTable;

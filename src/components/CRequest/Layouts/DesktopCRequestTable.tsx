import React from "react";
import { CloseOutlined, CheckOutlined, DeleteFilled } from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import { Button, FormInstance, Space, Spin, Typography } from "antd";
import { ICRequest } from "../../../interfaces/crequest";
import dayjs from "dayjs";
import json from "json-keys-sort";
import { IUser } from "../../../interfaces/user";
export interface CRequestTableProp<T> {
  data?: ICRequest[];
  showColumnIds?: string[];
  loading?: boolean;
  form?: FormInstance<any>;
  sendingRequest?: boolean;
  userLoggedIn?: IUser;
  onRespond: (values: T, answer: string) => void;
  setDenyRequestModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setCloseRequestModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setHideRequestModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const { Text } = Typography;

export function isValidHttpUrl(text: string) {
  try {
    const _ = new URL(text);
  } catch (_) {
    return false;
  }

  return true;
}

const DesktopCRequestTable: React.FC<CRequestTableProp<ICRequest>> = ({
  data,
  loading,
  form,
  sendingRequest,
  userLoggedIn,
  onRespond,
  setDenyRequestModalOpen,
  setCloseRequestModalOpen,
  setHideRequestModalOpen,
}) => {
  const columnsDesktop: ColumnsType<ICRequest> = [
    {
      title: "Name of Requestor",
      dataIndex: ["requestor", "profile", "fullName"],
      key: "fullName",
    },
    {
      title: "Asset Description",
      dataIndex: "assetDescBackup",
      key: "assetDescBackup",
      render: (_, { assetDescBackup }) => (
        <Space>
          {assetDescBackup != null && assetDescBackup !== ""
            ? assetDescBackup
            : "None"}
        </Space>
      ),
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
                key.toLowerCase().includes("message") ||
                key.toLowerCase().includes("unitid")
              )
          )
          .map(([key, value]) => {
            const displayVal = isValidHttpUrl(value) ? (
              <a href={value} target="_blank" rel="noreferrer">
                View
              </a>
            ) : (
              value
            );
            return (
              <li>
                {key}:&nbsp;{displayVal}
              </li>
            );
          });
        return (
          <small>
            <ul className="mb-0 ps-1" style={{ listStylePosition: "inside" }}>
              {listItems}
            </ul>
          </small>
        );
      },
    },
    {
      title: "Message",
      key: "message",
      render: (_, { details }) => {
        const entries = Object.entries(json.sort(details || {}, true));
        const messageItem = entries
          .filter(([key]) => key.toLowerCase().includes("message"))
          .map(([key, value]) => value);
        return <small>{messageItem[0]}</small>;
      },
    },
    {
      title: "Action",
      key: "action-option",
      render: (_, record) =>
        !sendingRequest ? (
          <Space size="middle" style={{ width: "8rem" }}>
            {!record.isArchived ? (
              record.isAnswered ? (
                record.isApproved ? (
                  <Space>
                    <Text
                      className="p-2 rounded"
                      style={{ backgroundColor: "forestgreen", color: "white" }}
                    >
                      Approved
                    </Text>
                    <Button
                      onClick={() => {
                        form?.resetFields();
                        form?.setFieldsValue({
                          id: record.id,
                        });
                        setHideRequestModalOpen(true);
                      }}
                      icon={<DeleteFilled />}
                    ></Button>
                  </Space>
                ) : (
                  <Space>
                    <Text
                      className="p-2 rounded"
                      style={{ backgroundColor: "crimson", color: "white" }}
                    >
                      Denied
                    </Text>
                    <Button
                      onClick={() => {
                        form?.resetFields();
                        form?.setFieldsValue({
                          id: record.id,
                        });
                        setHideRequestModalOpen(true);
                      }}
                      icon={<DeleteFilled />}
                    ></Button>
                  </Space>
                )
              ) : userLoggedIn?.role === "SUPER_ADMIN" ? (
                <>
                  <Button
                    onClick={() => {
                      form?.resetFields();
                      form?.setFieldsValue({
                        id: record.id,
                        eventType: record.eventType,
                      });
                      setDenyRequestModalOpen(true);
                    }}
                    className="action2"
                  >
                    <CloseOutlined />
                  </Button>
                  <Button
                    onClick={() => {
                      onRespond(record, "true");
                    }}
                    style={{ border: "1px solid green", color: "forestgreen" }}
                  >
                    <CheckOutlined />
                  </Button>
                </>
              ) : (
                <>
                  <Text
                    className="p-2 rounded"
                    style={{ backgroundColor: "#FCBF15", color: "black" }}
                  >
                    Pending
                  </Text>
                  <Button
                    onClick={() => {
                      form?.resetFields();
                      form?.setFieldValue("id", record.id);
                      setCloseRequestModalOpen(true);
                    }}
                    style={{ backgroundColor: "#A7171A", color: "white" }}
                    icon={<CloseOutlined />}
                  ></Button>
                </>
              )
            ) : (
              <Space>
                <Text
                  className="p-2 rounded"
                  style={{ backgroundColor: "darkslategrey", color: "white" }}
                >
                  Closed
                </Text>
                <Button
                  onClick={() => {
                    form?.resetFields();
                    form?.setFieldsValue({
                      id: record.id,
                    });
                    setHideRequestModalOpen(true);
                  }}
                  icon={<DeleteFilled />}
                ></Button>
              </Space>
            )}
          </Space>
        ) : (
          <Text>
            <Spin />
            {"\tPlease wait..."}
          </Text>
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
      scroll={{ x: "max-content" }}
      pagination={{ pageSize: 10 }}
      bordered
    />
  );
};

export default DesktopCRequestTable;

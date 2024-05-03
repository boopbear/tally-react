import React from "react";
import { Button, Empty, Row, Space, Spin, Typography } from "antd";
import { CloseOutlined, CheckOutlined, DeleteFilled } from "@ant-design/icons";
import { CRequestTableProp, isValidHttpUrl } from "./DesktopCRequestTable";
import * as S from "../CRequestTable.styles";
import { Loading } from "../../common/Loading";
import dayjs from "dayjs";
import json from "json-keys-sort";
import { ICRequest } from "../../../interfaces/crequest";

const { Text } = Typography;

const MobileCRequestTable: React.FC<CRequestTableProp<ICRequest>> = ({
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
  return (
    <>
      {!loading ? (
        data && data.length ? (
          <div className="w-100 my-3 pb-3">
            {data.map((request) => {
              const entries = Object.entries(
                json.sort(request.details || {}, true)
              );
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
              const messageItem = entries
                .filter(([key]) => key.toLowerCase().includes("message"))
                .map(([key, value]) => value);

              return (
                <Row className="my-3">
                  <S.CRequestTableRowHeader>
                    <S.CRequestTableColTitle>
                      Name of Requestor
                    </S.CRequestTableColTitle>
                    <S.CRequestTableColContent>
                      {request.requestor?.profile?.fullName}
                    </S.CRequestTableColContent>
                  </S.CRequestTableRowHeader>
                  <S.CRequestTableRowContent>
                    <S.CRequestTableColTitle>
                      Asset Description
                    </S.CRequestTableColTitle>
                    <S.CRequestTableColContent>
                      {request.assetDescBackup != null &&
                      request.assetDescBackup !== ""
                        ? request.assetDescBackup
                        : "None"}
                    </S.CRequestTableColContent>
                  </S.CRequestTableRowContent>
                  <S.CRequestTableRowContent>
                    <S.CRequestTableColTitle>Category</S.CRequestTableColTitle>
                    <S.CRequestTableColContent>
                      {request.inventoryCategory != null
                        ? request.inventoryCategory?.name
                        : "Unknown"}
                    </S.CRequestTableColContent>
                  </S.CRequestTableRowContent>
                  <S.CRequestTableRowContent>
                    <S.CRequestTableColTitle>Timestamp</S.CRequestTableColTitle>
                    <S.CRequestTableColContent>
                      {request.createdAt !== undefined
                        ? dayjs(request.createdAt).format("DD/MM/YYYY h:mm A")
                        : "N/A"}
                    </S.CRequestTableColContent>
                  </S.CRequestTableRowContent>
                  <S.CRequestTableRowContent>
                    <S.CRequestTableColTitle>Details</S.CRequestTableColTitle>
                    <S.CRequestTableColContent>
                      <small>
                        <ul
                          className="mb-0 ps-1"
                          style={{ listStylePosition: "inside" }}
                        >
                          {listItems}
                        </ul>
                      </small>
                    </S.CRequestTableColContent>
                  </S.CRequestTableRowContent>
                  <S.CRequestTableRowContent>
                    <S.CRequestTableColTitle>Message</S.CRequestTableColTitle>
                    <S.CRequestTableColContent>
                      <small>{messageItem[0]}</small>
                    </S.CRequestTableColContent>
                  </S.CRequestTableRowContent>
                  <S.CRequestTableRowContent>
                    <S.CRequestTableColTitle>Action</S.CRequestTableColTitle>
                    <S.CRequestTableColContent>
                      {!sendingRequest ? (
                        <Space size="middle" style={{ width: "8rem" }}>
                          {!request.isArchived ? (
                            request.isAnswered ? (
                              request.isApproved ? (
                                <Space>
                                  <Text
                                    className="p-2 rounded"
                                    style={{
                                      backgroundColor: "forestgreen",
                                      color: "white",
                                    }}
                                  >
                                    Approved
                                  </Text>
                                  <Button
                                    onClick={() => {
                                      form?.resetFields();
                                      form?.setFieldsValue({
                                        id: request.id,
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
                                    style={{
                                      backgroundColor: "crimson",
                                      color: "white",
                                    }}
                                  >
                                    Denied
                                  </Text>
                                  <Button
                                    onClick={() => {
                                      form?.resetFields();
                                      form?.setFieldsValue({
                                        id: request.id,
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
                                      id: request.id,
                                      eventType: request.eventType,
                                    });
                                    setDenyRequestModalOpen(true);
                                  }}
                                  className="action2"
                                >
                                  <CloseOutlined />
                                </Button>
                                <Button
                                  onClick={() => {
                                    onRespond(request, "true");
                                  }}
                                  style={{
                                    border: "1px solid green",
                                    color: "forestgreen",
                                  }}
                                >
                                  <CheckOutlined />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Text
                                  className="p-2 rounded"
                                  style={{
                                    backgroundColor: "#FCBF15",
                                    color: "black",
                                  }}
                                >
                                  Pending
                                </Text>
                                <Button
                                  onClick={() => {
                                    form?.resetFields();
                                    form?.setFieldValue("id", request.id);
                                    setCloseRequestModalOpen(true);
                                  }}
                                  style={{
                                    backgroundColor: "#A7171A",
                                    color: "white",
                                  }}
                                  icon={<CloseOutlined />}
                                ></Button>
                              </>
                            )
                          ) : (
                            <Space>
                              <Text
                                className="p-2 rounded"
                                style={{
                                  backgroundColor: "darkslategrey",
                                  color: "white",
                                }}
                              >
                                Closed
                              </Text>
                              <Button
                                onClick={() => {
                                  form?.resetFields();
                                  form?.setFieldsValue({
                                    id: request.id,
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
                      )}
                    </S.CRequestTableColContent>
                  </S.CRequestTableRowContent>
                </Row>
              );
            })}
          </div>
        ) : (
          <Empty style={{ placeContent: "center" }} />
        )
      ) : (
        <Loading className="p-5" />
      )}
    </>
  );
};

export default MobileCRequestTable;

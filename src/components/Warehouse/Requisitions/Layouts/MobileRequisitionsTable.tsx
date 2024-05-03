import React from "react";
import { Button, Empty, Row, Space } from "antd";
import * as S from "../../WarehouseTable.styles";
import { IWarehouseLogsTableProp } from "./DesktopRequisitionsTable";
import { Loading } from "../../../common/Loading";
import { ReloadOutlined, CloseOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const MobileRequisitionsTable: React.FC<IWarehouseLogsTableProp> = ({
  data,
  loading,
  form,
  setArchiveModalOpen,
  setUnarchiveModalOpen,
  setHideModalOpen,
}) => {
  return (
    <>
      {!loading ? (
        data && data.length ? (
          <div className="w-100 my-3 pb-3">
            {data.map((log) => {
              return (
                <Row className="my-3">
                  <S.TableRowHeader>
                    <S.TableColTitle>Item Code</S.TableColTitle>
                    <S.TableColContent>{log.itemCode}</S.TableColContent>
                  </S.TableRowHeader>
                  <S.TableRowContent>
                    <S.TableColTitle>Description</S.TableColTitle>
                    <S.TableColContent>{log.description}</S.TableColContent>
                  </S.TableRowContent>
                  <S.TableRowContent>
                    <S.TableColTitle>OUM</S.TableColTitle>
                    <S.TableColContent>{log.oum}</S.TableColContent>
                  </S.TableRowContent>
                  <S.TableRowContent>
                    <S.TableColTitle>Quantity</S.TableColTitle>
                    <S.TableColContent>{log.quantity}</S.TableColContent>
                  </S.TableRowContent>
                  <S.TableRowContent>
                    <S.TableColTitle>Date of Supply Requisition</S.TableColTitle>
                    <S.TableColContent>
                      <center>
                        <div>
                          <u>
                            <b>
                              {log.dateReceived != null
                                ? dayjs(log.dateReceived).format("DD/MM/YYYY")
                                : "N/A"}
                            </b>
                          </u>
                        </div>
                        <div>
                          <small>
                            {log.createdAt != null
                              ? dayjs(log.createdAt).format("DD/MM/YYYY")
                              : "N/A"}
                          </small>
                        </div>
                      </center>
                    </S.TableColContent>
                  </S.TableRowContent>
                  <S.TableRowContent>
                    <S.TableColTitle>Affiliation</S.TableColTitle>
                    <S.TableColContent>{log.affiliation}</S.TableColContent>
                  </S.TableRowContent>
                  <S.TableRowContent>
                    <S.TableColTitle>Reason / JR Number</S.TableColTitle>
                    <S.TableColContent>{log.reason}</S.TableColContent>
                  </S.TableRowContent>
                  <S.TableRowContent>
                    <S.TableColTitle>Action</S.TableColTitle>
                    <S.TableColContent>
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
                    </S.TableColContent>
                  </S.TableRowContent>
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

export default MobileRequisitionsTable;

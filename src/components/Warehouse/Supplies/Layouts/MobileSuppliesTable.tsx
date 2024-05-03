import React from "react";
import { Button, Empty, Row, Space } from "antd";
import { EditOutlined, CloseOutlined, RedoOutlined } from "@ant-design/icons";
import * as S from "../../WarehouseTable.styles";
import { IWarehouseTableProp } from "./DesktopSuppliesTable";
import { Loading } from "../../../common/Loading";

const MobileSuppliesTable: React.FC<IWarehouseTableProp> = ({
  data,
  loading,
  form,
  setEditModalOpen,
  setArchiveModalOpen,
  setUnarchiveModalOpen,
  setHideModalOpen,
}) => {
  return (
    <>
      {!loading ? (
        data && data.length ? (
          <div className="w-100 my-3 pb-3">
            {data.map((supply) => {
              return (
                <Row className="my-3">
                  <S.TableRowHeader>
                    <S.TableColTitle>Item Code</S.TableColTitle>
                    <S.TableColContent>{supply.itemCode}</S.TableColContent>
                  </S.TableRowHeader>
                  <S.TableRowContent>
                    <S.TableColTitle>Description</S.TableColTitle>
                    <S.TableColContent>{supply.description}</S.TableColContent>
                  </S.TableRowContent>
                  <S.TableRowContent>
                    <S.TableColTitle>OUM</S.TableColTitle>
                    <S.TableColContent>{supply.oum}</S.TableColContent>
                  </S.TableRowContent>
                  <S.TableRowContent>
                    <S.TableColTitle>Total Qty</S.TableColTitle>
                    <S.TableColContent>{supply.totalQty}</S.TableColContent>
                  </S.TableRowContent>
                  <S.TableRowContent>
                    <S.TableColTitle>Remaining Qty</S.TableColTitle>
                    <S.TableColContent>{supply.remQty}</S.TableColContent>
                  </S.TableRowContent>
                  <S.TableRowContent>
                    <S.TableColTitle>Location</S.TableColTitle>
                    <S.TableColContent>{supply.location}</S.TableColContent>
                  </S.TableRowContent>
                  <S.TableRowContent>
                    <S.TableColTitle>Pending Order</S.TableColTitle>
                    <S.TableColContent>{supply.pendingOrder}</S.TableColContent>
                  </S.TableRowContent>
                  <S.TableRowContent>
                    <S.TableColTitle>PO Number</S.TableColTitle>
                    <S.TableColContent>{supply.poNumber}</S.TableColContent>
                  </S.TableRowContent>

                  <S.TableRowContent>
                    <S.TableColTitle>Action</S.TableColTitle>
                    <S.TableColContent>
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

export default MobileSuppliesTable;

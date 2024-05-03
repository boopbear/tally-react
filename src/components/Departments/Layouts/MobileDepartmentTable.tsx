import React from "react";
import { Button, Empty, Row, Space } from "antd";
import {
  EditOutlined,
  MinusOutlined,
  ReloadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import * as S from "../DepartmentsTable.styles";
import { DepartmentTableProp } from "./DesktopDepartmentTable";
import { Loading } from "../../common/Loading";

const MobileCUsersTable: React.FC<DepartmentTableProp> = ({
  data,
  showColumnIds,
  loading,
  form,
  setEditModalOpen,
  setArchiveModalOpen,
  setUnarchiveModalOpen,
  setHideModalOpen,
}) => {
  return !loading ? (
    data && data.length ? (
      <div className="w-100 my-3 pb-3">
        {data.map((department) => {
          return (
            <Row className="my-3">
              <S.CDepartmentsTableRowHeader>
                <S.CDepartmentsTableColTitle>Units</S.CDepartmentsTableColTitle>
                <S.CDepartmentsTableColContent>
                  {department.name}
                </S.CDepartmentsTableColContent>
              </S.CDepartmentsTableRowHeader>
              <S.CDepartmentsTableRowContent>
                <S.CDepartmentsTableColTitle>
                  Location
                </S.CDepartmentsTableColTitle>
                <S.CDepartmentsTableColContent
                  style={{ whiteSpace: "pre-line" }}
                >
                  {department.location}
                </S.CDepartmentsTableColContent>
              </S.CDepartmentsTableRowContent>
              <S.CDepartmentsTableRowContent>
                <S.CDepartmentsTableColTitle>
                  Action
                </S.CDepartmentsTableColTitle>
                <S.CDepartmentsTableColContent>
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
                </S.CDepartmentsTableColContent>
              </S.CDepartmentsTableRowContent>
            </Row>
          );
        })}
      </div>
    ) : (
      <Empty className="pt-5" />
    )
  ) : (
    <Loading className="pt-5" />
  );
};

export default MobileCUsersTable;

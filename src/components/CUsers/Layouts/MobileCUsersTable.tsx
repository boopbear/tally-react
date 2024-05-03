import React from "react";
import { Button, Empty, Row, Space } from "antd";
import {
  EditOutlined,
  MinusOutlined,
  ReloadOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import * as S from "../CUsersTable.styles";
import { CUserTableProp } from "./DesktopCUsersTable";
import { Loading } from "../../common/Loading";
import dayjs from "dayjs";

const MobileCUsersTable: React.FC<CUserTableProp> = ({
  data,
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
        {data.map((user) => {
          return (
            <Row className="my-3">
              <S.CUsersTableRowHeader>
                <S.CUsersTableColTitle>Employee Number</S.CUsersTableColTitle>
                <S.CUsersTableColContent>
                  {user.profile?.employeeNumber}
                </S.CUsersTableColContent>
              </S.CUsersTableRowHeader>
              <S.CUsersTableRowContent>
                <S.CUsersTableColTitle>Name</S.CUsersTableColTitle>
                <S.CUsersTableColContent>
                  {user.profile?.fullName}
                </S.CUsersTableColContent>
              </S.CUsersTableRowContent>
              <S.CUsersTableRowContent>
                <S.CUsersTableColTitle>Email</S.CUsersTableColTitle>
                <S.CUsersTableColContent style={{ overflowX: "auto" }}>
                  {user.email}
                </S.CUsersTableColContent>
              </S.CUsersTableRowContent>
              <S.CUsersTableRowContent>
                <S.CUsersTableColTitle>Unit/Department</S.CUsersTableColTitle>
                <S.CUsersTableColContent>
                  {user.department?.name}
                </S.CUsersTableColContent>
              </S.CUsersTableRowContent>
              <S.CUsersTableRowContent>
                <S.CUsersTableColTitle>Role</S.CUsersTableColTitle>
                <S.CUsersTableColContent>
                  {user.role != null
                    ? user.role === "SUPER_ADMIN"
                      ? "Super Admin"
                      : "Office Admin"
                    : ""}
                </S.CUsersTableColContent>
              </S.CUsersTableRowContent>
              <S.CUsersTableRowContent>
                <S.CUsersTableColTitle>Action</S.CUsersTableColTitle>
                <S.CUsersTableColContent>
                  <Space size="middle">
                    {!user.isArchived ? (
                      <>
                        <Button
                          onClick={() => {
                            form?.setFieldsValue({
                              ...user,
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
                </S.CUsersTableColContent>
              </S.CUsersTableRowContent>
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

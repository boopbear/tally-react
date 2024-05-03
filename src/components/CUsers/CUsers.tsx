import React from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Form,
  Input,
  MenuProps,
  Row,
  Select,
  Space,
  message,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { PageTitle } from "../common/PageTitle";
import { cUsersIsArchivedOptions } from "./CUsersConfig";
import { IDropdownItem } from "../../interfaces/inventory";
import { useResponsive } from "../../hooks/useResponsive";
import DesktopCUsersTable from "./Layouts/DesktopCUsersTable";
import MobileCUsersTable from "./Layouts/MobileCUsersTable";
import ModalCreateUser from "./ModalCreateUser";
import {
  BasicStatusResponse,
  ENDPOINTS,
  RES_STATUS,
  USER_DETAILS_LOCAL,
} from "../../constants";
import {
  IDepartmentsResponse,
  IUser,
  IUsersResponse,
} from "../../interfaces/user";
import { client } from "../../api/client";
import { IOptionsProp, ISearchQueryForm } from "../../interfaces/overview";
import ModalUpdateUser from "./ModalUpdateUser";
import ModalStatusUser from "./ModalStatusUser";
import { useNavigate } from "react-router";
import ModalHideUser from "./ModalHideUser";

const CUsers: React.FC = () => {
  const { mobileOnly } = useResponsive();
  const navigate = useNavigate();

  const [users, setUsers] = React.useState<IUser[]>([]);
  const [departmentOptions, setDepartmentOptions] =
    React.useState<IOptionsProp>({ loading: true });
  const [loadingUsers, setLoadingUsers] = React.useState(false);
  const [userNameQuery, setUserNameQuery] = React.useState("");
  const [selectedDepartment, setSelectedDepartment] = React.useState<number>();
  const [userStatusDisplay, setUserStatusDisplay] =
    React.useState<IDropdownItem>(cUsersIsArchivedOptions[0]);
  const [isCreateUserOpen, setIsCreateUserOpen] = React.useState(false);
  const [isUpdateUserOpen, setIsUpdateUserOpen] = React.useState(false);
  const [isArchiveUserOpen, setIsArchiveUserOpen] = React.useState(false);
  const [isArchivingUser, setIsArchivingUser] = React.useState(false);
  const [isUnarchiveUserOpen, setIsUnarchiveUserOpen] = React.useState(false);
  const [isUnarchivingUser, setIsUnarchivingUser] = React.useState(false);
  const [hideUserOpen, setHideUserOpen] = React.useState(false);
  const [form] = Form.useForm();

  const getUsers = React.useCallback(async (query?: ISearchQueryForm) => {
    setLoadingUsers(true);
    const endpoint = ENDPOINTS.user.getUsers(
      query?.page,
      query?.size,
      query?.keyword,
      query?.departmentId,
      query?.active
    );

    try {
      const result = await client<IUsersResponse>(endpoint);

      if (result.status !== RES_STATUS.success) {
        throw new Error("failed");
      } else {
        setUsers(result.users || []);
        setLoadingUsers(false);
      }
    } catch (err) {
      message.error("Unable to retrieve users");
      setLoadingUsers(false);
      console.log(err);
    }
  }, []);

  const getDepartments = React.useCallback(async (query?: ISearchQueryForm) => {
    const endpoint = ENDPOINTS.department.getDepartments(
      query?.page,
      query?.size,
      query?.keyword,
      query?.active
    );

    try {
      const result = await client<IDepartmentsResponse>(endpoint);

      if (result.status !== RES_STATUS.success) {
        throw new Error("failed");
      } else {
        setDepartmentOptions({
          options: result.departments?.map((department) => ({
            label: department.name || "",
            value: department.id.toString(),
          })),
          loading: false,
        });
      }
    } catch (err) {
      message.error("Unable to retrieve departments");
      setDepartmentOptions({ loading: false });
      console.log(err);
    }
  }, []);

  React.useEffect(() => {
    try {
      const details: IUser = JSON.parse(
        localStorage.getItem(USER_DETAILS_LOCAL) || ""
      );
      if (details.role !== "SUPER_ADMIN") {
        navigate("/");
      } else {
        getUsers({ active: true });
        getDepartments({ active: true });
      }
    } catch (e: any) {
      console.log(e.message);
      navigate("/");
    }
  }, [getUsers, getDepartments, navigate]);

  const cUsersIsArchivedMenu: MenuProps["items"] = cUsersIsArchivedOptions;

  const onClickUserStatusDisplay: MenuProps["onClick"] = ({ key }) => {
    setUserStatusDisplay(
      cUsersIsArchivedOptions[parseInt(key)] || cUsersIsArchivedOptions[0]
    );
  };

  const onFinishArchiveUser = async (userId?: number) => {
    setIsArchivingUser(true);
    const endpoint = ENDPOINTS.user.archiveUser;

    try {
      const formData = new FormData();
      formData.append("userId", userId?.toString() || "");

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });

      if (result.status !== RES_STATUS.success) {
        throw new Error("failed");
      } else {
        getUsers({
          keyword: userNameQuery,
          departmentId: selectedDepartment,
          active: userStatusDisplay.value,
        });
        setIsArchivingUser(false);
        setIsArchiveUserOpen(false);
      }
    } catch (err) {
      message.error("Something went wrong");
      setIsArchivingUser(false);
      setIsArchiveUserOpen(false);
      console.log(err);
    }
  };

  const onFinishUnarchiveUser = async (userId?: number) => {
    setIsUnarchivingUser(true);
    const endpoint = ENDPOINTS.user.unArchiveUser;

    try {
      const formData = new FormData();
      formData.append("userId", userId?.toString() || "");

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });

      if (result.status !== RES_STATUS.success) {
        throw new Error("failed");
      } else {
        getUsers({
          keyword: userNameQuery,
          departmentId: selectedDepartment,
          active: userStatusDisplay.value,
        });
        setIsUnarchivingUser(false);
        setIsUnarchiveUserOpen(false);
      }
    } catch (err) {
      message.error("Something went wrong");
      setIsUnarchivingUser(false);
      setIsUnarchiveUserOpen(false);
      console.log(err);
    }
  };

  return (
    <>
      <PageTitle>Users</PageTitle>
      <Card>
        <Row>
          <Col>
            <Row gutter={[10, 10]}>
              <Col>
                <Input
                  placeholder="Search name"
                  onChange={(e) => setUserNameQuery(e.target.value)}
                />
              </Col>
              <Col>
                <Select
                  allowClear
                  showSearch
                  style={{ width: "18rem" }}
                  placeholder="Unit/Department"
                  filterOption={(
                    input: string,
                    option?: { label: string; value: string }
                  ) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={departmentOptions?.options}
                  onChange={(value: string) =>
                    setSelectedDepartment(parseInt(value))
                  }
                  loading={departmentOptions?.loading}
                />
              </Col>
              <Col>
                <Dropdown
                  menu={{
                    items: cUsersIsArchivedMenu,
                    onClick: onClickUserStatusDisplay,
                  }}
                  trigger={["click"]}
                >
                  <Button className="text-start">
                    <Space>
                      {userStatusDisplay.label}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </Col>
              <Col>
                <Button
                  onClick={() =>
                    getUsers({
                      keyword: userNameQuery,
                      departmentId: selectedDepartment,
                      active: userStatusDisplay.value,
                    })
                  }
                  type="primary"
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Col>
          <Col className="pt-3 pt-sm-0" style={{ marginLeft: "auto" }}>
            <Row justify={"end"}>
              <Col>
                <Button
                  onClick={() => setIsCreateUserOpen(true)}
                  className="button1"
                >
                  {"+ Create User"}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row style={{ placeContent: "center" }}>
          {mobileOnly ? (
            <MobileCUsersTable
              data={users}
              loading={loadingUsers}
              form={form}
              setEditModalOpen={setIsUpdateUserOpen}
              setArchiveModalOpen={setIsArchiveUserOpen}
              setUnarchiveModalOpen={setIsUnarchiveUserOpen}
              setHideModalOpen={setHideUserOpen}
            />
          ) : (
            <DesktopCUsersTable
              data={users}
              loading={loadingUsers}
              form={form}
              setEditModalOpen={setIsUpdateUserOpen}
              setArchiveModalOpen={setIsArchiveUserOpen}
              setUnarchiveModalOpen={setIsUnarchiveUserOpen}
              setHideModalOpen={setHideUserOpen}
            />
          )}
        </Row>
      </Card>
      <ModalCreateUser
        title="Register a new account"
        isModalOpen={isCreateUserOpen}
        setModalOpen={setIsCreateUserOpen}
        overloadOnFinish={() =>
          getUsers({
            keyword: userNameQuery,
            departmentId: selectedDepartment,
            active: userStatusDisplay.value,
          })
        }
        departmentOptions={departmentOptions}
      />
      <ModalUpdateUser
        title="Update account details"
        isModalOpen={isUpdateUserOpen}
        setModalOpen={setIsUpdateUserOpen}
        mainForm={form}
        overloadOnFinish={() =>
          getUsers({
            keyword: userNameQuery,
            departmentId: selectedDepartment,
            active: userStatusDisplay.value,
          })
        }
        departmentOptions={departmentOptions}
      />
      <ModalStatusUser
        title="Confirm disable user?"
        isModalOpen={isArchiveUserOpen}
        setModalOpen={setIsArchiveUserOpen}
        mainForm={form}
        submitting={isArchivingUser}
        onFinish={({ id }) => onFinishArchiveUser(id)}
      />
      <ModalStatusUser
        title="Confirm enable user?"
        isModalOpen={isUnarchiveUserOpen}
        setModalOpen={setIsUnarchiveUserOpen}
        mainForm={form}
        submitting={isUnarchivingUser}
        onFinish={({ id }) => onFinishUnarchiveUser(id)}
      />
      <ModalHideUser
        mainForm={form}
        isModalOpen={hideUserOpen}
        setModalOpen={setHideUserOpen}
        overloadOnFinish={() => {
          getUsers({
            keyword: userNameQuery,
            departmentId: selectedDepartment,
            active: userStatusDisplay.value,
          });
        }}
      />
    </>
  );
};

export default CUsers;

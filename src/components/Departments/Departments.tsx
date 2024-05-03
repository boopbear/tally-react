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
  Space,
  message,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import { PageTitle } from "../common/PageTitle";
import { cDepartmentsIsArchivedOptions } from "./DepartmentsConfig";
import { IDropdownItem } from "../../interfaces/inventory";
import { useResponsive } from "../../hooks/useResponsive";
import DesktopCDepartmentsTable from "./Layouts/DesktopDepartmentTable";
import MobileCDepartmentsTable from "./Layouts/MobileDepartmentTable";
import ModalCreateDepartment from "./ModalCreateDepartment";
import {
  BasicStatusResponse,
  ENDPOINTS,
  RES_STATUS,
  USER_DETAILS_LOCAL,
} from "../../constants";
import {
  IDepartment,
  IDepartmentsResponse,
  IUser,
} from "../../interfaces/user";
import { client } from "../../api/client";
import { ISearchQueryForm } from "../../interfaces/overview";
import ModalUpdateDepartment from "./ModalUpdateDepartment";
import ModalStatusDepartment from "./ModalStatusDepartment";
import { useNavigate } from "react-router";
import ModalHideDepartment from "./ModalHideDepartment";

const Departments: React.FC = () => {
  const { mobileOnly } = useResponsive();
  const navigate = useNavigate();

  const [departments, setDepartments] = React.useState<IDepartment[]>([]);
  const [loadingDepartments, setLoadingDepartments] = React.useState(false);
  const [departmentNameQuery, setDepartmentNameQuery] = React.useState("");
  const [departmentStatusDisplay, setDepartmentStatusDisplay] =
    React.useState<IDropdownItem>(cDepartmentsIsArchivedOptions[0]);
  const [isCreateDepartmentOpen, setIsCreateDepartmentOpen] =
    React.useState(false);
  const [isUpdateDepartmentOpen, setIsUpdateDepartmentOpen] =
    React.useState(false);
  const [isArchiveDepartmentOpen, setIsArchiveDepartmentOpen] =
    React.useState(false);
  const [isArchivingDepartment, setIsArchivingDepartment] =
    React.useState(false);
  const [isUnarchiveDepartmentOpen, setIsUnarchiveDepartmentOpen] =
    React.useState(false);
  const [isUnarchivingDepartment, setIsUnarchivingDepartment] =
    React.useState(false);
  const [hideDepartmentOpen, setHideDepartmentOpen] = React.useState(false);

  const [form] = Form.useForm();

  const getDepartments = React.useCallback(async (query?: ISearchQueryForm) => {
    setLoadingDepartments(true);
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
        setDepartments(result.departments || []);
        setLoadingDepartments(false);
      }
    } catch (err) {
      message.error("Unable to retrieve departments");
      setLoadingDepartments(false);
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
        getDepartments({ active: true });
      }
    } catch (e: any) {
      console.log(e.message);
      navigate("/");
    }
  }, [getDepartments, navigate]);

  const cDepartmentsIsArchivedMenu: MenuProps["items"] =
    cDepartmentsIsArchivedOptions;

  const onClickDepartmentStatusDisplay: MenuProps["onClick"] = ({ key }) => {
    setDepartmentStatusDisplay(
      cDepartmentsIsArchivedOptions[parseInt(key)] ||
        cDepartmentsIsArchivedOptions[0]
    );
  };

  const onFinishArchiveDepartment = async (departmentId?: number) => {
    setIsArchivingDepartment(true);
    const endpoint = ENDPOINTS.department.archiveDepartment;

    try {
      const formData = new FormData();
      formData.append("departmentId", departmentId?.toString() || "");

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });

      if (result.status !== RES_STATUS.success) {
        throw new Error("failed");
      } else {
        getDepartments({
          keyword: departmentNameQuery,
          active: departmentStatusDisplay.value,
        });
        setIsArchivingDepartment(false);
        setIsArchiveDepartmentOpen(false);
      }
    } catch (err) {
      message.error("Something went wrong");
      setIsArchivingDepartment(false);
      setIsArchiveDepartmentOpen(false);
      console.log(err);
    }
  };

  const onFinishUnarchiveDepartment = async (DepartmentId?: number) => {
    setIsUnarchivingDepartment(true);
    const endpoint = ENDPOINTS.department.unArchiveDepartment;

    try {
      const formData = new FormData();
      formData.append("departmentId", DepartmentId?.toString() || "");

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });

      if (result.status !== RES_STATUS.success) {
        throw new Error("failed");
      } else {
        getDepartments({
          keyword: departmentNameQuery,
          active: departmentStatusDisplay.value,
        });
        setIsUnarchivingDepartment(false);
        setIsUnarchiveDepartmentOpen(false);
      }
    } catch (err) {
      message.error("Something went wrong");
      setIsUnarchivingDepartment(false);
      setIsUnarchiveDepartmentOpen(false);
      console.log(err);
    }
  };

  return (
    <>
      <PageTitle>Units</PageTitle>
      <Card>
        <Row>
          <Col>
            <Row gutter={[10, 10]}>
              <Col>
                <Input
                  placeholder="Search units"
                  onChange={(e) => setDepartmentNameQuery(e.target.value)}
                />
              </Col>
              <Col>
                <Dropdown
                  menu={{
                    items: cDepartmentsIsArchivedMenu,
                    onClick: onClickDepartmentStatusDisplay,
                  }}
                  trigger={["click"]}
                >
                  <Button className="text-start">
                    <Space>
                      {departmentStatusDisplay.label}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </Col>
              <Col>
                <Button
                  onClick={() =>
                    getDepartments({
                      keyword: departmentNameQuery,
                      active: departmentStatusDisplay.value,
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
                  onClick={() => setIsCreateDepartmentOpen(true)}
                  className="button1"
                >
                  {"+ Add Unit"}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row style={{ placeContent: "center" }}>
          {mobileOnly ? (
            <MobileCDepartmentsTable
              data={departments}
              loading={loadingDepartments}
              form={form}
              setEditModalOpen={setIsUpdateDepartmentOpen}
              setArchiveModalOpen={setIsArchiveDepartmentOpen}
              setUnarchiveModalOpen={setIsUnarchiveDepartmentOpen}
              setHideModalOpen={setHideDepartmentOpen}
            />
          ) : (
            <DesktopCDepartmentsTable
              data={departments}
              loading={loadingDepartments}
              form={form}
              setEditModalOpen={setIsUpdateDepartmentOpen}
              setArchiveModalOpen={setIsArchiveDepartmentOpen}
              setUnarchiveModalOpen={setIsUnarchiveDepartmentOpen}
              setHideModalOpen={setHideDepartmentOpen}
            />
          )}
        </Row>
      </Card>
      <ModalCreateDepartment
        title="Add new unit/department"
        isModalOpen={isCreateDepartmentOpen}
        setModalOpen={setIsCreateDepartmentOpen}
        overloadOnFinish={() =>
          getDepartments({
            keyword: departmentNameQuery,
            active: departmentStatusDisplay.value,
          })
        }
      />
      <ModalUpdateDepartment
        title="Update unit/department details"
        isModalOpen={isUpdateDepartmentOpen}
        setModalOpen={setIsUpdateDepartmentOpen}
        mainForm={form}
        overloadOnFinish={() =>
          getDepartments({
            keyword: departmentNameQuery,
            active: departmentStatusDisplay.value,
          })
        }
      />
      <ModalStatusDepartment
        title="Confirm disable unit/department?"
        isModalOpen={isArchiveDepartmentOpen}
        setModalOpen={setIsArchiveDepartmentOpen}
        mainForm={form}
        submitting={isArchivingDepartment}
        onFinish={({ id }) => onFinishArchiveDepartment(id)}
      />
      <ModalStatusDepartment
        title="Confirm enable unit/department?"
        isModalOpen={isUnarchiveDepartmentOpen}
        setModalOpen={setIsUnarchiveDepartmentOpen}
        mainForm={form}
        submitting={isUnarchivingDepartment}
        onFinish={({ id }) => onFinishUnarchiveDepartment(id)}
      />
      <ModalHideDepartment
        mainForm={form}
        isModalOpen={hideDepartmentOpen}
        setModalOpen={setHideDepartmentOpen}
        overloadOnFinish={() => {
          getDepartments({
            keyword: departmentNameQuery,
            active: departmentStatusDisplay.value,
          });
        }}
      />
    </>
  );
};

export default Departments;

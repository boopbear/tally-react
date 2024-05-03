import React from "react";
import { PageTitle } from "../common/PageTitle";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Select,
  message,
} from "antd";
import DesktopLogsTable from "./Layouts/DesktopLogsTable";
import { useResponsive } from "../../hooks/useResponsive";
import MobileLogsTable from "./Layouts/MobileLogsTable";
import { IOptionsProp, ISearchInventory } from "../../interfaces/overview";
import { ENDPOINTS, RES_STATUS, USER_DETAILS_LOCAL } from "../../constants";
import { client } from "../../api/client";
import { ILogs, ILogsResponse } from "../../interfaces/logs";
import {
  IInventoryCategoriesResponse,
  IInventoryCategoryOption,
} from "../../interfaces/inventory";
import { orderByOptions } from "../Inventory/InventoryConfig";
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import dayjs from "dayjs";
import json from "json-keys-sort";
import ModalDestroyLogs from "./Modal/ModalDestroyLogs";
import { useNavigate } from "react-router";
import { IUser } from "../../interfaces/user";

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    padding: 20,
  },
  text: {
    marginBottom: 10,
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    flex: 1,
    marginVertical: 5,
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  }
});

const Logs: React.FC = () => {
  const { mobileOnly } = useResponsive();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [assetLogs, setAssetLogs] = React.useState<ILogs[]>([]);
  const [categoryOptions, setCategoryOptions] =
    React.useState<IInventoryCategoryOption>({
      categoryOption: { loading: true },
    });
  const [assetStatusOptions, setAssetStatusOptions] =
    React.useState<IOptionsProp>({});
  const [selectedStatus, setSelectedStatus] = React.useState<
    string | undefined
  >();
  React.useState<IOptionsProp>({ loading: true });

  const [retrievingLogs, setRetrievingLogs] = React.useState(false);
  const [destroyLogsOpen, setDestroyLogsOpen] = React.useState(false);
  const [querySearch, setQuerySearch] = React.useState<ISearchInventory>();

  const onFinishSearchInput = async (values?: ISearchInventory) => {
    setRetrievingLogs(true);
    setQuerySearch(values);
    const endpoint = ENDPOINTS.log.getLogs(
      values?.startDate,
      values?.endDate,
      values?.categoryId,
      values?.assetStatusId,
      values?.orderByRef,
      values?.orderBy,
      values?.page,
      values?.size,
      values?.keyword
    );

    try {
      const result = await client<ILogsResponse>(endpoint);

      if (result.status !== RES_STATUS.success) {
        throw new Error(result.message);
      } else {
        setAssetLogs(result.assetLogs || []);
        setRetrievingLogs(false);
      }
    } catch (err: any) {
      message.error(err.message);
      setRetrievingLogs(false);
      console.log(err);
    }
  };

  const onFinishSearchInputFailed = (errorInfo: any) => {
    console.log(errorInfo);
    return;
  };

  const onCancelSearchInput = () => {
    form.resetFields();
    setAssetStatusOptions({});
    setSelectedStatus(undefined);
  };

  const onChangeSelectCategory = (value: string) => {
    setAssetStatusOptions(
      categoryOptions?.assetStatusOption?.find(
        (o) => o.keyRef === parseInt(value)
      ) || {}
    );
    form.setFieldValue("assetStatusId", null);
    setSelectedStatus(undefined);
  };

  const getInventoryCategories = React.useCallback(async () => {
    const endpoint = ENDPOINTS.inventory.getCategories;

    try {
      const result = await client<IInventoryCategoriesResponse>(endpoint);

      if (result.status !== RES_STATUS.success) {
        throw new Error("failed");
      } else {
        const catOptions = {
          categoryOption: {
            options: result.inventoryCategories?.map((category) => ({
              key: category.id.toString(),
              label: category.name || "",
              value: category.id.toString(),
            })),
            loading: false,
          },
          assetStatusOption: result.inventoryCategories?.map((category) => {
            return {
              keyRef: category.id,
              options: category.inventoryStatusList?.map((status) => ({
                key: status.id.toString(),
                label: status.name || "",
                value: status.id.toString(),
              })),
              loading: false,
            };
          }),
        };

        setCategoryOptions(catOptions);
      }
    } catch (err) {
      message.error("Unable to retrieve categories");
      setCategoryOptions({ categoryOption: { loading: false } });
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
        getInventoryCategories();
      }
    } catch (e: any) {
      console.log(e.message);
      navigate("/");
    }
  }, [getInventoryCategories, navigate]);

  const generatePDFData = () => {
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <View style={styles.section}>
            <Text>Asset Logs</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableCell, styles.tableHeader]}>
                  <Text>Asset Code</Text>
                </View>
                <View style={[styles.tableCell, styles.tableHeader]}>
                  <Text>User</Text>
                </View>
                <View style={[styles.tableCell, styles.tableHeader]}>
                  <Text>Category</Text>
                </View>
                <View style={[styles.tableCell, styles.tableHeader]}>
                  <Text>Time Stamp</Text>
                </View>
                <View style={[styles.tableCell, styles.tableHeader]}>
                  <Text>Details</Text>
                </View>
                <View style={[styles.tableCell, styles.tableHeader]}>
                  <Text>Remarks/Reason</Text>
                </View>
              </View>
              {(assetLogs || []).map((log) => (
                <View style={styles.tableRow} key={log.id}>
                  <View style={styles.tableCell}>
                    <Text>{log.inventoryAsset?.assetCode || "Unknown"}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{log.responsible?.profile?.fullName || "Unknown"}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{log.inventoryCategory?.name || "Unknown"}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{log.createdAt ? dayjs(log.createdAt).format("DD/MM/YYYY h:mm:ss") : "N/A"}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{getDetails(log)}</Text>
                  </View>
                  <View style={styles.tableCell}>
                    <Text>{getRemarks(log)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </Page>
      </Document>
    );
  };

  const getDetails = (log: ILogs) => {
    const entries = Object.entries(json.sort(log.details || {}, true));
    return entries
      .filter(([key]) => !key.toLowerCase().includes("reason") && !key.toLowerCase().includes("remark"))
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  const getRemarks = (log: ILogs) => {
    const entries = Object.entries(json.sort(log.details || {}, true));
    return entries
      .filter(([key]) => key.toLowerCase().includes("reason") || key.toLowerCase().includes("remark"))
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
  };

  return (
    <>
      <PageTitle>Asset Logs</PageTitle>
      <Card>
        <Form
          name="logSearchForm"
          form={form}
          onFinish={onFinishSearchInput}
          onFinishFailed={onFinishSearchInputFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Row>
            <Col className="mb-3">
              <Row gutter={[10, 10]}>
                <Col>
                  <Form.Item<ISearchInventory>
                    name="keyword"
                    rules={[
                      { required: true, message: "This field is required" },
                    ]}
                  >
                    <Input
                      placeholder="Asset Code"
                      style={{ minWidth: "16rem" }}
                      allowClear
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[10, 10]} className="mt-2">
                <Col>
                  <Form.Item<ISearchInventory> name="categoryId">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Select a category"
                      filterOption={(
                        input: string,
                        option?: { label: string; value: string }
                      ) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={categoryOptions?.categoryOption?.options}
                      loading={categoryOptions?.categoryOption?.loading}
                      onChange={onChangeSelectCategory}
                      style={{ minWidth: "7rem" }}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item<ISearchInventory> name="assetStatusId">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Select a status"
                      filterOption={(
                        input: string,
                        option?: { label: string; value: string }
                      ) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={assetStatusOptions?.options}
                      loading={assetStatusOptions?.loading}
                      onChange={(value?: string) => setSelectedStatus(value)}
                      value={selectedStatus}
                      style={{ minWidth: "10rem" }}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item<ISearchInventory> name="orderBy">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Order date by"
                      filterOption={(
                        input: string,
                        option?: { label: string; value: string }
                      ) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={orderByOptions}
                      loading={false}
                      style={{ minWidth: "8rem" }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[10, 10]}>
                <Col>
                  <Form.Item<ISearchInventory> name="startDate">
                    <DatePicker placeholder="From" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item<ISearchInventory> name="endDate">
                    <DatePicker placeholder="To" />
                  </Form.Item>
                </Col>
                <Col>
                  <Row gutter={[10, 10]}>
                    <Col>
                      <Button
                        form="logSearchForm"
                        key="submit"
                        type="primary"
                        htmlType="submit"
                        disabled={retrievingLogs}
                      >
                        Search
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        key="cancel"
                        type="primary"
                        onClick={() => onCancelSearchInput()}
                        ghost
                      >
                        Clear Filter
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col style={{ marginLeft: "auto" }}>
              <Row justify={"end"}>
                <Col>
                <Button type="primary">
                <PDFDownloadLink
  document={generatePDFData()}
  fileName={`AssetLogs_${dayjs(new Date()).format("YYYYDDMMhmmss")}.pdf`}
>
  {({ blob, url, loading, error }) =>
    loading ? 'Loading document...' : 'Export as PDF'
  }
</PDFDownloadLink>
                  </Button>
                  
                </Col>
              </Row>
              <Row justify={"end"} className="mt-2">
                <Col>
                <Button
                    onClick={() => {
                      form.setFieldValue("logs", assetLogs);
                      setDestroyLogsOpen(true);
                    }}
                  style={{ backgroundColor: 'none', color: 'red', border: '1px solid red' }}
                  >
                    {"Delete"}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
        <Row>
          {mobileOnly ? (
            <MobileLogsTable data={assetLogs} loading={retrievingLogs} />
          ) : (
            <DesktopLogsTable data={assetLogs} loading={retrievingLogs} />
          )}
        </Row>
      </Card>
      <ModalDestroyLogs
        isModalOpen={destroyLogsOpen}
        setModalOpen={setDestroyLogsOpen}
        overloadOnFinish={() => onFinishSearchInput(querySearch)}
        mainForm={form}
      />
    </>
  );
};

export default Logs;

import {
  Button,
  Card,
  Checkbox,
  Col,
  Form,
  Input,
  MenuProps,
  Row,
  Space,
  UploadFile,
  message,
} from "antd";
import { DownOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import React from "react";
import { Dropdown } from "../common/Dropdown/Dropdown";
import { ENDPOINTS, RES_STATUS, USER_DETAILS_LOCAL } from "../../constants";
import {
  IInventoryAsset,
  IInventoryAssetResponse,
  IInventoryCategoriesResponse,
  IInventoryCategoryOption,
} from "../../interfaces/inventory";
import { orderByOptions, assetIsArchivedOptions } from "./InventoryConfig";
import DesktopInventoryTable from "./Layouts/DesktopInventoryTable";
import { useResponsive } from "../../hooks/useResponsive";
import MobileInventoryTable from "./Layouts/MobileInventoryTable";
import { PageTitle } from "../common/PageTitle";
import ModalCreateAsset from "./Modals/ModalCreateAsset";
import {
  IOption,
  IOptionsProp,
  ISearchInventory,
  ISearchQueryForm,
} from "../../interfaces/overview";
import { client } from "../../api/client";
import {
  IDepartment,
  IDepartmentsResponse,
  IUser,
} from "../../interfaces/user";
import ModalUpdateAsset from "./Modals/ModalUpdateAsset";
import ModalArchiveAsset from "./Modals/ModalArchiveAsset";
import ModalUnarchiveAsset from "./Modals/ModalUnarchiveAsset";
import ModalTransactAsset from "../TransactAsset/ModalTransactAsset";
import { useSearchParams } from "react-router-dom";
import ModalDestroyAsset from "./Modals/ModalDestroyAsset";
import ModalImportAssets from "./Modals/ModalImportAssets";
import { CheckboxValueType } from "antd/es/checkbox/Group";
import ModalTurnOverRequest from "./Modals/ModalTurnOverRequest";
import ModalPurchaseRequest from "./Modals/ModalPurchaseRequest";
import ModalDonateRequest from "./Modals/ModalDonateRequest";
import ModalCurrentInventoryRequest from "./Modals/ModalCurrentInventoryRequest";
import { CSVLink } from "react-csv";
import dayjs from "dayjs";
import { PDFDownloadLink, Page, Text, Document, StyleSheet, View } from '@react-pdf/renderer';
import { ASSET_SCAN_PATH } from "../../router/AppRouter";


const DEFAULT_VISIBLE_COLS = [
  "description",
  "serialNumber",
  "status",
  "endUser",
  "dateReceived",
  "poNumber",
  "itemCategory",
];



const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 12,
    padding: 20,
  },
  text: {
    marginBottom: 10,
  },
});

const Inventory: React.FC = () => {
  
  const { mobileOnly } = useResponsive();
  const [form] = Form.useForm();
  const [userLoggedIn, setUserLoggedIn] = React.useState<IUser | undefined>();
  const [retrievingAssets, setRetrievingAssets] = React.useState(false);
  const [inventoryAssets, setInventoryAssets] = React.useState< IInventoryAsset[] >([]);
  const [departments, setDepartments] = React.useState<IDepartment[]>([]);
  const [departmentOptions, setDepartmentOptions] =
    React.useState<IOptionsProp>({ loading: true });
  const [categoryOptions, setCategoryOptions] =
    React.useState<IInventoryCategoryOption>({
      categoryOption: { loading: true },
    });
  const [assetStatusOptions, setAssetStatusOptions] =
    React.useState<IOptionsProp>();
  const [selectedInventory, setSelectedInventory] = React.useState<IOption>();
  const [selectedStatus, setSelectedStatus] = React.useState<IOption>();
  const [selectedOrderBy, setSelectedOrderBy] = React.useState<IOption>(
    orderByOptions[1]
  );
  const [selectedAssetArchiveStatus, setSelectedAssetArchiveStatus] =
    React.useState<IOption>(assetIsArchivedOptions[0]);
  const [currentKeyword, setCurrentKeyword] = React.useState<string>();

  const [createAssetOpen, setCreateAssetOpen] = React.useState(false);
  const [updateAssetOpen, setUpdateAssetOpen] = React.useState(false);
  const [archiveAssetOpen, setArchiveAssetOpen] = React.useState(false);
  const [unarchiveAssetOpen, setUnarchiveAssetOpen] = React.useState(false);
  const [destroyAssetOpen, setDestroyAssetOpen] = React.useState(false);
  const [transactAssetOpen, setTranscatAssetOpen] = React.useState(false);
  const [importAssetsOpen, setImportAssetsOpen] = React.useState(false);

  const [currentInventoryRequestOpen, setCurrentInventoryRequestOpen] =
    React.useState(false);
  const [turnOverRequestOpen, setTurnOverRequestOpen] = React.useState(false);
  const [purchaseRequestOpen, setPurchaseRequestOpen] = React.useState(false);
  const [donateRequestOpen, setDonateRequestOpen] = React.useState(false);

  const [existingPics, setExistingPics] = React.useState<UploadFile<any>[]>([]);
  const [searchParams] = useSearchParams();

  const [visibleColumns, setVisibleColumns] =
    React.useState<string[]>(DEFAULT_VISIBLE_COLS);

  const getInventoryAssets = React.useCallback(
    async (query?: ISearchInventory) => {
      setRetrievingAssets(true);
      
      const showCurrentInventory =
        userLoggedIn?.customSettingsData?.hasCurrentInventoryAccess === "true";
      const categoryIdQuery =
        query?.categoryId ||
        (userLoggedIn?.role === "SUPER_ADMIN"
          ? 1
          : showCurrentInventory
          ? 1
          : 2);

      const endpoint = ENDPOINTS.inventory.getAssets(
        categoryIdQuery,
        query?.assetStatusId,
        query?.page,
        query?.size,
        query?.keyword,
        query?.orderBy,
        query?.active
      );

      try {
        const result = await client<IInventoryAssetResponse>(endpoint);

        if (result.status !== RES_STATUS.success) {
          throw new Error("failed");
        } else {
          setInventoryAssets(result.inventoryAssets || []);
          setRetrievingAssets(false);
        }
      } catch (err) {
        setRetrievingAssets(false);
        message.error("Unable to retrieve inventory");
        console.log(err);
      }
    },
    [
      userLoggedIn?.customSettingsData?.hasCurrentInventoryAccess,
      userLoggedIn?.role,
    ]
  );

  const getInventoryAssetBySharedId = React.useCallback(
    async (query?: ISearchInventory) => {
      setRetrievingAssets(true);
      const endpoint = ENDPOINTS.inventory.getAssetBySharedId(query?.sharedId);

      try {
        const result = await client<IInventoryAssetResponse>(endpoint);

        if (result.status !== RES_STATUS.success) {
          throw new Error(result.message);
        } else {
          setInventoryAssets(result.inventoryAssets || []);
          setRetrievingAssets(false);
        }
      } catch (err: any) {
        setRetrievingAssets(false);
        message.error(err.message);
        console.log(err);
      }
    },
    []
  );

  const getDepartments = React.useCallback(async (query?: ISearchQueryForm) => {
    const endpoint = ENDPOINTS.department.getDepartments(
      query?.page,
      query?.size,
      query?.keyword,
      true
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
        setDepartments(result.departments || []);
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
      setUserLoggedIn(details);

      const getInventoryCategories = async () => {
        const endpoint = ENDPOINTS.inventory.getCategories;

        try {
          const result = await client<IInventoryCategoriesResponse>(endpoint);

          if (result.status !== RES_STATUS.success) {
            throw new Error("failed");
          } else {
            const catOptions = {
              categoryOption: {
                options: result.inventoryCategories
                  ?.map((category) => {
                    return {
                      key: category.id.toString(),
                      label: category.name || "",
                      value: category.id.toString(),
                    };
                  })
                  .filter((o) => {
                    if (
                      o.label.toLowerCase().includes("current") &&
                      !(
                        details?.customSettingsData
                          ?.hasCurrentInventoryAccess === "true"
                      )
                    ) {
                      return false;
                    }
                    return true;
                  }),
                loading: false,
              },
              assetStatusOption: result.inventoryCategories
                ?.map((category) => {
                  return {
                    keyRef: category.id,
                    options: [
                      { key: "", label: "All Status", value: "" },
                      ...(category.inventoryStatusList?.map((status) => ({
                        key: status.id.toString(),
                        label: status.name || "",
                        value: status.id.toString(),
                      })) || []),
                    ],
                    loading: false,
                  };
                })
                .filter((o) => {
                  if (
                    o.keyRef === 1 &&
                    !(
                      details?.customSettingsData?.hasCurrentInventoryAccess ===
                      "true"
                    )
                  ) {
                    return false;
                  }
                  return true;
                }),
            };

            setCategoryOptions(catOptions);
            setSelectedInventory((catOptions.categoryOption.options || [])[0]);
            setSelectedStatus(
              (catOptions.assetStatusOption || [])[0].options[0]
            );
            setAssetStatusOptions((catOptions.assetStatusOption || [])[0]);
          }
        } catch (err) {
          message.error("Unable to retrieve categories");
          setCategoryOptions({ categoryOption: { loading: false } });
          console.log(err);
        }
      };

      getInventoryCategories();
    } catch (e: any) {
      console.log(e.message);
    }

    const assetScanSharedId = searchParams.get("sharedId");
    if (assetScanSharedId != null && assetScanSharedId !== "") {
      getInventoryAssetBySharedId({ sharedId: assetScanSharedId });
    } else {
      getInventoryAssets({ active: true });
    }
    getDepartments();
  }, [
    getInventoryAssets,
    getDepartments,
    getInventoryAssetBySharedId,
    searchParams,
  ]);

  const onClickInventoryCategory: MenuProps["onClick"] = ({ key }) => {
    setSelectedInventory(
      categoryOptions.categoryOption?.options?.find((o) => o.key === key)
    );
    setAssetStatusOptions(
      categoryOptions.assetStatusOption?.find(
        (o) => o.keyRef === parseInt(key)
      ) || {}
    );
    setSelectedStatus(
      ((categoryOptions?.assetStatusOption || [])[0].options || [])[0]
    );
  };

  const onClickAssetStatus: MenuProps["onClick"] = ({ key }) => {
    setSelectedStatus(assetStatusOptions?.options?.find((o) => o.key === key));
  };

  const onClickOrderBy: MenuProps["onClick"] = ({ key }) => {
    setSelectedOrderBy(orderByOptions[parseInt(key)]);
  };

  // const onClickQrStatus: MenuProps["onClick"] = ({ key }) => {
  //   setSelectedQrStatus(qrStatusOptions[parseInt(key)]);
  // };

  const onClickAssetArchiveStatus: MenuProps["onClick"] = ({ key }) => {
    setSelectedAssetArchiveStatus(assetIsArchivedOptions[parseInt(key)]);
  };

  const onClickResetFilter = () => {
    setSelectedInventory((categoryOptions?.categoryOption?.options || [])[0]);
    setSelectedStatus(
      ((categoryOptions?.assetStatusOption || [])[0].options || [])[0]
    );
    setAssetStatusOptions((categoryOptions.assetStatusOption || [])[0]);
    setSelectedOrderBy(orderByOptions[1]);
    // setSelectedQrStatus(qrStatusOptions[1]);
    setSelectedAssetArchiveStatus(assetIsArchivedOptions[0]);
    setCurrentKeyword("");
  };

  const onChangeCheckColumn = (checkedValues: CheckboxValueType[]) => {
    setVisibleColumns(checkedValues as string[]);
  };

  const generatePdf = () => {
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
    });
    
  
    const MyDocument = (
      <Document>
 <Page size="A4" orientation="landscape" style={styles.page}>
 <Text>Asset Movement / Inventory</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.tableHeader]}>
            <Text>Asset Code</Text>
          </View>
          <View style={[styles.tableCell, styles.tableHeader]}>
            <Text>Item Category</Text>
          </View>
          <View style={[styles.tableCell, styles.tableHeader]}>
            <Text>Description</Text>
          </View>
          <View style={[styles.tableCell, styles.tableHeader]}>
            <Text>Serial Number</Text>
          </View>
          <View style={[styles.tableCell, styles.tableHeader]}>
            <Text>End User</Text>
          </View>
        </View>
        {inventoryAssets.map((ia) => (
          <View style={styles.tableRow} key={ia.assetCode}>
            <View style={styles.tableCell}>
              <Text>{ia.assetCode}</Text>
            </View>
            <View style={[styles.tableCell]}>
              <Text>{ia.inventoryCategory?.name}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{ia.description}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{ia.serialNumber}</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>{ia.endUser}</Text>
            </View>
          </View>
            ))}
          </View>
        </Page>
      </Document>
    );
  
    return MyDocument;
  };

  return (
    <>
      <PageTitle>Asset Movement</PageTitle>
      <Card>
        <Row>
          <Col>
            <Row gutter={[10, 10]}>
              <Col>
                <Dropdown
                  menu={{
                    items: categoryOptions.categoryOption
                      ?.options as MenuProps["items"],
                    onClick: onClickInventoryCategory,
                  }}
                  trigger={["click"]}
                >
                  <Button className="text-start">
                    <Space>
                      {selectedInventory?.label || "Inventory"}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </Col>
              <Col>
                <Input
                  placeholder="Asset Code"
                  value={currentKeyword}
                  onChange={(e) => setCurrentKeyword(e.target.value)}
                  allowClear
                />
              </Col>
            </Row>
            <Row gutter={[10, 10]} className="mt-2">
              <Col>
                <Dropdown
                  menu={{
                    items: assetStatusOptions?.options as MenuProps["items"],
                    onClick: onClickAssetStatus,
                  }}
                  trigger={["click"]}
                >
                  <Button className="text-start">
                    <Space>
                      {selectedStatus?.label || "Status"}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </Col>
              <Col>
                <Dropdown
                  menu={{
                    items: orderByOptions as MenuProps["items"],
                    onClick: onClickOrderBy,
                  }}
                  trigger={["click"]}
                >
                  <Button className="text-start">
                    <Space>
                      {selectedOrderBy.label || "OrderBy"}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </Col>
              <Col>
                <Dropdown
                  menu={{
                    items: assetIsArchivedOptions as MenuProps["items"],
                    onClick: onClickAssetArchiveStatus,
                  }}
                  trigger={["click"]}
                >
                  <Button className="text-start">
                    <Space>
                      {selectedAssetArchiveStatus.label || "Active"}
                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </Col>
              <Col>
                <Button
                  onClick={() =>
                    getInventoryAssets({
                      categoryId: parseInt(selectedInventory?.value || "1"),
                      assetStatusId: parseInt(selectedStatus?.value || ""),
                      orderBy: selectedOrderBy.value,
                      active: selectedAssetArchiveStatus.value === "true",
                      keyword: currentKeyword,
                    })
                  }
                  type="primary"
                >
                  Search
                </Button>
              </Col>
              <Col>
                <Button onClick={onClickResetFilter} type="primary" ghost>
                  Clear Filter
                </Button>
              </Col>
            </Row>
          </Col>
          {userLoggedIn?.role === "SUPER_ADMIN" ? (
            <>
              <Col className="mt-2" style={{ marginLeft: "auto" }}>
                <Row justify={"end"}>
                  <Col>
                    <Button
                      onClick={() => setImportAssetsOpen(true)}
                      style={{ border: "none" }}
                      className="button1"
                    >
                      {"Import CSV"}
                    </Button>
                  </Col>
                </Row>
                <Row justify={"end"} className="mt-2">
                  <Col>
                    <Button
                      onClick={() => setCreateAssetOpen(true)}
                      type="default"
                      className="button1"
                    >
                      {"+ New Asset"}
                    </Button>
                  </Col>
                </Row>
              </Col>
            </>
          ) : (
            userLoggedIn?.customSettingsData?.hasCurrentInventoryAccess ===
              "false" && (
              <>
                <Col className="mt-2" style={{ marginLeft: "auto" }}>
                  <Row className="mb-2" justify={"end"}>
                    <Col className="text-end">
                      <ExclamationCircleOutlined />
                      <small>
                        &nbsp;Only outgoing inventory will be shown for
                        non-admin users. To get access, send a request.
                      </small>
                    </Col>
                  </Row>
                  <Row justify={"end"}>
                    <Col>
                      <Button
                        onClick={() => setCurrentInventoryRequestOpen(true)}
                        type="primary"
                        className="button1"
                      >
                        {"Request"}
                      </Button>
                    </Col>
                  </Row>
                </Col>
              </>
            )
          )}
        </Row>

        <Row className="mt-4 ">
          <Col
            className="p-2 bg-light"
            style={{ maxWidth: "50rem", borderRadius: "0.5em" }}
          >
            <Checkbox.Group
              options={[
                { label: "Description", value: "description" },
                { label: "SN", value: "serialNumber" },
                { label: "Status", value: "status" },
                { label: "End-user", value: "endUser" },
                { label: "Date Received", value: "dateReceived" },
                { label: "PO#", value: "poNumber" },
              ]}
              defaultValue={DEFAULT_VISIBLE_COLS}
              onChange={onChangeCheckColumn}
            />
          </Col>
          <Col className="pt-2" style={{ marginLeft: "auto" }}>
            <Row justify={"end"}>
              <Col>
              <Button type="primary" style={{ textDecoration: 'none' }}> {/* Add style prop to Button */}
  <PDFDownloadLink
    document={generatePdf()}
    fileName={`InventoryAssets_${dayjs(new Date()).format("YYYYDDMMhmmss")}.pdf`}
  >
    {({ blob, url, loading, error }) =>
      loading ? 'Loading document...' : 'Export as PDF'
    }
  </PDFDownloadLink>
</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          {mobileOnly ? (
            <MobileInventoryTable
              form={form}
              showColumnKeys={visibleColumns}
              loading={retrievingAssets}
              userLoggedIn={userLoggedIn}
              setEditModalOpen={setUpdateAssetOpen}
              setArchiveModalOpen={setArchiveAssetOpen}
              setDestroyModalOpen={setDestroyAssetOpen}
              setUnarchiveModalOpen={setUnarchiveAssetOpen}
              setTransactModalOpen={setTranscatAssetOpen}
              setExistingUploads={setExistingPics}
              setTurnOverModalOpen={setTurnOverRequestOpen}
              setPurchaseModalOpen={setPurchaseRequestOpen}
              setDonateModalOpen={setDonateRequestOpen}
              data={inventoryAssets}
            />
          ) : (
            <DesktopInventoryTable
              form={form}
              showColumnKeys={visibleColumns}
              loading={retrievingAssets}
              userLoggedIn={userLoggedIn}
              setEditModalOpen={setUpdateAssetOpen}
              setArchiveModalOpen={setArchiveAssetOpen}
              setDestroyModalOpen={setDestroyAssetOpen}
              setUnarchiveModalOpen={setUnarchiveAssetOpen}
              setTransactModalOpen={setTranscatAssetOpen}
              setExistingUploads={setExistingPics}
              setTurnOverModalOpen={setTurnOverRequestOpen}
              setPurchaseModalOpen={setPurchaseRequestOpen}
              setDonateModalOpen={setDonateRequestOpen}
              data={inventoryAssets}
            />
          )}
        </Row>
      </Card>

      <ModalCreateAsset
        isModalOpen={createAssetOpen}
        setModalOpen={setCreateAssetOpen}
        overloadOnFinish={() =>
          getInventoryAssets({
            categoryId: parseInt(selectedInventory?.value || "1"),
            assetStatusId: parseInt(selectedStatus?.value || ""),
            orderBy: selectedOrderBy.value,
            active: selectedAssetArchiveStatus.value === "true",
            keyword: currentKeyword,
          })
        }
        departmentOptions={departmentOptions}
        departments={departments}
        assetCategoryOptions={categoryOptions}
      />
      <ModalUpdateAsset
        isModalOpen={updateAssetOpen}
        setModalOpen={setUpdateAssetOpen}
        overloadOnFinish={() =>
          getInventoryAssets({
            categoryId: parseInt(selectedInventory?.value || "1"),
            assetStatusId: parseInt(selectedStatus?.value || ""),
            orderBy: selectedOrderBy.value,
            active: selectedAssetArchiveStatus.value === "true",
            keyword: currentKeyword,
          })
        }
        mainForm={form}
        departmentOptions={departmentOptions}
        departments={departments}
        assetCategoryOptions={categoryOptions}
        existingUploads={existingPics}
        setExistingUploads={setExistingPics}
      />
      <ModalArchiveAsset
        isModalOpen={archiveAssetOpen}
        setModalOpen={setArchiveAssetOpen}
        overloadOnFinish={() =>
          getInventoryAssets({
            categoryId: parseInt(selectedInventory?.value || "1"),
            assetStatusId: parseInt(selectedStatus?.value || ""),
            orderBy: selectedOrderBy.value,
            active: selectedAssetArchiveStatus.value === "true",
            keyword: currentKeyword,
          })
        }
        mainForm={form}
      />
      <ModalUnarchiveAsset
        isModalOpen={unarchiveAssetOpen}
        setModalOpen={setUnarchiveAssetOpen}
        overloadOnFinish={() =>
          getInventoryAssets({
            categoryId: parseInt(selectedInventory?.value || "1"),
            assetStatusId: parseInt(selectedStatus?.value || ""),
            orderBy: selectedOrderBy.value,
            active: selectedAssetArchiveStatus.value === "true",
            keyword: currentKeyword,
          })
        }
        mainForm={form}
      />
      <ModalDestroyAsset
        isModalOpen={destroyAssetOpen}
        setModalOpen={setDestroyAssetOpen}
        overloadOnFinish={() =>
          getInventoryAssets({
            categoryId: parseInt(selectedInventory?.value || "1"),
            assetStatusId: parseInt(selectedStatus?.value || ""),
            orderBy: selectedOrderBy.value,
            active: selectedAssetArchiveStatus.value === "true",
            keyword: currentKeyword,
          })
        }
        mainForm={form}
      />
      <ModalTransactAsset
        isModalOpen={transactAssetOpen}
        setModalOpen={setTranscatAssetOpen}
        overloadOnFinish={() =>
          getInventoryAssets({
            categoryId: parseInt(selectedInventory?.value || "1"),
            assetStatusId: parseInt(selectedStatus?.value || ""),
            orderBy: selectedOrderBy.value,
            active: selectedAssetArchiveStatus.value === "true",
            keyword: currentKeyword,
          })
        }
        mainForm={form}
        departmentOptions={departmentOptions}
        departments={departments}
        assetCategoryOptions={categoryOptions}
      />
      <ModalImportAssets
        isModalOpen={importAssetsOpen}
        setModalOpen={setImportAssetsOpen}
        overloadOnFinish={() =>
          getInventoryAssets({
            categoryId: parseInt(selectedInventory?.value || "1"),
            assetStatusId: parseInt(selectedStatus?.value || ""),
            orderBy: selectedOrderBy.value,
            active: selectedAssetArchiveStatus.value === "true",
            keyword: currentKeyword,
          })
        }
        mainForm={form}
        departments={departments}
        assetCategoryOptions={categoryOptions}
      />
      <ModalCurrentInventoryRequest
        isModalOpen={currentInventoryRequestOpen}
        setModalOpen={setCurrentInventoryRequestOpen}
      />
      <ModalTurnOverRequest
        isModalOpen={turnOverRequestOpen}
        setModalOpen={setTurnOverRequestOpen}
        mainForm={form}
        departmentOptions={departmentOptions}
        departments={departments}
      />
      <ModalPurchaseRequest
        isModalOpen={purchaseRequestOpen}
        setModalOpen={setPurchaseRequestOpen}
        mainForm={form}
      />
      <ModalDonateRequest
        isModalOpen={donateRequestOpen}
        setModalOpen={setDonateRequestOpen}
        mainForm={form}
      />
    </>
  );
};

export default Inventory;

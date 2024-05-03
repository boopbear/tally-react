import React from "react";
import { IInventoryAsset } from "../../../interfaces/inventory";
import {
  RetweetOutlined,
  EditOutlined,
  CloseOutlined,
  RedoOutlined,
  DownloadOutlined,
  AlignLeftOutlined,
  ShoppingFilled,
  HeartOutlined,
} from "@ant-design/icons";
import Table, { ColumnsType } from "antd/es/table";
import {
  Button,
  Divider,
  FormInstance,
  Image,
  Row,
  Space,
  UploadFile,
  Typography,
  Tooltip,
} from "antd";
import dayjs from "dayjs";
import QRCode from "react-qr-code";
import { ASSET_SCAN_PATH } from "../../../router/AppRouter";
import ReactDOMServer from "react-dom/server";
import { saveAs } from "file-saver";
import { IUser } from "../../../interfaces/user";

export interface InventoryTableProp {
  data?: IInventoryAsset[];
  showColumnKeys?: string[];
  loading?: boolean;
  userLoggedIn?: IUser;
  form?: FormInstance<any>;
  setEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setArchiveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUnarchiveModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDestroyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setTransactModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setExistingUploads?: React.Dispatch<React.SetStateAction<UploadFile<any>[]>>;
  setTurnOverModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPurchaseModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setDonateModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const alwaysVisibleCols = [
  "assetCode",
  "itemCategory",
  "location",
  "owner",
  "picture",
  "qr",
  "action",
];

const { Text } = Typography;
interface ISVG {
  data: string;
  blob: string | Blob;
}

function convertBase64ToBlob(base64Image: string) {
  const parts = base64Image.split(";base64,");
  const imageType = parts[0].split(":")[1];
  const decodedData = window.atob(parts[1]);
  const uInt8Array = new Uint8Array(decodedData.length);

  for (let i = 0; i < decodedData.length; ++i) {
    uInt8Array[i] = decodedData.charCodeAt(i);
  }

  return new Blob([uInt8Array], { type: imageType });
}

export const renderSVG = (qrString: string): ISVG => {
  const SVG64 = window.btoa(qrString);
  const SVGdata = "data:image/svg+xml;base64," + SVG64;
  return { data: SVGdata, blob: convertBase64ToBlob(SVGdata) };
};

const DesktopInventoryTable: React.FC<InventoryTableProp> = ({
  data,
  loading,
  showColumnKeys,
  userLoggedIn,
  form,
  setEditModalOpen,
  setArchiveModalOpen,
  setUnarchiveModalOpen,
  setDestroyModalOpen,
  setTransactModalOpen,
  setExistingUploads,
  setTurnOverModalOpen,
  setPurchaseModalOpen,
  setDonateModalOpen,
}) => {
  const [isPreviewVisible, setPreviewVisible] = React.useState(false);
  const previewSrc = React.useRef<string | undefined>();
  const columnsDesktop: ColumnsType<IInventoryAsset> = [
    {
      title: "Asset Code",
      dataIndex: "assetCode",
      key: "assetCode",
    },
    {
      title: "Item Category",
      dataIndex: "itemCategory",
      key: "itemCategory",
      render: (_, { inventoryCategory }) => (
        <Space>
          {inventoryCategory != null ? inventoryCategory.name : "Unknown"}
        </Space>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (_, { description }: any) => (
        <Space>
          {description != null && description !== "" ? description : "None"}
        </Space>
      ),
    },
    {
      title: "SN",
      dataIndex: "serialNumber",
      key: "serialNumber",
      render: (_, { serialNumber }) => (
        <Space>
          {serialNumber != null && serialNumber !== "" ? serialNumber : "None"}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, { assetStatus }) => (
        <Space>{assetStatus != null ? assetStatus.display : "None"}</Space>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      render: (_, { location }) => (
        <Space style={{ width: "12rem", whiteSpace: "pre-line" }}>
          {location != null ? location || "None" : "None"}
        </Space>
      ),
    },
    {
      title: "Owner",
      dataIndex: "owner",
      key: "owner",
      render: (_, { owner }) => (
        <Space>{owner != null && owner !== "" ? owner : "None"}</Space>
      ),
    },
    {
      title: "End-user",
      dataIndex: "endUser",
      key: "endUser",
      render: (_, { endUser }) => (
        <Space>{endUser != null && endUser !== "" ? endUser : "None"}</Space>
      ),
    },
    {
      title: "Date Received",
      dataIndex: "dateReceived",
      key: "dateReceived",
      render: (_, { createdAt, dateReceived }) => (
        <center>
          <div>
            <u>
              <b>
                {dateReceived != null
                  ? dayjs(dateReceived).format("DD/MM/YYYY")
                  : "N/A"}
              </b>
            </u>
          </div>
          <div>
            <small>
              {createdAt != null
                ? dayjs(createdAt).format("DD/MM/YYYY")
                : "N/A"}
            </small>
          </div>
        </center>
      ),
    },
    {
      title: "PO#",
      dataIndex: "poNumber",
      key: "poNumber",
      render: (_, { poNumber }) => (
        <Space>{poNumber != null && poNumber !== "" ? poNumber : "None"}</Space>
      ),
    },
    {
      title: "Picture",
      dataIndex: "picture",
      key: "picture",
      render: (_, { attachments }) => {
        const atts = attachments || [];
        return (
          <Space>
            {atts.length > 0 &&
            atts[0].storageLink != null &&
            atts[0].storageLink.length > 0 ? (
              <Button
                onClick={() => {
                  previewSrc.current = atts[0].storageLink;
                  setPreviewVisible(!isPreviewVisible);
                }}
              >
                View
              </Button>
            ) : (
              <Button>No image</Button>
            )}
          </Space>
        );
      },
    },
    {
      title: "QR",
      dataIndex: "qr",
      key: "qr",
      render: (_, { sharedId }) => {
        const qrCode = (
          <QRCode
            id="qr-code"
            size={256}
            value={`${window.location.origin}/${ASSET_SCAN_PATH}?sharedId=${sharedId}`}
            viewBox={`0 0 256 256`}
          />
        );

        const qrString = ReactDOMServer.renderToString(qrCode);
        const renderedSVG = renderSVG(qrString);

        return (
          <Space>
            <Button
              onClick={() => {
                previewSrc.current = renderedSVG.data;
                setPreviewVisible(!isPreviewVisible);
              }}
            >
              View
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                saveAs(renderedSVG.blob, "image.svg");
              }}
            ></Button>
          </Space>
        );
      },
    },
    {
      title: "Actions",
      key: "action",
      render: (_, asset) => (
        <>
          <Row>
            <Space size="middle">
              {userLoggedIn?.role === "SUPER_ADMIN" ? (
                !asset.isArchived ? (
                  <>
                    <Tooltip title="Transact" placement="bottom">
                      <Button
                        onClick={() => {
                          form?.resetFields();
                          form?.setFieldsValue({
                            inventoryAsset: asset,
                            inventoryCategory: asset.inventoryCategory,
                          });
                          setTransactModalOpen(true);
                        }}
                        className="action3"
                      >
                        <AlignLeftOutlined />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Edit" placement="bottom">
                      <Button
                        onClick={() => {
                          const atts = asset.attachments || [];
                          const uploads = atts
                            .filter((a) => {
                              if (
                                a.storageLink != null &&
                                a.storageLink.length > 0
                              ) {
                                return true;
                              }
                              return false;
                            })
                            .map((a) => {
                              return {
                                ...a,
                                uid: a.id?.toString(),
                                name: a.originalFileName,
                                status: "done",
                                url: a.storageLink,
                              };
                            });

                          form?.resetFields();
                          form?.setFieldsValue({
                            ...asset,
                            attachments: uploads,
                            dateReceived: asset.dateReceived
                              ? dayjs(asset.dateReceived)
                              : undefined,
                          });
                          setExistingUploads &&
                            setExistingUploads(uploads as UploadFile<any>[]);
                          setEditModalOpen(true);
                        }}
                        className="action1"
                      >
                        <EditOutlined />
                      </Button>
                    </Tooltip>

                    <Tooltip title="Archive" placement="bottom">
                      <Button
                        onClick={() => {
                          form?.resetFields();
                          form?.setFieldsValue({
                            id: asset.id,
                          });
                          setArchiveModalOpen(true);
                        }}
                        className="action2"
                      >
                        <CloseOutlined />
                      </Button>
                    </Tooltip>
                  </>
                ) : (
                  <>
                    <Tooltip title="Activate" placement="bottom">
                      <Button
                        onClick={() => {
                          form?.resetFields();
                          form?.setFieldsValue({
                            id: asset.id,
                          });
                          setUnarchiveModalOpen(true);
                        }}
                        className="action1"
                      >
                        <RedoOutlined />
                      </Button>
                    </Tooltip>
                    <Tooltip title="Delete" placement="bottom">
                      <Button
                        onClick={() => {
                          form?.resetFields();
                          form?.setFieldsValue({
                            id: asset.id,
                          });
                          setDestroyModalOpen(true);
                        }}
                        className="action2"
                      >
                        <CloseOutlined />
                      </Button>
                    </Tooltip>
                  </>
                )
              ) : (
                !asset.isArchived &&
                asset.inventoryCategory?.id === 1 && (
                  <>
                    <Text mark>Not available</Text>
                  </>
                )
              )}
            </Space>
          </Row>
          {!asset.isArchived &&
            asset.inventoryCategory?.id === 2 &&
            userLoggedIn?.customSettingsData?.hasCurrentInventoryAccess &&
            (userLoggedIn?.customSettingsData?.hasTurnOverAssetPermission ===
              "true" ||
              userLoggedIn?.customSettingsData?.hasPurchaseAssetPermission ===
                "true" ||
              userLoggedIn?.customSettingsData?.hasDonationAssetPermission ===
                "true") && (
              <>
                {userLoggedIn?.role === "SUPER_ADMIN" && (
                  <Divider
                    orientation="left"
                    orientationMargin="0"
                    className="p-0 my-2"
                    style={{ color: "black" }}
                  />
                )}
                <Row>
                  <Space size="middle">
                    {userLoggedIn?.customSettingsData
                      ?.hasTurnOverAssetPermission === "true" && (
                      <Tooltip title="Turnover" placement="bottom">
                        <Button
                          onClick={() => {
                            form?.resetFields();
                            form?.setFieldsValue({
                              inventoryAsset: asset,
                            });
                            setTurnOverModalOpen(true);
                          }}
                          style={{
                            border: "1px solid #E4B328",
                            color: "#E4B328",
                          }}
                        >
                          <RetweetOutlined />
                        </Button>
                      </Tooltip>
                    )}
                    {userLoggedIn?.customSettingsData
                      ?.hasPurchaseAssetPermission === "true" && (
                      <Tooltip title="Purchase" placement="bottom">
                        <Button
                          onClick={() => {
                            form?.resetFields();
                            form?.setFieldsValue({
                              inventoryAsset: asset,
                            });
                            setPurchaseModalOpen(true);
                          }}
                          style={{
                            border: "1px solid #00A600",
                            color: "#00A600",
                          }}
                        >
                          <ShoppingFilled />
                        </Button>
                      </Tooltip>
                    )}
                    {userLoggedIn?.customSettingsData
                      ?.hasDonationAssetPermission === "true" && (
                      <Tooltip title="Donate" placement="bottom">
                        <Button
                          onClick={() => {
                            form?.resetFields();
                            form?.setFieldsValue({
                              inventoryAsset: asset,
                            });
                            setDonateModalOpen(true);
                          }}
                          style={{
                            border: "1px solid #253DA1",
                            color: "#253DA1",
                          }}
                        >
                          <HeartOutlined />
                        </Button>
                      </Tooltip>
                    )}
                  </Space>
                </Row>
              </>
            )}
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        className="w-100 my-3 pb-3"
        columns={columnsDesktop.filter((col) => {
          const colKey = col.key as string;
          return (
            showColumnKeys?.includes(colKey) ||
            alwaysVisibleCols.includes(colKey)
          );
        })}
        dataSource={data}
        loading={loading}
        scroll={{ x: 'max-content' }}
        pagination={{ pageSize: 10 }} //Pagination po to
        bordered
      />
      <Image
        hidden
        preview={{
          visible: isPreviewVisible,
          onVisibleChange: (visible) => setPreviewVisible(visible),
        }}
        src={previewSrc.current}
      />
    </>
  );
};

export default DesktopInventoryTable;

import React from "react";
import { InventoryTableProp, renderSVG } from "./DesktopInventoryTable";
import {
  TableColContent,
  TableColTitle,
  TableRowContent,
  TableRowHeader,
} from "../InventoryTable.styles";
import {
  Button,
  Empty,
  Image,
  Row,
  Space,
  UploadFile,
  Typography,
  Divider,
} from "antd";
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
import dayjs from "dayjs";
import { Loading } from "../../common/Loading";
import QRCode from "react-qr-code";
import ReactDOMServer from "react-dom/server";
import { ASSET_SCAN_PATH } from "../../../router/AppRouter";
import { saveAs } from "file-saver";

const { Text } = Typography;

const MobileInventoryTable: React.FC<InventoryTableProp> = ({
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

  return (
    <>
      {!loading ? (
        data && data.length ? (
          <>
            <div className="w-100 my-3 pb-3">
              {data.map((asset) => {
                const atts = asset.attachments || [];
                const qrCode = (
                  <QRCode
                    id="qr-code"
                    size={256}
                    value={`${window.location.origin}/${ASSET_SCAN_PATH}?sharedId=${asset.sharedId}`}
                    viewBox={`0 0 256 256`}
                  />
                );

                const qrString = ReactDOMServer.renderToString(qrCode);
                const renderedSVG = renderSVG(qrString);

                return (
                  <Row className="my-3">
                    <TableRowHeader>
                      <TableColTitle>Asset Code</TableColTitle>
                      <TableColContent>{asset.assetCode}</TableColContent>
                    </TableRowHeader>
                    <TableRowContent>
                      <TableColTitle>Item Category</TableColTitle>
                      <TableColContent>
                        {asset.inventoryCategory != null
                          ? asset.inventoryCategory.name
                          : "Unknown"}
                      </TableColContent>
                    </TableRowContent>
                    {showColumnKeys?.includes("description") && (
                      <TableRowContent>
                        <TableColTitle>Description</TableColTitle>
                        <TableColContent>
                          {asset.description != null && asset.description !== ""
                            ? asset.description
                            : "None"}
                        </TableColContent>
                      </TableRowContent>
                    )}
                    {showColumnKeys?.includes("serialNumber") && (
                      <TableRowContent>
                        <TableColTitle>Serial Number</TableColTitle>
                        <TableColContent>
                          {asset.serialNumber != null &&
                          asset.serialNumber !== ""
                            ? asset.serialNumber
                            : "None"}
                        </TableColContent>
                      </TableRowContent>
                    )}
                    {showColumnKeys?.includes("status") && (
                      <TableRowContent>
                        <TableColTitle>Status</TableColTitle>
                        <TableColContent>
                          {asset.assetStatus != null
                            ? asset.assetStatus.display
                            : "None"}
                        </TableColContent>
                      </TableRowContent>
                    )}
                    <TableRowContent>
                      <TableColTitle>Location</TableColTitle>
                      <TableColContent style={{ whiteSpace: "pre-line" }}>
                        {asset.location != null ? asset.location : "None"}
                      </TableColContent>
                    </TableRowContent>
                    <TableRowContent>
                      <TableColTitle>Owner</TableColTitle>
                      <TableColContent>
                        {asset.owner != null && asset.owner !== ""
                          ? asset.owner
                          : "None"}
                      </TableColContent>
                    </TableRowContent>
                    {showColumnKeys?.includes("endUser") && (
                      <TableRowContent>
                        <TableColTitle>End-user</TableColTitle>
                        <TableColContent>
                          {asset.endUser != null && asset.endUser !== ""
                            ? asset.endUser
                            : "None"}
                        </TableColContent>
                      </TableRowContent>
                    )}
                    {showColumnKeys?.includes("dateReceived") && (
                      <TableRowContent>
                        <TableColTitle>Date Received</TableColTitle>
                        <TableColContent>
                          {
                            <center>
                              <div>
                                <u>
                                  <b>
                                    {asset.dateReceived != null
                                      ? dayjs(asset.dateReceived).format(
                                          "DD/MM/YYYY"
                                        )
                                      : "N/A"}
                                  </b>
                                </u>
                              </div>
                              <div>
                                <small>
                                  {asset.createdAt != null
                                    ? dayjs(asset.createdAt).format(
                                        "DD/MM/YYYY"
                                      )
                                    : "N/A"}
                                </small>
                              </div>
                            </center>
                          }
                        </TableColContent>
                      </TableRowContent>
                    )}
                    {showColumnKeys?.includes("poNumber") && (
                      <TableRowContent>
                        <TableColTitle>PO#</TableColTitle>
                        <TableColContent>
                          {asset.poNumber != null && asset.poNumber !== ""
                            ? asset.poNumber
                            : "None"}
                        </TableColContent>
                      </TableRowContent>
                    )}

                    <TableRowContent>
                      <TableColTitle>Picture</TableColTitle>
                      <TableColContent>
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
                      </TableColContent>
                    </TableRowContent>
                    <TableRowContent>
                      <TableColTitle>QR</TableColTitle>
                      <TableColContent>
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
                      </TableColContent>
                    </TableRowContent>
                    <TableRowContent>
                      <TableColTitle>Action</TableColTitle>
                      <TableColContent>
                        <Row>
                          <Space size="middle">
                            {userLoggedIn?.role === "SUPER_ADMIN" ? (
                              !asset.isArchived ? (
                                <>
                                  <Button
                                    onClick={() => {
                                      form?.resetFields();
                                      form?.setFieldsValue({
                                        inventoryAsset: asset,
                                        inventoryCategory:
                                          asset.inventoryCategory,
                                      });
                                      setTransactModalOpen(true);
                                    }}
                                    className="action3"
                                  >
                                    <AlignLeftOutlined />
                                  </Button>
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
                                        setExistingUploads(
                                          uploads as UploadFile<any>[]
                                        );
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
                                        id: asset.id,
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
                                        id: asset.id,
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
                                        id: asset.id,
                                      });
                                      setDestroyModalOpen(true);
                                    }}
                                    className="action2"
                                  >
                                    <CloseOutlined />
                                  </Button>
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
                          userLoggedIn?.customSettingsData
                            ?.hasCurrentInventoryAccess &&
                          (userLoggedIn?.customSettingsData
                            ?.hasTurnOverAssetPermission === "true" ||
                            userLoggedIn?.customSettingsData
                              ?.hasPurchaseAssetPermission === "true" ||
                            userLoggedIn?.customSettingsData
                              ?.hasDonationAssetPermission === "true") && (
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
                                    <Button
                                      onClick={() => {
                                        form?.resetFields();
                                        form?.setFieldsValue({
                                          inventoryAsset: asset,
                                        });
                                        setTurnOverModalOpen(true);
                                      }}
                                      style={{
                                        backgroundColor: "cornflowerblue",
                                        color: "white",
                                      }}
                                    >
                                      <RetweetOutlined />
                                    </Button>
                                  )}
                                  {userLoggedIn?.customSettingsData
                                    ?.hasPurchaseAssetPermission === "true" && (
                                    <Button
                                      onClick={() => {
                                        form?.resetFields();
                                        form?.setFieldsValue({
                                          inventoryAsset: asset,
                                        });
                                        setPurchaseModalOpen(true);
                                      }}
                                      style={{
                                        backgroundColor: "gold",
                                        color: "white",
                                      }}
                                    >
                                      <ShoppingFilled />
                                    </Button>
                                  )}
                                  {userLoggedIn?.customSettingsData
                                    ?.hasDonationAssetPermission === "true" && (
                                    <Button
                                      onClick={() => {
                                        form?.resetFields();
                                        form?.setFieldsValue({
                                          inventoryAsset: asset,
                                        });
                                        setDonateModalOpen(true);
                                      }}
                                      style={{
                                        backgroundColor: "deeppink",
                                        color: "white",
                                      }}
                                    >
                                      <HeartOutlined />
                                    </Button>
                                  )}
                                </Space>
                              </Row>
                            </>
                          )}
                      </TableColContent>
                    </TableRowContent>
                  </Row>
                );
              })}
            </div>
            <Image
              hidden
              preview={{
                visible: isPreviewVisible,
                onVisibleChange: (visible) => setPreviewVisible(visible),
              }}
              src={previewSrc.current}
            />
          </>
        ) : (
          <Empty style={{ placeContent: "center" }} />
        )
      ) : (
        <Loading className="p-5" />
      )}
    </>
  );
};

export default MobileInventoryTable;

import { Button, Form, Modal, Select, message } from "antd";
import React from "react";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../../constants";
import { client } from "../../api/client";
import { Loading } from "../common/Loading";
import { IModalPropsInventory, IOptionsProp } from "../../interfaces/overview";
import { IFormTransactAsset } from "../../interfaces/inventory";
import CurrentTransferAsset from "./Forms/CurrentTransferAsset";
import OutgoingTransferAsset from "./Forms/OutgoingTransferAsset";
import PullOutAsset from "./Forms/PullOutAsset";
import RepairAsset from "./Forms/RepairAsset";
import SupplierAsset from "./Forms/SupplierAsset";
import TurnoverAsset from "./Forms/TurnoverAsset";
import SaleAsset from "./Forms/SaleAsset";
import DonateAsset from "./Forms/DonateAsset";
import TextArea from "antd/es/input/TextArea";
import ScrapAsset from "./Forms/ScrapAsset";
import TradeInAsset from "./Forms/TradeInAsset";

const ModalTransactAsset: React.FC<IModalPropsInventory> = ({
  mainForm: form,
  isModalOpen,
  setModalOpen,
  overloadOnFinish = () => {},
  departmentOptions,
  departments,
  assetCategoryOptions,
}) => {
  const [submitting, setSubmitting] = React.useState(false);
  const [assetStatusOptions, setAssetStatusOptions] =
    React.useState<IOptionsProp>(
      assetCategoryOptions?.assetStatusOption?.find((o) => o.keyRef === 0) || {}
    );
  const [selectedStatus, setSelectedStatus] = React.useState<
    string | undefined
  >();

  const onFinish = async (values: IFormTransactAsset) => {
    setSubmitting(true);
    const endpoint = ENDPOINTS.inventory.transactAsset;

    try {
      const formData = new FormData();
      formData.append("assetId", values.inventoryAsset.id?.toString() || "");
      formData.append(
        "selectedStatusId",
        values.assetStatus?.id?.toString() || ""
      );
      formData.append("reason", values.reason || "");
      formData.append("otherReason", values.otherReason || "");
      formData.append("remarks", values.remarks || "");
      formData.append("owner", values.owner || "");
      formData.append("departmentId", values.department?.id.toString() || "");
      formData.append("location", values.location || "");
      formData.append("repairedByName", values.repairedByName || "");
      formData.append("supplierName", values.supplierName || "");
      formData.append("beneficiaryName", values.beneficiaryName || "");
      formData.append("beneficiaryAddress", values.beneficiaryAddress || "");
      formData.append("pmfNo", values.pmfNo || "");
      formData.append("soldToMemberName", values.soldToMemberName || "");
      formData.append("soldToMemberIdNo", values.soldToMemberIdNo || "");
      formData.append(
        "soldToMemberAffiliation",
        values.soldToMemberAffiliation || ""
      );
      formData.append(
        "soldToMemberPosition",
        values.soldToMemberPosition || ""
      );
      formData.append("salePrice", values.salePrice || "");
      formData.append("soldReceiptNo", values.soldReceiptNo || "");
      formData.append("scrapBuyerName", values.scrapBuyerName || "");
      formData.append("scrapReceiptNo", values.scrapReceiptNo || "");
      formData.append("scrapSSFNo", values.scrapSSFNo || "");

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });

      if (result.status !== RES_STATUS.success) {
        throw new Error(result.message);
      } else {
        overloadOnFinish();
        setSubmitting(false);
        onCancel();
      }
    } catch (err: any) {
      message.error(err.message);
      setSubmitting(false);
      setModalOpen(false);
      console.log(err);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
    return;
  };

  const onCancel = () => {
    setModalOpen(false);
    form?.resetFields();
  };

  const onChangeSelectedStatus = (value: string) => {
    setSelectedStatus(value);
  };

  return (
    <>
      <Modal
        title={form?.getFieldValue(["inventoryAsset", "assetCode"])}
        open={isModalOpen}
        onCancel={() => setModalOpen(false)}
        afterOpenChange={(open) => {
          setAssetStatusOptions(
            assetCategoryOptions?.assetStatusOption?.find(
              (o) =>
                o.keyRef === form?.getFieldValue(["inventoryCategory", "id"])
            ) || {}
          );
          setSelectedStatus(undefined);
        }}
        footer={[
          selectedStatus != null && !submitting && (
            <Button key="cancel" htmlType="reset" onClick={() => onCancel()}>
              Cancel
            </Button>
          ),
          selectedStatus != null && (
            <Button
              form="assetTransactForm"
              key="submit"
              type="primary"
              htmlType="submit"
              disabled={submitting}
            >
              Transfer
            </Button>
          ),
        ]}
      >
        {!submitting ? (
          <Form
            name="assetTransactForm"
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item<IFormTransactAsset>
              name={["inventoryAsset", "id"]}
              hidden={true}
            />
            <Form.Item<IFormTransactAsset>
              name={["assetStatus", "id"]}
              label="Transaction"
            >
              <Select
                allowClear
                showSearch
                placeholder="Select a transaction"
                filterOption={(
                  input: string,
                  option?: { label: string; value: string }
                ) =>
                  (option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                options={assetStatusOptions?.options?.filter(
                  (o) => o.key !== ""
                )}
                loading={assetStatusOptions?.loading}
                onChange={onChangeSelectedStatus}
                value={selectedStatus}
              />
            </Form.Item>

            {/* Not sure TODO: refactor to be based from backend */}
            {selectedStatus === "1" && <CurrentTransferAsset key={"form0"} />}
            {selectedStatus === "2" && <RepairAsset key={"form2"} />}
            {selectedStatus === "3" && <TradeInAsset key={"form3"} />}
            {selectedStatus === "4" && (
              <PullOutAsset
                key={"form4"}
                form={form}
                departmentOptions={departmentOptions}
                departments={departments}
              />
            )}
            {selectedStatus === "5" && (
              <TurnoverAsset
                key={"form5"}
                form={form}
                departmentOptions={departmentOptions}
                departments={departments}
              />
            )}
            {selectedStatus === "6" && <SupplierAsset key={"form6"} />}
            {selectedStatus === "7" && (
              <OutgoingTransferAsset
                key={"form7"}
                form={form}
                departmentOptions={departmentOptions}
                departments={departments}
              />
            )}
            {selectedStatus === "8" && <SaleAsset key={"form8"} />}
            {selectedStatus === "9" && <DonateAsset key={"form9"} />}
            {selectedStatus === "10" && <ScrapAsset key={"form10"} />}
            {(selectedStatus === "11" || selectedStatus === "12") && (
              <Form.Item<IFormTransactAsset>
                name="remarks"
                rules={[{ required: true, message: "This field is required" }]}
                label="Remarks"
              >
                <TextArea placeholder="Start typing..." />
              </Form.Item>
            )}
          </Form>
        ) : (
          <Loading className="p-5" />
        )}
      </Modal>
    </>
  );
};

export default ModalTransactAsset;

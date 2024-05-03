import React from "react";
import { IWarehouseTabProp } from "../Warehouse";
import { useResponsive } from "../../../hooks/useResponsive";
import { Button, Card, Col, Form, Input, Row, Select } from "antd";
import MobileSuppliesTable from "./Layouts/MobileSuppliesTable";
import DesktopSuppliesTable from "./Layouts/DesktopSuppliesTable";
import ModalUpdateSupply from "./Modals/ModalUpdateSupply";
import ModalArchiveSupply from "./Modals/ModalArchiveSupply";
import ModalHideSupply from "./Modals/ModalHideSupply";
import ModalUnArchiveSupply from "./Modals/ModalUnArchiveSupply";
import { ISearchWarehouse } from "../../../interfaces/overview";
import {
  suppliedSortByOptions,
  warehouseItemIsArchivedOptions,
} from "./SuppliesConfig";
import dayjs from "dayjs";
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

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

const Supplies: React.FC<IWarehouseTabProp> = ({
  query,
  items,
  loading,
  itemCategories,
  onFinishSearchInput,
  onFinishSearchInputFailed,
}) => {
  const { mobileOnly } = useResponsive();
  const [form] = Form.useForm();
  const [updateItemOpen, setUpdateItemOpen] = React.useState(false);
  const [archiveItemOpen, setArchiveItemOpen] = React.useState(false);
  const [unarchiveItemOpen, setUnarchiveItemOpen] = React.useState(false);
  const [hideItemOpen, setHideItemOpen] = React.useState(false);

  const onCancelSearchInput = () => {
    form.resetFields();
  };
  const generatePDFData = () => {
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
        <Text>Supplies</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableCell, styles.tableHeader]}>
                <Text>Item Code</Text>
              </View>
              <View style={[styles.tableCell, styles.tableHeader]}>
                <Text>Description</Text>
              </View>
              <View style={[styles.tableCell, styles.tableHeader]}>
                <Text>OUm</Text>
              </View>
              <View style={[styles.tableCell, styles.tableHeader]}>
                <Text>Total Quantity</Text>
              </View>
              <View style={[styles.tableCell, styles.tableHeader]}>
                <Text>Remaining Quantity</Text>
              </View>
              <View style={[styles.tableCell, styles.tableHeader]}>
                <Text>Location</Text>
              </View>
              <View style={[styles.tableCell, styles.tableHeader]}>
                <Text>Pending Order</Text>
              </View>
              <View style={[styles.tableCell, styles.tableHeader]}>
                <Text>PO Number</Text>
              </View>
            </View>
            {(items || []).map((item) => (
              <View style={styles.tableRow} key={item.itemCode}>
                <View style={styles.tableCell}>
                  <Text>{item.itemCode}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.description}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.oum}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.totalQty}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.remQty}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.location}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.pendingOrder}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{item.poNumber}</Text>
                </View>
              </View>
            ))}
          </View>
        </Page>
      </Document>
    );
  };

  return (
    <>
      <Card>
        <Form
          name="supplySearchForm"
          form={form}
          onFinish={onFinishSearchInput}
          onFinishFailed={onFinishSearchInputFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Row gutter={[10, 10]}>
            <Col>
              <Form.Item<ISearchWarehouse> name="categoryFilterId">
                <Select
                  allowClear
                  showSearch
                  placeholder="Product Type"
                  filterOption={(
                    input: string,
                    option?: { label: string; value: string }
                  ) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={(itemCategories || []).map((ic) => ({
                    label: ic.name || "",
                    value: ic.id?.toString() || "",
                  }))}
                  loading={false}
                  style={{ minWidth: "10rem" }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item<ISearchWarehouse> name="keyword">
                <Input
                  placeholder="Item Code"
                  style={{ minWidth: "16rem" }}
                  allowClear
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[10, 10]}>
            <Col>
              <Form.Item<ISearchWarehouse> name="active">
                <Select
                  allowClear
                  showSearch
                  placeholder="Status"
                  filterOption={(
                    input: string,
                    option?: { label: string; value: string }
                  ) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={warehouseItemIsArchivedOptions}
                  loading={false}
                  style={{ minWidth: "8rem" }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item<ISearchWarehouse> name="sortBy">
                <Select
                  allowClear
                  showSearch
                  placeholder="Sort by"
                  filterOption={(
                    input: string,
                    option?: { label: string; value: string }
                  ) =>
                    (option?.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                  options={suppliedSortByOptions}
                  loading={false}
                  style={{ minWidth: "10rem" }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Button
                form="supplySearchForm"
                key="submit"
                type="primary"
                htmlType="submit"
                disabled={loading}
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
            <Col style={{ marginLeft: "auto" }}>
              <Row justify={"end"}>
                <Col>
                <Button type="primary">
                    <PDFDownloadLink
                      document={generatePDFData()}
                      fileName={`Supplies_${dayjs(new Date()).format(
                        "YYYYDDMMhmmss"
                      )}.pdf`}
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
        </Form>
        <Row>
          {mobileOnly ? (
            <MobileSuppliesTable
              data={items}
              loading={loading}
              form={form}
              setEditModalOpen={setUpdateItemOpen}
              setArchiveModalOpen={setArchiveItemOpen}
              setUnarchiveModalOpen={setUnarchiveItemOpen}
              setHideModalOpen={setHideItemOpen}
            />
          ) : (
            <DesktopSuppliesTable
              data={items}
              loading={loading}
              form={form}
              setEditModalOpen={setUpdateItemOpen}
              setArchiveModalOpen={setArchiveItemOpen}
              setUnarchiveModalOpen={setUnarchiveItemOpen}
              setHideModalOpen={setHideItemOpen}
            />
          )}
        </Row>
      </Card>

      <ModalUpdateSupply
        mainForm={form}
        isModalOpen={updateItemOpen}
        setModalOpen={setUpdateItemOpen}
        overloadOnFinish={() => {
          onFinishSearchInput(query);
        }}
        categories={itemCategories}
      />
      <ModalArchiveSupply
        mainForm={form}
        isModalOpen={archiveItemOpen}
        setModalOpen={setArchiveItemOpen}
        overloadOnFinish={() => {
          onFinishSearchInput(query);
        }}
      />
      <ModalUnArchiveSupply
        mainForm={form}
        isModalOpen={unarchiveItemOpen}
        setModalOpen={setUnarchiveItemOpen}
        overloadOnFinish={() => {
          onFinishSearchInput(query);
        }}
      />
      <ModalHideSupply
        mainForm={form}
        isModalOpen={hideItemOpen}
        setModalOpen={setHideItemOpen}
        overloadOnFinish={() => {
          onFinishSearchInput(query);
        }}
      />
    </>
  );
};

export default Supplies;

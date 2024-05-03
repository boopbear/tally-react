import React from "react";
import { IWarehouseTabProp } from "../Warehouse";
import { useResponsive } from "../../../hooks/useResponsive";
import { Button, Card, Col, Form, Input, Row, Select } from "antd";
import MobileRequisitionsTable from "./Layouts/MobileRequisitionsTable";
import DesktopRequisitionsTable from "./Layouts/DesktopRequisitionsTable";
import { ISearchWarehouse } from "../../../interfaces/overview";
import { requisitionsSortByOptions } from "./RequisitionsConfig";
import { PDFDownloadLink, Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer"; // Import PDF-related components from react-pdf
import dayjs from "dayjs";
import ModalArchiveRequisition from "./Modals/ModalArchiveRequisition";
import ModalUnArchiveRequisition from "./Modals/ModalUnArchiveRequisition";
import ModalHideRequisition from "./Modals/ModalHideRequisition";
import { warehouseItemIsArchivedOptions } from "../Supplies/SuppliesConfig";

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


const Requisitions: React.FC<IWarehouseTabProp> = ({
  query,
  logs,
  loading,
  onFinishSearchInput,
  onFinishSearchInputFailed,
}) => {
  const { mobileOnly } = useResponsive();
  const [form] = Form.useForm();

  const [archiveReqOpen, setArchiveReqOpen] = React.useState(false);
  const [unarchiveReqOpen, setUnarchiveReqOpen] = React.useState(false);
  const [hideReqOpen, setHideReqOpen] = React.useState(false);

  const onCancelSearchInput = () => {
    form.resetFields();
  };
  

  const generatePDFData = () => {
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
        <Text>Requisitions</Text>
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
                <Text>Quantity</Text>
              </View>
              <View style={[styles.tableCell, styles.tableHeader]}>
                <Text>Date of Supply Requisition</Text>
              </View>
              <View style={[styles.tableCell, styles.tableHeader]}>
                <Text>Created At</Text>
              </View>
              <View style={[styles.tableCell, styles.tableHeader]}>
                <Text>Affiliation</Text>
              </View>
              <View style={[styles.tableCell, styles.tableHeader]}>
                <Text>Reason / JR Number</Text>
              </View>
            </View>
            {(logs || []).map((_logs) => (
              <View style={styles.tableRow} key={_logs.itemCode}>
                <View style={styles.tableCell}>
                  <Text>{_logs.itemCode}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{_logs.description}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{_logs.oum}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{_logs.quantity}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>
                    {_logs.dateReceived != null
                      ? dayjs(_logs.dateReceived).format("DD/MM/YYYY")
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>
                    {_logs.createdAt != null
                      ? dayjs(_logs.createdAt).format("DD/MM/YYYY")
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{_logs.affiliation}</Text>
                </View>
                <View style={styles.tableCell}>
                  <Text>{_logs.reason}</Text>
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
          name="requisitionsSearchForm"
          form={form}
          onFinish={onFinishSearchInput}
          onFinishFailed={onFinishSearchInputFailed}
          autoComplete="off"
          layout="vertical"
        >
          <Row>
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
                  options={requisitionsSortByOptions}
                  loading={false}
                  style={{ minWidth: "10rem" }}
                />
              </Form.Item>
            </Col>
            <Col>
              <Button
                form="requisitionsSearchForm"
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
                <Button type="primary" style={{ textDecoration: 'none' }}> {/* Add style prop to Button */}
  <PDFDownloadLink
    document={generatePDFData()}
    fileName={`Requisitions_${dayjs(new Date()).format("YYYYDDMMhmmss")}.pdf`}
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
            <MobileRequisitionsTable
              data={logs}
              loading={loading}
              form={form}
              setArchiveModalOpen={setArchiveReqOpen}
              setUnarchiveModalOpen={setUnarchiveReqOpen}
              setHideModalOpen={setHideReqOpen}
            />
          ) : (
            <DesktopRequisitionsTable
              data={logs}
              loading={loading}
              form={form}
              setArchiveModalOpen={setArchiveReqOpen}
              setUnarchiveModalOpen={setUnarchiveReqOpen}
              setHideModalOpen={setHideReqOpen}
            />
          )}
        </Row>
      </Card>

      <ModalArchiveRequisition
        mainForm={form}
        isModalOpen={archiveReqOpen}
        setModalOpen={setArchiveReqOpen}
        overloadOnFinish={() => {
          onFinishSearchInput(query);
        }}
      />
      <ModalUnArchiveRequisition
        mainForm={form}
        isModalOpen={unarchiveReqOpen}
        setModalOpen={setUnarchiveReqOpen}
        overloadOnFinish={() => {
          onFinishSearchInput(query);
        }}
      />
      <ModalHideRequisition
        mainForm={form}
        isModalOpen={hideReqOpen}
        setModalOpen={setHideReqOpen}
        overloadOnFinish={() => {
          onFinishSearchInput(query);
        }}
      />
    </>
  );
};

export default Requisitions;

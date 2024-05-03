import React from "react";
import { Button, Card, Col, Form, Input, Row, Select, message } from "antd";
import { requestOrderByOptions } from "./CRequestConfig";
import DesktopCRequestTable from "./Layouts/DesktopCRequestTable";
import { useResponsive } from "../../hooks/useResponsive";
import MobileCRequestTable from "./Layouts/MobileCRequestTable";
import { PageTitle } from "../common/PageTitle";
import { ICRequest, ICRequestsResponse } from "../../interfaces/crequest";
import { ISearchInventory, ISearchQueryForm } from "../../interfaces/overview";
import {
  BasicStatusResponse,
  ENDPOINTS,
  RES_STATUS,
  USER_DETAILS_LOCAL,
} from "../../constants";
import { client } from "../../api/client";
import { IUser } from "../../interfaces/user";
import ModalCloseRequest from "./Modals/ModalCloseRequest";
import ModalDenyRequest from "./Modals/ModalDenyRequest";
import ModalHideRequest from "./Modals/ModalHideRequest";

const CRequest: React.FC = () => {
  const [userLoggedIn, setUserLoggedIn] = React.useState<IUser | undefined>();
  const { mobileOnly } = useResponsive();
  const [form] = Form.useForm();
  const [assetRequests, setAssetRequests] = React.useState<ICRequest[]>([]);
  const [denyRequestOpen, setDenyRequestOpen] = React.useState(false);
  const [closeRequestOpen, setCloseRequestOpen] = React.useState(false);
  const [hideRequestOpen, setHideRequestOpen] = React.useState(false);
  const [retrievingRequests, setRetrievingRequests] = React.useState(false);
  const [updatingRequest, setUpdatingRequest] = React.useState(false);
  const [querySearch, setQuerySearch] = React.useState<ISearchInventory>();

  const onFinishSearchInput = async (values?: ISearchInventory) => {
    setRetrievingRequests(true);
    setQuerySearch(values);
    const endpoint = ENDPOINTS.request.getAssetRequests(
      values?.keyword,
      values?.orderBy
    );

    try {
      const result = await client<ICRequestsResponse>(endpoint);

      if (result.status !== RES_STATUS.success) {
        throw new Error(result.message);
      } else {
        setAssetRequests(result.assetRequests || []);
        setRetrievingRequests(false);
      }
    } catch (err: any) {
      message.error(err.message);
      setRetrievingRequests(false);
      console.log(err);
    }
  };

  const onFinishSearchInputFailed = (errorInfo: any) => {
    console.log(errorInfo);
    return;
  };

  const onCancelSearchInput = () => {
    form.resetFields();
  };

  React.useEffect(() => {
    try {
      const details: IUser = JSON.parse(
        localStorage.getItem(USER_DETAILS_LOCAL) || ""
      );
      setUserLoggedIn(details);
    } catch (e: any) {
      console.log(e.message);
    }

    onFinishSearchInput();
  }, []);

  const onRespond = async (values: ICRequest, answer: string) => {
    setUpdatingRequest(true);
    const endpoint = ENDPOINTS.request.respondAssetRequest;

    try {
      const formData = new FormData();
      formData.append("requestId", values.id.toString() || "");
      formData.append("requestTypeId", values.eventType.toString() || "");
      formData.append("approvedStatus", answer);

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });

      if (result.status !== RES_STATUS.success) {
        throw new Error(result.message);
      } else {
        onFinishSearchInput(querySearch);
        setUpdatingRequest(false);
      }
    } catch (err: any) {
      message.error(err.message);
      setUpdatingRequest(false);
      console.log(err);
    }
  };

  return (
    <>
      <PageTitle>Request</PageTitle>
      <Card>
        <Form
          name="requestsSearchForm"
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
                  <Form.Item<ISearchQueryForm> name="keyword">
                    <Input
                      placeholder="Search"
                      style={{ minWidth: "16rem" }}
                      allowClear
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item<ISearchQueryForm> name="orderBy">
                    <Select
                      allowClear
                      showSearch
                      placeholder="Order by"
                      filterOption={(
                        input: string,
                        option?: { label: string; value: string }
                      ) =>
                        (option?.label ?? "")
                          .toLowerCase()
                          .includes(input.toLowerCase())
                      }
                      options={requestOrderByOptions}
                      loading={false}
                      style={{ minWidth: "8rem" }}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Button
                    form="requestsSearchForm"
                    key="submit"
                    type="primary"
                    htmlType="submit"
                    disabled={retrievingRequests}
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
        </Form>
        <Row>
          {mobileOnly ? (
            <MobileCRequestTable
              data={assetRequests}
              loading={retrievingRequests}
              form={form}
              userLoggedIn={userLoggedIn}
              sendingRequest={updatingRequest}
              onRespond={onRespond}
              setDenyRequestModalOpen={setDenyRequestOpen}
              setCloseRequestModalOpen={setCloseRequestOpen}
              setHideRequestModalOpen={setHideRequestOpen}
            />
          ) : (
            <DesktopCRequestTable
              data={assetRequests}
              loading={retrievingRequests}
              form={form}
              userLoggedIn={userLoggedIn}
              sendingRequest={updatingRequest}
              onRespond={onRespond}
              setDenyRequestModalOpen={setDenyRequestOpen}
              setCloseRequestModalOpen={setCloseRequestOpen}
              setHideRequestModalOpen={setHideRequestOpen}
            />
          )}
        </Row>
      </Card>

      <ModalDenyRequest
        isModalOpen={denyRequestOpen}
        setModalOpen={setDenyRequestOpen}
        overloadOnFinish={() => onFinishSearchInput(querySearch)}
        mainForm={form}
      />
      <ModalCloseRequest
        isModalOpen={closeRequestOpen}
        setModalOpen={setCloseRequestOpen}
        overloadOnFinish={() => onFinishSearchInput(querySearch)}
        mainForm={form}
      />
      <ModalHideRequest
        isModalOpen={hideRequestOpen}
        setModalOpen={setHideRequestOpen}
        overloadOnFinish={() => onFinishSearchInput(querySearch)}
        mainForm={form}
      />
    </>
  );
};

export default CRequest;

import { Button, Card, Col, Form, Row, Space, message } from "antd";
import React from "react";
import { PageTitle } from "../common/PageTitle";
import Title from "antd/es/typography/Title";
import {
  BasicStatusResponse,
  ENDPOINTS,
  RES_STATUS,
  USER_DETAILS_LOCAL,
} from "../../constants";
import { client } from "../../api/client";
import { Loading } from "../common/Loading";
import { EditOutlined } from "@ant-design/icons";
import { ICFaq, IFaqContentResponse } from "../../interfaces/overview";
import TextEditor from "../common/TextEditor/TextEditor";
import { IUser } from "../../interfaces/user";

const CFaq: React.FC = () => {
  const [userLoggedIn, setUserLoggedIn] = React.useState<IUser | undefined>();
  const [faqContent, setFaqContent] = React.useState<ICFaq>();
  const [paragraph, setParagraph] = React.useState<string | undefined>();
  const [retrievingContent, setRetrievingContent] = React.useState(false);
  const [updateContentEnabled, setUpdateContentEnabled] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [form] = Form.useForm();

  const getFaqContent = React.useCallback(async () => {
    setRetrievingContent(true);
    const endpoint = ENDPOINTS.faq.getFaq;

    try {
      const result = await client<IFaqContentResponse>(endpoint);

      if (result.status !== RES_STATUS.success) {
        throw new Error(result.message);
      } else {
        setFaqContent(result.faq);
        setParagraph(result.faq?.content);
        setRetrievingContent(false);
      }
    } catch (err: any) {
      setRetrievingContent(false);
      message.error(err.message);
      console.log(err);
    }
  }, []);

  React.useEffect(() => {
    try {
      const details: IUser = JSON.parse(
        localStorage.getItem(USER_DETAILS_LOCAL) || ""
      );
      setUserLoggedIn(details);
    } catch (e: any) {
      console.log(e.message);
    }

    getFaqContent();
  }, [getFaqContent]);

  const onFinish = async (values: ICFaq) => {
    setSubmitting(true);
    const endpoint = ENDPOINTS.faq.updateFaq;

    try {
      const formData = new FormData();
      formData.append("content", values.content || "");

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });

      if (result.status !== RES_STATUS.success) {
        throw new Error(result.message);
      } else {
        getFaqContent();
        onCancel();
      }
    } catch (err: any) {
      message.error(err.message);
      onCancel();
      console.log(err);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
    return;
  };

  const onCancel = () => {
    setSubmitting(false);
    setUpdateContentEnabled(false);
  };

  return (
    <>
      <PageTitle>FAQs</PageTitle>
      <Card>
        <Row className="text-center">
          <Title className="w-100" level={3}>
            Frequently Asked Questions
          </Title>
        </Row>
        {!retrievingContent && !submitting ? (
          updateContentEnabled ? (
            <>
              <Row className="p-0 p-lg-3">
                <Col className="p-0 p-lg-1 col-12">
                  <Form
                    name="faqUpdateForm"
                    form={form}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    layout="vertical"
                  >
                    <Form.Item<ICFaq> name="content">
                      <TextEditor value={paragraph} onChange={setParagraph} />
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
              <Row className="my-3 d-block text-center">
                <Space>
                  <Button
                    key="cancel"
                    htmlType="reset"
                    onClick={() => onCancel()}
                  >
                    Cancel
                  </Button>
                  <Button
                    form="faqUpdateForm"
                    key="submit"
                    type="primary"
                    htmlType="submit"
                    disabled={submitting}
                  >
                    Save
                  </Button>
                </Space>
              </Row>
            </>
          ) : (
            <>
              <div
                className="custom-style-editor"
                dangerouslySetInnerHTML={{ __html: faqContent?.content || "" }}
              ></div>
              {userLoggedIn?.role === "SUPER_ADMIN" && (
                <Row className="my-3 d-block text-center">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      form.setFieldsValue(faqContent);
                      setUpdateContentEnabled(true);
                    }}
                    className="button1"
                  >
                    Edit
                  </Button>
                </Row>
              )}
            </>
          )
        ) : (
          <Loading className="p-5" />
        )}
      </Card>
    </>
  );
};

export default CFaq;

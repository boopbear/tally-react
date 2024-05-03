import React from "react";
import { PageTitle } from "../common/PageTitle";
import * as S from "./Auth.styles";
import { Link, useNavigate } from "react-router-dom";
import { Button, Checkbox, Form, Input, notification } from "antd";
import {
  BasicStatusResponse,
  ENDPOINTS,
  LOGIN_DETAILS_LOCAL,
  RES_STATUS,
} from "../../constants";
import { client } from "../../api/client";
import {
  openErrorNotification,
  openInfoNotification,
} from "../../api/notif-screen";
import { LoginLocalDetails } from "./Login";

interface OTPField {
  otp?: string;
  remember?: boolean;
}

interface VerifyResponse extends BasicStatusResponse {
  emailAuthenticated?: string;
  newRmeKey?: string;
}

const VerifyOTP: React.FC = () => {
  const navigate = useNavigate();
  const [api, contextHolder] = notification.useNotification();

  const unableToVerifyNotif = () =>
    openErrorNotification({
      api,
      placement: "top",
      message: "Error",
      description: "Unable to verify code",
    });

  const onFinish = async (values: OTPField) => {
    if (!values.otp) {
      return unableToVerifyNotif;
    }

    const endpoint = ENDPOINTS.otp.verifyOtp(values.otp, values.remember);

    try {
      const result = await client<VerifyResponse>(endpoint);

      if (result.status !== RES_STATUS.success) {
        localStorage.removeItem(LOGIN_DETAILS_LOCAL);
        throw new Error("failed");
      }

      if (result.newRmeKey) {
        const details: LoginLocalDetails = {
          email: result.emailAuthenticated,
          rmeKey: result.newRmeKey,
        };

        localStorage.setItem(LOGIN_DETAILS_LOCAL, JSON.stringify(details));
      }

      navigate("/");
    } catch (err) {
      return unableToVerifyNotif();
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    return unableToVerifyNotif();
  };

  const sendGenerateOTPRequest = async () => {
    const endpoint = ENDPOINTS.otp.generateOtp;

    try {
      const result = await client<BasicStatusResponse>(endpoint, {
        method: "POST",
      });

      if (result.status === RES_STATUS.success) {
        openInfoNotification({
          api,
          placement: "top",
          message: "Notice",
          description: "Please see your email for the QR Code",
        });
      } else {
        throw new Error(result.message);
      }
    } catch (e: any) {
      openErrorNotification({
        api,
        placement: "top",
        message: "Notice",
        description: e.message,
      });
    }
  };

  return (
    <>
      {contextHolder}

      <S.AuthWrapper>
        <S.AuthBackgroundWrapper>
          <S.AuthContainerWrapper>
            <PageTitle>Verify</PageTitle>
            <S.AuthCard>
              <h2 className="mb-4 fw-bold text-center">Account Verification</h2>
              <p className="text-center">
                Enter the six-digit TOTP from Google Authentication
              </p>
              <Form
                name="verifyForm"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
              >
                <Form.Item<OTPField>
                  name="otp"
                  rules={[
                    { required: true, message: "This field is required" },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item<OTPField> name="remember" valuePropName="checked">
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                      backgroundColor: "var(--button-primary-bg-color)",
                    }}
                  >
                    &#x2713; Verify
                  </Button>
                  <Button
                    htmlType="button"
                    style={{ margin: "0 12px", color: "black" }}
                  >
                    <Link
                      to={"/auth/login"}
                      style={{ textDecorationLine: "unset" }}
                    >
                      &#x2715; Cancel
                    </Link>
                  </Button>
                </Form.Item>
                <hr />
                <Form.Item>
                  <Button
                    onClick={() => sendGenerateOTPRequest()}
                    className="text-secondary text-md"
                    style={{ textDecoration: "none" }}
                  >
                    Can't access your TOTP?
                  </Button>
                </Form.Item>
              </Form>
            </S.AuthCard>
          </S.AuthContainerWrapper>
        </S.AuthBackgroundWrapper>
      </S.AuthWrapper>
    </>
  );
};

export default VerifyOTP;

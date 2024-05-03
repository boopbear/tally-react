import React from "react";
import { PageTitle } from "../common/PageTitle";
import * as S from "./Auth.styles";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { client } from "../../api/client";
import {
  ENDPOINTS,
  RES_STATUS,
  BasicStatusResponse,
  LOGIN_DETAILS_LOCAL,
  USER_DETAILS_LOCAL,
} from "../../constants";
import { notification } from "antd";
import { openErrorNotification } from "../../api/notif-screen";
import { IUser } from "../../interfaces/user";

interface LoginResponse extends BasicStatusResponse {
  isAuthenticated?: boolean;
  user?: IUser;
}

export interface LoginLocalDetails {
  email?: string;
  rmeKey?: string;
}

function decodeJwtResponseFromGoogleAPI(token: string | undefined) {
  const base64Url = token?.split(".")[1];
  const base64 = base64Url?.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64 || "")
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginLocalDetails, setLoginLocalDetails] =
    React.useState<LoginLocalDetails>();
  const [api, contextHolder] = notification.useNotification();

  React.useEffect(() => {
    try {
      setLoginLocalDetails(
        JSON.parse(localStorage.getItem(LOGIN_DETAILS_LOCAL) || "")
      );
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  const errNotifLogin = () =>
    openErrorNotification({
      api,
      placement: "top",
      message: "Error",
      description: "Unable to retrieve data",
    });

  const responseMessage = async (response: CredentialResponse) => {
    if (response) {
      const responsePayload = decodeJwtResponseFromGoogleAPI(
        response.credential
      );

      const endpoint = ENDPOINTS.user.loginUserByGoogle(
        responsePayload.email,
        loginLocalDetails?.rmeKey
      );

      try {
        const loginResult = await client<LoginResponse>(endpoint);

        if (loginResult.status !== RES_STATUS.success) {
          throw new Error("failed");
        } else {
          localStorage.setItem(
            USER_DETAILS_LOCAL,
            JSON.stringify(loginResult.user)
          );

          if (!loginResult.isAuthenticated) {
            navigate("/auth/verify");
          } else {
            navigate("/");
          }
        }
      } catch {
        return errNotifLogin();
      }
    } else {
      return errNotifLogin();
    }
  };

  const errorMessage = () => {
    return errNotifLogin();
  };

  return (
    <>
      {contextHolder}
      <S.AuthWrapper>
        <S.AuthBackgroundWrapper>
          <S.AuthContainerWrapper>
            <PageTitle>Log In</PageTitle>
            <S.AuthCard>
              <h2 className="mb-4 fw-bold">Sign In</h2>
              <p className="text-dark">
                To access TALLY, please make sure you meet the following
                requirements:
              </p>
              <ol className="mb-4 px-3 text-dark">
                <li>UST Google Workspace Personal Account</li>
                <li>UST Staff</li>
                <li>Google Authenticator Application</li>
              </ol>
              <GoogleLogin
                onSuccess={responseMessage}
                onError={errorMessage}
                theme="filled_black"
              />
            </S.AuthCard>
          </S.AuthContainerWrapper>
        </S.AuthBackgroundWrapper>
      </S.AuthWrapper>
    </>
  );
};

export default Login;

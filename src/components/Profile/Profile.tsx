import {
  Button,
  Card,
  Col,
  Form,
  Image,
  Row,
  Space,
  UploadFile,
  message,
} from "antd";
import React from "react";
import { PageTitle } from "../common/PageTitle";
import Title from "antd/es/typography/Title";
import { IUser, IUsersInfoResponse } from "../../interfaces/user";
import { ENDPOINTS, RES_STATUS, fallbackPic } from "../../constants";
import { client } from "../../api/client";
import { Loading } from "../common/Loading";
import dayjs from "dayjs";
import { EditOutlined } from "@ant-design/icons";
import ModalUpdateProfile from "./ModalUpdateProfile";

const Profile: React.FC = () => {
  const [user, setUser] = React.useState<IUser | undefined>();
  const [retrievingUserInfo, setRetrievingUserInfo] = React.useState(false);
  const [updateProfileOpen, setUpdateProfileOpen] = React.useState(false);
  const [existingPics, setExistingPics] = React.useState<UploadFile<any>[]>([]);
  const [form] = Form.useForm();

  const getUserInfo = React.useCallback(async () => {
    setRetrievingUserInfo(true);
    const endpoint = ENDPOINTS.user.getUserInfo;

    try {
      const result = await client<IUsersInfoResponse>(endpoint);

      if (result.status !== RES_STATUS.success) {
        throw new Error(result.message);
      } else {
        setUser(result.user || { id: 0 });
        setRetrievingUserInfo(false);
      }
    } catch (err: any) {
      setRetrievingUserInfo(false);
      message.error(err.message);
      console.log(err);
    }
  }, []);

  React.useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <>
      <PageTitle>Profile</PageTitle>
      <Card>
        {!retrievingUserInfo ? (
          <>
            <Row className="text-center">
              <Title className="w-100" level={3}>
                My Profile
              </Title>
            </Row>
            <Row className="p-0 p-lg-5">
              <Col className="p-0 p-lg-3 col-12 col-lg-6 text-start order-2 order-lg-1">
                <Title className="mb-0" level={5}>
                  First Name
                </Title>
                <Space className="mb-3">{user?.profile?.givenName}</Space>
                <Title className="mb-0" level={5}>
                  Last Name
                </Title>
                <Space className="mb-3">{user?.profile?.familyName}</Space>
                <Title className="mb-0" level={5}>
                  Birth Date
                </Title>
                <Space className="mb-3">
                  {user?.profile?.birthDate !== undefined
                    ? dayjs(user?.profile?.birthDate).format("DD/MM/YYYY")
                    : "Not set"}
                </Space>
                <Title className="mb-0" level={5}>
                  Unit/Department/Academic Staff
                </Title>
                <Space className="mb-3">
                  {user?.department?.name || "Not set"}
                </Space>
                <Title className="mb-0" level={5}>
                  Email address
                </Title>
                <Space className="mb-3">{user?.email}</Space>
                <Title className="mb-0" level={5}>
                  Employee Number
                </Title>
                <Space className="mb-3">
                  {user?.profile?.employeeNumber || "Not set"}
                </Space>
              </Col>
              <Col className="p-0 p-lg-3 col-12 col-lg-6 text-center order-1 order-lg-2">
                <Row className="d-block">
                  <Image
                    src={user?.profile?.profilePic?.storageLink || fallbackPic}
                    alt="article"
                    preview={true}
                    width={300}
                    height={300}
                    style={{objectFit: "contain"}}
                  />
                </Row>
                <Row className="my-3 d-block">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      const att = user?.profile?.profilePic;
                      const uploaded =
                        att != null &&
                        att.storageLink != null &&
                        att.storageLink.length > 0
                          ? [{
                              ...att,
                              uid: att.id?.toString(),
                              name: att.originalFileName,
                              status: "done",
                              url: att.storageLink,
                            }]
                          : [];

                      form.setFieldsValue({
                        ...user?.profile,
                        birthDate: user?.profile?.birthDate
                          ? dayjs(user?.profile?.birthDate)
                          : undefined,
                        attachments: uploaded,
                      });
                      setExistingPics(uploaded as UploadFile<any>[]);
                      setUpdateProfileOpen(true);
                    }}
                    className="button1"
                  >
                    Edit
                  </Button>
                </Row>
              </Col>
            </Row>
          </>
        ) : (
          <Loading className="p-5" />
        )}
      </Card>

      <ModalUpdateProfile
        isModalOpen={updateProfileOpen}
        setModalOpen={setUpdateProfileOpen}
        overloadOnFinish={() => getUserInfo()}
        mainForm={form}
        existingUploads={existingPics}
        setExistingUploads={setExistingPics}
      />
    </>
  );
};

export default Profile;

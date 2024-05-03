import React, { useState } from "react";
import { PageTitle } from "../common/PageTitle";
import { ArticleFeed } from "./ArticleFeed/ArticleFeed";
import { IArticle, IArticleResponse } from "../../interfaces/overview";
import TabHeader from "../common/TabHeader/TabHeader";
import {
  BasicStatusResponse,
  ENDPOINTS,
  RES_STATUS,
  USER_DETAILS_LOCAL,
} from "../../constants";
import { client } from "../../api/client";
import ModalEditArticle from "./ModalEditArticle";
import ModalDeleteArticle from "./ModalDeleteArticle";
import { IOverviewTabHeaderProp } from "../../interfaces/overview";
import ModalCreateAnnouncement from "./ModalCreateAnnouncement";
import { Form, SelectProps, message } from "antd";
import ModalCreateDiscrepancyReport from "./ModalCreateDiscrepancyReport";
import { IUser, IUsersResponse } from "../../interfaces/user";
import { DEFAULT_USER_CONTEXT, UserContext } from "../../store/userContext";

const INITIAL_SCROLL_COUNT = 1;
const DEFAULT_ARTICLE_SIZE = 10;

const Overview: React.FC = () => {
  const [userLoggedIn, setUserLoggedIn] = useState<IUser>(DEFAULT_USER_CONTEXT);
  const [articles, setArticles] = React.useState<IArticle[]>([]);
  const [loadingArticles, setLoadingArticles] = React.useState(true);
  const [isCreateAnnouncementOpen, setIsCreateAnnouncementOpen] =
    React.useState(false);
  const [isCreateDiscrepancyOpen, setIsCreateDiscrepancyOpen] =
    React.useState(false);
  const [currentScrollCount, setCurrentScrollCount] =
    React.useState(INITIAL_SCROLL_COUNT);
  const [hasMore, setHasMore] = React.useState(false);
  const [nextCallback, setNextCallback] = React.useState(() => {});

  const [isEditArticleOpen, setIsEditArticleOpen] = useState(false);
  const [articleUpdating, setArticleUpdating] = React.useState(false);
  const [isArchiveArticleOpen, setIsArchiveArticleOpen] = useState(false);
  const [articleArchiving, setArticleArchiving] = React.useState(false);

  const [form] = Form.useForm();
  const [userOptions, setUserOptions] = React.useState<SelectProps["options"]>(
    []
  );
  const [hasShareSetting, setHasShareSetting] = React.useState(false);

  const getUsers = async () => {
    const endpoint = ENDPOINTS.user.getUsers();

    try {
      const result = await client<IUsersResponse>(endpoint);

      if (result.status !== RES_STATUS.success) {
        throw new Error("failed");
      } else {
        setUserOptions(
          result.users?.map((user) => {
            return {
              label: `${user.profile?.fullName || "User"} (${user.email})`,
              value: user.email,
            };
          })
        );
      }
    } catch (err) {
      message.error("Unable to retrieve users");
      console.log(err);
    }
  };

  const getAnnouncements = React.useCallback(async () => {
    const postsEndpoint = ENDPOINTS.announcementPost.getPosts(
      currentScrollCount,
      DEFAULT_ARTICLE_SIZE
    );

    try {
      const result = await client<IArticleResponse>(postsEndpoint);
      setArticles(result.posts || []);
      setLoadingArticles(false);
    } catch (err: any) {
      console.log(err);
    }
  }, [currentScrollCount]);

  const getReports = React.useCallback(async () => {
    const reportsEndpoint = ENDPOINTS.discrepancyReport.getReports(
      currentScrollCount,
      DEFAULT_ARTICLE_SIZE
    );

    try {
      const result = await client<IArticleResponse>(reportsEndpoint);
      setArticles(result.reports || []);
      setLoadingArticles(false);
    } catch (err: any) {
      console.log(err);
    }
  }, [currentScrollCount]);

  React.useEffect(() => {
    try {
      const details: IUser = JSON.parse(
        localStorage.getItem(USER_DETAILS_LOCAL) || ""
      );
      setUserLoggedIn(details);
    } catch (e: any) {
      console.log(e.message);
    }

    getAnnouncements();
    getUsers();
  }, [getAnnouncements]);

  const getInitialAnnouncements = () => {
    setOnFinishUpdateCallback({ onFinish: onFinishUpdateAnnouncement });
    setOnFinishArchiveCallback({ onFinish: onFinishArchiveAnnouncement });
    setHasShareSetting(false);
    setCurrentScrollCount(INITIAL_SCROLL_COUNT);
    getAnnouncements();
  };

  const getInitialReports = () => {
    setOnFinishUpdateCallback({ onFinish: onFinishUpdateReport });
    setOnFinishArchiveCallback({ onFinish: onFinishArchiveReport });
    setHasShareSetting(true);
    setCurrentScrollCount(INITIAL_SCROLL_COUNT);
    getReports();
  };

  const onFinishUpdateAnnouncement = async (values: IArticle) => {
    setArticleUpdating(true);
    const endpoint = ENDPOINTS.announcementPost.updatePost;

    try {
      const formData = new FormData();
      formData.append("postId", values.id?.toString() || "");
      formData.append("title", values.title || "");
      formData.append("paragraph", values.paragraph || "");

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });

      if (result.status !== RES_STATUS.success) {
        throw new Error("failed");
      } else {
        getInitialAnnouncements();
        setArticleUpdating(false);
        setIsEditArticleOpen(false);
      }
    } catch (err) {
      message.error("Something went wrong");
      setArticleUpdating(false);
      console.log(err);
    }
  };

  const onFinishArchiveAnnouncement = async (postId?: number) => {
    setArticleArchiving(true);
    const endpoint = ENDPOINTS.announcementPost.archivePost;

    try {
      const formData = new FormData();
      formData.append("postId", postId?.toString() || "");

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });

      if (result.status !== RES_STATUS.success) {
        throw new Error("failed");
      } else {
        getInitialAnnouncements();
        setArticleArchiving(false);
        setIsArchiveArticleOpen(false);
      }
    } catch (err) {
      message.error("Something went wrong");
      setArticleArchiving(false);
      setIsArchiveArticleOpen(false);
      console.log(err);
    }
  };

  const onFinishUpdateReport = async (values: IArticle) => {
    setArticleUpdating(true);
    const endpoint = ENDPOINTS.discrepancyReport.updateReport;

    try {
      const formData = new FormData();
      formData.append("reportId", values.id?.toString() || "");
      formData.append("title", values.title || "");
      formData.append("paragraph", values.paragraph || "");
      const userEmails = values.sharedWithUserEmails;
      if (userEmails) {
        for (let i = 0; i < userEmails.length; i++) {
          formData.append("sharedWithUserEmails[]", userEmails[i]);
        }
      }

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });

      if (result.status !== RES_STATUS.success) {
        throw new Error("failed");
      } else {
        getInitialReports();
        setArticleUpdating(false);
        setIsEditArticleOpen(false);
      }
    } catch (err) {
      message.error("Something went wrong");
      setArticleUpdating(false);
      console.log(err);
    }
  };

  const onFinishArchiveReport = async (reportId?: number) => {
    setArticleArchiving(true);
    const endpoint = ENDPOINTS.discrepancyReport.archiveReport;

    try {
      const formData = new FormData();
      formData.append("reportId", reportId?.toString() || "");

      const result = await client<BasicStatusResponse>(endpoint, {
        body: formData,
        method: "POST",
        autoSetHeader: true,
      });

      if (result.status !== RES_STATUS.success) {
        throw new Error("failed");
      } else {
        getInitialReports();
        setArticleArchiving(false);
        setIsArchiveArticleOpen(false);
      }
    } catch (err) {
      message.error("Something went wrong");
      setArticleArchiving(false);
      setIsArchiveArticleOpen(false);
      console.log(err);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo);
    return;
  };

  const [onFinishUpdateCallback, setOnFinishUpdateCallback] = React.useState({
    onFinish: onFinishUpdateAnnouncement,
  });
  const [onFinishArchiveCallback, setOnFinishArchiveCallback] = React.useState({
    onFinish: onFinishArchiveAnnouncement,
  });

  const tabs: IOverviewTabHeaderProp[] = [
    {
      name: "Announcements",
      menuOnClick: getInitialAnnouncements,
      createButtonName: "+ Add",
      createOnClick: () => setIsCreateAnnouncementOpen(true),
    },
    {
      name: "Discrepancies",
      menuOnClick: getInitialReports,
      createButtonName: "+ Add",
      createOnClick: () => setIsCreateDiscrepancyOpen(true),
    },
  ];

  return (
    <>
      <PageTitle>Overview</PageTitle>
      <UserContext.Provider value={userLoggedIn}>
        <TabHeader tabs={tabs} />
        <ArticleFeed
          articles={articles}
          loading={loadingArticles}
          editArticle={(article) => {
            form.setFieldsValue(article);
            setIsEditArticleOpen(true);
          }}
          deleteArticle={({ id }) => {
            form.setFieldsValue({ id });
            setIsArchiveArticleOpen(true);
          }}
        />
      </UserContext.Provider>

      <ModalCreateAnnouncement
        title="Post an announcement"
        isModalOpen={isCreateAnnouncementOpen}
        setModalOpen={setIsCreateAnnouncementOpen}
        overloadOnFinish={getInitialAnnouncements}
      />
      <ModalCreateDiscrepancyReport
        title="Post a discrepancy report"
        isModalOpen={isCreateDiscrepancyOpen}
        setModalOpen={setIsCreateDiscrepancyOpen}
        overloadOnFinish={getInitialReports}
        userOptions={userOptions}
      />
      <ModalEditArticle
        title="Edit"
        isModalOpen={isEditArticleOpen}
        setModalOpen={setIsEditArticleOpen}
        mainForm={form}
        submitting={articleUpdating}
        onFinish={(values) => onFinishUpdateCallback.onFinish(values)}
        onFinishFailed={onFinishFailed}
        onCancel={() => setIsEditArticleOpen(false)}
        hasShareSelection={hasShareSetting}
        userOptions={userOptions}
      />
      <ModalDeleteArticle
        title="Confirm Delete?"
        isModalOpen={isArchiveArticleOpen}
        setModalOpen={setIsArchiveArticleOpen}
        mainForm={form}
        submitting={articleArchiving}
        onFinish={({ id }) => onFinishArchiveCallback.onFinish(id)}
      />
    </>
  );
};

export default Overview;

import React from "react";
import { Avatar, Row, Space } from "antd";
import { DeleteFilled, EditFilled } from "@ant-design/icons";
import * as S from "./ArticleCard.styles";
import { IArticle } from "../../../interfaces/overview";
import Moment from "moment";
import { useResponsive } from "../../../hooks/useResponsive";
import { fallbackPic } from "../../../constants";
import { UserContext } from "../../../store/userContext";

interface ArticleCardProps {
  key: any;
  article: IArticle;
  editArticle: (article: IArticle) => void;
  deleteArticle: (article: IArticle) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  key,
  article,
  editArticle,
  deleteArticle,
}) => {
  const { mobileOnly } = useResponsive();
  const userLoggedIn = React.useContext(UserContext);

  return (
    <S.Wrapper className="p-1 p-sm-3 article-card" key={key}>
      <S.Header>
        <Avatar
          src={
            article.publisher?.profile?.profilePic?.storageLink || fallbackPic
          }
          alt="author"
          size={43}
        />
        <S.AuthorWrapper>
          <S.Author>{article.publisher?.profile?.fullName || "User"}</S.Author>
          <S.DateTime>
            {Moment(article.createdAt).format("DD/MM/YYYY hh:mm A")}
          </S.DateTime>
        </S.AuthorWrapper>
      </S.Header>
      <S.InfoWrapper>
        <S.InfoHeader>
          <S.Title>{article.title}</S.Title>
        </S.InfoHeader>
        <S.Description>
          <div
            className="custom-style-editor"
            dangerouslySetInnerHTML={{ __html: article.paragraph || "" }}
          />
        </S.Description>
      </S.InfoWrapper>
      <Row
        className="mx-3"
        style={{ justifyContent: mobileOnly ? "center" : "start" }}
      >
        <Space
          style={{ flexFlow: mobileOnly ? "column" : "row", flexWrap: "wrap" }}
        >
          {article.attachments &&
            article.attachments.length > 0 &&
            article.attachments.map((attachment) => {
              return (
                <S.ArticleImage
                  src={attachment.storageLink || fallbackPic}
                  alt="article"
                  preview={true}
                  width={300}
                  height={300}
                />
              );
            })}
        </Space>
      </Row>
      {userLoggedIn.role === "SUPER_ADMIN" && (
        <S.ArticleActionWrapper>
          <S.ArticleAction
            onClick={() => editArticle(article)}
            buttonColor="#FCBF15"
            className="feed-action-icons"
          >
            <EditFilled />
          </S.ArticleAction>
          <S.ArticleAction
            onClick={() => deleteArticle(article)}
            buttonColor="#212529"
            className="feed-action-icons"
          >
            <DeleteFilled />
          </S.ArticleAction>
        </S.ArticleActionWrapper>
      )}
    </S.Wrapper>
  );
};

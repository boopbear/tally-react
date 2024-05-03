import React, { useState } from "react";
import { Card, Empty } from "antd";
import { Feed } from "../../common/Feed/Feed";
import { ArticleCard } from "../ArticleCard/ArticleCard";
import { IArticle } from "../../../interfaces/overview";

interface ArticleFeedProps {
  articles: IArticle[];
  loading: boolean;
  editArticle: (article: IArticle) => void;
  deleteArticle: (article: IArticle) => void;
}

export const ArticleFeed: React.FC<ArticleFeedProps> = ({
  articles,
  loading,
  editArticle,
  deleteArticle,
}) => {
  const [hasMore, setHasMore] = useState<boolean>(false);
  // const [loaded, setLoaded] = useState<boolean>(false);

  const next = () => {
    //
    setHasMore(false);
  };

  return !loading && articles?.length ? (
    <Feed next={next} hasMore={hasMore}>
      {articles.map((article, index) => (
        <ArticleCard
          key={index}
          article={article}
          editArticle={editArticle}
          deleteArticle={deleteArticle}
        />
      ))}
    </Feed>
  ) : (
    <Card>
      <Empty />
    </Card>
  );
};

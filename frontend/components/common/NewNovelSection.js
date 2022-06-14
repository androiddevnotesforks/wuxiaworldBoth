import NewBookCard from "./NewBookCard";
import { Title, Card, Grid, Col } from "@mantine/core";
import React from "react";
import { useMediaQuery } from "@mantine/hooks";
const NewNovelSection = ({ novelList, headingText = "Browse Novels" }) => {
  const mobile = useMediaQuery("(max-width: 768px)");
  const novels = novelList
    ? novelList.map((novel) => (
        <Col span={6} xs={4} sm={3} md={3} lg={3}>
          <NewBookCard
            bookName={novel.name}
            imageLink={
              novel?.image ?
              mobile
                ? `${novel?.image?.replace(
                    process.env.REACT_APP_SPACES_LINK,
                    process.env.REACT_APP_IMAGE_CDN
                  )}?tr=w-150`
                : `${novel?.image?.replace(
                    process.env.REACT_APP_SPACES_LINK,
                    process.env.REACT_APP_IMAGE_CDN
                  )}?tr=w-500`
              :""
            }
            badgeText={"New"}
            slug={novel.slug}
            rating={novel.rating}
            ranking={novel.ranking}
            views={novel.views}
            chapters={novel.chapters}
          />
        </Col>
      ))
    : Array.from(new Array(12)).map((element) => (
        <Col span={6} xs={4} sm={3} md={3} lg={3}>
          <NewBookCard loading={true} />
        </Col>
      ));

  return (
    <Card
      withBorder
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[0],
      })}
    >
      <Title align="center" sx={{ margin: "20px" }}>
        {headingText}
      </Title>
      <Grid gutter={20}>{novels}</Grid>
    </Card>
  );
};
export default React.memo(NewNovelSection);

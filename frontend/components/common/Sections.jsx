import { Title, Grid, Col, Card, Text, Badge, Container } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import Link from "next/link";
import NewBookCard from "./NewBookCard";
import { routes } from "../utils/Routes";
import { useEffect, useState } from "react";
import LinkText from "./LinkText";

const Sections = ({ categoryName, categorySlug, novelList, tagSlug }) => {
  const [desktop, setDesktop] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setDesktop(isDesktop);
  }, [desktop]);

  const novels = novelList?.map((novel) => (
    <Col span={6} xs={4} sm={3} md={3} lg={3} key={novel.slug}>
      <NewBookCard
        bookName={novel.name}
        imageLink={
          novel?.image
            ? !desktop
              ? `${novel?.image?.replace(
                  "https://wuxiaworld.fra1.cdn.digitaloceanspaces.com/",
                  "https://ik.imagekit.io/opyvhypp7cj/"
                )}?tr=w-150`
              : `${novel?.image?.replace(
                  "https://wuxiaworld.fra1.cdn.digitaloceanspaces.com/",
                  "https://ik.imagekit.io/opyvhypp7cj/"
                )}?tr=w-500`
            : ""
        }
        badgeText={"New"}
        slug={novel.slug}
        rating={novel.rating}
        ranking={novel.ranking}
        views={novel.views}
        chapters={novel.chapters}
      />
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
        Most Viewed {categoryName} Novels
      </Title>
      <Container
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "10px",
        }}
      >
        <Link
          href={
            tagSlug
              ? `${routes.tag}${tagSlug}`
              : `${routes.category}${categorySlug}`
          }
        >
          <Badge
            sx={(theme) => ({
              float: "right",
              marginBottom: "5px",
            })}
            color="grape"
            size="xl"
            variant="filled"
          >
            VIEW MORE
          </Badge>
        </Link>
      </Container>
      <Grid gutter={20}>
        {novelList
          ? novels
          : Array.from(new Array(10)).map((element) => (
              <NewBookCard loading={true} />
            ))}
      </Grid>
    </Card>
  );
};

export default Sections;

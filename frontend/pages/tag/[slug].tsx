import React, { useState, useEffect } from "react";
import axios from "axios";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { Button, Center, Container, Grid, Text } from "@mantine/core";
import { initializeStore, useStore } from "../../components/Store/Store";
import { apiHome } from "../../components/utils/siteName.js";
import Seo from "../../components/common/Seo.js";
import Background from "../../components/Background/Background.js";
import OrderFilter from "../../components/common/OrderFilter.js";
import { useRouter } from "next/router";
import { routes } from "../../components/utils/Routes.js";
import { Pagination } from "@mantine/core";
import LinkText from "../../components/common/LinkText.js";
import BackgroundLoading from "../../components/Background/BackgroundLoading.js";
import NewNovelSection from "../../components/common/NewNovelSection.js";
import dynamic from "next/dynamic.js";
import nookies from "nookies";
import { tagFetch, useTag } from "../../components/hooks/useTag";

const RecentlyUpdated = dynamic(
  () => import("../../components/common/RecentlyUpdated.js"),
  { ssr: false, loading: () => <BackgroundLoading /> }
);

export async function getStaticPaths(context) {
  const headers = {
    Authorization: `Token ${process.env.ADMIN_TOKEN}`,
  };
  const response = await axios.get(`${apiHome}/tags/`, {
    headers,
  });
  const urls = response.data.tags.slice(0, 3).map((item) => {
    const value = {
      params: { slug: item.slug },
    };
    return value;
  });
  return {
    paths: [...urls],
    fallback: "blocking", // false or 'blocking'
  };
}

export async function getStaticProps(context) {
  const { slug } = context.params;
  const page = context?.query?.page || null;
  const order_by = context?.query?.order_by || null;
  let pages;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    ["tagNovels", slug, page, order_by],
    tagFetch,
    {
      staleTime: Infinity,
    }
  );
  const tag_data = (await queryClient.getQueryData([
    "tagNovels",
    slug,
    page,
    order_by,
  ])) as any;
  pages = Math.floor(tag_data?.count / 12);
  let tagName = slug;
  const tempcat = tag_data.results[0]?.tag.filter((tag) => {
    if (tag.slug == slug) {
      tagName = tag.name;
    }
  });

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      pages: pages,
      tagName,
    },
  };
}
const TagPage = ({ pages, tagName }) => {
  const router = useRouter();
  const { slug, page, order_by } = router.query as any;

  const [orderBy, setOrderBy] = useState(order_by || "");

  const siteName = useStore((state) => state.siteName);
  const siteUrl = useStore((state) => state.siteUrl);

  const { data, error, status, isLoading } = useTag({ slug, page, orderBy });

  useEffect(() => {
    if (orderBy) {
      router.push(`${routes.tag}${slug}?page=${page}&order_by=${orderBy}`);
    }
  }, [orderBy]);

  const getPageButton = (props) => {
    switch (props.active) {
      case true:
        return (
          <LinkText
            href={`${routes.tag}${slug}?page=${props.page}&order_by=${orderBy}`}
          >
            <Button variant="filled">{props.page}</Button>
          </LinkText>
        );
      default:
    }
    switch (props.page) {
      case "dots":
        return <Text>..</Text>;
      case "next":
        return page != pages ? (
          <LinkText
            href={`${routes.tag}${slug}?page=${
              parseInt(page) + 1
            }&order_by=${orderBy}`}
          >
            <Button variant="default">{">"}</Button>
          </LinkText>
        ) : null;

      case "prev":
        return page != 1 ? (
          <LinkText
            href={`${routes.tag}${slug}?page=${
              parseInt(page) - 1
            }&order_by=${orderBy}`}
          >
            <Button variant="default">{"<"}</Button>
          </LinkText>
        ) : null;
      case "first":
        return page != 1 ? (
          <LinkText href={`${routes.tag}${slug}?page=1&order_by=${orderBy}`}>
            <Button variant="default">{"<<"}</Button>
          </LinkText>
        ) : null;
      case "last":
        return page != pages ? (
          <LinkText
            href={`${routes.tag}${slug}?page=${parseInt(
              pages
            )}&order_by=${orderBy}`}
          >
            <Button variant="default">{">>"}</Button>
          </LinkText>
        ) : null;
      default:
        return (
          <LinkText
            href={`${routes.tag}${slug}?page=${props.page}&order_by=${orderBy}`}
          >
            <Button variant="default">{props.page}</Button>
          </LinkText>
        );
    }
  };
  return (
    <Background>
      <Seo
        description={`Find more ${tagName} novels at ${siteName} for free on ${siteUrl}`}
        url={`${siteUrl}${routes.tag}${slug}`}
        title={`Tag ${tagName} - Read at ${siteName}`}
        image={""}
        loading={false}
      />
      <br />
      <OrderFilter orderBy={orderBy} setOrderBy={setOrderBy} />
      <br />
      <Container>
        <NewNovelSection headingText={tagName} novelList={data?.results} />
      </Container>
      <br />
      <Center>
        <Pagination
          total={pages}
          siblings={1}
          page={Number(page)}
          onChange={null}
          itemComponent={getPageButton}
          withEdges
          boundaries={1}
          spacing={7}
        />
      </Center>
      <br />
      <Container>
        <RecentlyUpdated tag={slug} category={null} />
      </Container>
    </Background>
  );
};

export default TagPage;

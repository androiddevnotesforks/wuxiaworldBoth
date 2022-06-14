import React, { useState, useEffect } from "react";
import axios from "axios";
import { dehydrate, QueryClient, useQuery } from "react-query";
import { Button, Center, Container, Grid, Text } from "@mantine/core";
import { useStore } from "../../components/Store/StoreProvider.js";
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

export async function getServerSideProps(context) {
  const { slug } = context.params;
  const { page, order_by } = context.query;
  let pages;
  const categoryFetch = ({ queryKey }) => {
    const [_, slug, page, order_by] = queryKey;
    let link = `${apiHome}/novels/?category_name=${slug}&limit=12&offset=${
      page * 12
    }`;
    if (order_by) {
      link = link + `&order=${order_by}`;
    }
    const results = axios.get(link).then((res) => {
      const novels = res.data.results;
      pages = Math.floor(res.data.count / 12);
      return novels;
    });
    return results;
  };
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    ["categoryNovels", slug, page, order_by],
    categoryFetch,
    {
      staleTime: Infinity,
    }
  );
  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
      pages: pages,
    },
  };
}
const CategoryPage = ({ pages }) => {
  const router = useRouter();
  const { slug, page, order_by } = router.query;

  const [categoryName, setCategoryName] = useState("");
  const [orderBy, setOrderBy] = useState(order_by || "");

  const siteName = useStore((state) => state.siteName);
  const siteUrl = useStore((state) => state.siteUrl);

  const categoryFetch = ({ queryKey }) => {
    const [_, slug, page, orderBy] = queryKey;
    let link = `${apiHome}/novels/?category_name=${slug}&limit=12&offset=${
      page || 0 * 12
    }`;
    if (orderBy) {
      link = link + `&order=${orderBy}`;
    }
    const results = axios.get(link).then((res) => {
      if (res?.data?.results?.length > 0) {
        const tempcat = res.data.results[0]?.category.filter((category) => {
          if (category.slug == slug) {
            setCategoryName(category.name);
          }
        });
      }
      const novels = res.data.results;
      return novels;
    });
    return results;
  };

  const { data, error, fetchNextPage, isFetchingNextPage, status, isLoading } =
    useQuery(
      ["categoryNovels", slug, page, orderBy],

      categoryFetch,
      {
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        enabled: router.isReady,
      }
    );

  useEffect(() => {
    if (orderBy) {
      router.push(`${routes.category}${slug}?page=${page}&order_by=${orderBy}`);
    }
  }, [orderBy]);

  const getPageButton = (props) => {
    switch (props.active) {
      case true:
        return (
          <LinkText
            href={`${routes.category}${slug}?page=${props.page}&order_by=${orderBy}`}
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
            href={`${routes.category}${slug}?page=${
              parseInt(page) + 1
            }&order_by=${orderBy}`}
          >
            <Button variant="default">{">"}</Button>
          </LinkText>
        ) : null;

      case "prev":
        return page != 1 ? (
          <LinkText
            href={`${routes.category}${slug}?page=${
              parseInt(page) - 1
            }&order_by=${orderBy}`}
          >
            <Button variant="default">{"<"}</Button>
          </LinkText>
        ) : null;
      case "first":
        return page != 1 ? (
          <LinkText
            href={`${routes.category}${slug}?page=1&order_by=${orderBy}`}
          >
            <Button variant="default">{"<<"}</Button>
          </LinkText>
        ) : null;
      case "last":
        return page != Number(pages) ? (
          <LinkText
            href={`${routes.category}${slug}?page=${Number(
              pages
            )}&order_by=${orderBy}`}
          >
            <Button variant="default">{">>"}</Button>
          </LinkText>
        ) : null;
      default:
        return (
          <LinkText
            href={`${routes.category}${slug}?page=${props.page}&order_by=${orderBy}`}
          >
            <Button variant="default">{props.page}</Button>
          </LinkText>
        );
    }
  };
  return (
    <Background>
      {categoryName && (
        <Seo
          description={`Find more ${categoryName} novels at ${siteName} for free on ${siteUrl}`}
          url={`${siteUrl}${routes.category}${slug}`}
          title={`Category ${categoryName} - Read at ${siteName}`}
          image={""}
          loading={false}
        />
      )}
      <br />
      <OrderFilter orderBy={orderBy} setOrderBy={setOrderBy} />
      <br />
      <Container>
        {data ? (
          <NewNovelSection headingText={categoryName} novelList={data} />
        ) : (
          <Container sx={{ position: "relative" }}>
            <BackgroundLoading />
          </Container>
        )}
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
    </Background>
  );
};

export default CategoryPage;

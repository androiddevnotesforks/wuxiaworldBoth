import { FC, useEffect, useState } from "react";

import {
  TextInput,
  Loader,
  Button,
  Group,
  Center,
  Container,
  Text,
  Title,
  Pagination,
  PaginationItemProps,
} from "@mantine/core";
import { useRouter } from "next/router";
import Background from "../../components/Background/Background";
import { routes } from "../../components/utils/Routes";
import { initializeStore, useStore } from "../../components/Store/Store";
import Seo from "../../components/common/Seo";
import OrderFilter from "../../components/common/OrderFilter";
import NewNovelSection from "../../components/common/NewNovelSection";
import { dehydrate, QueryClient, useQuery } from "react-query";
import axios from "axios";
import { apiHome } from "../../components/utils/siteName";
import nookies from "nookies";
import LinkText from "../../components/common/LinkText";

const searchFetch = ({ queryKey }) => {
  const [_, searchQuery, page, orderBy] = queryKey;

  let link = `${apiHome}/search/?limit=12&offset=${page || 0 * 12}&search=${
    searchQuery || ""
  }`;
  if (orderBy) {
    link = link + `&order=${orderBy}`;
  }
  const results = axios.get(link).then((res) => {
    const novels = res.data;
    return novels;
  });
  return results;
};

export async function getServerSideProps(context) {
  const { query, page, order_by } = context.params;
  const queryClient = new QueryClient();

  const darkMode = nookies.get(context)?.darkMode;
  const zustandStore = initializeStore({ darkMode: darkMode ?? "dark" });
  let pages;

  await queryClient.prefetchQuery(
    ["searchNovels", query || "", page || 1, order_by || ""],
    searchFetch,
    {
      staleTime: Infinity,
    }
  );
  const page_data = (await queryClient.getQueryData([
    "searchNovels",
    query || "",
    page || 1,
    order_by || "",
  ])) as any;
  pages = Math.floor(page_data?.count / 12);
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      pages: pages,
      initialZustandState: JSON.parse(JSON.stringify(zustandStore.getState())),
    },
  };
}
const SearchPage = ({ pages }) => {
  const router = useRouter();
  const { query, page, order_by } = router.query;

  const [searchQuery, setSearchQuery] = useState(query || "");
  const [searchQuery1, setSearchQuery1] = useState(query || "");
  const [resultCount, setResultCount] = useState(0);

  const siteName = useStore((state) => state.siteName);
  const siteUrl = useStore((state) => state.siteUrl);

  const [ascending, setAscending] = useState(true);
  const [pagesCount, setPagesCount] = useState(pages);
  const [orderBy, setOrderBy] = useState(order_by || "");
  const { data, error, status, isLoading } = useQuery(
    ["searchNovels", query, page, orderBy],

    searchFetch,
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      enabled: router.isReady,
    }
  );

  useEffect(() => {
    if (data) {
      setResultCount(data?.count || 0);
      setPagesCount(Math.floor(data?.count / 12));
    }
  }, [data]);

  const getPageButton: FC<PaginationItemProps> = (props) => {
    if (props.active === true) {
      return (
        <LinkText
          href={`${routes.search}${query}?page=${props.page}&order_by=${orderBy}`}
        >
          <Button variant="filled">{props.page}</Button>
        </LinkText>
      );
    }
    switch (props.page) {
      case "dots":
        return <Text>..</Text>;
      case "next":
        return page != pages ? (
          <LinkText
            href={`${routes.search}${query}?page=${
              parseInt(page) + 1
            }&order_by=${orderBy}`}
          >
            <Button variant="default">{">"}</Button>
          </LinkText>
        ) : null;

      case "prev":
        return page != 1 ? (
          <LinkText
            href={`${routes.search}${query}?page=${
              parseInt(page) - 1
            }&order_by=${orderBy}`}
          >
            <Button variant="default">{"<"}</Button>
          </LinkText>
        ) : null;
      case "first":
        return Number(page) != 1 ? (
          <LinkText
            href={`${routes.search}${query}?page=1&order_by=${orderBy}`}
          >
            <Button variant="default">{"<<"}</Button>
          </LinkText>
        ) : null;
      case "last":
        return page != Number(pagesCount) ? (
          <LinkText
            href={`${routes.search}${query}?page=${Number(
              pagesCount
            )}&order_by=${orderBy}`}
          >
            <Button variant="default">{">>"}</Button>
          </LinkText>
        ) : null;
      default:
        return (
          <LinkText
            href={`${routes.search}${query}?page=${props.page}&order_by=${orderBy}`}
          >
            <Button variant="default">{props.page}</Button>
          </LinkText>
        );
    }
  };

  useEffect(() => {
    if (query && query != searchQuery) {
      setSearchQuery(query);
    }
  }, [query]);

  useEffect(() => {
    if (searchQuery && searchQuery.length > 0 && searchQuery != query) {
      router.push(`${routes.search}${searchQuery}`, undefined, {
        shallow: true,
      });
    }
  }, [searchQuery, orderBy]);

  const handleQueryChange = (e) => {
    setSearchQuery1(e.target.value);
  };

  const searchNow = () => {
    setSearchQuery(searchQuery1);
  };

  return (
    <Background>
      <Seo
        title={`Search Page - Find Your Favorite Novels at ${process.env.NEXT_PUBLIC_SITE_NAME}`}
        description={`Search for more ${searchQuery} novels at ${siteName} for free on ${siteUrl}`}
        url={`${siteUrl}${routes.search}`}
        image={""}
        loading={false}
      />

      <Container>
        <Center>
          <Group>
            <TextInput
              size="lg"
              value={searchQuery1}
              placeholder="Search"
              onChange={handleQueryChange}
              rightSection={
                isLoading ? <Loader variant="oval" size="xs" /> : null
              }
            />
            <Button onClick={searchNow} leftIcon="🔎" size="lg">
              Search
            </Button>
          </Group>
        </Center>
        <OrderFilter setOrderBy={setOrderBy} orderBy={orderBy} />
        <NewNovelSection
          novelList={data?.results || null}
          headingText={`${resultCount} Results Found For '${searchQuery}'`}
        />
      </Container>
      {data?.results ? (
        <>
          <br />
          <Center>
            <Container>
              <Pagination
                total={pagesCount}
                siblings={1}
                page={parseInt(page)}
                onChange={null}
                itemComponent={getPageButton}
                withEdges
                boundaries={1}
                spacing={7}
              />
            </Container>
          </Center>
          <br />
        </>
      ) : !resultCount ? (
        <Title order={3} align="center" style={{ marginTop: "50px" }}>
          No Results Found
        </Title>
      ) : (
        <Title order={4} align="center" style={{ marginTop: "50px" }}>
          <Text>End of results</Text>
        </Title>
      )}
    </Background>
  );
};

export default SearchPage;

import { Badge, Card, Container, Title } from "@mantine/core";
import { dehydrate, QueryClient, useQuery } from "react-query";
import Background from "../../../components/Background/Background";
import LinkText from "../../../components/common/LinkText";
import Sections from "../../../components/common/Sections";
import Seo from "../../../components/common/Seo";
import {
  categoriesFetch,
  useCategories,
} from "../../../components/hooks/useCategories";
import { initializeStore, useStore } from "../../../components/Store/Store";
import { routes } from "../../../components/utils/Routes";

export async function getStaticProps() {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["categories_list"], categoriesFetch, {
    staleTime: Infinity,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 24,
  };
}
const Categories = () => {
  const siteName = useStore((state) => state.siteName);
  const siteUrl = useStore((state) => state.siteUrl);

  const { isLoading, error, data, isFetching } = useCategories();
  return (
    <Background>
      <Seo
        description={`Discover Your Favorite Categories. ${siteName} has the latest translations of your favorite Chinese, Japanese, Korean - Light Novels and Web Novels. All Chapters Are Updated Daily and New Novels Added Very Frequently.`}
        url={`${siteUrl}${routes.categories}`}
        title={`Discover Your Favorite Category of Novels - ${siteName}`}
        image={""}
        loading={false}
      />
      <Container>
        <Card>
          <Title order={1} align="center" style={{ margin: "10px" }}>
            All Categories
          </Title>
          <Container>
            {data?.categories?.map((item) => (
              <LinkText to={`${routes.category}${item.slug}`}>
                <Badge
                  key={item.name}
                  variant="filled"
                  size="lg"
                  style={{ cursor: "pointer", margin: "3px" }}
                >
                  {item.name}
                </Badge>
              </LinkText>
            ))}
          </Container>
        </Card>
        <Title order={1} align="center" style={{ margin: "10px" }}>
          Most Viewed Categories
        </Title>

        {data?.results?.map((category) => (
          <Sections
            categoryName={category.name}
            novelList={category.novels}
            categorySlug={category.slug}
          />
        ))}
      </Container>
    </Background>
  );
};

export default Categories;

import { useMediaQuery } from "@mantine/hooks";
import axios from "axios";
import { useQuery } from "react-query";
import { Card, Col, Grid, Title } from "@mantine/core";
import SmallBookCard from "./SmallBookCard";
import { apiHome } from "../utils/siteName";

const Recommendations = ({ novel_slug }) => {
  const mobile = useMediaQuery("(max-width: 768px)");

  const recommendation_fetch = () => {
    return axios
      .get(`${apiHome}/recommendations/${novel_slug}`)
      .then((response) => {
        const res = response.data;
        return res;
      })
      .catch((error) => error);
  };

  const { isLoading, error, data } = useQuery(
    ["get_recommendations", novel_slug],
    recommendation_fetch,
    {
      refetchOnWindowFocus: false,
      retry: 2,
      staleTime: 100000,
    }
  );
  return (
    <>
      <Card>
        <Title sx={{ marginBottom: "20px" }}>You Might Also Like</Title>

        <Grid gutter={20}>
          {isLoading &&
            Array.from(new Array(16)).map((element) => (
              <Col span={6} xs={4} sm={3} md={3} lg={3}>
                <SmallBookCard loading={true} />
              </Col>
            ))}
          {data?.results?.map((novel) => (
            <Col span={6} xs={4} sm={3} md={3} lg={3}>
              <SmallBookCard
                bookName={novel.name}
                imageLink={
                  novel?.image ?
                  mobile
                    ? `${novel?.image?.replace(
                        process.env.NEXT_PUBLIC_SPACES_LINK,
                        process.env.NEXT_PUBLIC_IMAGE_CDN
                      )}?tr=w-150`
                    : `${novel?.image?.replace(
                        process.env.NEXT_PUBLIC_SPACES_LINK,
                        process.env.NEXT_PUBLIC_IMAGE_CDN
                      )}?tr=w-500`
                  : null
                }
                badgeText={"New"}
                slug={novel.slug}
                rating={novel.rating}
                ranking={novel.ranking}
                views={novel.views}
                chapters={novel.chapters}
              />
            </Col>
          ))}
        </Grid>
        <Title align="center" order={5} sx={{ marginTop: "20px" }}>
          These Have A Similar Tag "{data?.tag}"
        </Title>
      </Card>
    </>
  );
};

export default Recommendations;

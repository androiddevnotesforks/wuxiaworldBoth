import { Container, Title, Card, Center } from "@mantine/core";
import dynamic from "next/dynamic";
import { dehydrate, QueryClient } from "react-query";
import Background from "../../../components/Background/Background";
import Seo from "../../../components/common/Seo";
import { reportFetch, useReports } from "../../../components/hooks/useReports";
import ChapterReportTable from "../../../components/PageSpecific/Request/ChapterReport";
import NovelReportTable from "../../../components/PageSpecific/Request/NovelReportTable";
const DisqusComments = dynamic(
  () => import("../../../components/common/DisqusComments"),
  {
    ssr: false,
  }
);
export async function getStaticProps(ctx) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["reportInfo"], reportFetch, {
    staleTime: Infinity,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60, // In seconds
  };
}
const Requests = () => {
  const { data } = useReports();
  return (
    <Background>
      <Seo
        title="Novel Requests - Wuxiaworld"
        description="Got a novel you'd like but don't see the chapters for? Request it here!"
      />
      <Container>
        <Card>
          <Title align="center">Novel Requests</Title>
          <br />
          <Center>
            <Title order={4}>
              Below you can find all the requests for novels that have been
              made. Requests made by logged in users are given priority
            </Title>
          </Center>

          <Card shadow="lg" sx={{ marginTop: "20px" }}>
            <Title order={2} align="center">
              Pending Novel Requests
            </Title>

            {data && (
              <NovelReportTable
                data={data.pending_reports}
                showReason={false}
                showActioned={false}
              />
            )}
          </Card>
          <Card shadow="lg" sx={{ marginTop: "20px" }}>
            <Title order={2} align="center">
              Approved Novel Requests
            </Title>

            {data && (
              <NovelReportTable
                data={data.approved_reports}
                showReason={false}
                showActioned={true}
              />
            )}
          </Card>
          <Card shadow="lg" sx={{ marginTop: "20px" }}>
            <Title order={2} align="center">
              Rejected Novel Requests
            </Title>

            {data && (
              <NovelReportTable
                data={data.rejected_reports}
                showReason={true}
                showActioned={true}
              />
            )}
          </Card>
          <Center sx={{ marginTop: "20px" }}>
            <Title order={4}>
              Below you can find all the reports for the chapters that have been
              made. Thanks for your help!
            </Title>
          </Center>
          <Card shadow="lg" sx={{ marginTop: "20px" }}>
            <Title order={2} align="center">
              Chapter Reports
            </Title>

            {data && <ChapterReportTable data={data.chapter_reports} />}
          </Card>
        </Card>
      </Container>
      <br />
      <DisqusComments slug={`requests`} />
    </Background>
  );
};
export default Requests;

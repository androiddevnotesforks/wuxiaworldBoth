import { Title, Text, Container } from "@mantine/core";
import dynamic from "next/dynamic";
import Background from "../../../components/Background/Background";

const DisqusComments = dynamic(
  () => import("../../../components/common/DisqusComments"),
  {
    ssr: false,
  }
);
export default function Announcements() {
  return (
    <Background>
      <Container width="md" sx={{ marginTop: "30px" }}>
        <Title order={3} align="center">
          Annoucements
        </Title>
        <br />
        <Title order={4}>Update 26.04.2021:</Title>
        <Text>
          About 5k new novels to be added, all with latest chapters and each
          updating daily.
        </Text>
        <br />

        <DisqusComments slug={`announcements`} />
      </Container>
    </Background>
  );
}

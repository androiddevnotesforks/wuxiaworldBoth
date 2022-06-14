import { Container, Title, Text } from "@mantine/core";
import dynamic from "next/dynamic";
import Background from "../../../components/Background/Background";
const DisqusComments = dynamic(
  () => import("../../../components/common/DisqusComments"),
  {
    ssr: false,
  }
);
const Requests = () => {
  return (
    <Background>
      <Container width="md">
        <Title align="center">Novel Requests</Title>
        <br />
        <Text>
          If there are any novels that you'd like me to add, just post the name
          and the Novel Updates links here. And if there are any broken links or
          chapters that are in wrong order, let me know by commenting as well.
        </Text>
      </Container>
      <br />
      <DisqusComments slug={`requests`} />
    </Background>
  );
};
export default Requests;

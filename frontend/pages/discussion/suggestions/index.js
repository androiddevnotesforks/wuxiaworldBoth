import { Title, Text, Container } from "@mantine/core";
import dynamic from "next/dynamic";
import Background from "../../../components/Background/Background";
const DisqusComments = dynamic(
  () => import("../../../components/common/DisqusComments"),
  {
    ssr: false,
  }
);
const Suggestions = () => {
  return (
    <Background>
      <Container width="md">
        <Title order={3} align="center">
          Please provide your suggestions here
        </Title>
        <br />
        <Text>
          Stuff like new functions you'd want me to add, broken functions, etc.
          Basically anything website functionality related. There is a seperate
          page for Novel requests, broken links etc.
        </Text>
        <br />
        <DisqusComments slug={`suggestions`} />
      </Container>
    </Background>
  );
};

export default Suggestions;

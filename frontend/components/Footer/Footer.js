import { Paper, Title, Container } from "@mantine/core";
import { useStore } from "../Store/Store";

const Footer = () => {
  const siteName = useStore((state) => state.siteName);

  return (
    <Paper radius={0} style={{ paddingTop: "30px" }}>
      <Container>
        <Title order={3} align="center">
          <strong>{siteName}</strong> - cause Novels should be free. Built with{" "}
          <strong>React</strong> and <strong>Django</strong>
        </Title>
      </Container>
      
    </Paper>
  );
};
export default Footer;

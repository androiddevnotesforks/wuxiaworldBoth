import { Title, Container, Card } from "@mantine/core";

const TabBase = (props) => {
  return (
    <Container style={{ paddingTop: "20px" }}>
      <Card padding="sm">
        <Title align="center">{props.title}</Title>
        {props.children}
      </Card>
    </Container>
  );
};

export default TabBase;

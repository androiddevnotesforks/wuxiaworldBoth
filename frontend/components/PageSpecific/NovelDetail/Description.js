import { Button, Container, Spoiler, Text } from "@mantine/core";
import { Skeleton } from "@mantine/core";

const Description = ({ text, height, fontSize = null }) => {
  return (
    <Container size="md">
      <Spoiler
        maxHeight={height}
        sx={{ justifyContent: "center", alignItems: "center" }}
        showLabel={
          <Button fullWidth sx={{ marginTop: 10 }}>
            Show more
          </Button>
        }
        hideLabel={
          <Button fullWidth sx={{ marginTop: 10 }}>
            Hide
          </Button>
        }
        transitionDuration={0}
      >
        {text ? (
          <Text size={fontSize ? 20 : "sm"}>{text}</Text>
        ) : (
          <Skeleton height={height * 10}>
            <Text></Text>
          </Skeleton>
        )}
      </Spoiler>
    </Container>
  );
};
export default Description;

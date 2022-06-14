import { Card, Image, Text, Button, Group, Skeleton } from "@mantine/core";
import { routes } from "../utils/Routes";
import React from "react";
import LinkText from "./LinkText";
const SmallBookCard = ({
  bookName,
  imageLink,
  slug,
  loading,
  rating,
  ranking,
  views,
  chapters,
}) => {
  return (
    <>
      {!loading ? (
        <LinkText href={`${routes.novel}${slug}`}>
          <Card
            shadow="lg"
            padding="md"
            sx={(theme) => ({
              width: "100%",
              height: "100%",
              marginBottom: "1em",
              backgroundColor:
                theme.colorScheme == "light"
                  ? theme.colors.red[2]
                  : theme.colors.dark[4],
            })}
          >
            <Card.Section sx={{ alignItems: "center" }}>
              <Image
                src={imageLink}
                height="150px"
                width="100%"
                sx={{
                  objectFit: "cover",
                }}
                alt={bookName}
                imageProps={{ loading: "lazy" }}
                withPlaceholder
              />
            </Card.Section>
            <Card.Section sx={{ position: "relative" }}>
              <Group sx={{ gap: 5 }}>
                <Text size="sm">👑 Rank: {ranking}</Text>
                <Text size="sm" sx={{ margin: 2 }}>
                  👁️ Views: {views}
                </Text>
                <Text size="sm" sx={{ margin: 2 }}>
                  🔢 Chapters: {chapters}
                </Text>
              </Group>

              <Text
                size="md"
                sx={{
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  height: "3em",
                  WebkitBoxOrient: "vertical",
                  margin: 5,
                  marginBottom: 10,
                  bottom: 0,
                }}
                weight={500}
              >
                {bookName}
              </Text>
            </Card.Section>
          </Card>
        </LinkText>
      ) : (
        <Card
          shadow="sm"
          padding="md"
          sx={{
            width: "100%",
            height: "100%",
            marginBottom: "1em",
          }}
        >
          <Card.Section>
            <Image
              height="200px"
              width="100%"
              sx={{
                objectFit: "cover",
              }}
              withPlaceholder
            />
          </Card.Section>
          <Skeleton variant="rectangle" />

          <Skeleton variant="text" width={50}></Skeleton>

          <Skeleton width={50}>
            <Button color="blue" fullWidth>
              Read Now
            </Button>
          </Skeleton>
        </Card>
      )}
    </>
  );
};

export default React.memo(SmallBookCard);

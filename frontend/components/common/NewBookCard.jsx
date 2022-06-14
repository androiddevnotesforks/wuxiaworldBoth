import {
  Card,
  Image,
  Text,
  Button,
  Badge,
  Group,
  Skeleton,
} from "@mantine/core";
import React, { useEffect } from "react";
import Link from 'next/link'
import { routes } from "../utils/Routes";
const NewBookCard = ({
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
        
        <Link 
        href={`${routes.novel}${slug}`}><a style = {{textDecoration:"none"}}><Card
          shadow="sm"
          padding="md"
          sx={{
            width: "100%",
            height: "100%",
            marginBottom: "1em",
            position: "relative",
          }}
        ><Card.Section sx={{ alignItems: "center" }}>
            <Image
              src={imageLink}
              height="200px"
              width="100%"
              sx={{
                objectFit: "cover",
              }}
              alt={bookName}
              imageProps={{ loading: "lazy" }}
              withPlaceholder
            />
          </Card.Section>
          <Card.Section>
            <Badge radius="xs" size="lg" sx={{ marginBottom: 10 }}>
              <Text>⭐{rating}</Text>
            </Badge>
            <Group>
              <Text size="sm" sx={{ margin: 5 }}>
                👑 Rank: {ranking}
              </Text>
              <Text size="sm" sx={{ margin: 5 }}>
                👁️ Views: {views}
              </Text>
            </Group>
            <Text size="sm" sx={{ margin: 5 }}>
              🔢 Chapters: {chapters}
            </Text>
            <Text
              size="lg"
              sx={{
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                height: "3em",
                WebkitBoxOrient: "vertical",
                margin: 5,
                marginBottom: 20,
                bottom: 0,
              }}
              weight={500}
            >
              {bookName}
            </Text>
            <Button
              color="grape"
              fullWidth
              sx={{ position: "absolute", bottom: 0, marginTop: 2 }}
            >
              READ NOW
            </Button>
            </Card.Section></Card></a></Link>
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

export default React.memo(NewBookCard);

import {
  Button,
  Card,
  Container,
  Group,
  Image,
  Spoiler,
  Tab,
  Tabs,
  Text,
  Title,
} from "@mantine/core";
import NewCard from "../../common/NewCard";
import Description from "./Description";

import TagBadges from "./TagSection";
import CategorySection from "./CategorySection";
import { useState } from "react";
import dynamic from "next/dynamic";
import BookmarkButton from "./BookmarkButton";
import LinkText from "../../common/LinkText";
import { routes } from "../../utils/Routes";

// const TagBadges = lazy(() => import("./TagSection"));
// const CategorySection = lazy(() => import("./CategorySection"));
const ChapterBox = dynamic(() => import("./ChapterBox"), {
  ssr: false,
});

const MobileDetail = ({ novelData, id }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Container>
      <Card>
        <Group direction="column" spacing="lg" grow>
          <Group
            noWrap={true}
            sx={{
              ">div": { padding: "8px" },
            }}
            position="apart"
            spacing={10}
          >
            <Container sx={{ maxWidth: "200px" }}>
              <Image
                src={
                  novelData && novelData?.image
                    ? `${novelData?.image?.replace(
                        process.env.NEXT_PUBLIC_SPACES_LINK,
                        process.env.NEXT_PUBLIC_IMAGE_CDN
                      )}?tr=w-150`
                    : ""
                }
                alt={novelData?.name}
                width={"150px"}
                height={"100%"}
                withPlaceholder={true}
                radius="md"
              />
            </Container>
            <Group direction="column">
              <Group direction="column" spacing="xs">
                <Title order={5} style={{ fontSize: 16 }}>
                  {novelData?.name}
                </Title>
                <Text size="sm">By {novelData?.author?.name}</Text>
              </Group>
              <BookmarkButton novelData={novelData} id={id} desktop={false} />
              <LinkText href={`${routes.chapter}${novelData?.first_chapter}`}>
                <Button size="sm" radius="sm">
                  Start Reading
                </Button>
              </LinkText>
              <Group sx={{ marginTop: 20 }}>
                <Text size="xs">
                  {!novelData?.novelStatus ? "Ongoing" : "Completed"}
                </Text>
                <Text size="xs">{novelData?.views} Views</Text>
              </Group>
            </Group>
          </Group>
          <NewCard>
            <Group position="apart">
              <Text size="sm" weight={500}>
                {novelData?.chapters} Chapters
              </Text>
              <Text size="sm" weight={500}>
                ⭐{novelData?.rating}
              </Text>
              <Text size="sm" weight={500}>
                {novelData?.review_count} Reviews
              </Text>
            </Group>
          </NewCard>

          <Tabs
            orientation={"horizontal"}
            grow
            position="center"
            active={activeTab}
            onTabChange={setActiveTab}
            styles={{ body: { width: "100%" } }}
          >
            <Tab label={<Title order={3}>Description</Title>}>
              <Description height={200} text={novelData?.description} />
            </Tab>
            <Tab label={<Title order={3}>Chapters</Title>}>
              <ChapterBox novelParent={id} desktop={false} />
            </Tab>
          </Tabs>

          <Group direction="column">
            <Title align="left" order={5}>
              Tags
            </Title>

            <Container>
              <Spoiler
                maxHeight={55}
                showLabel={
                  <Button variant="outline" size="xs">
                    ^
                  </Button>
                }
                hideLabel={
                  <Button variant="outline" size="xs">
                    ˅
                  </Button>
                }
              >
                <TagBadges tagList={novelData?.tag} />
              </Spoiler>
            </Container>
          </Group>
          <Group direction="column">
            <Title align="left" order={5}>
              Categories
            </Title>
            <Container>
              <Spoiler
                maxHeight={55}
                showLabel={
                  <Button variant="outline" size="xs">
                    ^
                  </Button>
                }
                hideLabel={
                  <Button variant="outline" size="xs">
                    ˅
                  </Button>
                }
              >
                <CategorySection categoryList={novelData?.category} />
              </Spoiler>
            </Container>
          </Group>
        </Group>
      </Card>
    </Container>
  );
};
export default MobileDetail;

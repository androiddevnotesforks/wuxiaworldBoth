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

// const TagBadges = lazy(() => import("./TagSection"));
// const CategorySection = lazy(() => import("./CategorySection"));
const ChapterBox = dynamic(() => import("./ChapterBox"), {
  ssr: false,
});

const MobileDetail = ({
  novelData,
  bookmarked,
  addNovelBookmark,
  removeNovelBookmark,
  bookmarkData,
  id,
}) => {
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
                  (novelData &&
                    `${novelData?.image?.replace(
                      "https://cdn.wuxianovels.co/",
                      "https://ik.imagekit.io/opyvhypp7cj/"
                    )}?tr=w-150`) ||
                  ""
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
                <Text size="sm">By {novelData?.author.name}</Text>
              </Group>

              {bookmarked ? (
                <Button
                  compact
                  size="xl"
                  radius={100}
                  onClick={removeNovelBookmark}
                >
                  ♥
                </Button>
              ) : (
                <Button
                  compact
                  size="xl"
                  radius={100}
                  onClick={addNovelBookmark}
                >
                  ♡
                </Button>
              )}
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
              <ChapterBox
                loading={false}
                // lastReadIndex={bookmarkData?.last_read?.index}
                novelParent={id}
                // bookmarkData={bookmarkData}
              />
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
                  <Button variant="outline" size={15}>
                    ^
                  </Button>
                }
                hideLabel={
                  <Button variant="outline" size={15}>
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
                  <Button variant="outline" size={15}>
                    ^
                  </Button>
                }
                hideLabel={
                  <Button variant="outline" size={15}>
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

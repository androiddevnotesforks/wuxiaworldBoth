import { Container, Tab, Tabs, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import LinkText from "../../common/LinkText";
import { routes } from "../../utils/Routes";
import BookmarkTab from "./BookmarkTab";
import ProfileTab from "./ProfileTab";
import SettingsTab from "./SettingsTab";

const AllTabs = ({ currentTab }) => {
  const phone = useMediaQuery("(max-width: 1024px)");

  return (
    <Container sx={{ maxWidth: "1100px", marginTop: "30px" }}>
      <Tabs
        orientation={!phone ? "vertical" : "horizontal"}
        grow
        position="center"
        active={currentTab}
        initialTab={1}
        styles={{ body: { width: "100%" } }}
      >
        <Tab
          label={
            <LinkText href={`${routes.profileView}`}>
              <Title order={3}>Profile</Title>
            </LinkText>
          }
        >
          <ProfileTab />
        </Tab>
        <Tab
          label={
            <LinkText href={`${routes.settings}`}>
              <Title order={3}>Settings</Title>
            </LinkText>
          }
        >
          <SettingsTab />
        </Tab>
        <Tab
          label={
            <LinkText href={`${routes.bookmark}`}>
              <Title order={3}>Bookmarks</Title>
            </LinkText>
          }
        >
          <BookmarkTab />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AllTabs;

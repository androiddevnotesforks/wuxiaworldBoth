import SearchIcon from "@mui/icons-material/Search";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Drawer, Accordion, Title, Group } from "@mantine/core";
// import { useHistory } from "react-router-dom";
import { useRouter } from "next/router";
import { routes } from "../utils/Routes";
import LinkText from "../common/LinkText";
import { useStore } from "../Store/StoreProvider";
import { useEffect } from "react";

const Sidebar = ({ opened, setOpened }) => {
  // const history = useHistory();
  const accessToken = useStore((state) => state.accessToken);
  const logOut = useStore((state) => state.logOut);
  const router = useRouter();
  useEffect(() => {
    router.events.on("routeChangeComplete", () => {
      setOpened(false);
    });
  }, [router]);
  return (
    <Drawer
      opened={opened}
      onClose={() => setOpened(false)}
      title="Menu"
      padding="md"
      size="sm"
      position="right"
      sx={{
        div: {
          marginBottom: "10px",
        },

        button: { marginTop: "15px" },
      }}
    >
      <Group>
        <LinkText to={routes.home}>
          <Title order={3}>🏠</Title>
        </LinkText>

        <LinkText to={routes.home}>
          <Title order={3}>Home</Title>
        </LinkText>
      </Group>
      <Accordion iconPosition="left" sx={{ h4: { marginBottom: "10px" } }}>
        <Accordion.Item label={<Title order={3}>Categories</Title>}>
          <LinkText to={`${routes.categories}`}>
            <Title order={4}>All</Title>
          </LinkText>
          <LinkText to={`${routes.category}action`}>
            <Title order={4}>Action</Title>
          </LinkText>
          <LinkText to={`${routes.category}adventure`}>
            <Title order={4}>Adventure</Title>
          </LinkText>
          <LinkText to={`${routes.category}shoujo`}>
            <Title order={4}>Shoujo</Title>
          </LinkText>
          <LinkText to={`${routes.category}romance`}>
            <Title order={4}>Romance</Title>
          </LinkText>
        </Accordion.Item>
        <Accordion.Item label={<Title order={3}>Tags</Title>}>
          <LinkText to={`${routes.tags}`}>
            <Title order={4}>All</Title>
          </LinkText>
          <LinkText to={`${routes.tag}cultivation`}>
            <Title order={4}>Cultivation</Title>
          </LinkText>
          <LinkText to={`${routes.tag}male-protagonist`}>
            <Title order={4}>Male Protagonist</Title>
          </LinkText>
          <LinkText to={`${routes.tag}arranged-marriage`}>
            <Title order={4}>Arranged Marriage</Title>
          </LinkText>
          <LinkText to={`${routes.tag}game-elements`}>
            <Title order={4}>Game Elements</Title>
          </LinkText>
        </Accordion.Item>
        {accessToken && (
          <Accordion.Item label={<Title order={3}>Account</Title>}>
            <LinkText to={`${routes.profileView}`}>
              <Title order={4}>Profile</Title>
            </LinkText>

            <LinkText to={`${routes.bookmark}`}>
              <Title order={4}>Bookmarks</Title>
            </LinkText>

            <LinkText to={`${routes.settings}`}>
              <Title order={4}>Settings</Title>
            </LinkText>
          </Accordion.Item>
        )}
        <Accordion.Item label={<Title order={3}>Discuss</Title>}>
          <a href="https://discord.gg/NV4tVGpxPr">
            <Title order={4}>Join Discord</Title>
          </a>
          <LinkText to={routes.suggestions}>
            <Title order={4}>Suggestions</Title>
          </LinkText>
          <LinkText to={routes.requests}>
            <Title order={4}>Requests</Title>
          </LinkText>
        </Accordion.Item>
      </Accordion>
      <LinkText to={`${routes.search}`}>
        <Button
          size="md"
          // compact={true}
          leftIcon={<SearchIcon />}
          fullWidth
        >
          Search
        </Button>
      </LinkText>
      {/* {!accessToken ? (
        <Button
          onClick={() => history.push(`${routes.login}`)}
          leftIcon={<LoginIcon />}
          fullWidth
          size="md"
        >
          Log In
        </Button>
      ) : (
        <Button
          onClick={() => logOut()}
          leftIcon={<LogoutIcon />}
          fullWidth
          size="md"
        >
          Log Out
        </Button>
      )} */}
    </Drawer>
  );
};
export default Sidebar;

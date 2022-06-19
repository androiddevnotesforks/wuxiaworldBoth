import { useState } from "react";
import { Burger } from "@mantine/core";
import { Container } from "@mantine/core";
import { Group } from "@mantine/core";
import { Title } from "@mantine/core";
import { ActionIcon } from "@mantine/core";
import { Divider, Paper } from "@mantine/core";
import { routes } from "../utils/Routes";
import { useStore } from "../Store/Store";
import LinkText from "../common/LinkText";
import Sidebar from "./Sidebar.js";

// const Sidebar = lazy(() => import("./Sidebar.js"));

const NavbarMobile = () => {
  const [opened, setOpened] = useState(false);
  const siteName = useStore((state) => state.siteName);
  const darkMode = useStore((state) => state.darkMode);
  const changeSettings = useStore((state) => state.changeSettings);
  const toggleDarkMode = () => {
    changeSettings({ darkMode: !darkMode });
  };
  return (
    <>
      <Paper
        padding="xl"
        shadow="md"
        radius={0}
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme == "light"
              ? theme.colors.gray[1]
              : theme.colors.dark[4],
        })}
      >
        <Container padding="xs">
          <Group position="apart">
            <LinkText href={routes.home}>
              <Group position="apart">
                <ActionIcon sx={{ fontSize: "35px" }}>📕</ActionIcon>
                <Title order={4}> {siteName} </Title>
              </Group>
            </LinkText>
            <Divider orientation="vertical" margins="sm" />
            <Group>
              <ActionIcon
                variant="outline"
                color={darkMode ? "yellow" : "blue"}
                onClick={toggleDarkMode}
                size="md"
                loaderProps={{
                  ariaLabel: darkMode ? "dark-mode" : "light-mode",
                }}
                aria-label={darkMode ? "dark-mode" : "light-mode"}
                sx={{ fontSize: "18px" }}
              >
                {darkMode ? "🌙" : "🌞"}
              </ActionIcon>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                aria-label="Toggle Menu"
              />
              <Sidebar opened={opened} setOpened={setOpened} />
            </Group>
          </Group>
        </Container>
      </Paper>
    </>
  );
};

export default NavbarMobile;

import { Paper } from "@mantine/core";
import { useStore } from "../Store/StoreProvider";
import { MantineProvider, NormalizeCSS, GlobalStyles } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useEffect } from "react";

const Background = (props) => {
  const darkMode = useStore((state) => state.darkMode);
  const loadFromLocalStorage = useStore((state) => state.loadFromLocalStorage);

  useEffect(() => {
    loadFromLocalStorage();
  }, []);
  return (
    <MantineProvider
      theme={{
        colorScheme: darkMode ? "dark" : "light",
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <NotificationsProvider>
        <Paper
          radius={0}
          style={{ minHeight: "90vh" }}
          sx={(theme) => ({
            backgroundColor:
              theme.colorScheme == "light"
                ? theme.colors.gray[1]
                : theme.colors.dark[4],
          })}
        >
          {props.children}
        </Paper>
      </NotificationsProvider>
    </MantineProvider>
  );
};

export default Background;

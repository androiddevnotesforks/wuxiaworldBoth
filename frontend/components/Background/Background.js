import { Paper } from "@mantine/core";
import { MantineProvider } from "@mantine/core";
import { NotificationsProvider } from "@mantine/notifications";
import { useEffect } from "react";
import { useStore } from "../Store/Store";
import { useProfile } from "../hooks/useProfile";

const Background = (props) => {
  const darkMode = useStore((state) => state.darkMode);
  const axiosRun = useStore((state) => state.axiosRun);
  const profileUpdate = useStore((state) => state.profileUpdate);
  const { data } = useProfile();
  useEffect(() => {
    if (typeof window !== "undefined") {
      axiosRun();
    }
  }, []);
  useEffect(() => {
    if (data) {
      profileUpdate(data);
    }
  }, [data]);
  useEffect(() => {
    console.log(darkMode);
  }, [darkMode]);

  return (
    <MantineProvider
      theme={{
        colorScheme: darkMode ?? "dark",
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

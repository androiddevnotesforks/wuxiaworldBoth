import { Card, Container, Title, Button, Group } from "@mantine/core";
import { useEffect } from "react";
import { routes } from "../../utils/Routes";
import ReactGA from "react-ga4";
import { useStore } from "../../Store/Store";
import { useRouter } from "next/router";
import TabBase from "./TabBase";
import { useSettings } from "../../hooks/useSettings";
import { parseCookies } from "nookies";

const SettingsTab = () => {
  const accessToken = useStore((state) => state.accessToken);
  const setUserInfo = useStore((state) => state.setUserInfo);
  const changeSettings = useStore((state) => state.changeSettings);
  const darkMode = useStore((state) => state.darkMode);
  const router = useRouter();
  const accessTokenCookie = parseCookies().accessToken;

  const { data: settings, refetch } = useSettings(accessToken);

  useEffect(() => {
    ReactGA.event({
      category: `Profile View`,
      label: `Settings Tab`,
      action: `Viewd Settings Tab`,
    });
  }, []);
  useEffect(() => {
    if (!accessToken && !accessTokenCookie) {
      router.push(routes.home);
      ReactGA.event({
        category: `Error`,
        label: `Settings Tab`,
        action: "No Token",
      });
    }
    if (!settings) {
      router.push(routes.home);
      ReactGA.event({
        category: `Error`,
        label: `Settings Tab`,
        action: "No Settings",
      });
    }
  }, [accessToken, settings]);

  const changeBookmark = () => {
    changeSettings({
      autoBookMark: !settings.autoBookMark,
    });
    ReactGA.event({
      category: `Settings Change`,
      label: `Bookmark Settings`,
      action: `Changed Bookmark Settings`,
    });
    refetch();
  };

  const addFontSize = () => {
    changeSettings({
      fontSize: settings.fontSize + 1,
    });
    ReactGA.event({
      category: `Settings Change`,
      label: `Change Font`,
      action: `Increase`,
    });
    refetch();
  };
  const decreaseFontSize = () => {
    changeSettings({
      fontSize: settings.fontSize - 1,
    });
    ReactGA.event({
      category: `Settings Change`,
      label: `Change Font`,
      action: `Decrease`,
    });
    refetch();
  };
  const toggleLowData = () => {
    changeSettings({
      lowData: !settings.lowData,
    });
    ReactGA.event({
      category: `Settings Change`,
      label: `Change Low Data`,
      action: `Turned ${settings.lowData ? "Off" : "On"}`,
    });
    refetch();
  };

  return (
    <TabBase title="Settings">
      <Container>
        <Card shadow="sm">
          <br />
          <Group
            direction="column"
            styles={{
              child: { padding: "15px" },
            }}
          >
            <Group>
              <Title order={4}>Dark Mode : </Title>
              <Button
                onClick={() => {
                  changeSettings({
                    darkMode: !darkMode,
                  });
                }}
              >
                {!darkMode ? "Turn On" : "Turn Off"}
              </Button>
            </Group>
            <Group>
              <Title order={4}>Auto Bookmark: </Title>
              <Button onClick={changeBookmark}>
                {settings?.autoBookMark ? "Turn Off" : "Turn On"}
              </Button>
            </Group>
            <Group>
              <Title order={4}>Change Fontsize(dev) : </Title>
              <Button onClick={addFontSize}>+</Button>
              <Title order={5}>{settings?.fontSize}</Title>

              <Button onClick={decreaseFontSize}>-</Button>
            </Group>
            <Group>
              <Title order={4}>Low Data Use(dev) : </Title>
              <Button onClick={toggleLowData}>
                {settings?.lowData ? "Turn Off" : "Turn On"}
              </Button>
            </Group>
            <Group>
              <Title order={4}>Ad Free View (coming soon) : </Title>
              <Button>Turn On</Button>
            </Group>
            <Group>
              <Title order={4}>
                No Flicker Between Chapter Loads (coming soon) :{" "}
              </Title>
              <Button>Turn On</Button>
            </Group>
          </Group>
          <br />
          <Title order={2} align="center">
            Description
          </Title>
          <br />

          <Group direction="column">
            <Title order={3}>
              Dark Mode : Toggle to switch from Light Mode to Dark Mode(light on
              eyes and reduce battery consumption)
            </Title>
            <Title order={3}>
              Auto Bookmark: If turned on, any novels that you have added to
              bookmarks will automatically update to the latest chapter you
              read. No need to click "Mark as Read"
            </Title>
            <Title order={3}>
              Change Fontsize : Increase or decrease the fontsize for chapter
              text from here or chapter page directly
            </Title>
            <Title order={3}>
              Low Data Use : In development right now. Basically if activated,
              all novels' images will switch to low quality images instead to
              not use too much data
            </Title>
          </Group>
        </Card>
      </Container>
    </TabBase>
  );
};

export default SettingsTab;

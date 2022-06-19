import { Card, Container, Title, Text, Avatar, Center } from "@mantine/core";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useStore } from "../../Store/Store";
import TabBase from "./TabBase";

const ProfileTab = () => {
  const accessToken = useStore((state) => state.accessToken);
  const userInfo = useStore((state) => state.userInfo);
  const setUserInfo = useStore((state) => state.setUserInfo);

  useEffect(() => {
    setUserInfo(accessToken);
    ReactGA.event({
      category: `Profile View`,
      action: `Profile Tab`,
    });
  }, []);
  return (
    <TabBase title="Profile">
      <Container>
        <Card>
          <Center>
            <Avatar size="xl" src={userInfo && userInfo.imageUrl}>
              {userInfo && userInfo.initials}
            </Avatar>
          </Center>
          <Title align="center">
            Welcome {userInfo && userInfo.user.first_name}
          </Title>
          <br />
          <Text>
            Only basic stuff in here for now. Check Settings tab to change your
            preferences and Bookmarks tab to get to your favorite books quick
          </Text>
        </Card>
      </Container>
    </TabBase>
  );
};

export default ProfileTab;

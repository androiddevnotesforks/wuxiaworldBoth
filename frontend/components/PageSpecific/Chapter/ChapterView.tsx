import React, { useEffect, useState } from "react";
import axios from "axios";
import { apiHome } from "../../utils/siteName.js";
// import { useWindowScroll } from "@mantine/hooks";
import {
  Center,
  Paper,
  Container,
  Text,
  Button,
  Breadcrumbs,
  Group,
  Title,
  Modal,
  Textarea,
  Select,
  Slider,
  Box,
  Card,
} from "@mantine/core";
import { useQueryClient } from "react-query";
import Background from "../../Background/Background.js";
// import GoogleAd from "../../components/common/GoogleAd.js";
import { useMediaQuery } from "@mantine/hooks";
import BackgroundLoading from "../../Background/BackgroundLoading.js";
import ReactGA from "react-ga";
import Buttons from "../../common/Buttons.js";
import GoogleAdSmall from "../../common/GoogleAdSmall.js";
// import GoogleAdMobile from "../../common/GoogleAdMobile.js";
import { useStore } from "../../Store/Store";
import LinkText from "../../common/LinkText";
import { routes } from "../../utils/Routes";
import { useChapter, chapterFetch } from "../../hooks/useChapter";
import GoogleAdText from "../../common/GoogleAdText";
import ScrollUpButton from "./ScrollToTop.js";
import { useNotifications } from "@mantine/notifications";
import { useProfile } from "../../hooks/useProfile";
import useSpeechSynthesis from "./speech_utils";
import NewCard from "../../common/NewCard.js";

const ChapterView = ({ chapterSlug }) => {
  const queryClient = useQueryClient();
  const accessToken = useStore((state) => state.accessToken);
  const changeSettings = useStore((state) => state.changeSettings);
  const fontSize = useStore((state) => state.fontSize);
  const [rate, setRate] = useStore((state) => [state.rate, state.setRate]);
  const [voiceName, setVoiceName] = useStore((state) => [
    state.voiceName,
    state.setVoiceName,
  ]);
  const phone = useMediaQuery("(max-width: 1024px)");
  const { data } = useChapter(chapterSlug);
  const [reportComment, setReportComment] = useState("");
  const [reportTitle, setReportTitle] = useState("");
  const notifications = useNotifications();
  const [sentReport, setSentReport] = useState(false);
  const [opened, setOpened] = useState(false);
  const { data: profile } = useProfile({ enabled: Boolean(accessToken) });
  const [setingsShow, setSettingsShow] = useState(false);
  const { supported, speak, speaking, cancel, voices, paused, pause, resume } =
    useSpeechSynthesis({
      onEnd: () => {
        console.log("test");
      },
    });

  const playClick = () => {
    if (paused) {
      resume();
    } else {
      speak({
        text: data?.text,
        voice: voiceName
          ? voices?.filter((voice) => voice.name == voiceName)[0]
          : null,
        rate,
      });
    }
  };
  const pauseClick = () => {
    pause();
  };
  const stopClick = () => {
    cancel();
  };

  useEffect(() => {
    if (accessToken && profile?.user?.is_staff && data?.nextChap) {
      queryClient.prefetchQuery(
        ["chapterFetch", `${data?.novelParent}-${data?.nextChap}`],

        chapterFetch,
        { staleTime: 100000 }
      );
    }
    if (data && data?.novelParentName) {
      ReactGA.event({
        category: "Novel View",
        action: "Chapter View",
        label: `${data?.novelParentName}`,
      });
    }
  }, [data]);
  useEffect(() => {
    if (accessToken && profile?.user?.is_staff && data?.nextChap) {
      queryClient.prefetchQuery(
        ["chapterFetch", `${data?.novelParent}-${data?.nextChap}`],

        chapterFetch,
        { staleTime: 100000 }
      );
    }
  }, [profile]);
  useEffect(() => {
    window.speechSynthesis.cancel();
  }, [voiceName, rate, chapterSlug]);
  const reportChapter = () => {
    setOpened(true);
  };
  const sendComment = (e) => {
    e.preventDefault();
    const notifId = notifications.showNotification({
      title: `Thanks for informing ${profile?.user?.first_name || ""}❤️`,
      message: `Will take a look and fix.`,
      autoClose: true,
    });
    const details = {
      title: reportTitle,
      description: `${reportTitle} \n${reportComment}`,
      type: "CR",
      chapter: data?.id,
      novel: data?.novelParent,
    };
    axios
      .post(`${apiHome}/report/`, details)
      .then((response) => {
        setSentReport(true);
      })
      .catch((error) => error);
    setOpened(false);
  };
  const addBookmark = () => {
    if (!chapterSlug) {
      return;
    }
    if (!accessToken) {
      const newNotif = notifications.showNotification({
        title: `Login Required`,
        message: `Bookmark feature is only available for logged in users.`,
        autoClose: true,
      });
    }
    const link = `${apiHome}/bookmark/`;
    const params = { novSlugChapSlug: chapterSlug };
    const notifId = notifications.showNotification({
      title: `Updating Bookmarks`,
      message: `Updating last read chapter to ${data?.title}, please wait`,
      loading: true,
      autoClose: false,
      disallowClose: true,
    });
    axios
      .post(link, params)
      .then((response) => {
        const res = response.data;
        notifications.updateNotification(notifId, {
          id: notifId,
          loading: false,
          autoClose: 2000,
          title: `Bookmark Updated`,
          message: `Your bookmark has been updated to ${res.last_read.title}`,
        });
      })
      .catch((err) => {
        notifications.updateNotification(notifId, {
          id: notifId,
          loading: false,
          autoClose: 2000,
          title: `Error : Bookmark Not Updated`,
          message: `An error occured, maybe try later?`,
        });
      });
  };

  const chapterParts = data?.text?.split("\n").map((text, index) => (
    <div key={index}>
      <Text
        id="chapterText"
        sx={(theme) => ({
          fontSize: `${fontSize}px`,
          lineHeight: "1.8em",
          marginTop: "1em",
        })}
      >
        {text}
      </Text>
      {index % 17 == 0 && !phone && index != 0 && !profile?.user?.is_staff && (
        <GoogleAdText pageParam={chapterSlug} adNum={index} />
      )}
      {index % 15 == 0 && phone && index != 0 && !profile?.user?.is_staff && (
        <GoogleAdSmall
          pageParam={chapterSlug}
          adNum={index}
          addedStyles={{ width: "300px", height: "100px" }}
        />
      )}
    </div>
  ));

  return (
    <Background>
      <Container>
        <div>
          <Breadcrumbs style={{ marginBottom: "40px" }}>
            <LinkText href={routes.home}>
              <Text size="xl">Home</Text>
            </LinkText>
            {data && (
              <LinkText
                style={{ whiteSpace: "nowrap" }}
                href={`${routes.novel}${data.novelParent}`}
              >
                <Text size="xl">{data && data.novelParentName}</Text>
              </LinkText>
            )}
          </Breadcrumbs>

          {data && (
            <>
              <Center>
                <Title order={1} sx={{ textTransform: "uppercase" }}>
                  {data.title}
                </Title>
              </Center>
              <br />
              <GoogleAdSmall
                pageParam={chapterSlug}
                adNum={100}
                addedStyles={{ width: "320px", height: "100px" }}
              />
              <br />

              <Buttons
                key={data?.index}
                novelParent={data?.novelParent}
                nextChapter={data?.nextChap}
                prevChapter={data?.prevChap}
                chapterIndex={data?.index}
              />
            </>
          )}
        </div>
      </Container>
      <Container>
        <div style={{ overflowWrap: "break-word" }}>
          <Paper
            radius={0}
            shadow="md"
            style={phone ? { padding: "10px 5px" } : { padding: "40px 15px" }}
          >
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Group>
                <Button
                  onClick={() => {
                    if (fontSize < 40) {
                      changeSettings({ fontSize: fontSize + 1 });
                    }
                  }}
                  radius="lg"
                  size="xs"
                >
                  A+
                </Button>
                <Button
                  onClick={() => {
                    if (fontSize > 10) {
                      changeSettings({ fontSize: fontSize - 1 });
                    }
                  }}
                  radius="lg"
                  size="xs"
                >
                  A-
                </Button>
                {data && (
                  <Button onClick={addBookmark} size="xs" leftIcon={<>📚</>}>
                    Mark Read
                  </Button>
                )}
              </Group>
            </div>
            {setingsShow && (
              <Card
                sx={(theme) => ({
                  maxWidth: "300px",
                  marginBottom: "20px",
                  paddingTop: "30px",
                  backgroundColor:
                    theme.colorScheme == "light"
                      ? theme.colors.gray[3]
                      : theme.colors.dark[6],
                })}
              >
                <Box
                  sx={{
                    align: "left",
                    marginBottom: "40px",
                  }}
                >
                  <Slider
                    step={0.2}
                    min={0}
                    max={5}
                    value={rate ?? 1}
                    onChange={setRate}
                    marks={[
                      { value: 0, label: "0" },
                      { value: 1, label: "1" },
                      { value: 2, label: "2" },
                      { value: 3, label: "3" },
                      { value: 4, label: "4" },
                      { value: 5, label: "5" },
                    ]}
                  />
                </Box>
                <Group position="center" grow>
                  <Select
                    data={voices.map((voice) => {
                      return { label: voice.name, value: voice.name };
                    })}
                    onChange={setVoiceName}
                    value={voiceName}
                  />
                </Group>
              </Card>
            )}
            <Group direction="column">
              <Group position="left">
                <Button
                  onClick={() => setSettingsShow(!setingsShow)}
                  radius="xl"
                >
                  ⚙️
                </Button>
                {(paused || !speaking) && (
                  <Button onClick={playClick}>Play</Button>
                )}
                {speaking && (
                  <>
                    {!paused && <Button onClick={pauseClick}>Pause</Button>}
                    <Button onClick={stopClick}>Stop</Button>
                  </>
                )}
              </Group>
            </Group>
            <Modal
              opened={opened}
              onClose={() => setOpened(false)}
              overflow="inside"
              size={phone ? "calc(100vw - 87px)" : "lg"}
              title="Report Chapter"
            >
              <Paper padding="xl">
                <form onSubmit={sendComment}>
                  <Select
                    label="What is the issue?"
                    placeholder="Pick one"
                    onChange={setReportTitle}
                    data={[
                      { value: "typo", label: "Typo in chapter" },
                      {
                        value: "index",
                        label: "The chapter number is placed incorrectly",
                      },
                      {
                        value: "corrupted",
                        label: "Chapter is corrupted/not readable",
                      },
                      {
                        value: "part-missing",
                        label: "Part of the chapter is missing",
                      },
                    ]}
                  />
                  <Textarea
                    placeholder="Your comment"
                    label="Your comment"
                    required
                    value={reportComment}
                    onChange={(event) =>
                      setReportComment(event.currentTarget.value)
                    }
                  />
                  <Button type="submit" radius="lg" size="xs">
                    {" "}
                    Submit{" "}
                  </Button>
                </form>
              </Paper>
            </Modal>
            {!data?.text ? (
              <Container sx={{ position: "relative" }}>
                <BackgroundLoading />
              </Container>
            ) : (
              <>
                {chapterParts}
                <Container
                  sx={{
                    paddingTop: "10px",
                    paddingBottom: "10px",
                  }}
                >
                  {data && (
                    <Button
                      disabled={sentReport}
                      onClick={reportChapter}
                      size="xs"
                      leftIcon={"!"}
                      sx={{
                        float: "right",
                      }}
                    >
                      Report Chapter
                    </Button>
                  )}
                </Container>
              </>
            )}
          </Paper>
        </div>
        <br />
        <GoogleAdSmall
          pageParam={chapterSlug}
          adNum={101}
          addedStyles={{ width: "320px", height: "100px" }}
        />
        {data && (
          <>
            <Buttons
              key={data.index}
              novelParent={data.novelParent}
              nextChapter={data.nextChap}
              prevChapter={data.prevChap}
              chapterIndex={data.index}
            />
          </>
        )}
      </Container>
      <ScrollUpButton />

      <br />

      <br />
      <br />
    </Background>
  );
};

export default ChapterView;

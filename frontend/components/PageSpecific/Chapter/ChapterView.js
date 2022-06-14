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
} from "@mantine/core";
import { useQueryClient } from "react-query";
import Background from "../../Background/Background.js";
// import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode";
// import GoogleAd from "../../components/common/GoogleAd.js";
import { useMediaQuery } from "@mantine/hooks";
import BackgroundLoading from "../../Background/BackgroundLoading.js";
import ReactGA from "react-ga";
import Buttons from "../../common/Buttons.js";
import GoogleAdSmall from "../../common/GoogleAdSmall.js";
// import GoogleAdMobile from "../../common/GoogleAdMobile.js";
import { useRouter } from "next/router";
import { useStore } from "../../Store/StoreProvider.js";
import LinkText from "../../common/LinkText.js";
import { routes } from "../../utils/Routes.js";
import { useChapter, chapterFetch } from "../../hooks/useChapter.js";
import GoogleAdText from "../../common/GoogleAdText.js";
import ScrollUpButton from "./ScrollToTop.js";
import { useNotifications } from "@mantine/notifications";

const ChapterView = ({ chapterSlug }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const accessToken = useStore((state) => state.accessToken);
  const changeSettings = useStore((state) => state.changeSettings);
  const fontSize = useStore((state) => state.fontSize);
  const phone = useMediaQuery("(max-width: 1024px)");
  const { data } = useChapter(chapterSlug);
  // const [reportComment, setReportComment] = useState("");
  const notifications = useNotifications();
  const [sentReport, setSentReport] = useState(false);

  useEffect(() => {
    if (data?.nextChap) {
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
        value: `${data?.title}`,
      });
    }
  }, [data]);
  const reportChapter = () => {
    const notifId = notifications.showNotification({
      title: `Thanks for informing ❤️`,
      message: `Will take a look and fix.`,
      autoClose: true,
    });
    const details = {
      title: "Fix Chapter",
      description: "something wrong here",
      chapter: data?.id,
      reported_by: null,
    };
    axios
      .post(`${apiHome}/report/`, details)
      .then((response) => {
        setSentReport(true);
      })
      .catch((error) => error);
  };
  const addBookmark = () => {
    if (!chapterSlug) {
      return;
    }
    if (!accessToken) {
      router.push(routes.login);
    }
    const link = `${apiHome}/bookmark/`;
    const params = { novSlugChapSlug: chapterSlug };
    axios
      .post(link, params)
      .then((response) => {
        const res = response.data;
        // toast.info("Your Novel Bookmark has been updated");
      })
      .catch((err) => {
        // toast.error("Couldn't update your bookmark");
      });
  };

  const chapterParts = data?.text?.split("\n").map((text, index) => (
    <div key={index}>
      <Text
        id="chapterText"
        style={{
          fontSize: `${fontSize}px`,
          lineHeight: "1.8em",
          marginTop: "1em",
        }}
      >
        {text}
      </Text>
      {index % 17 == 0 && !phone && index != 0 && (
        <GoogleAdText pageParam={chapterSlug} adNum={index} />
      )}
      {index % 15 == 0 && phone && index != 0 && (
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
                <Title order={1} transform="uppercase">
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
                {/* {data && (
                  <Button
                    onClick={addBookmark}
                    size="xs"
                    leftIcon={<ChromeReaderModeIcon />}
                  >
                    Mark Read
                  </Button>
                )} */}
                {data && (
                  <Button
                    disabled={sentReport}
                    onClick={reportChapter}
                    size="xs"
                    leftIcon={"!"}
                  >
                    Report Chapter
                  </Button>
                )}
              </Group>
            </div>
            {!data?.text ? (
              <Container sx={{ position: "relative" }}>
                <BackgroundLoading />
              </Container>
            ) : (
              <>{chapterParts}</>
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

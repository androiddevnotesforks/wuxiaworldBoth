import axios from "axios";
import { useMediaQuery } from "@mantine/hooks";
import { useQuery } from "react-query";
import { Group, Button } from "@mantine/core";
import { useEffect } from "react";
import LinkText from "./LinkText.js";
import { routes } from "../utils/Routes.js";
import { apiHome } from "../utils/siteName.js";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const ChaptersModal = dynamic(() => import("./ChaptersModal.js"));

const Buttons = ({ novelParent, nextChapter, prevChapter, chapterIndex }) => {
  const phone = useMediaQuery("(max-width: 768px)");
  const router = useRouter();

  const chaptersFetch = () => {
    return axios
      .get(`${apiHome}/chapters/${novelParent}/`)
      .then((response) => {
        const res = response.data;

        return res;
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleKeyPress = (event) => {
    if (event.keyCode === 37 && prevChapter) {
      router.push(
        `${routes.chapter}${novelParent}-${prevChapter}`,
        `${routes.chapter}${novelParent}-${prevChapter}`,
        { shallow: true }
      );
    } else if (event.keyCode === 39 && nextChapter) {
      router.push(
        `${routes.chapter}${novelParent}-${nextChapter}`,
        `${routes.chapter}${novelParent}-${nextChapter}`,
        {
          shallow: true,
        }
      );
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      localStorage.removeItem("chapters");
    };
  }, []);

  const { isLoading, error, data, refetch } = useQuery(
    ["chapBox", novelParent],
    chaptersFetch,
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  return (
    <Group position="apart" key={nextChapter} style={{ marginBottom: "10px" }}>
      <LinkText
        href={
          prevChapter
            ? `${routes.chapter}${novelParent}-${prevChapter}`
            : `${routes.novel}${novelParent}`
        }
        refresh={true}
      >
        <Button id="previousChapter">
          {!phone ? (prevChapter ? "Previous Chapter" : "Novel Info") : "<"}
        </Button>
      </LinkText>

      <ChaptersModal
        chapterList={data}
        fetchFunction={refetch}
        loading={isLoading}
      />
      <LinkText
        href={
          nextChapter
            ? `${routes.chapter}${novelParent}-${nextChapter}`
            : `${routes.novel}${novelParent}`
        }
        refresh={true}
      >
        <Button id="nextChapter" disabled={nextChapter ? false : true}>
          {!phone ? (nextChapter ? "Next Chapter" : "Novel Info") : ">"}
        </Button>
      </LinkText>
    </Group>
  );
};
export default Buttons;

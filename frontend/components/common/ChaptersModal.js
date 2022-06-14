import {
  Divider,
  LoadingOverlay,
  Modal,
  Paper,
  Title,
  Button,
  Center,
} from "@mantine/core";
import React, { useState } from "react";
import { useMediaQuery } from "@mantine/hooks";
import { Pagination } from "@mantine/core";
import { routes } from "../utils/Routes";
import LinkText from "./LinkText";

const ChaptersModal = ({ chapterList, loading, fetchFunction, buttonText }) => {
  const [opened, setOpened] = useState(false);
  const phone = useMediaQuery("(max-width: 768px)");
  const [activePage, setPage] = useState(1);

  const openModal = () => {
    setOpened(true);
    if (chapterList && chapterList.length) {
      return;
    } else {
      fetchFunction();
    }
  };
  const allChapters =
    !loading && chapterList ? (
      (chapterList?.length > 100
        ? chapterList.slice((activePage - 1) * 50, activePage * 50)
        : chapterList
      ).map((chapter) => (
        <LinkText
          key={chapter.novSlugChapSlug}
          href={`${routes.chapter}${chapter.novSlugChapSlug}`}
        >
          <Title order={4} sx={{ marginBottom: "10px" }}>
            {chapter.title}
          </Title>
          <Divider />
        </LinkText>
      ))
    ) : (
      <LoadingOverlay visible={true} />
    );
  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        overflow="inside"
        size={phone ? "calc(100vw - 87px)" : "lg"}
      >
        <Paper padding="30px">
          {allChapters}
          {chapterList?.length > 100 && (
            <Center>
              <Pagination
                page={activePage}
                total={~~(chapterList?.length / 50) + 1}
                onChange={setPage}
              />
            </Center>
          )}
        </Paper>
      </Modal>
      <Button onClick={openModal}>
        {buttonText ? buttonText : "All Chapters"}
      </Button>
    </>
  );
};

export default React.memo(ChaptersModal);

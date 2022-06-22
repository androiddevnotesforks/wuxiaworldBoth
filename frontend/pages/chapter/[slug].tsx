import Script from "next/script";
import { useRouter } from "next/router";
import { chapterFetch, useChapter } from "../../components/hooks/useChapter";
import { initializeStore, useStore } from "../../components/Store/Store";
import DisqusComments from "../../components/common/DisqusComments";
import useInView from "react-cool-inview";
import { Container } from "@mantine/core";
import dynamic from "next/dynamic";
import ChapterView from "../../components/PageSpecific/Chapter/ChapterView";
import { dehydrate, QueryClient } from "react-query";
import { routes } from "../../components/utils/Routes.js";
import Seo from "../../components/common/Seo";
import Background from "../../components/Background/Background";
import { apiHome } from "../../components/utils/siteName";
import axios from "axios";
import { useEffect } from "react";
import nookies from "nookies";
// const ChapterView = dynamic(
//   () => import("../../components/PageSpecific/Chapter/ChapterView"),
//   {
//     ssr: false,
//     loading: () => <BackgroundLoading />,
//   }
// );
const Recommendations = dynamic(
  () => import("../../components/common/Recommendations"),
  {
    ssr: false,
  }
);

// export async function getStaticPaths() {
//   const headers = {
//     Authorization: `Token ${process.env.ADMIN_TOKEN}`,
//   };

//   const fetched_chapters = await axios
//     .get(`${apiHome}/chapters/library-of-heavens-path/`, { headers })
//     .then((response) => {
//       const res = response.data;
//       return res;
//     })
//     .catch((error) => console.log(error));

//   const all_chaps = fetched_chapters.slice(0, 10);

//   const paths_to_return = all_chaps.map((chap) => {
//     const value = { slug: chap.novSlugChapSlug };
//     return value;
//   });

//   const flattened_array = paths_to_return.map((chapter) => {
//     const value = {
//       params: { slug: chapter.slug },
//     };
//     return value;
//   });

//   return {
//     paths: [...flattened_array],
//     fallback: "blocking", // false or 'blocking'
//   };
// }
export async function getServerSideProps(ctx) {
  const { slug } = ctx.params;
  const darkMode = nookies.get(ctx)?.darkMode;
  const fontSize = nookies.get(ctx)?.fontSize;
  const zustandStore = initializeStore({
    darkMode: darkMode ?? "dark",
    fontSize: fontSize ?? 21,
  });

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["chapterFetch", slug], chapterFetch, {
    staleTime: Infinity,
  });
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      initialZustandState: JSON.parse(JSON.stringify(zustandStore.getState())),
    },
  };
}
const Chapter = (props) => {
  const router = useRouter();

  const { observe, inView } = useInView({
    threshold: 0.5,
    onEnter: ({ unobserve }) => {
      unobserve();
    },
  });
  const { slug } = router.query;
  const { data, isLoading } = useChapter(slug);

  const siteUrl = useStore((state) => state.siteUrl);
  const axiosRun = useStore((state) => state.axiosRun);

  useEffect(() => {
    if (typeof window !== "undefined") {
      axiosRun();
    }
  }, []);

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5752282235723884"
        strategy="beforeInteractive"
      />
      <Background>
        <Seo
          description={`You're reading ${data?.title} - ${data?.novelParentName} for free on ${siteUrl}, continue reading `}
          url={`${siteUrl}${routes.chapter}${data?.novelParent}-${data?.index}`}
          title={`${data?.title} : ${data?.novelParentName} - Read at Wuxiaworld EU`}
          image={""}
          loading={false}
        />
        <ChapterView chapterSlug={slug} />
        <Container sx={{ maxWidth: "700px", position: "relative" }}>
          <Container size="md" ref={observe}>
            {inView && <DisqusComments slug={`${slug}`} />}
          </Container>
          {!isLoading && (
            <>
              <Container ref={observe}>
                {inView && (
                  <DisqusComments
                    slug={`${data?.novelParent}-${data?.index}`}
                  />
                )}
              </Container>
              <br />
              <br />

              <Container
                sx={{
                  maxWidth: "700px",
                }}
              >
                {inView && <Recommendations novel_slug={data?.novelParent} />}
              </Container>
              <br />
            </>
          )}
          <br />
        </Container>
      </Background>
    </>
  );
};

export default Chapter;

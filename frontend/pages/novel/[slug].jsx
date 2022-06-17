import Background from "../../components/Background/Background";
import { dehydrate, QueryClient } from "react-query";
import { useRouter } from "next/router";
import { novelInfoFetch, useNovel } from "../../components/hooks/useNovel";
import MobileDetail from "../../components/PageSpecific/NovelDetail/MobileDetail";
import dynamic from "next/dynamic";
import { Container } from "@mantine/core";
import useInView from "react-cool-inview";
import Seo from "../../components/common/Seo.js";
import { routes } from "../../components/utils/Routes";
import { useStore } from "../../components/Store/StoreProvider";
// import { getSession, useSession } from "next-auth/react";
import axios from "axios";
import { apiHome } from "../../components/utils/siteName";

const DisqusComments = dynamic(
  () => import("../../components/common/DisqusComments"),
  {
    ssr: false,
  }
);
const Recommendations = dynamic(
  () => import("../../components/PageSpecific/NovelDetail/Recommendations"),
  {
    ssr: false,
  }
);

const SSR = typeof window === "undefined";

export async function getStaticPaths() {
  const headers = {
    Authorization: `Token ${process.env.ADMIN_TOKEN}`,
  };
  const response = await axios.get(
    `${apiHome}/admin-novels/?order=-total_views`,
    {
      headers,
    }
  );
  const urls = response.data.slice(0, 10).map((item) => {
    const value = { params: { slug: item.slug } };
    return value;
  });
  return {
    paths: [...urls],
    fallback: "blocking", // false or 'blocking'
  };
}

export async function getStaticProps(context) {
  const { slug } = context.params;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["novelInfo", slug], novelInfoFetch, {
    staleTime: Infinity,
  });
  const recommendation_fetch = ({ queryKey }) => {
    const [_, id] = queryKey;
    const link = `${apiHome}/recommendations/${id}`;
    return axios
      .get(link)
      .then((response) => {
        const res = response.data;
        return res;
      })
      .catch((error) => {
        console.log(error);
      });
  };
  await queryClient.prefetchQuery(
    ["get_recommendations", slug],
    recommendation_fetch,
    {
      staleTime: Infinity,
    }
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 60 * 60 * 48,
  };
}

// export async function getServerSideProps(context) {
//   // const { req } = context;
//   const { slug } = context.params;

//   // const session = await getSession({ req });
//   // if (session) {
//   //   axios.defaults.headers.common[
//   //     "Authorization"
//   //   ] = `Token ${session.user.accessToken}`;
//   // }

//   const queryClient = new QueryClient();
//   await queryClient.prefetchQuery(["novelInfo", slug], novelInfoFetch, {
//     staleTime: Infinity,
//   });
//   // console.log(dehydrate(queryClient));
//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   };
// }

const NovelDetail = (props) => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: novelData } = useNovel(slug);
  const siteName = useStore((state) => state.siteName);

  const { observe, unobserve, inView, scrollDirection, entry } = useInView({
    threshold: 0,

    onEnter: ({ unobserve }) => {
      unobserve();
    },
  });
  const { observe: recommendationObserve, inView: recommendationView } =
    useInView({
      threshold: 0.1, // Default is 0

      onEnter: ({ unobserve }) => {
        unobserve();
      },
    });
  return (
    <Background>
      <Seo
        url={`${routes.novel}${novelData?.slug}`}
        image={`${novelData?.image}`}
        title={`${novelData?.name} - Read Wuxia Novels at ${siteName}`}
        description={`You are reading ${novelData?.name} online for free on ${siteName}. Read ${novelData?.name} and more Wuxia, Xuanhuan, Korean and Japanese novels at ${siteName}. Continue reading . ${novelData?.description}`}
        loading={false}
      />
      <MobileDetail
        novelData={novelData}
        // bookmarked={bookmarkData?.created_at && !bookmarkError}
        // addNovelBookmark={addNovelBookmark}
        // removeNovelBookmark={removeNovelBookmark}
        // bookmarkData={bookmarkData}
        id={slug}
      />
      <Container
        sx={{ maxWidth: "700px", position: "relative" }}
        ref={recommendationObserve}
      >
        <Container size="md" ref={observe}>
          {inView && <DisqusComments slug={`${novelData?.slug}`} />}
        </Container>
        <Recommendations novel_slug={slug} />
        <br />
      </Container>
    </Background>
  );
};

export default NovelDetail;

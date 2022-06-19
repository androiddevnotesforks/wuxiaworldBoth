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
// import { getSession, useSession } from "next-auth/react";
import axios from "axios";
import nookies from "nookies";
import { useEffect } from "react";
import { initializeStore, useStore } from "../../components/Store/Store";
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
  const urls = response.data.slice(0, 100).map((item) => {
    const value = { params: { slug: item.slug } };
    return value;
  });
  return {
    paths: [...urls],
    fallback: "blocking", // false or 'blocking'
  };
}

export async function getStaticProps(ctx) {
  const { slug } = ctx.params;

  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["novelInfo", slug], novelInfoFetch, {
    staleTime: Infinity,
  });
  const zustandStore = initializeStore();

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      initialZustandState: JSON.parse(JSON.stringify(zustandStore.getState())),
    },
  };
}

const NovelDetail = (props) => {
  const router = useRouter();
  const { slug } = router.query;
  const { data: novelData } = useNovel(slug);
  const profile = useStore((state) => state.profile);
  const axiosRun = useStore((state) => state.axiosRun);

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
        title={`${novelData?.name} - Read Wuxia Novels at ${process.env.NEXT_PUBLIC_SITE_NAME}`}
        description={`You are reading ${novelData?.name} online for free on ${process.env.NEXT_PUBLIC_SITE_NAME}. Read ${novelData?.name} and more Wuxia, Xuanhuan, Korean and Japanese novels at ${process.env.NEXT_PUBLIC_SITE_NAME}. Continue reading . ${novelData?.description}`}
        loading={false}
      />
      {profile?.user?.is_staff && (
        <Container>
          <div>
            <a href={`${routes.novel}${novelData?.slug}/edit`}>Edit</a>
          </div>
        </Container>
      )}

      <MobileDetail novelData={novelData} id={slug} />
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

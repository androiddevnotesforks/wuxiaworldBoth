import { useState, useEffect } from "react";
import { initializeStore, useStore } from "../../../components/Store/Store";
import { routes } from "../../../components/utils/Routes";
import { useRouter } from "next/router";
import Background from "../../../components/Background/Background";
import Seo from "../../../components/common/Seo";
import dynamic from "next/dynamic";
import { dehydrate, QueryClient } from "react-query";
import { bookmarksFetch } from "../../../components/hooks/useBookmark";
import {
  settingsFetch,
  useSettings,
} from "../../../components/hooks/useSettings";
import { profileFetch } from "../../../components/hooks/useProfile";
import nookies from "nookies";

const ProfileRoutes = {
  view: 0,
  settings: 1,
  bookmark: 2,
};
const AllTabs = dynamic(
  () => import("../../../components/PageSpecific/Profile/AllTabs"),
  { ssr: false }
);
export async function getServerSideProps(ctx) {
  const queryClient = new QueryClient();
  const accessToken = nookies.get(ctx).accessToken;
  if (!accessToken) {
    return {
      redirect: {
        permanent: false,
        destination: routes.login,
      },
      props: {},
    };
  }

  const { slug } = ctx.params as { slug: string };
  await queryClient.prefetchQuery(["getProfile", accessToken], profileFetch, {
    staleTime: Infinity,
  });
  const profile = (await queryClient.getQueryData([
    "getProfile",
    accessToken,
  ])) as any;
  if (slug == "settings") {
    await queryClient.prefetchQuery(
      ["getSettings", accessToken],
      settingsFetch,
      {
        staleTime: Infinity,
      }
    );
  }
  if (slug == "bookmark") {
    await queryClient.prefetchQuery(
      ["getBookmarks", accessToken],
      bookmarksFetch,
      {
        staleTime: Infinity,
      }
    );
  }

  const zustandStore = initializeStore({
    accessToken: accessToken,
    profile,
    darkMode: profile?.settings.darkMode,
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      initialZustandState: JSON.parse(JSON.stringify(zustandStore.getState())),
    },
  };
}

const Profile = () => {
  const token = useStore((state) => state.accessToken);
  const settings = useSettings();

  const [currentTab, setCurrentTab] = useState(null);

  const router = useRouter();
  const { slug } = router.query as { slug: string };

  useEffect(() => {
    setCurrentTab(ProfileRoutes[slug]);
  }, [slug]);

  useEffect(() => {
    if (!token) {
      router.push(routes.home);
    }
    if (!settings) {
      router.push(routes.home);
    }
  }, [token, settings, router.pathname]);
  return (
    <Background>
      <Seo
        title={`Profile - ${process.env.NEXT_PUBLIC_SITE_NAME}`}
        loading={false}
      />
      <AllTabs currentTab={currentTab} />
    </Background>
  );
};

export default Profile;

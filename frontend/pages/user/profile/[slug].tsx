import { useState, useEffect } from "react";
import { useStore } from "../../../components/Store/Store";
import { routes } from "../../../components/utils/Routes";
import { useRouter } from "next/router";
import Background from "../../../components/Background/Background";
import Seo from "../../../components/common/Seo";
import dynamic from "next/dynamic";

const ProfileRoutes = {
  view: 0,
  settings: 1,
  bookmark: 2,
};
const AllTabs = dynamic(
  () => import("../../../components/PageSpecific/Profile/AllTabs"),
  { ssr: false }
);

const Profile = () => {
  const token = useStore((state) => state.accessToken);
  const settings = useStore((state) => state.settings);

  const [currentTab, setCurrentTab] = useState(null);

  const router = useRouter();
  const { slug } = router.query as { slug: string };

  useEffect(() => {
    if (!token) {
      router.push(routes.home);
    }
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

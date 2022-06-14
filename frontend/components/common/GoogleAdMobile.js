import React, { useEffect } from "react";

const GoogleAdMobile = ({ pageParam, adNum }) => {
  useEffect(() => {
    const pushAd = () => {
      try {
        const adsbygoogle = window.adsbygoogle;
        adsbygoogle.push({});
      } catch (e) {
        console.error(e);
      }
    };

    let interval = setInterval(() => {
      if (window.adsbygoogle) {
        pushAd();
        clearInterval(interval);
      }
    }, 50);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <ins
      className={`adsbygoogle`}
      data-ad-client="ca-pub-5752282235723884"
      data-ad-slot="1980500813"
      data-ad-format="fluid"
      data-ad-layout="in-article"
      key={`small-add-${pageParam}-${adNum}`}
      style={{
        display: "block",
      }}
    />
  );
};
export default React.memo(GoogleAdMobile);

import React, { useEffect } from "react";

const GoogleAdText = ({ pageParam, adNum, addedStyles }) => {
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
      style={{
        display: "block",
        textAlign: "center",
        ...addedStyles,
      }}
      data-ad-client="ca-pub-5752282235723884"
      data-ad-slot="2802361965"
      key={`text-add-${pageParam}-${adNum}`}
    />
  );
};
export default React.memo(GoogleAdText);

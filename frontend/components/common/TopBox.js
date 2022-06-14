import { Image, Text, Card, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";

const TopBox = () => {
  const desktop = useMediaQuery("(min-width: 768px)");
  return (
    <Card shadow="xl" sx={{ marginBottom: 30 }}>
      <Title order={1} align="center" sx={{ marginBottom: 10 }}>
        What is this site for?{"\n"}
      </Title>
      <div style={{ position: "relative", padding: desktop && "20px" }}>
        <Image
          height="100%"
          radius="md"
          src={!desktop ? "/webp.webp" : "/TopImage.webp"}
          width="100%"
          sx={{
            filter: "brightness(50%)",
          }}
          alt="Wuxiaworld Background Image"
          withPlaceholder
        />

        <div
          style={{
            position: "absolute",
            bottom: 15,
            left: 20,
            paddingRight: desktop && 30,
            paddingLeft: desktop && 30,
            paddingBottom: desktop && 30,
          }}
        >
          <Text sx={{ color: "white", fontSize: !desktop ? "20px" : "30px" }}>
            {process.env.NEXT_PUBLIC_SITE_NAME} is the best place to read Light
            Novels, Chinese Novels , Korean and of course Wuxia Novels
            translated in English.
          </Text>
          {desktop && (
            <>
              <Text
                sx={{
                  color: "white",
                  fontSize: !desktop ? "16px" : "30px",
                  marginTop: 20,
                }}
              >
                If you're tired of switching sites to read novels, or just sick
                of Webnovel ruining your reading experience, then this site is
                for you. Find all the new chapters updated instantly on
                {process.env.REACT_APP_SITE_NAME} and more than 5000 novels to
                read.
              </Text>
            </>
          )}
        </div>
      </div>
      <Title order={2} align="center" sx={{ marginTop: 20 }}>
        Start reading now, its free
      </Title>
    </Card>
  );
};
export default TopBox;

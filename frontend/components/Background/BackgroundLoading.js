import { LoadingOverlay } from "@mantine/core";

const BackgroundLoading = () => {
  return (
    <div style={{ height: "100vh", position: "relative" }}>
      <LoadingOverlay visible={true} />
    </div>
  );
};

export default BackgroundLoading;

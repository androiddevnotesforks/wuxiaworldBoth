import { Button } from "@mantine/core";
import { useEffect, useState } from "react";

const ToggleButton = ({ text, setOrder, orderText, currentOrder }) => {
  const [ascending, setAscending] = useState(0);

  useEffect(() => {
    if (!currentOrder.includes(orderText)) {
      setAscending(0);
    }
  }, [currentOrder]);
  const toggleAscending = () => {
    switch (ascending) {
      case 0:
        setAscending(1);
        setOrder(`-${orderText}`);
        break;
      case 1:
        setAscending(2);
        setOrder(`${orderText}`);
        break;

      case 2:
        setAscending(0);
        setOrder("");
        break;
      default:
        setAscending(0);
        setOrder("");
    }
  };
  return (
    <Button onClick={toggleAscending} size="xs" style={{ margin: "2px" }}>
      {text} {(ascending == 1 && "↓") || (ascending == 2 && "↑")}
    </Button>
  );
};
export default ToggleButton;

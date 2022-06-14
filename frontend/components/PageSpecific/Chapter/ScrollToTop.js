import { Affix, Button, Transition } from "@mantine/core";
import { useWindowScroll } from "@mantine/hooks";

const ScrollUpButton = () => {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <Affix position={{ bottom: 20, right: 20 }}>
      <Transition transition="slide-up" mounted={scroll.y > 500}>
        {(transitionStyles) => (
          <Button style={transitionStyles} onClick={() => scrollTo({ y: 0 })}>
            ↑
          </Button>
        )}
      </Transition>
    </Affix>
  );
};
export default ScrollUpButton;

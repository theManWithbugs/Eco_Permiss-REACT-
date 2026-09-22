import {
  CapybaraLoader,
  Capy,
  Capybara,
  CapyHead,
  CapyEar,
  CapyEarInner,
  CapyMouth,
  CapyLips,
  CapyEye,
  CapyLeg,
  CapyLeg2,
  LoaderBar,
  LoaderLine,
} from "../styles/Loader";

function Loader() {
  return (
    <CapybaraLoader>
      <Capybara>
        <CapyHead>
          <CapyEar>
            <CapyEarInner />
          </CapyEar>

          <CapyEar />

          <CapyMouth>
            <CapyLips />
            <CapyLips />
          </CapyMouth>

          <CapyEye />
          <CapyEye />
        </CapyHead>

        <CapyLeg />

        <CapyLeg2 />
        <CapyLeg2 />

        <Capy />
      </Capybara>

      <LoaderBar>
        <LoaderLine />
      </LoaderBar>
    </CapybaraLoader>
  );
}

export default Loader;
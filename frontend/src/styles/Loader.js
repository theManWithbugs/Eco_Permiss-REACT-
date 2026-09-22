import styled, { keyframes } from "styled-components";

const moveBody = keyframes`
  0% {
    transform: translateX(0%);
  }

  50% {
    transform: translateX(2%);
  }

  100% {
    transform: translateX(0%);
  }
`;

const moveLeg = keyframes`
  0% {
    transform: rotate(-45deg) translateX(-5%);
  }

  50% {
    transform: rotate(45deg) translateX(5%);
  }

  100% {
    transform: rotate(-45deg) translateX(-5%);
  }
`;

const moveLeg2 = keyframes`
  0% {
    transform: rotate(45deg);
  }

  50% {
    transform: rotate(-45deg);
  }

  100% {
    transform: rotate(45deg);
  }
`;

const moveLine = keyframes`
  0% {
    transform: translateX(0%);
    opacity: 0%;
  }

  5% {
    opacity: 100%;
  }

  95% {
    opacity: 100%;
  }

  100% {
    opacity: 0%;
    transform: translateX(-70%);
  }
`;

export const CapybaraLoader = styled.div`
  width: 14em;
  height: 10em;

  --color: rgb(204, 125, 45);
  --color2: rgb(83, 56, 28);

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.75);

  z-index: 9999;
`;

export const Capybara = styled.div`
  width: 100%;
  height: 7.5em;
  position: relative;
  z-index: 1;
`;

export const LoaderBar = styled.div`
  width: 100%;
  height: 2.5em;
  position: relative;
  z-index: 1;
  overflow: hidden;
`;

export const Capy = styled.div`
  width: 85%;
  height: 100%;
  background: linear-gradient(
    var(--color),
    90%,
    var(--color2)
  );

  border-radius: 45%;
  position: relative;
  z-index: 1;

  animation: ${moveBody} 1s linear infinite;
`;

export const CapyHead = styled.div`
  width: 7.5em;
  height: 7em;
  bottom: 0em;
  right: 0em;

  position: absolute;

  background-color: var(--color);

  z-index: 3;

  border-radius: 3.5em;

  box-shadow: -1em 0em var(--color2);

  animation: ${moveBody} 1s linear infinite;
`;

export const CapyEar = styled.div`
  width: 2em;
  height: 2em;

  background: linear-gradient(
    -45deg,
    var(--color),
    90%,
    var(--color2)
  );

  top: 0em;
  left: 0em;

  border-radius: 100%;

  position: absolute;
  overflow: hidden;

  z-index: 3;

  &:nth-child(2) {
    left: 5em;

    background: linear-gradient(
      25deg,
      var(--color),
      90%,
      var(--color2)
    );
  }
`;

export const CapyEarInner = styled.div`
  width: 100%;
  height: 1em;

  background-color: var(--color2);

  bottom: 0em;
  left: 0.5em;

  border-radius: 100%;

  position: absolute;

  transform: rotate(-45deg);
`;

export const CapyMouth = styled.div`
  width: 3.5em;
  height: 2em;

  background-color: var(--color2);

  position: absolute;

  bottom: 0em;
  left: 2.5em;

  border-radius: 50%;

  display: flex;
  justify-content: space-around;
  align-items: center;

  padding: 0.5em;
`;

export const CapyLips = styled.div`
  width: 0.25em;
  height: 0.75em;

  border-radius: 100%;

  transform: rotate(-45deg);

  background-color: var(--color);

  &:nth-child(2) {
    transform: rotate(45deg);
  }
`;

export const CapyEye = styled.div`
  width: 2em;
  height: 0.5em;

  background-color: var(--color2);

  position: absolute;

  bottom: 3.5em;
  left: 1.5em;

  border-radius: 5em;

  transform: rotate(45deg);

  &:nth-child(4) {
    transform: rotate(-45deg);
    left: 5.5em;
    width: 1.75em;
  }
`;

export const CapyLeg = styled.div`
  width: 6em;
  height: 5em;

  bottom: 0em;
  left: 0em;

  position: absolute;

  background: linear-gradient(
    var(--color),
    95%,
    var(--color2)
  );

  z-index: 2;

  border-radius: 2em;

  animation: ${moveBody} 1s linear infinite;
`;

export const CapyLeg2 = styled.div`
  width: 1.75em;
  height: 3em;

  bottom: 0em;
  left: 3.25em;

  position: absolute;

  background: linear-gradient(
    var(--color),
    80%,
    var(--color2)
  );

  z-index: 2;

  border-radius: 0.75em;

  box-shadow: inset 0em -0.5em var(--color2);

  animation: ${moveLeg} 1s linear infinite;

  &:nth-child(3) {
    width: 1.25em;
    left: 0.5em;
    height: 2em;

    animation: ${moveLeg2} 1s linear infinite 0.075s;
  }
`;

export const LoaderLine = styled.div`
  width: 50em;
  height: 0.5em;

  border-top: 0.5em dashed var(--color2);

  animation: ${moveLine} 10s linear infinite;
`;
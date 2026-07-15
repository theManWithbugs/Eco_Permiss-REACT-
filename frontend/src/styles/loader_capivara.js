import styled, { keyframes } from "styled-components";

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

const moveLine = keyframes`
  0% {
    transform: translateX(0%);
    opacity: 0;
  }

  5% {
    opacity: 1;
  }

  95% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(-70%);
  }
`;

export const LoaderWrapper = styled.div`
  position: fixed;
  inset: 0;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

export const CapybaraLoader = styled.div`
  width: 14em;
  height: 10em;
  position: relative;
  z-index: 1;

  --color: rgb(204, 125, 45);
  --color2: rgb(83, 56, 28);

  transform: scale(0.75);
`;

export const Capybara = styled.div`
  width: 100%;
  height: 7.5em;
  position: relative;
`;

export const LoaderRoad = styled.div`
  width: 100%;
  height: 2.5em;
  overflow: hidden;
  position: relative;
`;

export const Capy = styled.div`
  width: 85%;
  height: 100%;
  background: linear-gradient(var(--color), 90%, var(--color2));
  border-radius: 45%;
  position: relative;
  animation: ${moveBody} 1s linear infinite;
`;

export const CapyHead = styled.div`
  width: 7.5em;
  height: 7em;
  position: absolute;
  right: 0;
  bottom: 0;
  background: var(--color);
  border-radius: 3.5em;
  box-shadow: -1em 0 var(--color2);
  animation: ${moveBody} 1s linear infinite;
`;

export const CapyEar = styled.div`
  width: 2em;
  height: 2em;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  border-radius: 50%;
  background: linear-gradient(-45deg, var(--color), 90%, var(--color2));

  &:nth-child(2) {
    left: 5em;
    background: linear-gradient(25deg, var(--color), 90%, var(--color2));
  }
`;

export const CapyEarInner = styled.div`
  width: 100%;
  height: 1em;
  position: absolute;
  bottom: 0;
  left: .5em;
  border-radius: 50%;
  background: var(--color2);
  transform: rotate(-45deg);
`;

export const CapyMouth = styled.div`
  width: 3.5em;
  height: 2em;
  position: absolute;
  bottom: 0;
  left: 2.5em;

  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: .5em;

  border-radius: 50%;
  background: var(--color2);
`;

export const CapyLip = styled.div`
  width: .25em;
  height: .75em;
  background: var(--color);
  border-radius: 50%;
  transform: rotate(-45deg);

  &:nth-child(2) {
    transform: rotate(45deg);
  }
`;

export const CapyEye = styled.div`
  width: 2em;
  height: .5em;
  position: absolute;
  bottom: 3.5em;
  left: 1.5em;
  border-radius: 5em;
  background: var(--color2);
  transform: rotate(45deg);

  &:nth-of-type(2) {
    left: 5.5em;
    width: 1.75em;
    transform: rotate(-45deg);
  }
`;

export const CapyLeg = styled.div`
  width: 6em;
  height: 5em;
  position: absolute;
  left: 0;
  bottom: 0;
  border-radius: 2em;
  background: linear-gradient(var(--color),95%,var(--color2));
  animation: ${moveBody} 1s linear infinite;
`;

export const CapyLegFront = styled.div`
  width: 1.75em;
  height: 3em;
  position: absolute;
  left: 3.25em;
  bottom: 0;
  border-radius: .75em;
  background: linear-gradient(var(--color),80%,var(--color2));
  box-shadow: inset 0 -.5em var(--color2);
  animation: ${moveLeg} 1s linear infinite;

  &:nth-child(2) {
    width: 1.25em;
    height: 2em;
    left: .5em;
    animation: ${moveLeg2} 1s linear infinite .075s;
  }
`;

export const LoaderLine = styled.div`
  width: 50em;
  height: .5em;
  border-top: .5em dashed var(--color2);
  animation: ${moveLine} 10s linear infinite;
`;
import styled from "styled-components";

export const Root = styled.div`
  --ip-forest: #1a472a;
  --ip-canopy: #2e7d32;
  --ip-leaf: #4caf50;
  --ip-mist: #f0f7f1;
  --ip-fog: #e8f5e9;
  --ip-ink: #1a2e1e;
  --ip-muted: #5c7a61;
  --ip-line: #d4e8d6;
  --ip-radius: 16px;
  --ip-shadow: 0 8px 32px rgba(26, 71, 42, 0.1);
`;

export const Page = styled.div`
  padding: 32px 20px 80px;
  min-height: 100vh;
`;

export const Sheet = styled.div`
  background: #fff;
  border-radius: 24px;
  box-shadow: var(--ip-shadow);
  overflow: hidden;
  max-width: 1080px;
  margin: 0 auto;
`;

export const Header = styled.header`
  background: linear-gradient(
    135deg,
    var(--ip-forest) 0%,
    var(--ip-canopy) 60%,
    #388e3c 100%
  );
  padding: 44px 36px 40px;
  position: relative;
  overflow: hidden;

  &::before,
  &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    pointer-events: none;
  }

  &::before {
    width: 320px;
    height: 320px;
    top: -80px;
    right: -60px;
  }

  &::after {
    width: 180px;
    height: 180px;
    bottom: -60px;
    left: 15%;
  }
`;

export const HeaderInner = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }
`;

export const HeaderIcon = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  flex-shrink: 0;
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const HeaderTitle = styled.h2`
  margin: 0;
  color: #fff;
  font-size: 28px;
  font-weight: 700;
`;

export const HeaderSub = styled.p`
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 15px;
`;

export const LinkMenuContainer = styled.div`
  margin-top: 24px;
`;

export const LinkMenu = styled.nav`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

export const MenuButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  padding: 12px 20px;

  border: none;
  border-radius: 10px;

  cursor: pointer;

  background: ${({ $active }) =>
    $active ? "var(--ip-canopy)" : "#fff"};

  color: ${({ $active }) =>
    $active ? "#fff" : "var(--ip-forest)"};

  transition: all .25s ease;

  &:hover {
    background: ${({ $active }) =>
      $active ? "var(--ip-forest)" : "var(--ip-mist)"};
  }
`;

export const MenuButtonText = styled.span`
  font-size: .9rem;
  font-weight: 600;
`;

export const MenuButtonIndicator = styled.span`
  margin-top: 6px;
  width: 28px;
  height: 3px;
  border-radius: 2px;
  background: currentColor;
`;

export const Body = styled.div`
  padding: 24px 24px 48px;
  background: #f7fbf8;
`;

export const Section = styled.section`
  background: #fff;
  border: 1px solid #e3efe3;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
`;

export const SectionLabel = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 700;
  color: #1a472a;
  margin: 0 0 16px;
`;

export const Cards = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
`;

export const Card = styled.div`
  border: 1px solid ${({ borderColor }) => borderColor || '#dcebdc'};
  background: ${({ background }) => background || '#fff'};
  border-radius: 14px;
  padding: 16px;
  min-height: 110px;
`;

export const CardLabel = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #4f6e58;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const CardValue = styled.div`
  color: #1f2e23;
  font-size: 15px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

export const DocsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
`;

export const StatusBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #f5faf6;
  border: 1px solid #dfeee0;
  border-radius: 14px;
`;

export const StatusMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #39573f;
`;

export const FooterNote = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  color: #5f7666;
  font-size: 14px;
`;

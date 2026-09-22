import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% {
    background-position: -720px 0;
  }

  100% {
    background-position: 720px 0;
  }
`;

const Skeleton = styled.div`
  background: linear-gradient(90deg, #e5e7eb 25%, #f8fafc 50%, #e5e7eb 75%);
  background-size: 720px 100%;
  animation: ${shimmer} 1.5s infinite linear;
`;

const SkeletonCard = styled.div`
  width: 100%;
  max-width: 1080px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, .07);
`;

const SkeletonHeader = styled.div`
  padding: 32px 36px;
  display: flex;
  align-items: center;
  gap: 20px;
  background: #e5e7eb;

  @media (max-width: 640px) {
    padding: 24px 20px;
    gap: 14px;
  }
`;

const SkeletonBody = styled.div`
  padding: 36px;
  display: flex;
  flex-direction: column;
  gap: 30px;

  @media (max-width: 640px) {
    padding: 24px 20px;
    gap: 22px;
  }
`;

const SkeletonSection = styled.div``;

const SkeletonTitle = styled(Skeleton)`
  width: 150px;
  height: 12px;
  margin-bottom: 14px;
  border-radius: 4px;
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SkeletonField = styled.div`
  min-height: 76px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 3px solid #d1d5db;
  border-radius: 8px;
`;

const SkeletonLabel = styled(Skeleton)`
  width: 38%;
  height: 9px;
  border-radius: 3px;
`;

const SkeletonValue = styled(Skeleton)`
  width: 72%;
  height: 15px;
  border-radius: 4px;
`;

const SkeletonMembers = styled.div`
  padding: 0 36px 36px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 640px) {
    padding: 0 20px 24px;
    grid-template-columns: 1fr;
  }
`;

const SkeletonMember = styled(SkeletonField)`
  min-height: 120px;
`;

function VideoSkeleton() {
  return (
    <SkeletonCard>
      <SkeletonHeader>
        <Skeleton width="52px" height="52px" borderRadius="8px" />
        <div>
          <Skeleton width="220px" height="24px" borderRadius="5px" />
          <Skeleton width="145px" height="12px" borderRadius="4px" style={{ marginTop: "10px" }} />
        </div>
      </SkeletonHeader>

      <SkeletonBody>
        <SkeletonSection>
          <SkeletonTitle />
          <SkeletonGrid>
            <SkeletonField><SkeletonLabel /><SkeletonValue /></SkeletonField>
            <SkeletonField><SkeletonLabel /><SkeletonValue /></SkeletonField>
          </SkeletonGrid>
        </SkeletonSection>

        <SkeletonSection>
          <SkeletonTitle width="95px" />
          <SkeletonGrid>
            <SkeletonField><SkeletonLabel /><SkeletonValue /></SkeletonField>
            <SkeletonField><SkeletonLabel /><SkeletonValue /></SkeletonField>
          </SkeletonGrid>
        </SkeletonSection>

        <SkeletonSection>
          <SkeletonTitle width="190px" />
          <SkeletonGrid>
            <SkeletonField><SkeletonLabel /><SkeletonValue /></SkeletonField>
            <SkeletonField><SkeletonLabel /><SkeletonValue /></SkeletonField>
          </SkeletonGrid>
        </SkeletonSection>

        <SkeletonSection>
          <SkeletonTitle width="55px" />
          <SkeletonGrid>
            <SkeletonField><SkeletonLabel /><SkeletonValue width="90px" /></SkeletonField>
            <SkeletonField><SkeletonLabel /><SkeletonValue /></SkeletonField>
          </SkeletonGrid>
        </SkeletonSection>
      </SkeletonBody>

      <SkeletonMembers>
        <SkeletonMember><SkeletonLabel /><SkeletonValue /><SkeletonValue width="55%" /></SkeletonMember>
        <SkeletonMember><SkeletonLabel /><SkeletonValue /><SkeletonValue width="55%" /></SkeletonMember>
        <SkeletonMember><SkeletonLabel /><SkeletonValue /><SkeletonValue width="55%" /></SkeletonMember>
      </SkeletonMembers>
    </SkeletonCard>
  )
}

export default VideoSkeleton;
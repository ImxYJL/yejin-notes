'use client';

import ErrorSection from '@/components/common/ErrorSection';
import { useRouter } from 'next/navigation';

// Next가 error.tsx에 전달하는 props 타입
type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  const router = useRouter();

  const goLandingPage = () => router.push('/');

  return (
    <ErrorSection
      title="서버 오류가 발생했습니다"
      errorMessage={`잠시 후 다시 시도해주세요.${error.digest ? ` (코드: ${error.digest})` : ''}`}
      handleReload={reset}
      handleGoOtherPage={goLandingPage}
    />
  );
}

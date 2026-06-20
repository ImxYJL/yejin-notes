'use client';

import ErrorSection from '@/components/common/ErrorSection';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  return (
    <ErrorSection
      title="페이지를 찾을 수 없습니다"
      errorMessage="존재하지 않거나 삭제된 페이지입니다."
      handleReload={() => router.back()}
      handleGoOtherPage={() => router.push('/')}
    />
  );
}

"use client";

import { useRouter } from "next/navigation";
import type { FallbackProps } from "react-error-boundary";
import ErrorSection from "./ErrorSection";

const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const router = useRouter();

  const goChatPage = () => router.push("/chat");

  return (
    <ErrorSection
      errorMessage={error.message ?? "알 수 없는 에러가 발생했습니다"}
      handleReload={resetErrorBoundary}
      handleGoOtherPage={goChatPage}
    />
  );
};

export default ErrorFallback;

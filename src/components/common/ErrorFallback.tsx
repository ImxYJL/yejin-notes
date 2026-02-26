"use client";

import { useRouter } from "next/navigation";
import type { FallbackProps } from "react-error-boundary";
import ErrorSection from "./ErrorSection";

interface CustomFallbackProps extends FallbackProps {
  customReset?: () => void;
}

const ErrorFallback = ({
  customReset,
  error,
  resetErrorBoundary,
}: CustomFallbackProps) => {
  const router = useRouter();
  const handleReload = customReset ?? resetErrorBoundary;

  const goHome = () => router.push("/");

  return (
    <ErrorSection
      errorMessage={error.message ?? "알 수 없는 에러가 발생했습니다"}
      handleReload={handleReload}
      handleGoOtherPage={goHome}
    />
  );
};

export default ErrorFallback;

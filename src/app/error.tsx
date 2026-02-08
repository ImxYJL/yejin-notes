"use client";

import ErrorSection from "@/components/common/ErrorSection";
import { useRouter } from "next/navigation";

// Next가 error.tsx에 전달하는 props 타입
type Props = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: Props) {
  const router = useRouter();

  const goChatPage = () => router.push("/chat");

  return (
    <ErrorSection
      errorMessage={error?.message || "알 수 없는 에러가 발생했습니다"}
      handleReload={reset}
      handleGoOtherPage={goChatPage}
    />
  );
}

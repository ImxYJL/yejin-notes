"use client";

import clsx from "clsx";
import Button from "./Button";

export type ErrorSectionProps = {
  title?: string;
  errorMessage: string;
  handleReload: () => void;
  handleGoOtherPage: () => void;
};

const ErrorSection = ({
  title = "문제가 발생했습니다",
  errorMessage,
  handleReload,
  handleGoOtherPage,
}: ErrorSectionProps) => {
  return (
    <section
      className={clsx(
        "flex min-h-screen items-center justify-center bg-gray-50 p-4",
      )}
    >
      <div
        className={clsx(
          "w-full max-w-md rounded-xl bg-white p-8 text-center shadow-md",
        )}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="text-accent-primary mx-auto mb-4 h-20 w-20"
        >
          <path
            fillRule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
            clipRule="evenodd"
          ></path>
        </svg>

        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>

        <p className="mt-2 text-base text-gray-500">{errorMessage}</p>

        <div className="mt-8 flex w-full flex-col justify-center gap-3">
          <Button variant="primary" onClick={handleReload} className="p-2.5">
            다시 시도
          </Button>
          <Button variant="ghost" onClick={handleGoOtherPage} className="p-2.5">
            시작 화면으로 돌아가기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ErrorSection;

"use client";

import { ErrorBoundary } from "react-error-boundary";
import { QueryErrorResetBoundary } from "@tanstack/react-query";
import { type ReactNode } from "react";
import ErrorFallback from "@/components/common/ErrorFallback";

type QueryErrorProviderProps = {
  children: ReactNode;
};

const QueryErrorProvider = ({ children }: QueryErrorProviderProps) => {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <ErrorFallback
              error={error}
              reset={() => {
                reset(); // TanStack Query 캐시 리셋
                resetErrorBoundary(); // ErrorBoundary UI 리셋
              }}
            />
          )}
        >
          {children}
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
};

export default QueryErrorProvider;

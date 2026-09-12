'use client';

import { AlertTriangle } from 'lucide-react';
import Button from './Button';

export type ErrorSectionProps = {
  title?: string;
  errorMessage: string;
  handleReload: () => void;
  handleGoOtherPage: () => void;
};

const ErrorSection = ({
  title = '문제가 발생했습니다',
  errorMessage,
  handleReload,
  handleGoOtherPage,
}: ErrorSectionProps) => {
  return (
    <section className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm text-center space-y-4">
        <AlertTriangle size={40} className="mx-auto text-accent-primary opacity-70" />
        <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
        <div className="flex flex-col gap-2 pt-4">
          <Button variant="primary" onClick={handleReload} className="p-2.5">
            다시 시도
          </Button>
          <Button
            variant="outline"
            onClick={handleGoOtherPage}
            className="p-2.5 border-muted-foreground/40"
          >
            시작 화면으로 돌아가기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ErrorSection;

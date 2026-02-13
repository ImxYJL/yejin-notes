"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { LogIn } from "lucide-react";
import { Button, Divider } from "@/components/common";
import useLogin from "@/queries/auth/useLogin";
import { OAUTH_PARAMS } from "@/constants/system";
import { useToastStore } from "@/store/useToastStore";

const LoginPage = () => {
  const { showToast } = useToastStore();
  const { mutate: handleGoogleLogin, isPending } = useLogin();

  const searchParams = useSearchParams();
  const message = searchParams.get(OAUTH_PARAMS.message);

  useEffect(() => {
    if (message) showToast(message);
  }, [message]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm bg-background border border-muted-foreground/30 rounded-main p-8 shadow-sm">
        <header className="text-center space-y-4 mb-4">
          <h1 className="text-2xl font-black tracking-tighter text-muted-foreground">
            MY PERSONAL BLOG
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Admin Authentication
          </p>
        </header>

        <Divider direction="horizontal" className="mb-8 opacity-50" />

        <div className="space-y-4">
          <Button
            variant="primary"
            onClick={() => handleGoogleLogin()}
            disabled={isPending}
            className="w-full flex items-center justify-center gap-3 text-background py-3 px-4 rounded-main font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <span className="animate-pulse">Connecting...</span>
            ) : (
              <>
                <LogIn size={18} />
                <span>Login with Google</span>
              </>
            )}
          </Button>

          <p className="text-[11px] text-center text-muted-foreground/60 font-mono tracking-widest uppercase">
            Restricted Access
          </p>
        </div>
      </div>

      <footer className="mt-8">
        <p className="text-xs text-muted-foreground/40 font-mono">
          © 2026 Admin Portal
        </p>
      </footer>
    </main>
  );
};

export default LoginPage;

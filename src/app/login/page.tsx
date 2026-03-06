import { Suspense } from "react";
import LoginForm from "./LoginForm";

const LoginPage = () => {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        }
      >
        <LoginForm />
      </Suspense>

      <footer className="mt-8">
        <p className="text-xs text-muted-foreground/40 font-mono">
          © 2026 Admin Portal
        </p>
      </footer>
    </main>
  );
};

export default LoginPage;

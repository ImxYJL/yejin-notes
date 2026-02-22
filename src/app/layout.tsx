import "@/app/globals.css";
import { Toast } from "@/components/common";

import { pretendard } from "@/libs/fonts";
import ClientProviders from "@/utils/providers/ClientProviders";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <Toast />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

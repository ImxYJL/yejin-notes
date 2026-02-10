import "@/app/globals.css";

import { pretendard } from "@/libs/fonts";
import ClientProviders from "@/utils/providers/ClientProviders";
// import { ToastContainer } from 'react-toastify/unstyled';
// import 'react-toastify/ReactToastify.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={pretendard.variable}>
      <body>
        <ClientProviders>
          {/* <ToastContainer autoClose={2500} /> */}
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}

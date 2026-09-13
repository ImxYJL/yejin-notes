import '@/app/globals.css';
import { Toast } from '@/components/common';
import { pretendard } from '@/libs/fonts';
import ClientProviders from '@/utils/providers/ClientProviders';
import { THEME_STORAGE_KEY } from '@/constants/theme';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ko"
      className={pretendard.variable}
      data-theme="forest"
      suppressHydrationWarning
    >
      <head>
        <script
          // NOTE: 하이드레이션 전에 localStorage의 저장된 테마를 먼저 적용해
          // 새로고침 시 기본 테마가 잠깐 칠해지는 깜빡임(FOUC)을 막음
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(s){var t=JSON.parse(s).state.theme;if(t)document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <Toast />
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}

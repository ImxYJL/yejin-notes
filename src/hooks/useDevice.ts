import { useState, useEffect } from 'react';

export const BREAKPOINT = {
  lg: 1024,
} as const;

type DeviceType = {
  isMobile: boolean; // lg 미만 (모바일 & 태블릿)
  isDesktop: boolean; // lg 이상
};

/**
 * 현재 화면 크기가 테일윈드 lg(1024px) 기준 모바일인지 데스크탑인지 판별하는 훅
 */
const useDevice = () => {
  const [deviceType, setDeviceType] = useState<DeviceType>({
    isMobile: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setDeviceType({
        isMobile: width < BREAKPOINT.lg,
        isDesktop: width >= BREAKPOINT.lg,
      });
    };

    // 마운트 시점에 한 번 실행
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
};

export default useDevice;

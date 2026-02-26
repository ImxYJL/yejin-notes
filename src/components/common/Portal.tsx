"use client";

import { ReactNode, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  children: ReactNode;
};

// 클라이언트 마운트 상태를 체크하기 위한 구독
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

const Portal = ({ children }: PortalProps) => {
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  if (!isClient) return null;

  return createPortal(children, document.body);
};

export default Portal;

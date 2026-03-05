import { getFirstText } from "@/utils/node";
import { cn } from "@/utils/styles";
import { hasChildren } from "@/utils/type";
import React, { ReactNode, ComponentPropsWithoutRef } from "react";

type CalloutType = "blue" | "yellow" | "red" | "green";

type CalloutStyle = {
  container: string;
  icon: string;
};

const CALLOUT_CONFIG: Record<CalloutType, CalloutStyle> = {
  blue: { container: "bg-blue-50 border-blue-400", icon: "👻" },
  yellow: { container: "bg-yellow-50 border-yellow-400", icon: "✨" },
  red: { container: "bg-red-50 border-red-400", icon: "🚫" },
  green: { container: "bg-green-50 border-green-400", icon: "🦖" },
};

const isCalloutType = (type: string): type is CalloutType => {
  return Object.keys(CALLOUT_CONFIG).includes(type);
};

/**
 * children 노드를 재귀적으로 탐색하여 [!TYPE] 태그를 제거
 */
const stripCalloutSyntax = (nodes: ReactNode, fullTag: string): ReactNode => {
  if (!fullTag) return nodes;

  return React.Children.map(nodes, (child) => {
    if (typeof child === "string") {
      return child.replace(fullTag, "").trimStart();
    }

    if (hasChildren(child)) {
      return React.cloneElement(child, {
        children: stripCalloutSyntax(child.props.children, fullTag),
      });
    }

    return child;
  });
};

type CalloutProps = ComponentPropsWithoutRef<"blockquote"> & {
  children?: ReactNode;
};

const Callout = ({ children, ...props }: CalloutProps) => {
  const firstText = getFirstText(children).trim();
  const calloutMatch = firstText.match(/^\[!(\w+)\]/);

  // 일반 인용문인 경우 스타일만 입혀서 리턴
  if (!calloutMatch) {
    return (
      <blockquote
        {...props}
        className="pl-4 my-4 italic border-l-4 border-gray-300 text-gray-600"
      >
        {children}
      </blockquote>
    );
  }

  // 콜아웃 처리 - 타입 추출 및 불필요한 문구 제거
  const rawType = calloutMatch[1].toLowerCase();
  const type = isCalloutType(rawType) ? rawType : "blue";
  const config = CALLOUT_CONFIG[type];

  const fullTag = calloutMatch[0];
  const contentWithoutTag = stripCalloutSyntax(children, fullTag);

  return (
    <aside
      className={cn(
        "flex p-4 my-4 border-l-4 rounded-r-md shadow-sm transition-colors",
        config.container,
      )}
    >
      <span
        className="mr-3 text-xl leading-none select-none shrink-0"
        aria-hidden="true"
      >
        {config.icon}
      </span>
      <div className="flex-1 leading-relaxed callout-content">
        {contentWithoutTag}
      </div>
    </aside>
  );
};

export default Callout;

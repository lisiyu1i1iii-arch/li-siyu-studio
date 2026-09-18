"use client";

import { Component, type ReactNode } from "react";
import { Compass } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  failed: boolean;
}

/**
 * 3D Canvas 的运行时错误兜底。
 * 只包裹 StudioScene：即使 3D 初始化/渲染抛错，DOM UI（菜单 / Quick View / Overlay）仍可用，
 * 不会白屏，也不会让整个 React 应用崩溃。
 */
export default class StudioErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[studio] 3D scene error:", error);
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-studio-paper via-studio-sand to-studio-sun/40 px-8 text-center">
          <div className="max-w-sm space-y-3">
            <Compass className="mx-auto h-8 w-8 text-studio-ember" />
            <h1 className="font-serif text-2xl text-studio-ink">
              3D 工作室暂时不可用
            </h1>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

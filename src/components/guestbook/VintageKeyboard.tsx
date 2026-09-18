"use client";

/**
 * 复古机械键盘（奶油/米白键帽 + 棕色底座，圆润厚实键帽）。
 * 只负责视觉与按下动画；实际输入/提交由父组件处理。
 */

interface KeyDef {
  id: string;
  label: string;
  /** 相对宽度 */
  grow?: number;
}

const ROWS: KeyDef[][] = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"].map((id) => ({
    id,
    label: id,
  })),
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"].map((id) => ({
    id,
    label: id.toUpperCase(),
  })),
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"].map((id) => ({
    id,
    label: id.toUpperCase(),
  })),
  [
    { id: "shift", label: "Shift", grow: 1.7 },
    ...["z", "x", "c", "v", "b", "n", "m"].map((id) => ({
      id,
      label: id.toUpperCase(),
    })),
    { id: "backspace", label: "⌫", grow: 1.9 },
  ],
  [
    { id: "space", label: "Space", grow: 6 },
    { id: "enter", label: "Enter ⏎", grow: 2.4 },
  ],
];

export default function VintageKeyboard({
  shiftOn,
  pressed,
  onPress,
}: {
  shiftOn: boolean;
  pressed: Record<string, number>;
  onPress: (key: string) => void;
}) {
  return (
    <div className="mx-auto w-full max-w-[900px] rounded-2xl border border-[#4a3121]/50 bg-gradient-to-b from-[#6B4A33] to-[#553a27] p-2.5 shadow-2xl sm:rounded-3xl sm:p-3.5">
      <div className="space-y-1.5 sm:space-y-2">
        {ROWS.map((row, ri) => (
          <div key={ri} className="flex gap-1.5 sm:gap-2">
            {row.map((key) => {
              const isDown = Boolean(pressed[key.id]);
              const isShiftOn = key.id === "shift" && shiftOn;
              return (
                <button
                  key={key.id}
                  type="button"
                  aria-label={key.label}
                  onPointerDown={(e) => {
                    // 保持输入框焦点；按键音在用户手势中触发
                    e.preventDefault();
                    onPress(key.id);
                  }}
                  style={{ flexGrow: key.grow ?? 1, flexBasis: 0 }}
                  className={`select-none rounded-lg border-b-[4px] px-1 py-2 text-[10px] font-medium uppercase tracking-wide transition-all duration-75 sm:rounded-xl sm:py-2.5 sm:text-xs ${
                    isDown
                      ? "translate-y-[3px] border-b-[1px] bg-[#e6d8c0] text-[#5a3d29] shadow-inner"
                      : "border-[#b79b73] bg-[#f3ead9] text-[#5a3d29] shadow-[0_2px_0_rgba(0,0,0,0.18)] hover:bg-[#f8f1e3]"
                  } ${isShiftOn ? "ring-2 ring-studio-ember/70" : ""}`}
                >
                  {key.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

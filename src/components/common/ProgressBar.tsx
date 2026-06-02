interface ProgressBarProps {
  /** 0-100 的数值 */
  value: number;
  /** 可选标签 */
  label?: string;
  /** 高度，默认 8px */
  height?: number;
  /** 颜色，默认 primary */
  color?: string;
}

export default function ProgressBar({
  value,
  label,
  height = 8,
  color,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="progress-bar-wrapper">
      {label && <span className="progress-bar-label">{label}</span>}
      <div
        className="progress-bar-track"
        style={{ height: `${height}px` }}
      >
        <div
          className="progress-bar-fill"
          style={{
            width: `${clamped}%`,
            backgroundColor: color || undefined,
          }}
        />
      </div>
    </div>
  );
}

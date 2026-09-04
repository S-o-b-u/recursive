import { EVENT } from "@/data/hackathon";

export interface DevfolioButtonProps {
  slug?: string;
  theme?: "light" | "dark" | "dark-inverted";
  className?: string;
  style?: React.CSSProperties;
}

export default function DevfolioButton({
  slug = EVENT.devfolioSlug || "recursiveacm",
  theme = EVENT.devfolioTheme || "light",
  className = "",
  style,
}: DevfolioButtonProps) {
  return (
    <div
      className={`devfolio-button-wrapper ${className}`.trim()}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "44px",
        width: "312px",
        maxWidth: "100%",
        ...style,
      }}
    >
      <div
        className="apply-button"
        data-hackathon-slug={slug}
        data-button-theme={theme}
        style={{
          height: "44px",
          width: "312px",
        }}
      />
    </div>
  );
}
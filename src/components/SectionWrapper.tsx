interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  alternate?: boolean;
}

export default function SectionWrapper({
  children,
  id,
  className = "",
  alternate = false,
}: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`section ${className}`}
      style={alternate ? { backgroundColor: "var(--color-bg-alt)" } : undefined}
    >
      <div className="section-inner">{children}</div>
    </section>
  );
}

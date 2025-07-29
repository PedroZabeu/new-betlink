export function BetlinkLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="120"
      height="40"
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="BetLink"
      role="img"
    >
      <text
        x="0"
        y="28"
        fontSize="24"
        fontWeight="bold"
        fill="currentColor"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        BetLink
      </text>
    </svg>
  );
}
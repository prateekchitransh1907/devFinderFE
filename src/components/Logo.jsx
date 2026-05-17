function Logo({ size = "md" }) {
    const sizes = {
        sm: { icon: 20, text: "text-lg", gap: "gap-1.5" },
        md: { icon: 28, text: "text-2xl", gap: "gap-2" },
        lg: { icon: 40, text: "text-4xl", gap: "gap-3" },
    };

    const s = sizes[size] ?? sizes.md;

    return (
        <span
            className={`inline-flex items-center ${s.gap} select-none`}
            aria-label="Dev Finder"
        >
            {/* Terminal / code icon */}
            <svg
                width={s.icon}
                height={s.icon}
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                    filter: "drop-shadow(0 2px 6px rgba(255,255,255,0.35))",
                }}
            >
                {/* Outer rounded rect */}
                <rect
                    x="1"
                    y="1"
                    width="26"
                    height="26"
                    rx="6"
                    fill="white"
                    fillOpacity="0.08"
                    stroke="white"
                    strokeOpacity="0.7"
                    strokeWidth="1.5"
                />

                {/* Chevron prompt */}
                <polyline
                    points="7,10 12,14 7,18"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Cursor underline */}
                <rect
                    x="14"
                    y="17"
                    width="7"
                    height="2"
                    rx="1"
                    fill="white"
                    fillOpacity="0.9"
                />
            </svg>

            {/* Wordmark */}
            <span
                className={`font-mono font-bold tracking-tight ${s.text} leading-none`}
                style={{
                    color: "white",
                    textShadow:
                        "0 1px 3px rgba(0,0,0,0.5), 0 4px 14px rgba(255,255,255,0.15)",
                    letterSpacing: "-0.03em",
                }}
            >
                dev
                <span style={{ opacity: 0.55, fontWeight: 400 }}>/</span>
                <span style={{ fontWeight: 800 }}>Finder</span>
            </span>
        </span>
    );
}

export default Logo;
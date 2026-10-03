"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutGroup, MotionConfig } from "motion/react";
import { theme } from "@/config/theme";
import CardDetail from "./CardDetail";
import Catalog from "./Catalog";
import Hero from "./Hero";
import { directLinks, groups, newTabProps, type OpenCard } from "./utils";

export default function Showroom({ initialTab }: { initialTab?: string }) {
  const [open, setOpen] = useState<OpenCard | null>(null);

  const rootStyle = useMemo(
    () =>
      ({
        "--bg": theme.colors.bg,
        "--bg-glow": theme.colors.bgGlow,
        "--card": theme.colors.card,
        "--ink": theme.colors.ink,
        "--title": theme.colors.title,
        "--dim": theme.colors.dim,
        "--line": theme.colors.line,
        "--gold": theme.colors.gold,
        "--lilac": theme.colors.lilac
      }) as React.CSSProperties,
    []
  );

  // Old links such as ?tab=02 jump to the matching group.
  useEffect(() => {
    const tab = (initialTab || "").trim().toLowerCase();
    if (!tab) return;
    const group = groups.find((g) => g.id === tab || g.number === tab.padStart(2, "0"));
    if (group) document.getElementById(`group-${group.id}`)?.scrollIntoView({ block: "start" });
  }, [initialTab]);

  const closeDetail = useCallback(() => {
    open?.trigger?.focus({ preventScroll: true });
    setOpen(null);
  }, [open]);

  return (
    <MotionConfig reducedMotion="user">
      <LayoutGroup>
        <div className="sr-root" style={rootStyle}>
          <div className="sr-sky" aria-hidden="true" />
          <Hero />
          <Catalog onOpen={setOpen} />
          <footer className="sr-foot">
            {directLinks.map((link) => (
              <a key={link.id} className="sr-foot-link" href={link.href} {...newTabProps(link.href)}>
                <b>{link.name}</b>
                <span>{link.description}</span>
              </a>
            ))}
          </footer>
          <CardDetail open={open} onClose={closeDetail} />
        </div>
      </LayoutGroup>
    </MotionConfig>
  );
}

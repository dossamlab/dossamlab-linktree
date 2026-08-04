"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Spiral, type SpiralProps } from "@paper-design/shaders-react";
import { cards, profile, type LinkCard, type LinkItem, type Thumb } from "@/config/linktree";
import { theme } from "@/config/theme";

const DISPLAY = "'DM Sans', 'Pretendard', 'Noto Sans KR', system-ui, sans-serif";
const BODY = "'DM Sans', 'Pretendard', 'Noto Sans KR', system-ui, sans-serif";
const MONO = "'Space Mono', ui-monospace, SFMono-Regular, Menlo, monospace";

const spiralProps = {
  fit: "none",
  scale: 1.3,
  rotation: 0,
  offsetX: 0,
  offsetY: 0,
  originX: 0.5,
  originY: 0.5,
  worldWidth: 0,
  worldHeight: 0,
  density: 0.5,
  colorBack: theme.colors.cream,
  colorFront: theme.colors.spiralFront,
  distortion: 0,
  strokeWidth: 0.5,
  strokeTaper: 0,
  strokeCap: 0,
  noise: 1,
  noiseFrequency: 0.25,
  softness: 0,
  speed: 0.75,
  frame: 0,
  maxPixelCount: 1_500_000
} satisfies Partial<SpiralProps>;

const isExternal = (href: string) => href.startsWith("http") || href.startsWith("mailto:");
const cleanTab = (tab?: string | null) => (tab || "").trim().toLowerCase();
const tabIndexOf = (tab?: string | null) => {
  const t = cleanTab(tab);
  if (!t) return -1;
  return cards.findIndex((card) => card.id === t || card.number === t || card.number === t.padStart(2, "0"));
};
const itemsOf = (card: LinkCard): LinkItem[] => (card.kind === "group" ? card.items : []);
const iconSrc = (icon: string) => `/icons/${icon}.svg`;

function ArrowUpRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

function ArrowRight({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function ChevronDown({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function ThumbView({ thumb, size = 52 }: { thumb: Thumb; size?: number }) {
  if (thumb.kind === "image") {
    return <img className="lt-thumb" src={thumb.src} alt={thumb.alt} loading="lazy" style={{ width: size, height: size }} />;
  }
  return (
    <span className="lt-thumb lt-thumb-icon" style={{ width: size, height: size }} aria-hidden="true">
      <img src={iconSrc(thumb.icon)} alt="" loading="lazy" />
    </span>
  );
}

function IntroOverlay({ onBrowse }: { onBrowse: () => void }) {
  return (
    <div className="lt-intro">
      <Spiral className="lt-intro-spiral" {...spiralProps} />
      <div className="lt-intro-card">
        <span className="lt-intro-title">{profile.introTitle}</span>
        <p className="lt-intro-copy">{profile.introDescription}</p>
        <button type="button" className="lt-intro-cta" onClick={onBrowse}>
          모든 활동 구경하기
          <ChevronDown size={18} />
        </button>
      </div>
    </div>
  );
}

function PillStack({ selected, onSelect }: { selected: number; onSelect: (index: number) => void }) {
  return (
    <div className="lt-pills" role="listbox" aria-label="링크 선택">
      {cards.map((card, index) => {
        const colors = theme.pillColors[index % theme.pillColors.length];
        const count = card.kind === "group" ? itemsOf(card).length : card.href.startsWith("mailto:") ? "MAIL" : isExternal(card.href) ? "EXT" : "LINK";
        const active = index === selected;
        return (
          <div
            key={card.id}
            className={`lt-pill${active ? " lt-pill-active" : ""}`}
            style={{ background: colors.bg, color: colors.fg, ["--rot" as string]: `${[-3, 2, -1.5, 3.5][index % 4]}deg` }}
          >
            <button type="button" role="option" aria-selected={active} className="lt-pill-main" onClick={() => onSelect(index)}>
              <ThumbView thumb={card.thumb} size={44} />
              <span className="lt-pill-text">
                <span className="lt-pill-name">{card.name}</span>
                <span className="lt-pill-desc">{card.description}</span>
              </span>
            </button>
            <span className="lt-pill-meta">{card.number} // {count}</span>
          </div>
        );
      })}
    </div>
  );
}

function ItemRow({ item }: { item: LinkItem }) {
  const inner = (
    <>
      {item.thumb ? <ThumbView thumb={item.thumb} size={40} /> : <span className="lt-row-dot" aria-hidden="true" />}
      <span className="lt-row-text">
        <span className="lt-row-name">{item.name}</span>
        {item.description ? <span className="lt-row-desc">{item.description}</span> : null}
      </span>
      <span className="lt-row-go" aria-hidden="true"><ArrowUpRight size={15} /></span>
    </>
  );
  if (isExternal(item.href)) {
    return <a className="lt-row" href={item.href} {...(item.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{inner}</a>;
  }
  return <Link className="lt-row" href={item.href}>{inner}</Link>;
}

function SelectionPanel({ card, endRef }: { card: LinkCard; endRef: React.RefObject<HTMLSpanElement | null> }) {
  const items = itemsOf(card);
  return (
    <div className="lt-panel-inner">
      <div className="lt-sel-head">
        <ThumbView thumb={card.thumb} size={60} />
        <div className="lt-sel-headtext">
          <span className="lt-sel-name">{card.name}</span>
          <span className="lt-sel-num">{card.number}</span>
        </div>
      </div>
      <p className="lt-sel-desc">{card.description}</p>

      {card.kind === "group" ? (
        <div className="lt-rows">
          {items.map((item) => <ItemRow key={`${item.name}-${item.href}`} item={item} />)}
        </div>
      ) : isExternal(card.href) ? (
        <a className="lt-visit" href={card.href} {...(card.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          바로가기 <ArrowRight size={16} />
        </a>
      ) : (
        <Link className="lt-visit" href={card.href}>
          바로가기 <ArrowRight size={16} />
        </Link>
      )}
      <span ref={endRef} className="lt-panel-end" aria-hidden="true" />
    </div>
  );
}

function MoreHint({ visible, className = "" }: { visible: boolean; className?: string }) {
  return (
    <div className={`lt-more-hint ${className}${visible ? " lt-more-visible" : ""}`} aria-hidden={!visible}>
      <span>더 보기</span>
      <ChevronDown size={17} />
    </div>
  );
}

export default function LinkTree({ initialTab }: { initialTab?: string }) {
  const initialIndex = tabIndexOf(initialTab);
  const [selected, setSelected] = useState(initialIndex >= 0 ? initialIndex : 0);
  const [introSkipped, setIntroSkipped] = useState(initialIndex >= 0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [panelMore, setPanelMore] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const panelEndRef = useRef<HTMLSpanElement | null>(null);
  const selectedCard = cards[selected];

  const rootStyle = useMemo(() => ({
    "--cream": theme.colors.cream,
    "--ink": theme.colors.ink,
    "--dim": theme.colors.dim,
    "--rose": theme.colors.rose,
    "--brown": theme.colors.brown,
    "--denim": theme.colors.denim,
    "--latte": theme.colors.latte,
    "--border": theme.colors.border,
    "--scroll-track": theme.colors.scrollTrack,
    "--scroll-thumb": theme.colors.scrollThumb,
    "--scroll-thumb-hover": theme.colors.scrollThumbHover,
    "--display": DISPLAY,
    "--body": BODY,
    "--mono": MONO
  }) as React.CSSProperties, []);

  useEffect(() => {
    if (!sheetOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [sheetOpen]);

  useEffect(() => {
    if (initialIndex < 0) return;
    setSelected(initialIndex);
    setIntroSkipped(true);
    requestAnimationFrame(() => {
      if (window.innerWidth <= 768) setSheetOpen(true);
      else document.querySelector(".lt-catalog")?.scrollIntoView({ block: "start" });
    });
  }, [initialIndex]);

  useEffect(() => {
    const update = () => {
      const panel = panelRef.current?.querySelector(".lt-panel-inner") as HTMLElement | null;
      const end = panelEndRef.current;
      if (!panel || !end) {
        setPanelMore(false);
        return;
      }
      setPanelMore(end.getBoundingClientRect().bottom > panel.getBoundingClientRect().bottom + 12);
    };
    update();
    window.addEventListener("resize", update);
    const panel = panelRef.current?.querySelector(".lt-panel-inner");
    panel?.addEventListener("scroll", update, { passive: true });
    const timer = window.setTimeout(update, 160);
    return () => {
      window.removeEventListener("resize", update);
      panel?.removeEventListener("scroll", update);
      window.clearTimeout(timer);
    };
  }, [selected, sheetOpen]);

  const browseLinks = () => {
    setIntroSkipped(true);
    requestAnimationFrame(() => requestAnimationFrame(() => document.querySelector(".lt-catalog")?.scrollIntoView({ block: "start" })));
  };

  const onSelect = (index: number) => {
    setSelected(index);
    if (window.innerWidth <= 768) setSheetOpen(true);
  };

  return (
    <div className={`lt-root${introSkipped ? " lt-root-browsing" : ""}`} style={rootStyle}>
      <div className="lt-deco" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => <span key={n} className={`lt-deco-spiral lt-deco-${n}`} />)}
      </div>

      {!introSkipped ? <IntroOverlay onBrowse={browseLinks} /> : null}

      <header className="lt-header">
        <span className="lt-brand">{profile.title}</span>
      </header>

      <section className="lt-hero">
        <span className="lt-kicker">DORMS COMMUNITY LINKTREE</span>
        <h1 className="lt-title">{profile.catalogTitle}</h1>
        <p className="lt-tagline">{profile.catalogDescription}</p>
      </section>

      <main className="lt-catalog">
        <div className="lt-pills-wrap">
          <PillStack selected={selected} onSelect={onSelect} />
        </div>
        <div ref={panelRef} className={`lt-panel${sheetOpen ? " lt-panel-open" : ""}`}>
          <button type="button" className="lt-sheet-handle" onClick={() => setSheetOpen(false)} aria-label="접기">
            <ChevronDown size={20} />
            <span>접기</span>
          </button>
          <SelectionPanel card={selectedCard} endRef={panelEndRef} />
          <MoreHint visible={panelMore} className="lt-panel-more" />
        </div>
        <button type="button" className={`lt-backdrop${sheetOpen ? " lt-backdrop-open" : ""}`} onClick={() => setSheetOpen(false)} aria-label="닫기" />
      </main>

      <footer className="lt-foot">
        <span>DoRms community linktree</span>
        <span>{String(cards.length).padStart(3, "0")}-A</span>
      </footer>
    </div>
  );
}

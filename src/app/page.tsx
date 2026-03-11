"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const cards = [
  "Älskar att du tar hand om vårt nya hem",
  "Älskar att du sätter andra först fast du inte behöver göra det",
  "Älskar att du är glad när du kommer hem till mig",
  "Älskar att du är min trygga punkt",
  "Älskar att du vill bolla mina intressen oavsett vad du tycker",
  "Älskar att du har utmanat och utvecklat mig som person",
  "Älskar att du vill att jag ska jaga mina drömmar",
  "Älskar att du imiterar min humor",
  "Älskar att du är gosig och närgången",
  "Älskar att du är lätt att ta med vart som helst",
  "Älskar att du är sprallig",
  "Älskar att du jagar dina egna drömmar",
  "Älskar att du skulle vara en fantastisk mamma",
  "Älskar att du tänker på hälsan och inte bara träning",
  "Älskar att du alltid är positiv",
  "Älskar att du ger mig en stabil grund",
  "Älskar att du aldrig skulle såra mig",
  "Älskar att du vill mitt bästa",
  "Älskar att du förstår mig även fast jag inte alltid kan uttrycka mig väl",
  "Älskar att du har egna åsikter",
  "Älskar att du är ärlig och rättvis",
  "Älskar att du kan prata om vad som helst",
  "Älskar att du har egna vänner och intressen",
  "Älskar att du är stark och alltid uppnår det du bestämmer dig för",
  "Älskar att du söker tröst hos mig",
  "Älskar att du är genuint glad för andras skull",
  "Älskar att du tar och driver initiativ",
  "Älskar att du uppskattar det lilla",
  "Älskar att du har format mig till en bättre man",
  "Älskar att du älskar mig",
];

const cornerSVG = (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 18 L2 4 Q2 2 4 2 L18 2" stroke="rgba(201,168,76,0.4)" strokeWidth="1" fill="none" />
    <circle cx="2" cy="2" r="1.5" fill="rgba(201,168,76,0.3)" />
  </svg>
);

const bowSVG = (
  <svg className="gift-bow" viewBox="0 0 60 30" width="54" fill="none">
    <path d="M30 22 C26 18 13 14 11 8 C9 2 17 -1 23 3 C27 6 29 14 30 22Z" fill="rgba(201,168,76,0.4)" stroke="rgba(201,168,76,0.7)" strokeWidth="0.8" />
    <path d="M30 22 C34 18 47 14 49 8 C51 2 43 -1 37 3 C33 6 31 14 30 22Z" fill="rgba(201,168,76,0.4)" stroke="rgba(201,168,76,0.7)" strokeWidth="0.8" />
    <circle cx="30" cy="22" r="4" fill="rgba(201,168,76,0.6)" stroke="rgba(201,168,76,0.8)" strokeWidth="0.8" />
  </svg>
);

type Screen = "landing" | "hellstrom" | "cards" | "song" | "copenhagen";

function GiftBox({ label, index, onClick, opened }: { label: string; index: number; onClick: () => void; opened: boolean }) {
  return (
    <div id={`gift-${index}`} className={`gift${opened ? " opened" : ""}`} onClick={onClick}>
      <div className="gift-wrap">
        {bowSVG}
        <div className="gift-lid" />
        <div className="gift-body">
          <div className="gift-glow" />
        </div>
      </div>
      <div className="gift-label">{label}</div>
    </div>
  );
}

function LoveCard({ index, extraClass, onClickNext }: { index: number; extraClass: string; onClickNext: () => void }) {
  const isLast = index === cards.length - 1;
  return (
    <div className={`love-card${isLast ? " last-card" : ""} ${extraClass}`} onClick={onClickNext}>
      <div className="card-paper">
        <div className="card-border" />
        <div className="card-corner tl">{cornerSVG}</div>
        <div className="card-corner tr">{cornerSVG}</div>
        <div className="card-corner bl">{cornerSVG}</div>
        <div className="card-corner br">{cornerSVG}</div>
        <div className="card-content">
          {isLast && <div className="last-heart">{"\u2665"}</div>}
          <div className="card-title">30 anledningar varför jag älskar dig</div>
          <div className="card-number">{index + 1} av 30</div>
          <div className="card-divider" />
          <div className="card-text">{cards[index]}</div>
        </div>
      </div>
    </div>
  );
}

function Petals() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    for (let i = 0; i < 18; i++) {
      const p = document.createElement("div");
      p.className = "petal";
      p.style.left = Math.random() * 100 + "vw";
      p.style.top = "-20px";
      p.style.animationDuration = 12 + Math.random() * 18 + "s";
      p.style.animationDelay = Math.random() * 20 + "s";
      p.style.opacity = String(Math.random() * 0.5);
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      const scale = 0.5 + Math.random() * 1.5;
      p.style.width = 5 * scale + "px";
      p.style.height = 9 * scale + "px";
      container.appendChild(p);
    }
  }, []);

  return <div className="bg-petals" ref={containerRef} />;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("landing");
  const [openedGifts, setOpenedGifts] = useState<Set<number>>(new Set());
  const [currentCard, setCurrentCard] = useState(0);
  const [animClass, setAnimClass] = useState("");
  const [exitingCard, setExitingCard] = useState<{ index: number; dir: string } | null>(null);
  const isAnimating = useRef(false);
  const flashRef = useRef<HTMLDivElement>(null);

  const screenMap: Screen[] = ["hellstrom", "cards", "song", "copenhagen"];
  const audioRef = useRef<HTMLAudioElement>(null);

  const openGift = useCallback((index: number) => {
    if (openedGifts.has(index)) {
      setScreen(screenMap[index]);
      if (index === 1) {
        setCurrentCard(0);
        setAnimClass("");
        setExitingCard(null);
      }
      return;
    }

    const gift = document.getElementById(`gift-${index}`);
    if (!gift) return;
    const rect = gift.getBoundingClientRect();
    const cx = (rect.left + rect.width / 2) / window.innerWidth * 100;
    const cy = (rect.top + rect.height / 2) / window.innerHeight * 100;

    if (flashRef.current) {
      flashRef.current.style.setProperty("--flash-x", cx + "%");
      flashRef.current.style.setProperty("--flash-y", cy + "%");
    }

    gift.classList.add("opening");

    setTimeout(() => {
      flashRef.current?.classList.add("active");
    }, 400);

    setTimeout(() => {
      setScreen(screenMap[index]);
      flashRef.current?.classList.remove("active");
      gift.classList.remove("opening");
      setOpenedGifts((prev) => new Set(prev).add(index));

      if (index === 1) {
        setCurrentCard(0);
        setAnimClass("");
        setExitingCard(null);
      }
    }, 800);
  }, [openedGifts]);

  const navigateCard = useCallback((dir: number, targetIndex?: number) => {
    if (isAnimating.current) return;
    const nextIndex = targetIndex !== undefined ? targetIndex : currentCard + dir;
    if (nextIndex < 0 || nextIndex >= cards.length || nextIndex === currentCard) return;

    isAnimating.current = true;
    const actualDir = nextIndex > currentCard ? 1 : -1;

    setExitingCard({ index: currentCard, dir: actualDir > 0 ? "exit-left" : "exit-right" });
    setCurrentCard(nextIndex);
    setAnimClass(actualDir > 0 ? "enter-right" : "enter-left");

    setTimeout(() => {
      setExitingCard(null);
      setAnimClass("");
      isAnimating.current = false;
    }, 460);
  }, [currentCard]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (screen !== "cards") {
        if (e.key === "Escape") setScreen("landing");
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowDown") navigateCard(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") navigateCard(-1);
      if (e.key === "Escape") setScreen("landing");
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [screen, navigateCard]);

  useEffect(() => {
    let touchStartX = 0;
    const onStart = (e: TouchEvent) => { touchStartX = e.touches[0].clientX; };
    const onEnd = (e: TouchEvent) => {
      if (screen !== "cards") return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 50) navigateCard(dx < 0 ? 1 : -1);
    };
    document.addEventListener("touchstart", onStart);
    document.addEventListener("touchend", onEnd);
    return () => {
      document.removeEventListener("touchstart", onStart);
      document.removeEventListener("touchend", onEnd);
    };
  }, [screen, navigateCard]);

  return (
    <>
      <div className="bg-texture" />
      <Petals />
      <div className="flash-overlay" ref={flashRef} />

      {/* ═══ LANDING ═══ */}
      <div className={`screen${screen === "landing" ? " active" : ""}`}>
        <div className="landing-content">
          <div className="landing-header">
            <div className="landing-name">Grattis på födelsedagen min älskling</div>
            <div className="landing-sub">Fyra spännande presenter väntar på dig</div>
          </div>
          <div className="gifts">
            <GiftBox label="I" index={0} onClick={() => openGift(0)} opened={openedGifts.has(0)} />
            <GiftBox label="II" index={1} onClick={() => openGift(1)} opened={openedGifts.has(1)} />
            <GiftBox label="III" index={2} onClick={() => openGift(2)} opened={openedGifts.has(2)} />
            <GiftBox label="IV" index={3} onClick={() => openGift(3)} opened={openedGifts.has(3)} />
          </div>
        </div>
      </div>

      {/* ═══ HELLSTRÖM ═══ */}
      <div className={`screen screen-hellstrom${screen === "hellstrom" ? " active" : ""}`}>
        <button className="back-btn" onClick={() => setScreen("landing")}>&larr; Tillbaka</button>
        <div className="ticket">
          <div className="ticket-inner">
            <div className="ticket-border" />
            <div className="ticket-spotlight" />
            <div className="ticket-icon">🎶</div>
            <div className="ticket-label">Konsertbiljett</div>
            <div className="ticket-divider" />
            <div className="ticket-artist">Håkan Hellström</div>
            <div className="ticket-type">Live</div>
            <div className="ticket-note">
              Detaljer avslöjas snart&hellip;
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 30 CARDS ═══ */}
      <div className={`screen${screen === "cards" ? " active" : ""}`}>
        <button className="back-btn" onClick={() => setScreen("landing")}>&larr; Tillbaka</button>
        <div className="card-stage">
          {currentCard < cards.length - 2 && (
            <LoveCard index={currentCard + 2} extraClass="behind-2" onClickNext={() => {}} />
          )}
          {currentCard < cards.length - 1 && (
            <LoveCard index={currentCard + 1} extraClass="behind-1" onClickNext={() => {}} />
          )}
          {exitingCard && (
            <LoveCard index={exitingCard.index} extraClass={exitingCard.dir} onClickNext={() => {}} />
          )}
          <LoveCard
            key={currentCard}
            index={currentCard}
            extraClass={`active ${animClass}`}
            onClickNext={() => navigateCard(1)}
          />
        </div>
        <div className="cards-nav">
          <button className="nav-btn" disabled={currentCard === 0} onClick={() => navigateCard(-1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 11L5 7L9 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="nav-counter">{currentCard + 1} / {cards.length}</div>
          <button className="nav-btn" disabled={currentCard === cards.length - 1} onClick={() => navigateCard(1)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* ═══ SONG ═══ */}
      <div className={`screen screen-song${screen === "song" ? " active" : ""}`}>
        <button className="back-btn" onClick={() => { setScreen("landing"); audioRef.current?.pause(); }}>&larr; Tillbaka</button>
        <div className="card-stage">
          <div className="love-card song-card-wrap active">
            <div className="card-paper">
              <div className="card-border" />
              <div className="card-corner tl">{cornerSVG}</div>
              <div className="card-corner tr">{cornerSVG}</div>
              <div className="card-corner bl">{cornerSVG}</div>
              <div className="card-corner br">{cornerSVG}</div>
              <div className="card-content">
                <div className="song-icon">🎵</div>
                <div className="card-number">Present III</div>
                <div className="card-divider" />
                <div className="card-text">En låt till dig</div>
                <div className="song-subtitle">Tryck play</div>
                <audio ref={audioRef} className="song-player" controls src="/Mia V2.mp3" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ COPENHAGEN ═══ */}
      <div className={`screen screen-copenhagen${screen === "copenhagen" ? " active" : ""}`}>
        <button className="back-btn" onClick={() => setScreen("landing")}>&larr; Tillbaka</button>
        <div className="cph-card">
          <div className="cph-border" />
          <div className="cph-shimmer" />
          <div className="cph-flag">🇩🇰</div>
          <div className="cph-label">Present IV</div>
          <div className="cph-divider" />
          <div className="cph-title">Vi åker till Köpenhamn</div>
          <div className="cph-subtitle">Bara du och jag</div>
        </div>
      </div>
    </>
  );
}

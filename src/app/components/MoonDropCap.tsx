"use client";

import * as React from "react";

type Apod = {
  title?: string;
  url?: string;
  media_type?: "image" | "video";
  date?: string;
};

export default function MoonDropcap({
  text = "Bruno Baumgartner – Autor",
  date: dateProp,
  showDatePicker = false,
  size = "lg",
  className = "",
}: {
  text?: string;
  date?: string;               // YYYY-MM-DD
  showDatePicker?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const apiKey =
    (process.env.NEXT_PUBLIC_NASA_API_KEY as string) ||
    (process.env.REACT_APP_NASA_API_KEY as string) ||
    "DEMO_KEY";

  const todayLocal = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const [selectedDate, setSelectedDate] = React.useState<string>(
    dateProp || todayLocal()
  );
  const [moonEmoji, setMoonEmoji] = React.useState<string>("🌑");
  const [nasaApod, setNasaApod] = React.useState<Apod | null>(null);

  // 1) NASA-API (APOD) – wird abgerufen, aber beeinflusst das Emoji NICHT.
  React.useEffect(() => {
    let cancelled = false;
    async function loadApod() {
      try {
        const res = await fetch("/api/nasa/apod"); // gleiche Origin → CSP-konform

        if (!res.ok) throw new Error(`NASA APOD ${res.status}`);
        const data: Apod = await res.json();
        if (!cancelled) setNasaApod(data);
      } catch (e) {
        // still silent fallback; DEMO_KEY ist rate-limited
        if (!cancelled) setNasaApod(null);
      }
    }
    loadApod();
    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  // 2) Mondphase oder Spezial-Emoji bestimmen
  React.useEffect(() => {
    const special = specialEmojiOverride(selectedDate);
    if (special) {
      setMoonEmoji(special); // nur Emoji (z. B. 🥂, 👑, ⛑️, 🎄 …)
      return;
    }
    setMoonEmoji(getMoonPhaseEmoji(selectedDate)); // aktuelle Phase
  }, [selectedDate]);

  const sizes = {
    sm: { fontSize: 56, gap: 10, lineHeight: 0.9 },
    md: { fontSize: 80, gap: 12, lineHeight: 0.9 },
    lg: { fontSize: 112, gap: 14, lineHeight: 0.9 },
  } as const;
  const s = sizes[size];

  return (
    <div className={`moon-dropcap ${className}`} data-nasa-apod={nasaApod?.date || ""}>
      <div className="row">
        {/* Nur Emoji, kein sichtbarer Text */}
        <span aria-hidden className="dropcap">
          {moonEmoji}
        </span>
        <span className="title">{text}</span>
      </div>

      {showDatePicker && (
        <div className="controls">
          <label>
            Datum:&nbsp;
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </label>
        </div>
      )}

      <style jsx>{`
        .row {
          display: flex;
          align-items: flex-start;
          gap: ${s.gap}px;
        }
        .dropcap {
          font-size: ${s.fontSize}px;
          line-height: ${s.lineHeight};
          display: inline-block;
          transform: translateY(2px);
          filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.15));
        }
        .title {
          font-weight: 700;
          font-size: clamp(1.6rem, 2.5vw, 2.2rem);
          line-height: 1.2;
          letter-spacing: 0.2px;
        }
        .controls {
          margin-top: 8px;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          opacity: 0.9;
        }
        .controls input[type="date"] {
          padding: 6px 8px;
          border-radius: 8px;
          border: 1px solid rgba(0,0,0,0.1);
          background: rgba(255,255,255,0.6);
          backdrop-filter: blur(6px);
        }
      `}</style>
    </div>
  );

  // --- Mondphase (Näherung) ---
  function getMoonPhaseEmoji(iso: string): string {
    const synodic = 29.53;
    const ref = new Date("2024-03-10T00:00:00Z").getTime(); // Referenz-Neumond
    const t = new Date(`${iso}T00:00:00`).getTime();
    const days = (t - ref) / 86400000;
    const age = ((days % synodic) + synodic) % synodic;

    if (age < 1.845) return "🌑";
    if (age < 5.536) return "🌒";
    if (age < 9.228) return "🌓";
    if (age < 12.92) return "🌔";
    if (age < 16.61) return "🌕";
    if (age < 20.3) return "🌖";
    if (age < 24.0) return "🌗";
    if (age < 27.68) return "🌘";
    return "🌑";
  }

  // --- Spezielle, jährlich wiederkehrende Daten (nur Emoji) inkl. Ostern ---
  function specialEmojiOverride(iso: string): string {
    const { y, mmdd } = splitDate(iso);
    const yearly: Record<string, string> = {
      "01-01": "🥂", // Neujahr
      "01-06": "👑", // Heilige Drei Könige
      "02-14": "❤️", // Valentinstag
      "06-15": "🎁", // Geburtstag
      "07-31": "⛑️", // Vorabend Bundesfeier – Helm mit Kreuz
      "08-01": "⛑️", // Bundesfeier – Helm mit Kreuz
      "10-31": "🎃", // Halloween
      "12-06": "🎅", // Nikolaus
      "12-24": "🎄", // Heiligabend
      "12-25": "🎄", // Weihnachten
      "12-26": "🎄", // Stephanstag
    };
    if (yearly[mmdd]) return yearly[mmdd];
    if (iso === easterISO(y)) return "🐰"; // Ostern
    return "";
  }

  function splitDate(iso: string) {
    const d = new Date(`${iso}T00:00:00`);
    return {
      y: d.getFullYear(),
      mmdd: `${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`,
    };
  }

  // Ostersonntag (Meeus/Jones/Butcher)
  function easterISO(year: number) {
    const a = year % 19,
      b = Math.floor(year / 100),
      c = year % 100,
      d = Math.floor(b / 4),
      e = b % 4,
      f = Math.floor((b + 8) / 25),
      g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - d - g + 15) % 30,
      i = Math.floor(c / 4),
      k = c % 4,
      l = (32 + 2 * e + 2 * i - h - k) % 7,
      m = Math.floor((a + 11 * h + 22 * l) / 451),
      month = Math.floor((h + l - 7 * m + 114) / 31),
      day = ((h + l - 7 * m + 114) % 31) + 1;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }
}

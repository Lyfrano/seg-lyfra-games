import { useState, useMemo } from "react";
import { ShoppingCart, Search, Star, X, Tag, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";
import yoshiBanner from "@/imports/yoshis-story-nintendo-64-art-banner.jpg";
import psLogo from "@/imports/PlayStation-Logo.wine.png";
import switch1Logo from "@/imports/Nintendo_switch_logo.png";
import switch2Logo from "@/imports/Nintendo_Switch_2_logo.svg.png";
import lyfraLogo from "@/imports/lyfra-games-logo.png";

// ── Types ─────────────────────────────────────────────────────────────────────

type Page = "home" | "search" | "checkout";
type ConsoleName = "PS4" | "PS5" | "Switch 1" | "Switch 2";
type Genre =
  | "Action"
  | "RPG"
  | "Sports"
  | "Racing"
  | "Fighting"
  | "Adventure"
  | "Puzzle"
  | "Shooter";

interface Game {
  id: number;
  title: string;
  console: ConsoleName;
  genre: Genre;
  price: number;
  originalPrice?: number;
  onSale: boolean;
}

interface CartItem {
  gameId: number;
  qty: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const CONSOLES: ConsoleName[] = ["PS4", "PS5", "Switch 1", "Switch 2"];
const GENRES: Genre[] = [
  "Action",
  "RPG",
  "Sports",
  "Racing",
  "Fighting",
  "Adventure",
  "Puzzle",
  "Shooter",
];
const MAX_PRICE = 60;

// Flat solid color per console — no gradients
const CONSOLE_BG: Record<ConsoleName, string> = {
  PS4: "#003791",
  PS5: "#1a1a2e",
  "Switch 1": "#ece2d0",
  "Switch 2": "#4bbe61",
};

// Logo images per console
const CONSOLE_LOGO = {
  PS4: psLogo,
  PS5: psLogo,
  "Switch 1": switch1Logo,
  "Switch 2": switch2Logo,
};

const GAMES: Game[] = [
  { id: 1,  title: "Action — PS4",         console: "PS4",      genre: "Action",    price: 18.99, originalPrice: 29.99, onSale: true  },
  { id: 2,  title: "RPG — PS4",            console: "PS4",      genre: "RPG",       price: 24.99,                       onSale: false },
  { id: 3,  title: "Sports — PS4",         console: "PS4",      genre: "Sports",    price: 12.99, originalPrice: 19.99, onSale: true  },
  { id: 4,  title: "Racing — PS4",         console: "PS4",      genre: "Racing",    price: 15.99,                       onSale: false },
  { id: 5,  title: "Action — PS5",         console: "PS5",      genre: "Action",    price: 34.99, originalPrice: 49.99, onSale: true  },
  { id: 6,  title: "RPG — PS5",            console: "PS5",      genre: "RPG",       price: 44.99,                       onSale: false },
  { id: 7,  title: "Shooter — PS5",        console: "PS5",      genre: "Shooter",   price: 29.99, originalPrice: 44.99, onSale: true  },
  { id: 8,  title: "Adventure — PS5",      console: "PS5",      genre: "Adventure", price: 39.99,                       onSale: false },
  { id: 9,  title: "Adventure — Switch 1", console: "Switch 1", genre: "Adventure", price: 22.99,                       onSale: false },
  { id: 10, title: "Puzzle — Switch 1",    console: "Switch 1", genre: "Puzzle",    price: 14.99, originalPrice: 24.99, onSale: true  },
  { id: 11, title: "Fighting — Switch 1",  console: "Switch 1", genre: "Fighting",  price: 19.99,                       onSale: false },
  { id: 12, title: "Sports — Switch 1",    console: "Switch 1", genre: "Sports",    price: 16.99, originalPrice: 22.99, onSale: true  },
  { id: 13, title: "Action — Switch 2",    console: "Switch 2", genre: "Action",    price: 44.99,                       onSale: false },
  { id: 14, title: "RPG — Switch 2",       console: "Switch 2", genre: "RPG",       price: 49.99, originalPrice: 59.99, onSale: true  },
  { id: 15, title: "Racing — Switch 2",    console: "Switch 2", genre: "Racing",    price: 39.99,                       onSale: false },
  { id: 16, title: "Puzzle — Switch 2",    console: "Switch 2", genre: "Puzzle",    price: 34.99, originalPrice: 44.99, onSale: true  },
];

// ── PriceRangeSlider ──────────────────────────────────────────────────────────

function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
}: {
  min: number;
  max: number;
  value: [number, number];
  onChange: (v: [number, number]) => void;
}) {
  const [lo, hi] = value;
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Price range</span>
        <span className="font-medium text-foreground">
          ${lo} – ${hi}
        </span>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-6 shrink-0">Min</span>
          <input
            type="range"
            min={min}
            max={max}
            value={lo}
            onChange={(e) => onChange([Math.min(+e.target.value, hi - 1), hi])}
            className="w-full cursor-pointer"
            style={{ accentColor: "var(--primary)" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground w-6 shrink-0">Max</span>
          <input
            type="range"
            min={min}
            max={max}
            value={hi}
            onChange={(e) => onChange([lo, Math.max(+e.target.value, lo + 1)])}
            className="w-full cursor-pointer"
            style={{ accentColor: "var(--primary)" }}
          />
        </div>
      </div>
    </div>
  );
}

// ── ConsolePlaceholder ────────────────────────────────────────────────────────

function ConsolePlaceholder({
  console: consoleName,
  className = "",
}: {
  console: ConsoleName;
  className?: string;
}) {
  const isPS = consoleName === "PS4" || consoleName === "PS5";
  return (
    <div
      className={`flex items-center justify-center overflow-hidden ${className}`}
      style={{ backgroundColor: CONSOLE_BG[consoleName] }}
    >
      <ImageWithFallback
        src={CONSOLE_LOGO[consoleName]}
        alt={consoleName}
        className={
          isPS
            ? "h-16 w-16 object-contain [filter:brightness(0)_invert(1)]"
            : "w-full h-full object-cover"
        }
      />
    </div>
  );
}

// ── GameCard ──────────────────────────────────────────────────────────────────

function GameCard({
  game,
  onAdd,
}: {
  game: Game;
  onAdd: (id: number) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:-translate-y-0.5 transition-all duration-200">
      <div className="relative h-36">
        {game.onSale && (
          <span className="absolute top-2 right-2 z-10 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded tracking-widest">
            SALE
          </span>
        )}
        <ConsolePlaceholder console={game.console} className="w-full h-full" />
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold leading-tight">{game.title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{game.genre}</p>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-primary font-bold text-base">
            ${game.price.toFixed(2)}
          </span>
          {game.originalPrice && (
            <span className="text-muted-foreground text-xs line-through">
              ${game.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <button
          onClick={() => onAdd(game.id)}
          className="mt-2.5 w-full bg-primary/10 text-primary text-xs font-semibold py-1.5 rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors duration-150"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

function Navbar({
  page,
  cartCount,
  onNavigate,
}: {
  page: Page;
  cartCount: number;
  onNavigate: (p: Page) => void;
}) {
  return (
    <nav className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center"
          aria-label="Lyfra-Games"
        >
          <ImageWithFallback
            src={lyfraLogo}
            alt="Lyfra-Games logo"
            className="h-10 md:h-12 w-auto object-contain"
          />
        </button>
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate("home")}
            className={`text-sm font-medium transition-colors ${
              page === "home"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => onNavigate("search")}
            className={`text-sm font-medium transition-colors ${
              page === "search"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Browse
          </button>
          <button
            onClick={() => onNavigate("checkout")}
            className="relative text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount > 9 ? "9+" : cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ── HomePage ──────────────────────────────────────────────────────────────────

function HomePage({
  onNavigate,
  onFilterConsole,
  onAdd,
}: {
  onNavigate: (p: Page) => void;
  onFilterConsole: (c: ConsoleName) => void;
  onAdd: (id: number) => void;
}) {
  const saleGames = GAMES.filter((g) => g.onSale);

  return (
    <div>
      {/* Hero banner — Yoshi image with overlay */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <ImageWithFallback
          src={yoshiBanner}
          alt="Yoshi's Story Nintendo 64 art"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <p
            className="text-xs font-semibold tracking-[0.2em] uppercase text-primary/80 mb-3"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Lyfra-Games
          </p>
          <h1
            className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight"
            style={{ fontFamily: "Outfit, sans-serif" }}
          >
            Find Your Next Favorite Game
          </h1>
          <p className="text-white/70 mb-7 text-sm max-w-md">
            Quality used games for PS4, PS5, Switch 1 &amp; Switch 2 — at unbeatable prices.
          </p>
          <button
            onClick={() => onNavigate("search")}
            className="inline-flex items-center gap-2 bg-primary text-white px-7 py-2.5 rounded-lg font-semibold hover:bg-primary/85 transition-colors text-sm"
          >
            Browse All Games
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Shop by Console */}
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2
          className="text-base font-bold mb-5 uppercase tracking-wider text-muted-foreground"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          Shop by Console
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CONSOLES.map((c) => (
            <button
              key={c}
              onClick={() => {
                onFilterConsole(c);
                onNavigate("search");
              }}
              className="rounded-xl overflow-hidden hover:scale-[1.02] hover:brightness-110 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <div className="relative h-24">
                <ConsolePlaceholder console={c} className="w-full h-full" />
                <div className="absolute inset-0 bg-black/20 flex items-end pb-2 px-3">
                  <span
                    className="text-white font-bold text-sm drop-shadow"
                    style={{ fontFamily: "Outfit, sans-serif" }}
                  >
                    {c}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* On Sale Now */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Tag size={15} className="text-accent" />
            <h2
              className="text-base font-bold uppercase tracking-wider text-muted-foreground"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              On Sale Now
            </h2>
          </div>
          <button
            onClick={() => onNavigate("search")}
            className="text-xs text-primary hover:text-primary/75 transition-colors flex items-center gap-0.5"
          >
            View all <ChevronRight size={13} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {saleGames.map((g) => (
            <GameCard key={g.id} game={g} onAdd={onAdd} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SearchPage ────────────────────────────────────────────────────────────────

function SearchPage({
  selectedConsoles,
  setSelectedConsoles,
  selectedGenres,
  setSelectedGenres,
  priceRange,
  setPriceRange,
  onSaleOnly,
  setOnSaleOnly,
  onAdd,
}: {
  selectedConsoles: Set<ConsoleName>;
  setSelectedConsoles: (s: Set<ConsoleName>) => void;
  selectedGenres: Set<Genre>;
  setSelectedGenres: (s: Set<Genre>) => void;
  priceRange: [number, number];
  setPriceRange: (r: [number, number]) => void;
  onSaleOnly: boolean;
  setOnSaleOnly: (v: boolean) => void;
  onAdd: (id: number) => void;
}) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.toLowerCase();
    return GAMES.filter((g) => {
      if (q && !g.title.toLowerCase().includes(q) && !g.genre.toLowerCase().includes(q))
        return false;
      if (selectedConsoles.size > 0 && !selectedConsoles.has(g.console))
        return false;
      if (selectedGenres.size > 0 && !selectedGenres.has(g.genre))
        return false;
      if (g.price < priceRange[0] || g.price > priceRange[1]) return false;
      if (onSaleOnly && !g.onSale) return false;
      return true;
    });
  }, [query, selectedConsoles, selectedGenres, priceRange, onSaleOnly]);

  function toggleConsole(c: ConsoleName) {
    const next = new Set(selectedConsoles);
    if (next.has(c)) next.delete(c);
    else next.add(c);
    setSelectedConsoles(next);
  }

  function toggleGenre(g: Genre) {
    const next = new Set(selectedGenres);
    if (next.has(g)) next.delete(g);
    else next.add(g);
    setSelectedGenres(next);
  }

  function clearAll() {
    setSelectedConsoles(new Set());
    setSelectedGenres(new Set());
    setPriceRange([0, MAX_PRICE]);
    setOnSaleOnly(false);
    setQuery("");
  }

  const hasFilters =
    selectedConsoles.size > 0 ||
    selectedGenres.size > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < MAX_PRICE ||
    onSaleOnly;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 flex gap-8">
      {/* Left sidebar */}
      <aside className="w-52 shrink-0">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Filters
          </h3>
          {hasFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-primary hover:text-primary/75 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-6">
          {/* Console */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Console</h4>
            <div className="space-y-2.5">
              {CONSOLES.map((c) => (
                <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedConsoles.has(c)}
                    onChange={() => toggleConsole(c)}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {c}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Genre */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Genre</h4>
            <div className="space-y-2.5">
              {GENRES.map((g) => (
                <label key={g} className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedGenres.has(g)}
                    onChange={() => toggleGenre(g)}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {g}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="pt-4 border-t border-border">
            <PriceRangeSlider
              min={0}
              max={MAX_PRICE}
              value={priceRange}
              onChange={setPriceRange}
            />
          </div>

          {/* On Sale */}
          <div className="pt-4 border-t border-border">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onSaleOnly}
                onChange={(e) => setOnSaleOnly(e.target.checked)}
                style={{ accentColor: "var(--primary)" }}
              />
              <span className="text-sm font-medium">On Sale Only</span>
            </label>
          </div>
        </div>
      </aside>

      {/* Results */}
      <div className="flex-1 min-w-0">
        <div className="relative mb-5">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or genre…"
            className="w-full bg-card border border-border rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {results.length} {results.length === 1 ? "result" : "results"} found
        </p>

        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search size={40} className="text-muted-foreground/20 mb-4" />
            <p className="text-muted-foreground text-sm">
              No games match your filters.
            </p>
            <button
              onClick={clearAll}
              className="mt-3 text-sm text-primary hover:text-primary/75 transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((g) => (
              <GameCard key={g.id} game={g} onAdd={onAdd} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── CheckoutPage ──────────────────────────────────────────────────────────────

function CheckoutPage({
  cart,
  onRemove,
  onOrderPlaced,
  onNavigate,
}: {
  cart: CartItem[];
  onRemove: (id: number) => void;
  onOrderPlaced: () => void;
  onNavigate: (p: Page) => void;
}) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    address: "",
    city: "",
    postal: "",
    card: "",
    expiry: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cartItems = cart
    .map((item) => ({ ...item, game: GAMES.find((g) => g.id === item.gameId)! }))
    .filter((item) => item.game);

  const subtotal = cartItems.reduce((s, i) => s + i.game.price * i.qty, 0);

  function update(k: keyof typeof form, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[k];
      return next;
    });
  }

  function formatCard(v: string) {
    return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email";
    if (!form.address.trim()) e.address = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.postal.trim()) e.postal = "Required";
    if (form.card.replace(/\s/g, "").length < 16)
      e.card = "Enter a 16-digit number";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) e.expiry = "Format: MM/YY";
    if (form.cvv.length < 3) e.cvv = "3 digits required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center px-6">
        <ShoppingCart size={48} className="text-muted-foreground/20 mb-5" />
        <h2
          className="text-xl font-bold mb-2"
          style={{ fontFamily: "Outfit, sans-serif" }}
        >
          Your cart is empty
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Browse our games and add some to your cart.
        </p>
        <button
          onClick={() => onNavigate("search")}
          className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/85 transition-colors text-sm"
        >
          Browse Games
        </button>
      </div>
    );
  }

  const inputCls = (k: string) =>
    `w-full bg-input-background border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors ${
      errors[k] ? "border-destructive" : "border-border"
    }`;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1
        className="text-2xl font-bold mb-8"
        style={{ fontFamily: "Outfit, sans-serif" }}
      >
        Checkout
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
        {/* Form */}
        <div className="md:col-span-3 space-y-7">
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Contact
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Full Name</label>
                <input
                  value={form.fullName}
                  onChange={(e) => update("fullName", e.target.value)}
                  placeholder="John Doe"
                  className={inputCls("fullName")}
                />
                {errors.fullName && (
                  <p className="text-destructive text-xs mt-1">{errors.fullName}</p>
                )}
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Email Address</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="john@example.com"
                  className={inputCls("email")}
                />
                {errors.email && (
                  <p className="text-destructive text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Shipping Address
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Street Address</label>
                <input
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder="123 Main Street"
                  className={inputCls("address")}
                />
                {errors.address && (
                  <p className="text-destructive text-xs mt-1">{errors.address}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">City</label>
                  <input
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                    placeholder="Montreal"
                    className={inputCls("city")}
                  />
                  {errors.city && (
                    <p className="text-destructive text-xs mt-1">{errors.city}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Postal Code</label>
                  <input
                    value={form.postal}
                    onChange={(e) => update("postal", e.target.value)}
                    placeholder="H3A 1A1"
                    className={inputCls("postal")}
                  />
                  {errors.postal && (
                    <p className="text-destructive text-xs mt-1">{errors.postal}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Payment
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">Card Number</label>
                <input
                  value={form.card}
                  onChange={(e) => update("card", formatCard(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className={inputCls("card")}
                />
                {errors.card && (
                  <p className="text-destructive text-xs mt-1">{errors.card}</p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Expiry Date</label>
                  <input
                    value={form.expiry}
                    onChange={(e) => update("expiry", formatExpiry(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className={inputCls("expiry")}
                  />
                  {errors.expiry && (
                    <p className="text-destructive text-xs mt-1">{errors.expiry}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">CVV</label>
                  <input
                    value={form.cvv}
                    onChange={(e) =>
                      update("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    placeholder="123"
                    maxLength={4}
                    className={inputCls("cvv")}
                  />
                  {errors.cvv && (
                    <p className="text-destructive text-xs mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <button
            onClick={() => {
              if (validate()) onOrderPlaced();
            }}
            className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary/85 transition-colors"
          >
            Place Order — ${subtotal.toFixed(2)}
          </button>
        </div>

        {/* Order summary */}
        <div className="md:col-span-2">
          <div className="bg-card border border-border rounded-xl p-5 sticky top-20">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">
              Order Summary
            </h3>
            <div className="space-y-3">
              {cartItems.map(({ gameId, qty, game }) => (
                <div key={gameId} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                    <ConsolePlaceholder console={game.console} className="w-full h-full" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{game.title}</p>
                    <p className="text-xs text-muted-foreground">Qty: {qty}</p>
                  </div>
                  <p className="text-sm font-semibold shrink-0">
                    ${(game.price * qty).toFixed(2)}
                  </p>
                  <button
                    onClick={() => onRemove(gameId)}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-1 shrink-0"
                    aria-label="Remove item"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="border-t border-border mt-5 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span className="text-green-400 font-medium">Free</span>
              </div>
              <div className="flex justify-between font-bold pt-3 border-t border-border">
                <span>Total</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── RatingModal ───────────────────────────────────────────────────────────────

function RatingModal({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-xl p-8 max-w-md w-full shadow-2xl">
        {submitted ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-4">
              <Star size={22} className="fill-primary text-primary" />
            </div>
            <h3
              className="text-xl font-bold mb-2"
              style={{ fontFamily: "Outfit, sans-serif" }}
            >
              Thank You!
            </h3>
            <p className="text-muted-foreground text-sm mb-7">
              Your review has been submitted.
            </p>
            <button
              onClick={onClose}
              className="bg-primary text-white px-8 py-2.5 rounded-lg font-medium hover:bg-primary/85 transition-colors text-sm"
            >
              Back to Home
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-7">
              <div className="w-10 h-10 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-4">
                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>
              <h3
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "Outfit, sans-serif" }}
              >
                Order Confirmed!
              </h3>
              <p className="text-muted-foreground text-sm">
                Thank you for shopping at Lyfra-Games.
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm font-medium mb-4 text-center">
                How was your experience?
              </p>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-transform hover:scale-110 active:scale-95"
                    aria-label={`Rate ${n} star${n > 1 ? "s" : ""}`}
                  >
                    <Star
                      size={34}
                      className={`transition-colors ${
                        n <= (hovered || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">
                Comment{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about your experience…"
                rows={3}
                className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
              />
            </div>

            <button
              onClick={() => {
                if (rating > 0) setSubmitted(true);
              }}
              disabled={rating === 0}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold text-sm hover:bg-primary/85 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Submit Review
            </button>
            {rating === 0 && (
              <p className="text-center text-xs text-muted-foreground mt-2">
                Select a rating to continue
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedConsoles, setSelectedConsoles] = useState<Set<ConsoleName>>(new Set());
  const [selectedGenres, setSelectedGenres] = useState<Set<Genre>>(new Set());
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [showRating, setShowRating] = useState(false);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  function addToCart(gameId: number) {
    setCart((prev) => {
      const existing = prev.find((i) => i.gameId === gameId);
      if (existing)
        return prev.map((i) => (i.gameId === gameId ? { ...i, qty: i.qty + 1 } : i));
      return [...prev, { gameId, qty: 1 }];
    });
  }

  function removeFromCart(gameId: number) {
    setCart((prev) => prev.filter((i) => i.gameId !== gameId));
  }

  function filterByConsole(c: ConsoleName) {
    setSelectedConsoles(new Set([c]));
    setSelectedGenres(new Set());
    setPriceRange([0, MAX_PRICE]);
    setOnSaleOnly(false);
  }

  function handleCloseRating() {
    setShowRating(false);
    setCart([]);
    setPage("home");
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: "DM Sans, sans-serif" }}
    >
      <Navbar page={page} cartCount={cartCount} onNavigate={setPage} />

      {page === "home" && (
        <HomePage
          onNavigate={setPage}
          onFilterConsole={filterByConsole}
          onAdd={addToCart}
        />
      )}

      {page === "search" && (
        <SearchPage
          selectedConsoles={selectedConsoles}
          setSelectedConsoles={setSelectedConsoles}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          onSaleOnly={onSaleOnly}
          setOnSaleOnly={setOnSaleOnly}
          onAdd={addToCart}
        />
      )}

      {page === "checkout" && (
        <CheckoutPage
          cart={cart}
          onRemove={removeFromCart}
          onOrderPlaced={() => setShowRating(true)}
          onNavigate={setPage}
        />
      )}

      <footer className="border-t border-border mt-12">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Lyfra-Games. All rights reserved.</p>
          <p>
            Attribution: {" "}
            <a
              href="https://www.textstudio.com/"
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline"
            >
              Font generator
            </a>
          </p>
        </div>
      </footer>

      {showRating && <RatingModal onClose={handleCloseRating} />}
    </div>
  );
}

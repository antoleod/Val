// ===== Constants & Config =====
const XP_PER_CORRECT_ANSWER = 10;

const PRESETS = {
    ocean: { accent: "#4c6fff", accent2: "#00d4ff", bg0: "#070a14", bg1: "#06122a" },
    violet: { accent: "#8a5bff", accent2: "#ff5bd6", bg0: "#070a14", bg1: "#120a2a" },
    mint: { accent: "#35d07f", accent2: "#4c6fff", bg0: "#070a14", bg1: "#071a1a" },
    sunset: { accent: "#ff7a59", accent2: "#8a5bff", bg0: "#070a14", bg1: "#241021" },
    gold: { accent: "#ffcc66", accent2: "#ff5b6e", bg0: "#070a14", bg1: "#22150b" },
    day: {
        accent: "#4c6fff", accent2: "#00d4ff", bg0: "#f0f4f8", bg1: "#ffffff",
    }
};

const I18N = {
    fr: {
        title: "Valentina – Entraînement premium", subtitle: "Maths • Logique • Scénarios — records, thèmes et explications.",
        user: (n) => `Utilisateur : ${n}`, dash: "Dashboard", record: "Record", streak: "Streak",
        cards: {
            mTag: "Mathématiques", mTitle: "Calculs & Divisions", mDesc: "Jusqu’à 10 000 + tactiques de division.",
            lTag: "Logique", lTitle: "Suites & règles", lDesc: "Intrus, suites, règles simples.",
            sTag: "Scénarios", sTitle: "Problèmes en contexte", sDesc: "Piscine, boîtes, école, magasin."
        },
        enter: "Entrer",
        time: "Temps",
        best_time: "Record temps",
        test: "Test",
        create: "Créer",
        workshop_title: "Atelier perso",
        shop_buy: "Acheter",
        shop_equip: "Equiper",
        shop_equipped: "Equipe",
        game_over_title: "Game Over",
        game_over_text: "Tu as perdu toutes tes vies ! Essaie encore.",
        exam_title: "Examen Surprise",
        exam_desc: "Un mélange de tout pour tester tes connaissances !",
        pet_stages: ["Oeuf", "Poussin", "Lapin", "Renard", "Licorne", "Dragon"],
        pet_status: (l, n) => `Niveau ${l} • Prochaine évolution : Niv ${n}`,
        pet_max: "Niveau Max !",
        logic_color_q: "Mélange de couleurs :",
        logic_color_hint: "Pense à la peinture.",
        story_cinema_q: (p, t) => `Cinéma : ${p}€ le ticket, ${t}€ le popcorn. 2 personnes (ticket + popcorn). Total ?`,
        story_cinema_hint: "2 × (Ticket + Popcorn)"
    },
    nl: {
        title: "Valentina – Premium oefenen", subtitle: "Rekenen • Logica • Scenario’s — records, thema’s en uitleg.",
        user: (n) => `Gebruiker: ${n}`, dash: "Dashboard", record: "Record", streak: "Streak",
        cards: {
            mTag: "Wiskunde", mTitle: "Bewerkingen & Delen", mDesc: "Tot 10 000 + deel-tactieken.",
            lTag: "Logica", lTitle: "Reeksen & regels", lDesc: "Intrus, reeksen, eenvoudige regels.",
            sTag: "Scenario’s", sTitle: "Context-opgaven", sDesc: "Zwembad, doosjes, school, winkel."
        },
        enter: "Openen",
        time: "Tijd",
        best_time: "Recordtijd",
        test: "Test",
        create: "Maken",
        workshop_title: "Eigen atelier",
        shop_buy: "Kopen",
        shop_equip: "Uitrusten",
        shop_equipped: "Uitgerust",
        game_over_title: "Game Over",
        game_over_text: "Je hebt al je levens verloren! Probeer opnieuw.",
        exam_title: "Verrassingsexamen",
        exam_desc: "Een mix van alles om je kennis te testen!",
        pet_stages: ["Ei", "Kuiken", "Konijn", "Vos", "Eenhoorn", "Draak"],
        pet_status: (l, n) => `Niveau ${l} • Volgende evolutie: Niv ${n}`,
        pet_max: "Max Niveau!",
        logic_color_q: "Kleuren mengen:",
        logic_color_hint: "Denk aan verf.",
        story_cinema_q: (p, t) => `Bioscoop: ${p}€ ticket, ${t}€ popcorn. 2 personen (ticket + popcorn). Totaal?`,
        story_cinema_hint: "2 × (Ticket + Popcorn)"
    }
};

const BADGES = [
    { id: "lvl5", icon: "🐣", title: "Niveau 5", desc: "Atteins le niveau 5", check: (s) => s.level >= 5 },
    { id: "lvl10", icon: "⭐", title: "Star", desc: "Atteins le niveau 10", check: (s) => s.level >= 10 },
    { id: "exam100", icon: "💯", title: "Génie", desc: "100% à l'examen", check: (s, ctx) => ctx?.type === "exam" && ctx.score === 100 },
    { id: "streak3", icon: "🔥", title: "On Fire", desc: "Série de 3 jours", check: (s) => s.streak >= 3 },
    { id: "mathSpeed", icon: "⚡", title: "Flash", desc: "Maths en < 60s (100%)", check: (s, ctx) => ctx?.type === "math" && ctx.score === 100 && ctx.time < 60 }
];

const SHOP_ITEMS = [
    { id: 'hat_crown', name: 'Couronne', icon: '👑', price: 1000, type: 'hat', style: 'top: -15px; left: 25px; transform: rotate(-15deg);' },
    { id: 'hat_cowboy', name: 'Chapeau Cowboy', icon: '🤠', price: 750, type: 'hat', style: 'font-size: 60px; top: -25px; left: 15px;' },
    { id: 'glasses_cool', name: 'Lunettes Cool', icon: '😎', price: 500, type: 'glasses', style: 'font-size: 50px; top: 15px; left: 20px;' },
    { id: 'glasses_monocle', name: 'Monocle', icon: '🧐', price: 600, type: 'glasses', style: 'font-size: 50px; top: 10px; left: 20px;' },
    { id: 'item_scarf', name: 'Écharpe', icon: '🧣', price: 400, type: 'item', style: 'font-size: 60px; top: 30px; left: 15px;' }
];

// ===== Storage Helpers =====
const save = (k, v) => localStorage.setItem("vp_" + k, JSON.stringify(v));
const load = (k, d) => { try { const v = localStorage.getItem("vp_" + k); return v ? JSON.parse(v) : d; } catch { return d; } };
const todayKey = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };

// ===== State Management =====
let lang = load("lang", "fr");
const T = () => I18N[lang];

const state = {
    name: load("name", "Valentina"),
    goal: load("goal", 10),
    stats: load("stats", {
        bestAll: 0,
        best: { math: 0, logic: 0, story: 0, mathTime: null },
        sessions: 0,
        badges: [],
        streak: 0,
        lastDay: "",
        history: [],
        level: 1, xp: 0,
        coins: 0,
        purchasedItems: [],
        petAccessories: { hat: null, glasses: null, item: null }
    }),
    theme: load("theme", PRESETS.ocean)
};

// ===== Error Handling =====
const errorBar = document.getElementById("errorBar");
function showErr(msg) {
    if (!errorBar) return;
    errorBar.style.display = "block";
    errorBar.textContent = msg;
}
window.addEventListener("error", (e) => showErr("JS ERROR:\n" + (e?.message || "Unknown")));
window.addEventListener("unhandledrejection", (e) => showErr("PROMISE ERROR:\n" + (e?.reason?.message || String(e?.reason || "Unknown"))));

// ===== Theme & Contrast Logic =====
function getLuminance(hexColor) {
    if (!hexColor || hexColor.length < 4) return 0;
    const rgb = parseInt(hexColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

function updateContrast(bgColor) {
    const root = document.documentElement.style;
    const lum = getLuminance(bgColor);
    if (lum > 0.5) { // Light background
        root.setProperty('--text', '#1a202c');
        root.setProperty('--muted', 'rgba(0, 0, 0, 0.55)');
        root.setProperty('--line', 'rgba(0, 0, 0, 0.1)');
    } else { // Dark background
        root.setProperty('--text', '#eef1ff');
        root.setProperty('--muted', 'rgba(238, 241, 255, 0.72)');
        root.setProperty('--line', 'rgba(255, 255, 255, 0.12)');
    }
}

const applyTheme = (t) => {
    const root = document.documentElement.style;
    root.setProperty("--accent", t.accent);
    root.setProperty("--accent2", t.accent2);
    root.setProperty("--bg0", t.bg0);
    root.setProperty("--bg1", t.bg1);
    updateContrast(t.bg1);
};
applyTheme(state.theme);

// ===== UI Helpers =====
const pct = (n) => `${Math.round(n)}%`;
const viewHome = document.getElementById("viewHome");
const viewMath = document.getElementById("viewMath");
const viewLogic = document.getElementById("viewLogic");
const viewStory = document.getElementById("viewStory");
const viewExam = document.getElementById("viewExam");

const show = (v) => {
    [viewHome, viewMath, viewLogic, viewStory, viewExam].forEach(x => x.classList.add("hidden"));
    v.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// ===== Generators =====
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const roundNear = (n) => n >= 5000 ? Math.round(n / 1000) * 1000 : n >= 500 ? Math.round(n / 100) * 100 : Math.round(n / 10) * 10;

// Dynamic Text Generators (Called on Render)
function explainMath(op, a, b, ans) {
    const isFr = (lang === "fr");
    let steps = "";

    // Strategy: Decompose (Split)
    if (op === "+" || op === "−") {
        // Split the second number (b) into tens and units
        const tens = Math.floor(b / 10) * 10;
        const units = b - tens;

        if (tens > 0 && units > 0) {
            const step1 = (op === "+") ? a + tens : a - tens;
            steps = isFr
                ? `<b>Stratégie : Décomposer</b><br>1. Décompose ${b} en <b>${tens}</b> + <b>${units}</b>.<br>2. ${op === "+" ? "Ajoute" : "Enlève"} les dizaines : ${a} ${op} ${tens} = <b>${step1}</b>.<br>3. ${op === "+" ? "Ajoute" : "Enlève"} les unités : ${step1} ${op} ${units} = <b>${ans}</b>.`
                : `<b>Strategie: Splitsen</b><br>1. Splits ${b} in <b>${tens}</b> + <b>${units}</b>.<br>2. ${op === "+" ? "Plus" : "Min"} de tientallen: ${a} ${op} ${tens} = <b>${step1}</b>.<br>3. ${op === "+" ? "Plus" : "Min"} de eenheden: ${step1} ${op} ${units} = <b>${ans}</b>.`;
        } else {
            steps = isFr ? "Calcul direct simple." : "Eenvoudige directe berekening.";
        }
    } else if (op === "×") {
        // Split 'a' if it's double digit
        if (a > 10) {
            const tens = Math.floor(a / 10) * 10;
            const units = a - tens;
            const p1 = tens * b;
            const p2 = units * b;
            steps = isFr
                ? `<b>Stratégie : Distribuer</b><br>1. Décompose ${a} en ${tens} + ${units}.<br>2. Multiplie chaque partie : (${tens} × ${b} = ${p1}) et (${units} × ${b} = ${p2}).<br>3. Additionne tout : ${p1} + ${p2} = <b>${ans}</b>.`
                : `<b>Strategie: Verdelen</b><br>1. Splits ${a} in ${tens} + ${units}.<br>2. Vermenigvuldig elk deel: (${tens} × ${b} = ${p1}) en (${units} × ${b} = ${p2}).<br>3. Tel alles op: ${p1} + ${p2} = <b>${ans}</b>.`;
        }
    } else if (op === "÷") {
        steps = isFr
            ? `<b>Stratégie : Inverse</b><br>Pense à la multiplication : <b>?</b> × ${b} = ${a}.<br>Ou décompose ${a} en morceaux faciles à diviser par ${b}.`
            : `<b>Strategie: Omgekeerde</b><br>Denk aan vermenigvuldigen: <b>?</b> × ${b} = ${a}.<br>Of splits ${a} in stukken die makkelijk te delen zijn door ${b}.`;
    }
    return steps;
}

// Data Generators (Called on Start)
function makeMath(level, mode, maxV) {
    let ops;
    if (mode !== 'mix') {
        const opChar = mode === 'divfocus' ? '÷' : mode === 'mulfocus' ? '×' : mode.replace('add', '+').replace('sub', '−');
        ops = [opChar];
    } else {
        if (level === 'easy') {
            ops = ['+', '+', '+', '+', '-', '-']; // 66% add, 33% sub
        } else if (level === 'hard') {
            ops = ['+', '-', '×', '×', '÷']; // 20% each, but more complex ops
        } else { // mid
            ops = ['+', '+', '-', '×', '÷']; // 40% add, 20% each for others
        }
    }
    const op = ops[rnd(0, ops.length - 1)];
    const cap = clamp(maxV, 100, 10000);
    const scale = (level === "easy") ? 0.35 : (level === "mid") ? 0.6 : 1.0;
    let a, b, ans, options = null;

    if (op === "+") { a = rnd(10, Math.floor(cap * scale)); b = rnd(10, Math.floor(cap * scale)); ans = a + b; }
    if (op === "−") { a = rnd(10, Math.floor(cap * scale)); b = rnd(10, Math.floor(cap * scale)); if (b > a) [a, b] = [b, a]; ans = a - b; }
    if (op === "×") { a = rnd(12, Math.min(999, Math.floor(cap * scale))); b = rnd(2, (level === "easy") ? 19 : (level === "mid") ? 49 : 99); ans = a * b; }
    if (op === "÷") {
        b = rnd(2, (level === "easy") ? 12 : (level === "mid") ? 25 : 60);
        const q = rnd(2, (level === "easy") ? 30 : (level === "mid") ? 120 : 250);
        a = b * q;
        if (a > cap) { const q2 = Math.max(2, Math.floor(cap / b)); a = b * q2; ans = q2; } else ans = q;
    }

    // Generate options for Math (Didactic: make it easier to select than type)
    const correct = ans;
    const distractors = new Set();
    while (distractors.size < 3) {
        let d = correct + rnd(-5, 5); // Close values
        if (d !== correct && d >= 0) distractors.add(d);
        if (distractors.size < 3) distractors.add(correct + rnd(10, 20)); // Fallback
    }
    options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    return { type: "math", op, a, b, ans, options };
}

function makeLogic(kind) {
    const pick = (arr) => arr[rnd(0, arr.length - 1)];
    const k = (kind === "mix") ? pick(["sequence", "odd", "rule", "color"]) : kind;
    let ans = "", options = null, data = {};

    if (k === "sequence") {
        const base = rnd(1, 9), step = pick([2, 3, 4, 5, 10]);
        const seq = Array.from({ length: 5 }, (_, i) => base + step * i);
        const miss = rnd(2, 4);
        const shown = seq.map((v, i) => i === miss ? "?" : v).join(", ");
        ans = String(seq[miss]);
        data = { shown, step };

        const correct = Number(ans);
        options = [correct, correct + step, correct - step, correct + step * 2].sort(() => Math.random() - 0.5);
    }

    if (k === "odd") {
        const set = pick([
            { items: ["2", "4", "6", "9", "8"], odd: "9", fr: "9 est impair.", nl: "9 is oneven." },
            { items: ["10", "20", "30", "35", "40"], odd: "35", fr: "35 n’est pas multiple de 10.", nl: "35 is geen veelvoud van 10." },
            { items: ["3", "6", "9", "12", "14"], odd: "14", fr: "14 n'est pas multiple de 3.", nl: "14 is geen veelvoud van 3." },
            { items: ["Carré", "Triangle", "Rond", "Cube"], odd: "Cube", fr: "Cube est 3D, les autres 2D.", nl: "Kubus is 3D, anderen 2D." },
            { items: ["Chien", "Chat", "Vache", "Requin"], odd: "Requin", fr: "Le requin vit dans l'eau.", nl: "De haai leeft in het water." },
            { items: ["Pomme", "Poire", "Banane", "Carotte"], odd: "Carotte", fr: "La carotte est un légume.", nl: "De wortel is een groente." },
            { items: ["Voiture", "Bus", "Vélo", "Avion"], odd: "Avion", fr: "L'avion vole.", nl: "Het vliegtuig vliegt." },
            { items: ["Janvier", "Février", "Mars", "Lundi"], odd: "Lundi", fr: "Lundi est un jour.", nl: "Lundi is een dag." },
            { items: ["Football", "Tennis", "Basket", "Guitare"], odd: "Guitare", fr: "Guitare est un instrument.", nl: "Gitaar is een instrument." }
        ]);
        ans = set.odd;
        data = { items: set.items, frMeta: set.fr, nlMeta: set.nl };
        options = set.items;
    }

    if (k === "rule") {
        const rule = pick([
            { fr: "×2 puis +1", nl: "×2 dan +1", f: (x) => x * 2 + 1 },
            { fr: "+3", nl: "+3", f: (x) => x + 3 },
            { fr: "Moitié", nl: "Helft", f: (x) => x / 2 },
            { fr: "Moins 5", nl: "Min 5", f: (x) => x - 5 },
            { fr: "Fois 10", nl: "Keer 10", f: (x) => x * 10 }
        ]);
        const x = (rule.fr === "Moitié") ? rnd(2, 20) * 2 : rnd(2, 9);
        ans = String(rule.f(x));
        data = { ruleFr: rule.fr, ruleNl: rule.nl, x };

        const correct = Number(ans);
        options = [correct, correct + 1, correct - 1, correct * 2].sort(() => Math.random() - 0.5);
    }

    if (k === "color") {
        const mix = pick([
            { qFr: "Rouge + Jaune", qNl: "Rood + Geel", ansFr: "Orange", ansNl: "Oranje", opts: ["Orange", "Vert", "Violet"] },
            { qFr: "Bleu + Jaune", qNl: "Blauw + Geel", ansFr: "Vert", ansNl: "Groen", opts: ["Vert", "Orange", "Violet"] },
            { qFr: "Rouge + Bleu", qNl: "Rood + Blauw", ansFr: "Violet", ansNl: "Paars", opts: ["Violet", "Vert", "Orange"] },
            { qFr: "Blanc + Noir", qNl: "Wit + Zwart", ansFr: "Gris", ansNl: "Grijs", opts: ["Gris", "Rose", "Marron"] },
            { qFr: "Rouge + Blanc", qNl: "Rood + Wit", ansFr: "Rose", ansNl: "Roze", opts: ["Rose", "Gris", "Orange"] }
        ]);
        ans = (lang === "fr") ? mix.ansFr : mix.ansNl; // Initial ans, will update on render
        data = { mix };
        options = mix.opts; // Placeholder, updated in render
    }

    return { type: "logic", subtype: k, data, ans, options };
}

function makeStory(theme) {
    const pick = (arr) => arr[rnd(0, arr.length - 1)];
    const t = (theme === "mix") ? pick(["swim", "boxes", "school", "shop", "cinema", "garden", "cooking"]) : theme;
    let ans = 0, data = {};

    if (t === "swim") {
        const kids = rnd(120, 900), days = 5; ans = kids * days;
        data = { kids, days };
    }
    if (t === "boxes") {
        const candies = pick([48, 60, 63, 80, 96, 100, 120]);
        const per = pick([2, 3, 4, 5, 6, 8, 10]);
        const qv = Math.floor(candies / per);
        const r = candies - qv * per;
        ans = (r === 0) ? qv : r;
        data = { candies, per, isDiv: (r === 0) };
    }
    if (t === "school") {
        const a = rnd(1000, 9000), b = rnd(1000, 9000); const big = Math.max(a, b), small = Math.min(a, b); ans = big - small;
        data = { big, small };
    }
    if (t === "shop") {
        const price = rnd(2, 9), qty = rnd(3, 12); ans = price * qty;
        data = { price, qty };
    }
    if (t === "cinema") {
        const price = rnd(8, 12), pop = rnd(4, 7); ans = 2 * (price + pop);
        data = { price, pop };
    }
    if (t === "garden") {
        const rows = rnd(4, 9), perRow = rnd(6, 12); ans = rows * perRow;
        data = { rows, perRow };
    }
    if (t === "cooking") {
        const perCake = rnd(2, 4), cakes = rnd(3, 6); ans = perCake * cakes;
        data = { perCake, cakes };
    }
    return { type: "story", subtype: t, data, ans };
}

// ===== Translation & Text Generation =====
function getProblemText(p) {
    const isFr = (lang === "fr");
    let q = "", hint = "", meta = "", methods = "", options = p.options;

    if (p.type === "math") {
        q = `${p.a} ${p.op} ${p.b}`;
        if (p.op === "+") hint = `${roundNear(p.a)} + ${roundNear(p.b)} ≈ <b>${roundNear(p.a) + roundNear(p.b)}</b>`;
        if (p.op === "−") hint = `${roundNear(p.a)} − ${roundNear(p.b)} ≈ <b>${roundNear(p.a) - roundNear(p.b)}</b>`;
        if (p.op === "×") hint = `${roundNear(p.a)} × ${roundNear(p.b)} ≈ <b>${roundNear(p.a) * roundNear(p.b)}</b>`;
        if (p.op === "÷") {
            meta = isFr ? "Division exacte." : "Exacte deling.";
            hint = `${roundNear(p.a)} ÷ ${roundNear(p.b)} ≈ <b>${Math.floor(roundNear(p.a) / roundNear(p.b))}</b>`;
        }
        methods = explainMath(p.op, p.a, p.b, p.ans);
    }
    else if (p.type === "logic") {
        if (p.subtype === "sequence") {
            q = isFr ? `Complète: ${p.data.shown}` : `Vul aan: ${p.data.shown}`;
            hint = isFr ? `Différence: ${p.data.step}` : `Verschil: ${p.data.step}`;
        }
        if (p.subtype === "odd") {
            q = isFr ? `L'intrus: ${p.data.items.join(", ")}` : `De intrus: ${p.data.items.join(", ")}`;
            meta = isFr ? p.data.frMeta : p.data.nlMeta;
            hint = isFr ? "Cherche une règle." : "Zoek een regel.";
        }
        if (p.subtype === "rule") {
            const r = isFr ? p.data.ruleFr : p.data.ruleNl;
            q = isFr ? `Règle: ${r}. Si x = ${p.data.x}?` : `Regel: ${r}. Als x = ${p.data.x}?`;
            hint = isFr ? "Applique la règle." : "Pas de regel toe.";
        }
        if (p.subtype === "color") {
            q = `${T().logic_color_q} ${isFr ? p.data.mix.qFr : p.data.mix.qNl}`;
            hint = T().logic_color_hint;
            // Update options/ans based on language for this specific type
            p.ans = isFr ? p.data.mix.ansFr : p.data.mix.ansNl;
            options = isFr ? ["Orange", "Vert", "Violet"] : ["Oranje", "Groen", "Paars"]; // Simplified for demo
        }
    }
    else if (p.type === "story") {
        const d = p.data;
        if (p.subtype === "swim") {
            q = isFr ? `Stage: ${d.kids} enfants, 5 jours. Total tickets?` : `Kamp: ${d.kids} kinderen, 5 dagen. Totaal tickets?`;
            hint = `${d.kids} × 5`;
        }
        if (p.subtype === "boxes") {
            if (d.isDiv) {
                q = isFr ? `${d.candies} bonbons, boîtes de ${d.per}. Combien?` : `${d.candies} snoepjes, doosjes van ${d.per}. Hoeveel?`;
                hint = `${d.candies} ÷ ${d.per}`;
            } else {
                q = isFr ? `${d.candies} bonbons, boîtes de ${d.per}. Reste?` : `${d.candies} snoepjes, doosjes van ${d.per}. Rest?`;
                hint = `Reste de ${d.candies} ÷ ${d.per}`;
            }
        }
        if (p.subtype === "school") {
            q = isFr ? `A: ${d.big}, B: ${d.small}. Différence?` : `A: ${d.big}, B: ${d.small}. Verschil?`;
            hint = `${d.big} − ${d.small}`;
        }
        if (p.subtype === "shop") {
            q = isFr ? `Jus ${d.price}€, qté ${d.qty}. Total?` : `Sap ${d.price}€, aant ${d.qty}. Totaal?`;
            hint = `${d.qty} × ${d.price}`;
        }
        if (p.subtype === "cinema") {
            q = T().story_cinema_q(d.price, d.pop);
            hint = T().story_cinema_hint;
        }
        if (p.subtype === "garden") {
            q = isFr ? `Jardin: ${d.rows} rangées de ${d.perRow} fleurs. Total?` : `Tuin: ${d.rows} rijen van ${d.perRow} bloemen. Totaal?`;
            hint = `${d.rows} × ${d.perRow}`;
        }
        if (p.subtype === "cooking") {
            q = isFr ? `Cuisine: ${d.cakes} gâteaux, ${d.perCake} œufs chacun. Total œufs?` : `Keuken: ${d.cakes} taarten, ${d.perCake} eieren elk. Totaal eieren?`;
            hint = `${d.cakes} × ${d.perCake}`;
        }
    }

    return { title: `${p.type === 'math' ? '' : 'Q: '}${q}`, meta, hint, methods, options };
}

// ===== Rendering =====
function renderProblem(container, p, idx) {
    const card = document.createElement("div");
    card.className = "q";

    // Generate text dynamically based on current language
    const txt = getProblemText(p);

    let inputHtml = "";
    if (txt.options && txt.options.length > 0) {
        // Multiple Choice
        inputHtml = `<div class="optionsGrid" data-i="${idx}">
      ${txt.options.map(opt => `<div class="optionBtn" onclick="selectOption(this, ${idx}, '${opt}')">${opt}</div>`).join("")}
    </div><input type="hidden" data-i="${idx}" />`;
    } else {
        // Text Input
        inputHtml = `<input data-i="${idx}" placeholder="${lang === "fr" ? "Ta réponse" : "Jouw antwoord"}" inputmode="numeric"/>`;
    }

    card.innerHTML = `
    <div class="qhead">
      <div>
        <div class="qtitle">${idx + 1} — ${txt.title}</div>
        <div class="qmeta">${txt.meta || ""}</div>
      </div>
    </div>
    <div class="answerRow">
      ${inputHtml}
      <span class="badge" data-status="${idx}">—</span>
    </div>
    <details><summary>${lang === "fr" ? "Indice" : "Hint"}</summary><div class="content">${txt.hint || ""}</div></details>
    ${txt.methods ? `<details><summary>${lang === "fr" ? "Méthodes faciles" : "Makkelijke methodes"}</summary><div class="content">${txt.methods}</div></details>` : ""}
    <details><summary>${lang === "fr" ? "Solution" : "Oplossing"}</summary><div class="content"><b>= ${p.ans}</b></div></details>
  `;
    container.appendChild(card);
}

// Helper for selection
window.selectOption = (btn, idx, val) => {
    const container = btn.parentElement;
    container.querySelectorAll(".optionBtn").forEach(b => b.classList.remove("selected"));
    btn.classList.add("selected");
    document.querySelector(`input[type="hidden"][data-i="${idx}"]`).value = val;
};

function check(container, probs) {
    let ok = 0, bad = 0;
    probs.forEach((p, idx) => {
        const input = container.querySelector(`input[data-i="${idx}"]`);
        const badge = container.querySelector(`[data-status="${idx}"]`);
        const raw = (input?.value || "").trim();
        let correct = false;
        if (/^[-]?\d+([.,]\d+)?$/.test(raw)) {
            const v = Number(raw.replace(",", "."));
            correct = (v == p.ans); // loose equality for string/number mix
        } else {
            // String match (e.g. "Cube")
            correct = (raw.toLowerCase() === String(p.ans).toLowerCase());
        }
        p._correct = correct;
        if (correct) { ok++; badge.textContent = "✔"; badge.className = "badge ok"; }
        else { bad++; badge.textContent = "✘"; badge.className = "badge bad"; }
    });
    const scorePct = probs.length ? Math.round(ok / probs.length * 100) : 0;
    return { ok, bad, scorePct };
}

function retryWrong(probs) {
    return probs.filter(p => !p._correct).map(p => { const c = { ...p }; delete c._correct; return c; });
}

// ===== Session Logic =====
const xpForLevel = (level) => level * 100;

function checkBadges(context) {
    const st = state.stats;
    if (!st.badges) st.badges = [];
    let newBadge = false;

    BADGES.forEach(b => {
        if (!st.badges.includes(b.id)) {
            if (b.check(st, context)) {
                st.badges.push(b.id);
                showBadgeToast(b);
                newBadge = true;
            }
        }
    });

    if (newBadge) {
        save("stats", st);
        renderDashboard();
    }
}

function showBadgeToast(badge) {
    const t = document.getElementById("badgeToast");
    t.querySelector(".badgeToastIcon").textContent = badge.icon;
    t.querySelector(".badgeToastTitle").textContent = badge.title;
    t.querySelector(".badgeToastDesc").textContent = badge.desc;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 4000);
    // Play sound if available
    // const audio = new Audio('ding.mp3'); audio.play().catch(()=>{});
}

function addXp(amount) {
    if (!amount || amount <= 0) return;
    state.stats.xp += amount;

    const oldLevel = state.stats.level;
    let requiredXp = xpForLevel(state.stats.level);
    while (state.stats.xp >= requiredXp) {
        state.stats.xp -= requiredXp;
        state.stats.level++;
        requiredXp = xpForLevel(state.stats.level);
    }

    if (state.stats.level > oldLevel) {
        openLevelUp(state.stats.level);
    }
    renderXpAndLevel(); // Update UI after XP change
    renderPet(); // Check if pet evolves
    checkBadges(); // Check level based badges
}

let sessionStreak = 0;
function updateFireStreak(isCorrect) {
    if (isCorrect) {
        sessionStreak++;
    } else {
        sessionStreak = 0;
    }
    const w = document.getElementById("fireWidget");
    document.getElementById("fireCount").textContent = sessionStreak;
    if (sessionStreak >= 5) w.classList.add("onFire");
    else w.classList.remove("onFire");
}

function updateStreak() {
    const st = state.stats, today = todayKey();
    if (st.lastDay === today) return;
    if (!st.lastDay) st.streak = 1;
    else {
        const prev = new Date(st.lastDay), now = new Date(today);
        const diff = Math.round((now - prev) / (1000 * 60 * 60 * 24));
        st.streak = (diff === 1) ? st.streak + 1 : 1;
    }
    st.lastDay = today;
}

function finishSession(label, key, res, count) {
    const st = state.stats;
    st.sessions++;
    updateStreak();

    // Add XP for correct answers
    addXp(res.ok * XP_PER_CORRECT_ANSWER);
    addCoins(res.ok * COINS_PER_CORRECT_ANSWER);
    updateFireStreak(res.ok === count); // Only boost streak if perfect? Or per question? Let's keep simple: session perfect

    st.best[key] = Math.max(st.best[key] || 0, res.scorePct);
    st.bestAll = Math.max(st.bestAll || 0, res.scorePct);
    st.history.push({ category: label, date: todayKey(), score: res.scorePct, ok: res.ok, count });
    save("stats", st);

    checkBadges({ type: key, score: res.scorePct, time: (key === 'math' && mathStartTime) ? (Date.now() - mathStartTime) / 1000 : 0 });

    renderDashboard();
    renderCards();
}

// ===== View Controllers =====
let mathP = [], logicP = [], storyP = [];
let examP = [], examLives = 3; // Exam state
let mathTimerInterval = null, mathStartTime = 0; // Timer variables
const mathList = document.getElementById("mathList");
const logicList = document.getElementById("logicList");
const storyList = document.getElementById("storyList");
const examList = document.getElementById("examList");

function generateUnique(count, generatorFn) {
    const result = [];
    const signatures = new Set();
    let attempts = 0;
    while (result.length < count && attempts < count * 5) {
        const p = generatorFn();
        let sig = p.type + "|" + p.subtype;
        if (p.type === 'math') {
            sig += `|${p.op}|${p.a}|${p.b}`;
        } else if (p.type === 'logic') {
            if (p.subtype === 'sequence') sig += `|${p.data.shown}`;
            else if (p.subtype === 'odd') sig += `|${p.data.items.join(',')}`;
            else if (p.subtype === 'rule') sig += `|${p.data.ruleFr}|${p.data.x}`;
            else if (p.subtype === 'color') sig += `|${p.data.mix.qFr}`;
        } else if (p.type === 'story') {
            sig += `|${JSON.stringify(p.data)}`;
        }
        if (!signatures.has(sig)) { signatures.add(sig); result.push(p); }
        attempts++;
    }
    return result;
}

function resetSessionState(listEl, scoreEl, okEl, badEl, timerEl) {
    listEl.innerHTML = `<div style="text-align:center; padding: 20px; color: var(--muted);">...</div>`;
    if (scoreEl) scoreEl.textContent = "—";
    if (okEl) okEl.textContent = "—";
    if (badEl) badEl.textContent = "—";
    if (timerEl) {
        clearInterval(mathTimerInterval);
        timerEl.textContent = "00:00";
    }
}

function fadeAndRegenerate(listEl, generatorFn) {
    listEl.style.opacity = 0;
    setTimeout(() => {
        const problems = generatorFn();
        listEl.innerHTML = "";
        problems.forEach((p, i) => renderProblem(listEl, p, i));
        listEl.style.opacity = 1;
        return problems;
    }, 200);
}

const updateMathTimer = () => {
    const elapsedSeconds = Math.round((Date.now() - mathStartTime) / 1000);
    document.getElementById("mathTimer").textContent = formatTime(elapsedSeconds);
};

function setupControllers() {
    // Math
    document.getElementById("startMath").onclick = () => {
        const count = Number(document.getElementById("mathCount").value || 20);
        const maxV = clamp(Number(document.getElementById("mathMax").value || 10000), 100, 10000);
        const level = document.getElementById("mathLevel").value;
        const mode = document.getElementById("mathMode").value;
        mathP = generateUnique(count, () => makeMath(level, mode, maxV));
        mathList.innerHTML = ""; mathP.forEach((p, i) => renderProblem(mathList, p, i));
        document.getElementById("mathScore").textContent = "—";
        document.getElementById("mathBestTime").textContent = state.stats.best.mathTime ? formatTime(state.stats.best.mathTime) : "—";

        // Timer start
        clearInterval(mathTimerInterval);
        mathStartTime = Date.now();
        document.getElementById("mathTimer").textContent = "00:00";
        mathTimerInterval = setInterval(updateMathTimer, 1000);
    };
    document.getElementById("checkMath").onclick = () => {
        // Timer stop
        clearInterval(mathTimerInterval);
        const elapsedSeconds = Math.round((Date.now() - mathStartTime) / 1000);
        document.getElementById("mathTimer").textContent = formatTime(elapsedSeconds);

        const res = check(mathList, mathP);
        document.getElementById("mathScore").textContent = res.scorePct + "%";
        document.getElementById("mathOk").textContent = res.ok;
        document.getElementById("mathBad").textContent = res.bad;
        document.getElementById("mathBest2").textContent = pct(state.stats.best.math || 0);

        // Fire Streak Logic (Per question check for immediate feedback would be better, but here we check batch)
        // Let's assume if score is 100%, streak increases by count. If not, reset.
        if (res.scorePct === 100) sessionStreak += mathP.length;
        else sessionStreak = 0;
        updateFireStreak(sessionStreak > 0);

        // Check for new best time if score is 100%
        if (res.scorePct === 100 && (!state.stats.best.mathTime || elapsedSeconds < state.stats.best.mathTime)) {
            state.stats.best.mathTime = elapsedSeconds;
        }
        document.getElementById("mathBestTime").textContent = state.stats.best.mathTime ? formatTime(state.stats.best.mathTime) : "—";
        finishSession("Math", "math", res, mathP.length);
    };
    document.getElementById("retryMath").onclick = () => {
        mathP = retryWrong(mathP);
        mathList.innerHTML = ""; mathP.forEach((p, i) => renderProblem(mathList, p, i));
    };
    document.getElementById("backFromMath").onclick = () => show(viewHome);

    function regenerateLogicExercises() {
        resetSessionState(logicList, document.getElementById("logicScore"), document.getElementById("logicOk"), document.getElementById("logicBad"));
        fadeAndRegenerate(logicList, () => {
            const count = Number(document.getElementById("logicCount").value || 20);
            const kind = document.getElementById("logicKind").value;
            logicP = generateUnique(count, () => makeLogic(kind));
            return logicP;
        });
    }
    document.getElementById("startLogic").onclick = regenerateLogicExercises;
    ["logicCount", "logicKind"].forEach(id => document.getElementById(id).addEventListener("change", regenerateLogicExercises));
    document.getElementById("checkLogic").onclick = () => {
        const res = check(logicList, logicP);
        document.getElementById("logicScore").textContent = res.scorePct + "%";
        document.getElementById("logicOk").textContent = res.ok;
        document.getElementById("logicBad").textContent = res.bad;
        document.getElementById("logicBest2").textContent = pct(state.stats.best.logic || 0);
        finishSession("Logic", "logic", res, logicP.length);
    };
    document.getElementById("retryLogic").onclick = () => {
        logicP = retryWrong(logicP);
        logicList.innerHTML = ""; logicP.forEach((p, i) => renderProblem(logicList, p, i));
    };
    document.getElementById("backFromLogic").onclick = () => show(viewHome);

    function regenerateStoryExercises() {
        resetSessionState(storyList, document.getElementById("storyScore"), document.getElementById("storyOk"), document.getElementById("storyBad"));
        fadeAndRegenerate(storyList, () => {
            const count = Number(document.getElementById("storyCount").value || 12);
            const theme = document.getElementById("storyTheme").value;
            storyP = generateUnique(count, () => makeStory(theme));
            return storyP;
        });
    }
    document.getElementById("startStory").onclick = regenerateStoryExercises;
    ["storyCount", "storyTheme"].forEach(id => document.getElementById(id).addEventListener("change", regenerateStoryExercises));
    document.getElementById("checkStory").onclick = () => {
        const res = check(storyList, storyP);
        document.getElementById("storyScore").textContent = res.scorePct + "%";
        document.getElementById("storyOk").textContent = res.ok;
        document.getElementById("storyBad").textContent = res.bad;
        document.getElementById("storyBest2").textContent = pct(state.stats.best.story || 0);
        finishSession("Story", "story", res, storyP.length);
    };
    document.getElementById("retryStory").onclick = () => {
        storyP = retryWrong(storyP);
        storyList.innerHTML = ""; storyP.forEach((p, i) => renderProblem(storyList, p, i));
    };
    document.getElementById("backFromStory").onclick = () => show(viewHome);

    // Exam (Surprise)
    document.getElementById("startExam").onclick = () => {
        const lvl = document.getElementById("examLevel").value;
        // Mix: 8 Math, 8 Logic, 4 Story
        examP = generateUnique(8, () => makeMath(lvl, "mix", (lvl === "easy" ? 100 : 1000)));
        examP.push(...generateUnique(8, () => makeLogic("mix")));
        examP.push(...generateUnique(4, () => makeStory("mix")));
        // Shuffle
        examP.sort(() => Math.random() - 0.5);

        examList.innerHTML = "";
        examP.forEach((p, i) => renderProblem(examList, p, i));
        document.getElementById("examScore").textContent = "—";

        // Reset lives
        examLives = 3;
        renderLives(examLives);
        document.getElementById("checkExam").disabled = false;
    };
    document.getElementById("checkExam").onclick = () => {
        if (examLives <= 0) return;

        const res = check(examList, examP);
        const livesLost = res.bad;
        const oldLives = examLives;
        examLives = Math.max(0, examLives - livesLost);
        renderLives(examLives, oldLives);

        document.getElementById("examScore").textContent = res.scorePct + "%";
        document.getElementById("examOk").textContent = res.ok;
        document.getElementById("examBad").textContent = res.bad;

        finishSession("Exam", "exam", res, examP.length);

        if (examLives <= 0) {
            document.getElementById("gameOverBack").style.display = "flex";
            document.getElementById("checkExam").disabled = true;
        }
    };
    document.getElementById("backFromExam").onclick = () => show(viewHome);

    // Custom Practice Start
    const startCustomBtn = document.getElementById("startCustom");
    if (startCustomBtn) startCustomBtn.onclick = () => {
        const type = document.getElementById("custType")?.value || "math";
        const count = Number(document.getElementById("custCount")?.value || 12);
        const max = Number(document.getElementById("custMax")?.value || 1000);
        const op = document.getElementById("custOp")?.value || "mix";

        // Reuse Math View for custom session
        mathP = [];
        if (type === "math") {
            const mode = (op === "mix") ? "mix" : (op === "div") ? "divfocus" : (op === "mul") ? "mulfocus" : "mix"; // Simplified mapping
            mathP = generateUnique(count, () => makeMath("mid", mode, max));
            show(viewMath);
            mathList.innerHTML = ""; mathP.forEach((p, i) => renderProblem(mathList, p, i));
            const cb = document.getElementById("customBack");
            if (cb) cb.style.display = "none";
        } else {
            // Logic custom... (simplified for now, redirects to logic view)
            show(viewLogic);
            const cb = document.getElementById("customBack");
            if (cb) cb.style.display = "none";
            document.getElementById("startLogic").click();
        }
    };
}

// ===== Level Up & Effects =====
const levelUpBack = document.getElementById("levelUpBack");
function openLevelUp(lvl) {
    document.getElementById("ui_newLevel").textContent = lvl;
    levelUpBack.style.display = "flex";
    spawnConfetti();
}
document.getElementById("closeLevelUp").onclick = () => levelUpBack.style.display = "none";

function spawnConfetti() {
    const colors = ["#ff5b6e", "#35d07f", "#4c6fff", "#ffcc66", "#8a5bff", "#00d4ff"];
    for (let i = 0; i < 60; i++) {
        const c = document.createElement("div");
        c.className = "confetti";
        c.style.left = Math.random() * 100 + "vw";
        c.style.top = -10 + "px";
        c.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        const size = Math.random() * 8 + 6;
        c.style.width = size + "px";
        c.style.height = size + "px";
        c.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";

        c.style.animationDuration = (Math.random() * 2 + 1.5) + "s";
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 4000);
    }
}

function renderLives(current, initial = 3) {
    const container = document.getElementById("examLivesContainer");
    if (!container) return;
    container.innerHTML = '';
    for (let i = 1; i <= 3; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart';
        heart.textContent = '❤️';
        if (i > current) heart.classList.add('lost');
        if (i > current && i <= initial) {
            setTimeout(() => heart.classList.add('shake'), (i - current) * 200);
        }
        container.appendChild(heart);
    }
}

// ===== Main Render & Init =====
function renderXpAndLevel() {
    const st = state.stats;
    const level = st.level || 1;
    const currentXp = st.xp || 0;
    const requiredXp = xpForLevel(level);
    const progress = requiredXp > 0 ? (currentXp / requiredXp) * 100 : 0;

    document.getElementById("levelPill").textContent = level;
    document.getElementById("xpBarInner").style.width = `${Math.min(100, progress)}%`;
}

function renderCoins() {
    const balance = state.stats.coins || 0;
    document.getElementById("coinBalance").textContent = balance;
}

function renderPet() {
    const lvl = state.stats.level || 1;
    const stages = [
        { min: 1, icon: "🥚", nameIdx: 0, next: 5 },
        { min: 5, icon: "🐣", nameIdx: 1, next: 10 },
        { min: 10, icon: "🐇", nameIdx: 2, next: 20 },
        { min: 20, icon: "🦊", nameIdx: 3, next: 30 },
        { min: 30, icon: "🦄", nameIdx: 4, next: 50 },
        { min: 50, icon: "🐉", nameIdx: 5, next: 999 }
    ];

    // Find current stage
    let current = stages[0];
    for (let s of stages) {
        if (lvl >= s.min) current = s;
    }

    const avatarContainer = document.getElementById("petAvatar");
    avatarContainer.innerHTML = ''; // Clear first

    const basePet = document.createElement('span');
    basePet.textContent = current.icon;
    avatarContainer.appendChild(basePet);

    // Render accessories
    for (const type in state.stats.petAccessories) {
        const itemId = state.stats.petAccessories[type];
        if (itemId) {
            const itemData = SHOP_ITEMS.find(i => i.id === itemId);
            if (itemData) {
                const accessoryEl = document.createElement('span');
                accessoryEl.className = 'petAccessory';
                accessoryEl.textContent = itemData.icon;
                accessoryEl.style.cssText = itemData.style;
                avatarContainer.appendChild(accessoryEl);
            }
        }
    }

    document.getElementById("petName").textContent = T().pet_stages[current.nameIdx];

    const statusText = (current.next === 999) ? T().pet_max : T().pet_status(lvl, current.next);
    document.getElementById("petStatus").textContent = statusText;
}

function renderDashboard() {
    const st = state.stats;
    document.getElementById("kpiBest").textContent = pct(st.bestAll || 0);
    document.getElementById("kpiStreak").textContent = String(st.streak || 0);
    document.getElementById("kpiSessions").textContent = String(st.sessions || 0);
    document.getElementById("kpiBadges").textContent = String((st.badges || []).length);
    document.getElementById("bestAllPill").textContent = pct(st.bestAll || 0);
    document.getElementById("streakPill").textContent = String(st.streak || 0);

    const hist = (st.history || []).slice(-10).reverse();
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = "";
    if (hist.length === 0) {
        const d = document.createElement("div");
        d.className = "histItem";
        d.innerHTML = `<span>${lang === "fr" ? "Pas encore de sessions." : "Nog geen sessies."}</span>`;
        historyList.appendChild(d);
    } else {
        hist.forEach(h => {
            const d = document.createElement("div");
            d.className = "histItem";
            d.innerHTML = `<span><b>${h.category}</b> • ${h.date} • ${h.count}</span><span><b>${h.score}%</b> (${h.ok}/${h.count})</span>`;
            historyList.appendChild(d);
        });
    }
}

function renderCards() {
    const box = document.getElementById("moduleCards");
    box.innerHTML = "";
    const c = T().cards;
    const mkBtn = (id, txt, isPrimary = true) => `<button class="${isPrimary ? 'btnPrimary' : ''}" id="${id}" style="font-size:11px; padding:8px 12px">${txt}</button>`;

    const mk = (tag, title, desc, btnId) => `
    <div class="card">
      <div class="tag">${tag}</div>
      <h3>${title}</h3>
      <p>${desc}</p>
      <div class="cta" style="justify-content:space-between; width:100%; margin-top: auto;">
        <div style="display:flex; gap:6px">
            ${mkBtn(btnId, btnId === 'goCustom' ? T().create : T().enter)}
            ${btnId !== 'goExam' && btnId !== 'goCustom' ? mkBtn(btnId + 'Test', T().test, false) : ''}
        </div>
        ${btnId !== 'goCustom' ? `<span class="pill" style="font-size:10px">${T().record}: <b>${pct(state.stats.best[
        btnId.includes("Math") ? "math" :
            btnId.includes("Logic") ? "logic" :
                btnId.includes("Story") ? "story" : "exam"
    ] || 0)}</b></span>` : ''}
      </div>
    </div>`;
    box.insertAdjacentHTML("beforeend", mk(c.mTag, c.mTitle, c.mDesc, "goMath"));
    box.insertAdjacentHTML("beforeend", mk(c.lTag, c.lTitle, c.lDesc, "goLogic"));
    box.insertAdjacentHTML("beforeend", mk(c.sTag, c.sTitle, c.sDesc, "goStory"));
    box.insertAdjacentHTML("beforeend", mk("Mix", T().exam_title, T().exam_desc, "goExam"));
    box.insertAdjacentHTML("beforeend", mk("Perso", T().workshop_title, "Crée tes exercices.", "goCustom"));

    document.getElementById("goMath").onclick = () => show(viewMath);
    document.getElementById("goLogic").onclick = () => show(viewLogic);
    document.getElementById("goStory").onclick = () => show(viewStory);
    document.getElementById("goExam").onclick = () => show(viewExam);

    // Specific Test Buttons (Quick Exam Mode per topic)
    document.getElementById("goMathTest").onclick = () => { show(viewMath); document.getElementById("startMath").click(); };
    document.getElementById("goLogicTest").onclick = () => { show(viewLogic); document.getElementById("startLogic").click(); };
    document.getElementById("goStoryTest").onclick = () => { show(viewStory); document.getElementById("startStory").click(); };
    document.getElementById("openShopBtn").onclick = () => { renderShop(); document.getElementById("shopBack").style.display = 'flex'; };

    // Custom Practice
    const custBack = document.getElementById("customBack");
    const goCustomBtn = document.getElementById("goCustom");
    const closeCustomBtn = document.getElementById("closeCustom");
    if (goCustomBtn && custBack) goCustomBtn.onclick = () => custBack.style.display = "flex";
    if (closeCustomBtn && custBack) closeCustomBtn.onclick = () => custBack.style.display = "none";
}

function renderBadgesModal() {
    const grid = document.getElementById("badgeGrid");
    grid.innerHTML = "";
    const unlocked = state.stats.badges || [];
    BADGES.forEach(b => {
        const isUnlocked = unlocked.includes(b.id);
        const div = document.createElement("div");
        div.className = `badgeItem ${isUnlocked ? "unlocked" : ""}`;
        div.innerHTML = `<span class="badgeIcon">${b.icon}</span><span class="badgeTitle">${b.title}</span>`;
        grid.appendChild(div);
    });
}

function applyLang() {
    document.getElementById("ui_title").textContent = T().title;
    document.getElementById("ui_subtitle").textContent = T().subtitle;
    document.getElementById("ui_userPill").textContent = T().user(state.name);
    document.getElementById("homeBtn").textContent = T().dash;
    document.getElementById("ui_bestPill").textContent = T().record;
    document.getElementById("ui_streakPill").textContent = T().streak;
    document.getElementById("langBtn").textContent = (lang === "fr") ? "FR → NL" : "NL → FR";

    document.getElementById("ui_s_time").textContent = T().time;
    document.getElementById("ui_s_best_time").textContent = T().best_time;

    document.getElementById("ui_exam_dash").textContent = T().exam_title;
    document.getElementById("ui_exam_dash_meta").textContent = T().exam_desc;

    document.getElementById("ui_gameOverTitle").textContent = T().game_over_title;
    document.getElementById("ui_gameOverText").textContent = T().game_over_text;

    document.getElementById("ui_gameOverTitle").textContent = T().game_over_title;
    document.getElementById("ui_gameOverText").textContent = T().game_over_text;

    // Re-render active lists to update text
    if (!viewMath.classList.contains("hidden") && mathP.length) { mathList.innerHTML = ""; mathP.forEach((p, i) => renderProblem(mathList, p, i)); }
    if (!viewLogic.classList.contains("hidden") && logicP.length) { logicList.innerHTML = ""; logicP.forEach((p, i) => renderProblem(logicList, p, i)); }
    if (!viewStory.classList.contains("hidden") && storyP.length) { storyList.innerHTML = ""; storyP.forEach((p, i) => renderProblem(storyList, p, i)); }
    if (!viewExam.classList.contains("hidden") && examP.length) { examList.innerHTML = ""; examP.forEach((p, i) => renderProblem(examList, p, i)); }

    renderCards();
    renderDashboard();
    renderWeeklyChart();
    renderPet();
}

function autoTheme() {
    const h = new Date().getHours();
    // Day mode between 8 AM and 8 PM (20:00)
    if (h >= 8 && h < 20) {
        // Apply Day theme temporarily (or permanently if we want to override)
        // For now, let's just apply it without saving to state so user preference returns at night
        applyTheme(PRESETS.day);
    } else {
        applyTheme(state.theme); // Re-apply user preference (likely dark)
    }
}

const findPresetNameByTheme = (theme) => {
    for (const name in PRESETS) {
        const p = PRESETS[name];
        if (p.accent === theme.accent && p.accent2 === theme.accent2 && p.bg0 === theme.bg0 && p.bg1 === theme.bg1) {
            return name;
        }
    }
    return null;
}

// ===== Initialization =====
document.getElementById("langBtn").addEventListener("click", () => { lang = (lang === "fr") ? "nl" : "fr"; save("lang", lang); applyLang(); });
document.getElementById("homeBtn").addEventListener("click", () => show(viewHome));

// Theme Modal
const themeBack = document.getElementById("themeBack");
const themeInputs = ["accentPick", "accent2Pick", "bg0Pick", "bg1Pick"];
document.getElementById("themeBtn").onclick = () => {
    document.getElementById("accentPick").value = state.theme.accent;
    document.getElementById("accent2Pick").value = state.theme.accent2;
    document.getElementById("bg0Pick").value = state.theme.bg0;
    document.getElementById("bg1Pick").value = state.theme.bg1;

    document.querySelectorAll(".preset").forEach(p => p.classList.remove("activeTheme"));
    const activePresetName = findPresetNameByTheme(state.theme);
    if (activePresetName) {
        const activeEl = document.querySelector(`.preset[data-preset="${activePresetName}"]`);
        if (activeEl) activeEl.classList.add("activeTheme");
    }
    themeBack.style.display = "flex";
};
document.getElementById("closeTheme").onclick = () => themeBack.style.display = "none";
themeBack.addEventListener("click", (e) => { if (e.target === themeBack) themeBack.style.display = "none"; });
document.querySelectorAll(".preset").forEach(el => {
    el.onclick = () => {
        const p = PRESETS[el.dataset.preset]; if (!p) return;
        document.getElementById("accentPick").value = p.accent;
        document.getElementById("accent2Pick").value = p.accent2;
        document.getElementById("bg0Pick").value = p.bg0;
        document.getElementById("bg1Pick").value = p.bg1;
        document.querySelectorAll(".preset").forEach(x => x.classList.remove("activeTheme"));
        el.classList.add("activeTheme");
    };
});
document.getElementById("saveTheme").onclick = () => {
    const newTheme = {
        accent: document.getElementById("accentPick").value,
        accent2: document.getElementById("accent2Pick").value,
        bg0: document.getElementById("bg0Pick").value,
        bg1: document.getElementById("bg1Pick").value
    };
    state.theme = newTheme;
    applyTheme(newTheme);
    save("theme", newTheme);
    themeBack.style.display = "none";
};
themeInputs.forEach(id => document.getElementById(id).addEventListener("input", () => {
    const tempTheme = { accent: accentPick.value, accent2: accent2Pick.value, bg0: bg0Pick.value, bg1: bg1Pick.value };
    applyTheme(tempTheme);
}));

// Welcome Modal
const welcomeBack = document.getElementById("welcomeBack");
const openWelcome = () => {
    document.getElementById("nameInput").value = state.name;
    document.getElementById("goalSelect").value = String(state.goal);
    welcomeBack.style.display = "flex";
};
const closeWelcome = () => welcomeBack.style.display = "none";
welcomeBack.addEventListener("click", (e) => { if (e.target === welcomeBack) closeWelcome(); });
const commit = () => {
    const n = (document.getElementById("nameInput").value || "").trim() || "Valentina";
    state.name = n;
    state.goal = Number(document.getElementById("goalSelect").value || 10);
    save("name", state.name); save("goal", state.goal);
    applyLang();
};
document.getElementById("welcomeMath").onclick = () => { commit(); closeWelcome(); show(viewMath); };
document.getElementById("welcomeLogic").onclick = () => { commit(); closeWelcome(); show(viewLogic); };
document.getElementById("welcomeStory").onclick = () => { commit(); closeWelcome(); show(viewStory); };

// Badges Modal
const badgesBack = document.getElementById("badgesBack");
document.getElementById("ui_kpi_badges").onclick = () => { renderBadgesModal(); badgesBack.style.display = "flex"; };
document.getElementById("closeBadges").onclick = () => badgesBack.style.display = "none";
badgesBack.addEventListener("click", (e) => { if (e.target === badgesBack) badgesBack.style.display = "none"; });

// Shop Modal
const shopBack = document.getElementById("shopBack");
document.getElementById("closeShop").onclick = () => shopBack.style.display = "none";
shopBack.addEventListener("click", (e) => { if (e.target === shopBack) shopBack.style.display = "none"; });

// Custom Modal
const customBack = document.getElementById("customBack");
if (customBack) {
    customBack.addEventListener("click", (e) => {
        if (e.target === customBack) customBack.style.display = "none";
    });
}

function renderShop() {
    const grid = document.getElementById("shopGrid");
    grid.innerHTML = "";
    const purchased = state.stats.purchasedItems || [];
    const coins = state.stats.coins || 0;

    SHOP_ITEMS.forEach(item => {
        const isPurchased = purchased.includes(item.id);
        const isEquipped = state.stats.petAccessories[item.type] === item.id;
        const canAfford = coins >= item.price;

        const div = document.createElement("div");
        div.className = "shopItem";

        let buttonHtml = '';
        if (isEquipped) {
            buttonHtml = `<button disabled>${T().shop_equipped}</button>`;
        } else if (isPurchased) {
            buttonHtml = `<button onclick="equipItem('${item.id}')">${T().shop_equip}</button>`;
        } else {
            buttonHtml = `<button onclick="buyItem('${item.id}')" ${!canAfford ? 'disabled' : ''}>${T().shop_buy}</button>`;
        }

        div.innerHTML = `
            <div class="shopItemIcon">${item.icon}</div>
            <div class="shopItemName">${item.name}</div>
            <div class="shopItemPrice">💰 ${item.price}</div>
            ${buttonHtml}
        `;
        grid.appendChild(div);
    });
}

window.buyItem = (itemId) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (item && state.stats.coins >= item.price) {
        state.stats.coins -= item.price;
        state.stats.purchasedItems.push(itemId);
        save("stats", state.stats);
        renderCoins();
        renderShop();
    }
};

window.equipItem = (itemId) => {
    const item = SHOP_ITEMS.find(i => i.id === itemId);
    if (item && state.stats.purchasedItems.includes(itemId)) {
        state.stats.petAccessories[item.type] = itemId;
        save("stats", state.stats);
        renderPet();
        renderShop();
    }
};

// Game Over Modal
const gameOverBack = document.getElementById("gameOverBack");
document.getElementById("closeGameOver").onclick = () => gameOverBack.style.display = "none";
gameOverBack.addEventListener("click", (e) => { if (e.target === gameOverBack) gameOverBack.style.display = "none"; });

document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    [welcomeBack, themeBack, badgesBack, shopBack, gameOverBack, customBack, levelUpBack]
        .filter(Boolean)
        .forEach(modal => modal.style.display = "none");
});

// Boot
initEventListeners();
autoTheme(); // Check time on load
applyLang();
renderCards();
renderDashboard();
renderCoins();
renderXpAndLevel(); // Initial render for level and XP
renderPet(); // Initial render for pet
setTimeout(openWelcome, 200);

// ===== Constants & Config =====
const XP_PER_CORRECT_ANSWER = 10;
const PRESETS = {
    ocean: { accent: "#4c6fff", accent2: "#00d4ff", bg0: "#070a14", bg1: "#06122a" },
    violet: { accent: "#8a5bff", accent2: "#ff5bd6", bg0: "#070a14", bg1: "#120a2a" },
    mint: { accent: "#35d07f", accent2: "#4c6fff", bg0: "#070a14", bg1: "#071a1a" },
    sunset: { accent: "#ff7a59", accent2: "#8a5bff", bg0: "#070a14", bg1: "#241021" },
    gold: { accent: "#ffcc66", accent2: "#ff5b6e", bg0: "#070a14", bg1: "#22150b" }
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
        best_time: "Record temps"
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
        best_time: "Recordtijd"
    }
};

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
        level: 1,
        xp: 0
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

// ===== Theme Logic =====
const applyTheme = (t) => {
    const root = document.documentElement.style;
    root.setProperty("--accent", t.accent);
    root.setProperty("--accent2", t.accent2);
    root.setProperty("--bg0", t.bg0);
    root.setProperty("--bg1", t.bg1);
};
applyTheme(state.theme);

// ===== UI Helpers =====
const pct = (n) => `${Math.round(n)}%`;
const viewHome = document.getElementById("viewHome");
const viewMath = document.getElementById("viewMath");
const viewLogic = document.getElementById("viewLogic");
const viewStory = document.getElementById("viewStory");

const show = (v) => {
    [viewHome, viewMath, viewLogic, viewStory].forEach(x => x.classList.add("hidden"));
    v.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
};

// ===== Generators =====
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const roundNear = (n) => n >= 5000 ? Math.round(n / 1000) * 1000 : n >= 500 ? Math.round(n / 100) * 100 : Math.round(n / 10) * 10;

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

function makeMath(level, mode, maxV) {
    const ops = (mode === "divfocus") ? ["÷", "÷", "÷", "+", "−"] :
        (mode === "mulfocus") ? ["×", "×", "×", "+", "−"] :
            ["+", "−", "×", "÷"];
    const op = ops[rnd(0, ops.length - 1)];
    const cap = clamp(maxV, 100, 10000);
    const scale = (level === "easy") ? 0.35 : (level === "mid") ? 0.6 : 1.0;
    let a, b, ans, meta = "", hint = "", methods = "";

    if (op === "+") { a = rnd(10, Math.floor(cap * scale)); b = rnd(10, Math.floor(cap * scale)); ans = a + b; hint = `${roundNear(a)} + ${roundNear(b)} ≈ <b>${roundNear(a) + roundNear(b)}</b>`; }
    if (op === "−") { a = rnd(10, Math.floor(cap * scale)); b = rnd(10, Math.floor(cap * scale)); if (b > a) [a, b] = [b, a]; ans = a - b; hint = `${roundNear(a)} − ${roundNear(b)} ≈ <b>${roundNear(a) - roundNear(b)}</b>`; }
    if (op === "×") { a = rnd(12, Math.min(999, Math.floor(cap * scale))); b = rnd(2, (level === "easy") ? 19 : (level === "mid") ? 49 : 99); ans = a * b; hint = `${roundNear(a)} × ${roundNear(b)} ≈ <b>${roundNear(a) * roundNear(b)}</b>`; }
    if (op === "÷") {
        b = rnd(2, (level === "easy") ? 12 : (level === "mid") ? 25 : 60);
        const q = rnd(2, (level === "easy") ? 30 : (level === "mid") ? 120 : 250);
        a = b * q;
        if (a > cap) { const q2 = Math.max(2, Math.floor(cap / b)); a = b * q2; ans = q2; } else ans = q;
        meta = (lang === "fr") ? "Division exacte (reste = 0)." : "Exacte deling (rest = 0).";
        hint = `${roundNear(a)} ÷ ${roundNear(b)} ≈ <b>${Math.floor(roundNear(a) / roundNear(b))}</b>`;
    }

    methods = explainMath(op, a, b, ans);
    return { type: "math", op, a, b, ans, meta, hint, methods };
}

function makeLogic(kind) {
    const pick = (arr) => arr[rnd(0, arr.length - 1)];
    const k = (kind === "mix") ? pick(["sequence", "odd", "rule"]) : kind;
    let q = "", ans = "", hint = "", meta = "", methods = "", options = null;

    if (k === "sequence") {
        const base = rnd(1, 9), step = pick([2, 3, 4, 5, 10]);
        const seq = Array.from({ length: 5 }, (_, i) => base + step * i);
        const miss = rnd(2, 4);
        const shown = seq.map((v, i) => i === miss ? "?" : v).join(", ");
        ans = String(seq[miss]);
        q = (lang === "fr") ? `Complète la suite: ${shown}` : `Vul de reeks aan: ${shown}`;
        hint = (lang === "fr") ? `Différence constante (+${step}).` : `Verschil is constant (+${step}).`;

        // Generate options for sequence (Multiple Choice)
        const correct = Number(ans);
        options = [correct, correct + step, correct - step, correct + step * 2].sort(() => Math.random() - 0.5);
    }

    if (k === "odd") {
        const set = pick([
            { items: ["2", "4", "6", "9", "8"], odd: "9", fr: "9 est impair.", nl: "9 is oneven." },
            { items: ["10", "20", "30", "35", "40"], odd: "35", fr: "35 n’est pas multiple de 10.", nl: "35 is geen veelvoud van 10." },
            { items: ["3", "6", "9", "12", "14"], odd: "14", fr: "14 n'est pas multiple de 3.", nl: "14 is geen veelvoud van 3." },
            { items: ["Carré", "Triangle", "Rond", "Cube"], odd: "Cube", fr: "Cube est 3D, les autres 2D.", nl: "Kubus is 3D, anderen 2D." }
        ]);
        q = (lang === "fr") ? `Trouve l’intrus: ${set.items.join(", ")}` : `Zoek de intrus: ${set.items.join(", ")}`;
        ans = set.odd; meta = (lang === "fr") ? set.fr : set.nl;
        hint = (lang === "fr") ? "Test une règle simple." : "Test een simpele regel.";
        options = set.items;
    }

    if (k === "rule") {
        const rule = pick([
            { fr: "×2 puis +1", nl: "×2 dan +1", f: (x) => x * 2 + 1 },
            { fr: "+3", nl: "+3", f: (x) => x + 3 },
            { fr: "Moitié", nl: "Helft", f: (x) => x / 2 }
        ]);
        const x = (rule.fr === "Moitié") ? rnd(2, 20) * 2 : rnd(2, 9);
        q = (lang === "fr") ? `Règle: ${rule.fr}. Si x = ${x}, résultat ?` : `Regel: ${rule.nl}. Als x = ${x}, resultaat?`;
        ans = String(rule.f(x));
        hint = (lang === "fr") ? "Applique étape par étape." : "Stap voor stap toepassen.";

        // Generate options for rule
        const correct = Number(ans);
        options = [correct, correct + 1, correct - 1, correct * 2].sort(() => Math.random() - 0.5);
    }
    return { type: "logic", q, ans, meta, hint, methods, options };
}

function makeStory(theme) {
    const pick = (arr) => arr[rnd(0, arr.length - 1)];
    const t = (theme === "mix") ? pick(["swim", "boxes", "school", "shop"]) : theme;
    let q = "", ans = 0, hint = "", meta = "", methods = "", steps = "";
    if (t === "swim") {
        const kids = rnd(120, 900), days = 5; ans = kids * days;
        q = (lang === "fr")
            ? `Stage: ${kids} enfants nagent chaque jour (pas le week-end). Combien de tickets pour la semaine ?`
            : `Kamp: ${kids} kinderen zwemmen elke dag (niet in het weekend). Hoeveel tickets voor de week?`;
        hint = `${kids} × ${days}`;
    }
    if (t === "boxes") {
        const candies = pick([48, 60, 63, 80, 96, 100, 120]);
        const per = pick([2, 3, 4, 5, 6, 8, 10]);
        const qv = Math.floor(candies / per);
        const r = candies - qv * per;
        if (r === 0) { ans = qv; q = (lang === "fr") ? `J’ai ${candies} bonbons. Boîtes de ${per}. Combien de boîtes ?` : `Ik heb ${candies} snoepjes. Doosjes van ${per}. Hoeveel doosjes?`; hint = `${candies} ÷ ${per}`; }
        else { ans = r; q = (lang === "fr") ? `J’ai ${candies} bonbons. Boîtes de ${per}. Quel reste ?` : `Ik heb ${candies} snoepjes. Doosjes van ${per}. Wat is de rest?`; hint = `Reste de ${candies} ÷ ${per}`; }
    }
    if (t === "school") {
        const a = rnd(1000, 9000), b = rnd(1000, 9000); const big = Math.max(a, b), small = Math.min(a, b); ans = big - small;
        q = (lang === "fr") ? `Classe A: ${big} points, classe B: ${small}. Différence ?` : `Klas A: ${big} punten, klas B: ${small}. Verschil?`;
        hint = `${big} − ${small}`;
    }
    if (t === "shop") {
        const price = rnd(2, 9), qty = rnd(3, 12); ans = price * qty;
        q = (lang === "fr") ? `Un jus coûte ${price} €. Valentina en achète ${qty}. Total ?` : `Een sapje kost ${price} €. Valentina koopt ${qty}. Totaal?`;
        hint = `${qty} × ${price}`;
    }
    return { type: "story", q, ans, meta, hint, methods, steps };
}

// ===== Rendering =====
function renderProblem(container, p, idx) {
    const card = document.createElement("div");
    card.className = "q";
    const title = (p.type === "math") ? `${idx + 1} — ${p.a} ${p.op} ${p.b}` : `${idx + 1} — ${p.q}`;

    let inputHtml = "";
    if (p.options && p.options.length > 0) {
        // Multiple Choice
        inputHtml = `<div class="optionsGrid" data-i="${idx}">
      ${p.options.map(opt => `<div class="optionBtn" onclick="selectOption(this, ${idx}, '${opt}')">${opt}</div>`).join("")}
    </div><input type="hidden" data-i="${idx}" />`;
    } else {
        // Text Input
        inputHtml = `<input data-i="${idx}" placeholder="${lang === "fr" ? "Ta réponse" : "Jouw antwoord"}" inputmode="numeric"/>`;
    }

    card.innerHTML = `
    <div class="qhead">
      <div>
        <div class="qtitle">${title}</div>
        <div class="qmeta">${p.meta || ""}</div>
      </div>
    </div>
    <div class="answerRow">
      ${inputHtml}
      <span class="badge" data-status="${idx}">—</span>
    </div>
    <details><summary>${lang === "fr" ? "Indice" : "Hint"}</summary><div class="content">${p.hint || ""}</div></details>
    ${p.methods ? `<details><summary>${lang === "fr" ? "Méthodes faciles" : "Makkelijke methodes"}</summary><div class="content">${p.methods}</div></details>` : ""}
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

    st.best[key] = Math.max(st.best[key] || 0, res.scorePct);
    st.bestAll = Math.max(st.bestAll || 0, res.scorePct);
    st.history.push({ category: label, date: todayKey(), score: res.scorePct, ok: res.ok, count });
    save("stats", st);
    renderDashboard();
    renderCards();
}

// ===== View Controllers =====
let mathP = [], logicP = [], storyP = [];
let mathTimerInterval = null, mathStartTime = 0; // Timer variables
const mathList = document.getElementById("mathList");
const logicList = document.getElementById("logicList");
const storyList = document.getElementById("storyList");

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
        mathP = []; for (let i = 0; i < count; i++) mathP.push(makeMath(level, mode, maxV));
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

    // Logic
    document.getElementById("startLogic").onclick = () => {
        const count = Number(document.getElementById("logicCount").value || 20);
        const kind = document.getElementById("logicKind").value;
        logicP = []; for (let i = 0; i < count; i++) logicP.push(makeLogic(kind));
        logicList.innerHTML = ""; logicP.forEach((p, i) => renderProblem(logicList, p, i));
        document.getElementById("logicScore").textContent = "—";
    };
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

    // Story
    document.getElementById("startStory").onclick = () => {
        const count = Number(document.getElementById("storyCount").value || 12);
        const theme = document.getElementById("storyTheme").value;
        storyP = []; for (let i = 0; i < count; i++) storyP.push(makeStory(theme));
        storyList.innerHTML = ""; storyP.forEach((p, i) => renderProblem(storyList, p, i));
        document.getElementById("storyScore").textContent = "—";
    };
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

    const mk = (tag, title, desc, btnId) => `
    <div class="card">
      <div class="tag">${tag}</div>
      <h3>${title}</h3>
      <p>${desc}</p>
      <div class="cta">
        <button class="btnPrimary" id="${btnId}">${T().enter}</button>
        <span class="pill">${T().record}: <b>${pct(state.stats.best[btnId.includes("Math") ? "math" : btnId.includes("Logic") ? "logic" : "story"] || 0)}</b></span>
      </div>
    </div>`;
    box.insertAdjacentHTML("beforeend", mk(c.mTag, c.mTitle, c.mDesc, "goMath"));
    box.insertAdjacentHTML("beforeend", mk(c.lTag, c.lTitle, c.lDesc, "goLogic"));
    box.insertAdjacentHTML("beforeend", mk(c.sTag, c.sTitle, c.sDesc, "goStory"));

    document.getElementById("goMath").onclick = () => show(viewMath);
    document.getElementById("goLogic").onclick = () => show(viewLogic);
    document.getElementById("goStory").onclick = () => show(viewStory);
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

    renderCards();
    renderDashboard();
}

// ===== Initialization =====
document.getElementById("langBtn").addEventListener("click", () => { lang = (lang === "fr") ? "nl" : "fr"; save("lang", lang); applyLang(); });
document.getElementById("homeBtn").addEventListener("click", () => show(viewHome));

// Theme Modal
const themeBack = document.getElementById("themeBack");
document.getElementById("themeBtn").onclick = () => {
    document.getElementById("accentPick").value = state.theme.accent;
    document.getElementById("accent2Pick").value = state.theme.accent2;
    document.getElementById("bg0Pick").value = state.theme.bg0;
    document.getElementById("bg1Pick").value = state.theme.bg1;
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
    };
});
document.getElementById("saveTheme").onclick = () => {
    state.theme = {
        accent: document.getElementById("accentPick").value,
        accent2: document.getElementById("accent2Pick").value,
        bg0: document.getElementById("bg0Pick").value,
        bg1: document.getElementById("bg1Pick").value
    };
    applyTheme(state.theme);
    save("theme", state.theme);
    themeBack.style.display = "none";
};

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

// Boot
setupControllers();
applyLang();
renderCards();
renderDashboard();
renderXpAndLevel(); // Initial render for level and XP
setTimeout(openWelcome, 200);
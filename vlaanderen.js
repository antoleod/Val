(function () {
  "use strict";

  function generateRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function selectRandomTemplate(templates) {
    return templates[generateRandom(0, templates.length - 1)];
  }

  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = generateRandom(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function gcd(a, b) {
    let x = Math.abs(a);
    let y = Math.abs(b);
    while (y !== 0) {
      const t = y;
      y = x % y;
      x = t;
    }
    return x || 1;
  }

  function simplifyFraction(n, d) {
    const g = gcd(n, d);
    return { n: n / g, d: d / g };
  }

  function makeOptions(correct, deltas) {
    const baseDeltas = deltas || [1, 2, 3];
    const options = new Set([String(correct)]);
    let i = 0;
    while (options.size < 4 && i < 30) {
      const delta = baseDeltas[i % baseDeltas.length];
      const sign = i % 2 === 0 ? 1 : -1;
      const candidate = Number(correct) + sign * delta;
      if (Number.isFinite(candidate) && candidate >= 0) options.add(String(candidate));
      i++;
    }
    return shuffleArray([...options]);
  }

  const TOPICS = [
    {
      key: "numbers",
      label: "Numbers and Operations",
      topicField: "Numbers",
      templates: {
        easy: [
          function () {
            const n = generateRandom(10000, 99999);
            const place = selectRandomTemplate([10, 100, 1000, 10000]);
            const digit = Math.floor(n / place) % 10;
            const value = digit * place;
            return {
              question: `Place value: In ${n}, what is the value of the digit in the ${place} place?`,
              solution: `Digit is ${digit}, so value is ${digit} x ${place} = ${value}.`,
              options: makeOptions(value, [place, place * 2, place * 3])
            };
          },
          function () {
            const a = generateRandom(1000, 9999);
            const b = generateRandom(1000, 9999);
            return {
              question: `Add: ${a} + ${b}`,
              solution: `${a} + ${b} = ${a + b}. Start from units, then tens, then hundreds.`,
              options: makeOptions(a + b, [10, 100, 1000])
            };
          },
          function () {
            const start = generateRandom(20, 200);
            const step = selectRandomTemplate([5, 10, 25]);
            const missing = start + step * 4;
            return {
              question: `Missing number pattern: ${start}, ${start + step}, ${start + 2 * step}, ${start + 3 * step}, ?, ${start + 5 * step}`,
              solution: `Pattern adds ${step} each time, so missing number is ${missing}.`,
              options: makeOptions(missing, [step, step * 2, step * 3])
            };
          }
        ],
        medium: [
          function () {
            const a = generateRandom(20000, 90000);
            const b = generateRandom(10000, a - 1000);
            return {
              question: `Subtract: ${a} - ${b}`,
              solution: `${a} - ${b} = ${a - b}. Subtract by place values carefully.`,
              options: makeOptions(a - b, [10, 100, 1000])
            };
          },
          function () {
            const a = generateRandom(12, 99);
            const b = generateRandom(3, 9);
            return {
              question: `Multiply: ${a} x ${b}`,
              solution: `${a} x ${b} = ${a * b}. Split ${a} into tens and ones if needed.`,
              options: makeOptions(a * b, [b, b * 2, 10])
            };
          },
          function () {
            const d = generateRandom(4, 12);
            const q = generateRandom(20, 80);
            const n = d * q;
            return {
              question: `Divide: ${n} / ${d}`,
              solution: `${n} / ${d} = ${q}. Check with ${q} x ${d} = ${n}.`,
              options: makeOptions(q, [1, 2, 5])
            };
          }
        ],
        hard: [
          function () {
            const a = generateRandom(15000, 50000);
            const b = generateRandom(5000, 15000);
            const c = generateRandom(20, 60);
            const d = generateRandom(2, 9);
            const result = (a - b) + c * d;
            return {
              question: `Compute: (${a} - ${b}) + (${c} x ${d})`,
              solution: `First ${a} - ${b} = ${a - b}. Then ${c} x ${d} = ${c * d}. Total = ${result}.`
            };
          },
          function () {
            const base = generateRandom(1000, 5000);
            const step = generateRandom(50, 250);
            const x = base + step * 5;
            return {
              question: `Find x: ${base}, ${base + step}, ${base + 2 * step}, ${base + 3 * step}, ${base + 4 * step}, x`,
              solution: `The pattern adds ${step}. So x = ${x}.`,
              options: makeOptions(x, [step, step * 2, step * 3])
            };
          },
          function () {
            const a = generateRandom(30000, 80000);
            const b = generateRandom(2000, 9000);
            const c = generateRandom(8, 20);
            const total = a - b * c;
            return {
              question: `Compute: ${a} - (${b} x ${c})`,
              solution: `First multiply: ${b} x ${c} = ${b * c}. Then ${a} - ${b * c} = ${total}.`
            };
          }
        ]
      }
    },
    {
      key: "fractions",
      label: "Fractions & Decimals",
      topicField: "Fractions",
      templates: {
        easy: [
          function () {
            const d = selectRandomTemplate([4, 5, 8, 10]);
            const a = generateRandom(1, d - 1);
            let b = generateRandom(1, d - 1);
            if (a === b) b = (b % (d - 1)) + 1;
            const bigger = a > b ? `${a}/${d}` : `${b}/${d}`;
            return {
              question: `Compare fractions: Which is larger, ${a}/${d} or ${b}/${d}?`,
              solution: `Same denominator (${d}). Compare numerators. Answer: ${bigger}.`,
              options: shuffleArray([`${a}/${d}`, `${b}/${d}`, "equal", "not possible"])
            };
          },
          function () {
            const n = selectRandomTemplate([2, 3, 4, 5, 6, 7, 8, 9]);
            return {
              question: `Convert to decimal: ${n}/10`,
              solution: `${n}/10 = 0.${n}.`,
              options: shuffleArray([`0.${n}`, `${n}.0`, `0.${Math.max(0, n - 1)}`, `1.${n}`])
            };
          },
          function () {
            const n = selectRandomTemplate([2, 3, 4, 6, 8, 9, 10, 12]);
            const d = selectRandomTemplate([4, 6, 8, 10, 12]);
            const s = simplifyFraction(n, d);
            return {
              question: `Simplify fraction: ${n}/${d}`,
              solution: `Divide numerator and denominator by gcd ${gcd(n, d)}: ${s.n}/${s.d}.`,
              options: shuffleArray([`${s.n}/${s.d}`, `${n}/${d}`, `${Math.max(1, s.n - 1)}/${s.d}`, `${s.n}/${s.d + 1}`])
            };
          }
        ],
        medium: [
          function () {
            const d = selectRandomTemplate([6, 8, 10, 12]);
            const a = generateRandom(1, Math.floor(d / 2));
            const b = generateRandom(1, Math.floor(d / 2));
            const n = a + b;
            const s = simplifyFraction(n, d);
            return {
              question: `Add fractions: ${a}/${d} + ${b}/${d}`,
              solution: `Same denominator. ${a + b}/${d}, simplified = ${s.n}/${s.d}.`,
              options: shuffleArray([`${s.n}/${s.d}`, `${n}/${d}`, `${Math.max(1, s.n - 1)}/${s.d}`, `${s.n}/${s.d + 1}`])
            };
          },
          function () {
            const d = selectRandomTemplate([4, 5, 8, 20, 25]);
            const n = generateRandom(1, d - 1);
            const decimal = (n / d).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
            return {
              question: `Convert fraction to decimal: ${n}/${d}`,
              solution: `${n} / ${d} = ${decimal}.`,
              options: shuffleArray([decimal, (n / (d + 1)).toFixed(2), (n / Math.max(1, d - 1)).toFixed(2), (n / d + 0.1).toFixed(2)])
            };
          },
          function () {
            const d = selectRandomTemplate([8, 10, 12]);
            const a = generateRandom(Math.floor(d / 2), d - 1);
            const b = generateRandom(1, Math.floor(d / 2));
            const n = a - b;
            const s = simplifyFraction(n, d);
            return {
              question: `Subtract fractions: ${a}/${d} - ${b}/${d}`,
              solution: `${a} - ${b} = ${n}, so ${n}/${d}. Simplified: ${s.n}/${s.d}.`
            };
          }
        ],
        hard: [
          function () {
            const a = selectRandomTemplate([1, 2, 3, 4]);
            const b = selectRandomTemplate([2, 3, 4, 5]);
            const c = selectRandomTemplate([1, 2, 3]);
            const d = selectRandomTemplate([4, 5, 8, 10]);
            const lcm = b * d;
            const n = a * d + c * b;
            const s = simplifyFraction(n, lcm);
            return {
              question: `Add unlike fractions: ${a}/${b} + ${c}/${d}`,
              solution: `Use denominator ${lcm}. Sum ${n}/${lcm}. Simplified ${s.n}/${s.d}.`
            };
          },
          function () {
            const whole = generateRandom(1, 4);
            const n = generateRandom(1, 3);
            const d = selectRandomTemplate([4, 5, 8]);
            const improper = whole * d + n;
            return {
              question: `Convert mixed number to improper fraction: ${whole} ${n}/${d}`,
              solution: `${whole} x ${d} + ${n} = ${improper}. Result: ${improper}/${d}.`,
              options: shuffleArray([`${improper}/${d}`, `${whole + n}/${d}`, `${improper - 1}/${d}`, `${improper}/${d + 1}`])
            };
          },
          function () {
            const d = selectRandomTemplate([10, 100]);
            const n = generateRandom(11, d - 1);
            const decimal = (n / d).toString();
            return {
              question: `Order from smallest to largest: ${n}/${d}, ${decimal}, ${(Math.floor((n / d) * 10) / 10).toFixed(1)}`,
              solution: `${n}/${d} = ${decimal}. Convert all to decimals, then compare.`
            };
          }
        ]
      }
    },
    {
      key: "geometry",
      label: "Geometry",
      topicField: "Geometry",
      templates: {
        easy: [
          function () {
            const deg = selectRandomTemplate([30, 45, 60, 90, 120, 150]);
            const type = deg < 90 ? "acute" : deg === 90 ? "right" : "obtuse";
            return {
              question: `Angle type: A ${deg} degree angle is...?`,
              solution: `${deg} degree is a ${type} angle.`,
              options: shuffleArray(["acute", "right", "obtuse", "straight"])
            };
          },
          function () {
            const shape = selectRandomTemplate([
              { name: "square", lines: 4 },
              { name: "rectangle", lines: 2 },
              { name: "equilateral triangle", lines: 3 },
              { name: "circle", lines: "many" }
            ]);
            return {
              question: `How many symmetry lines does a ${shape.name} have?`,
              solution: `A ${shape.name} has ${shape.lines} symmetry line(s).`,
              options: shuffleArray([String(shape.lines), "1", "2", "4"])
            };
          },
          function () {
            const l = generateRandom(3, 12);
            const w = generateRandom(2, 10);
            return {
              question: `Perimeter of a rectangle: length ${l} cm, width ${w} cm`,
              solution: `Perimeter = 2 x (${l} + ${w}) = ${2 * (l + w)} cm.`,
              options: makeOptions(2 * (l + w), [2, 4, 6])
            };
          }
        ],
        medium: [
          function () {
            const l = generateRandom(4, 15);
            const w = generateRandom(3, 12);
            return {
              question: `Area of a rectangle: length ${l} m, width ${w} m`,
              solution: `Area = ${l} x ${w} = ${l * w} square meters.`,
              options: makeOptions(l * w, [l, w, 10])
            };
          },
          function () {
            const a = generateRandom(20, 70);
            const b = generateRandom(20, 70);
            const c = 180 - a - b;
            return {
              question: `Triangle angles: ${a} degree and ${b} degree. Find the third angle.`,
              solution: `Triangle sum is 180. Third angle = ${c} degree.`,
              options: makeOptions(c, [5, 10, 15])
            };
          },
          function () {
            const side = generateRandom(3, 14);
            return {
              question: `Perimeter of a square with side ${side} cm`,
              solution: `Perimeter = 4 x ${side} = ${4 * side} cm.`,
              options: makeOptions(4 * side, [2, 4, 8])
            };
          }
        ],
        hard: [
          function () {
            const l = generateRandom(8, 18);
            const w = generateRandom(4, 9);
            const outer = l * w;
            const inner = (l - 2) * (w - 2);
            return {
              question: `A rectangle is ${l} m by ${w} m. A 1 m border is inside all around. Border area?`,
              solution: `Outer ${outer}. Inner ${inner}. Border = ${outer - inner} square meters.`
            };
          },
          function () {
            const p = generateRandom(24, 80);
            const s = p / 4;
            return {
              question: `A square has perimeter ${p} cm. Find its side and area.`,
              solution: `Side ${s} cm. Area ${s} x ${s} = ${s * s} square cm.`
            };
          },
          function () {
            const a = selectRandomTemplate([35, 40, 55, 65]);
            const b = selectRandomTemplate([25, 30, 45]);
            const c = 360 - a - b;
            return {
              question: `At one point, two angles are ${a} degree and ${b} degree. Find the third angle for a full turn.`,
              solution: `Full turn is 360. Third angle = ${c} degree.`,
              options: makeOptions(c, [5, 10, 20])
            };
          }
        ]
      }
    },
    {
      key: "measurement",
      label: "Measurement",
      topicField: "Measurement",
      templates: {
        easy: [
          function () {
            const h = generateRandom(1, 5);
            return {
              question: `Convert time: ${h} hour(s) = ? minutes`,
              solution: `1 hour = 60 minutes. ${h} x 60 = ${h * 60}.`,
              options: makeOptions(h * 60, [10, 20, 30])
            };
          },
          function () {
            const m = generateRandom(2, 20);
            return {
              question: `Convert length: ${m} m = ? cm`,
              solution: `1 m = 100 cm. ${m} x 100 = ${m * 100}.`,
              options: makeOptions(m * 100, [10, 100, 200])
            };
          },
          function () {
            const kg = generateRandom(1, 12);
            return {
              question: `Convert mass: ${kg} kg = ? g`,
              solution: `1 kg = 1000 g. ${kg} x 1000 = ${kg * 1000}.`,
              options: makeOptions(kg * 1000, [100, 500, 1000])
            };
          }
        ],
        medium: [
          function () {
            const min = generateRandom(90, 240);
            const h = Math.floor(min / 60);
            const r = min % 60;
            return {
              question: `Convert ${min} minutes to hours and minutes.`,
              solution: `${min} minutes = ${h} hour(s) and ${r} minute(s).`
            };
          },
          function () {
            const l = generateRandom(2, 12);
            return {
              question: `Convert volume: ${l} L = ? mL`,
              solution: `1 L = 1000 mL. ${l} x 1000 = ${l * 1000}.`,
              options: makeOptions(l * 1000, [100, 200, 500])
            };
          },
          function () {
            const cm = generateRandom(120, 980);
            return {
              question: `Convert ${cm} cm to m and cm.`,
              solution: `${cm} cm = ${Math.floor(cm / 100)} m and ${cm % 100} cm.`
            };
          }
        ],
        hard: [
          function () {
            const tripMin = generateRandom(25, 95);
            const trips = generateRandom(3, 6);
            const total = tripMin * trips;
            return {
              question: `A school bus in Vlaanderen makes ${trips} trips of ${tripMin} minutes each. Total travel time?`,
              solution: `${tripMin} x ${trips} = ${total} minutes = ${Math.floor(total / 60)} h ${total % 60} min.`
            };
          },
          function () {
            const m = generateRandom(5, 18);
            const cm = generateRandom(20, 90);
            const totalCm = m * 100 + cm;
            const other = totalCm - generateRandom(5, 40);
            return {
              question: `Which is longer, ${m} m ${cm} cm or ${other} cm?`,
              solution: `${m} m ${cm} cm = ${totalCm} cm, so compare ${totalCm} and ${other}.`
            };
          },
          function () {
            const grams = generateRandom(1200, 6800);
            const boxes = generateRandom(3, 8);
            const total = boxes * grams;
            return {
              question: `A bakery in Gent packs ${boxes} boxes, each ${grams} g. Total in kg and g?`,
              solution: `${total} g = ${Math.floor(total / 1000)} kg ${total % 1000} g.`
            };
          }
        ]
      }
    },
    {
      key: "data",
      label: "Data & Statistics",
      topicField: "Data",
      templates: {
        easy: [
          function () {
            const labels = ["Mon", "Tue", "Wed", "Thu"];
            const values = labels.map(() => generateRandom(2, 12));
            const maxI = values.indexOf(Math.max.apply(null, values));
            return {
              question: `Bar graph (books read): Mon ${values[0]}, Tue ${values[1]}, Wed ${values[2]}, Thu ${values[3]}. Which day is highest?`,
              solution: `Highest value is ${values[maxI]} on ${labels[maxI]}.`,
              options: shuffleArray(labels)
            };
          },
          function () {
            const a = generateRandom(5, 20);
            const b = generateRandom(5, 20);
            const c = generateRandom(5, 20);
            return {
              question: `Picture graph totals: apples ${a}, pears ${b}, oranges ${c}. Total fruits?`,
              solution: `${a} + ${b} + ${c} = ${a + b + c}.`,
              options: makeOptions(a + b + c, [2, 4, 6])
            };
          },
          function () {
            const cats = generateRandom(6, 16);
            const dogs = generateRandom(6, 16);
            return {
              question: `Class survey: cats ${cats}, dogs ${dogs}. Difference?`,
              solution: `Difference = ${Math.abs(cats - dogs)}.`,
              options: makeOptions(Math.abs(cats - dogs), [1, 2, 3])
            };
          }
        ],
        medium: [
          function () {
            const vals = [generateRandom(10, 30), generateRandom(10, 30), generateRandom(10, 30), generateRandom(10, 30)];
            const avg = Math.round((vals[0] + vals[1] + vals[2] + vals[3]) / 4);
            return {
              question: `Weekly bike trips in Leuven: ${vals.join(", ")}. About average per day?`,
              solution: `Average is about ${avg}.`
            };
          },
          function () {
            const x = generateRandom(12, 30);
            const y = generateRandom(8, 24);
            const z = generateRandom(6, 18);
            return {
              question: `Votes: Football ${x}, Dance ${y}, Robotics ${z}. Which pair sum is greatest?`,
              solution: `Compare pair sums: F+D ${x + y}, F+R ${x + z}, D+R ${y + z}.`
            };
          },
          function () {
            const days = ["Mon", "Tue", "Wed", "Thu", "Fri"];
            const vals = days.map(() => generateRandom(1, 10));
            const min = Math.min.apply(null, vals);
            const max = Math.max.apply(null, vals);
            return {
              question: `Rain chart (mm): ${days.map((d, i) => `${d} ${vals[i]}`).join(", ")}. Find range (max-min).`,
              solution: `Max ${max}, min ${min}, range ${max - min}.`,
              options: makeOptions(max - min, [1, 2, 3])
            };
          }
        ],
        hard: [
          function () {
            const vals = [generateRandom(20, 40), generateRandom(20, 40), generateRandom(20, 40)];
            const total = vals[0] + vals[1] + vals[2];
            const p = Math.round((vals[0] / total) * 100);
            return {
              question: `Library books by genre: Adventure ${vals[0]}, Science ${vals[1]}, History ${vals[2]}. Adventure percent (rounded)?`,
              solution: `${vals[0]}/${total} x 100 = about ${p}%.`
            };
          },
          function () {
            const girls = generateRandom(12, 20);
            const boys = generateRandom(10, 18);
            const absent = generateRandom(1, 5);
            return {
              question: `Class data: ${girls} girls, ${boys} boys, ${absent} absent. How many present?`,
              solution: `Present = ${girls + boys} - ${absent} = ${girls + boys - absent}.`,
              options: makeOptions(girls + boys - absent, [1, 2, 3])
            };
          },
          function () {
            const a = generateRandom(18, 45);
            const b = generateRandom(18, 45);
            const c = generateRandom(18, 45);
            return {
              question: `Points: Team A ${a}, Team B ${b}, Team C ${c}. If A +5 and C -3, who is highest?`,
              solution: `New values: A ${a + 5}, B ${b}, C ${c - 3}. Compare the three.`
            };
          }
        ]
      }
    },
    {
      key: "word",
      label: "Word Problems",
      topicField: "Word Problems",
      templates: {
        easy: [
          function () {
            const pencils = generateRandom(12, 30);
            const packs = generateRandom(3, 8);
            return {
              question: `In a Brugge class, each pack has ${pencils} pencils. There are ${packs} packs. Total pencils?`,
              solution: `${pencils} x ${packs} = ${pencils * packs}.`
            };
          },
          function () {
            const apples = generateRandom(20, 50);
            const used = generateRandom(4, 12);
            return {
              question: `A student had ${apples} apples and used ${used}. How many are left?`,
              solution: `${apples} - ${used} = ${apples - used}.`,
              options: makeOptions(apples - used, [1, 2, 4])
            };
          },
          function () {
            const price = generateRandom(2, 9);
            const qty = generateRandom(2, 7);
            return {
              question: `In Antwerpen, one sandwich costs EUR ${price}. Buy ${qty}. Total cost?`,
              solution: `${price} x ${qty} = EUR ${price * qty}.`,
              options: makeOptions(price * qty, [1, 2, 3])
            };
          }
        ],
        medium: [
          function () {
            const pages = generateRandom(8, 18);
            const days = generateRandom(4, 8);
            const extra = generateRandom(10, 30);
            return {
              question: `A girl in Vlaanderen reads ${pages} pages/day for ${days} days, then ${extra} extra pages. Total pages?`,
              solution: `${pages} x ${days} = ${pages * days}; then +${extra} = ${pages * days + extra}.`
            };
          },
          function () {
            const budget = generateRandom(30, 80);
            const itemA = generateRandom(6, 15);
            const itemB = generateRandom(5, 14);
            const qtyA = generateRandom(2, 4);
            const qtyB = generateRandom(2, 5);
            const spent = itemA * qtyA + itemB * qtyB;
            return {
              question: `School trip budget EUR ${budget}. Bought ${qtyA} tickets at EUR ${itemA} and ${qtyB} snacks at EUR ${itemB}. Money left?`,
              solution: `Spent EUR ${spent}. Left EUR ${budget - spent}.`
            };
          },
          function () {
            const boxes = generateRandom(4, 9);
            const per = generateRandom(18, 36);
            const groups = generateRandom(3, 8);
            const total = boxes * per;
            return {
              question: `A club in Gent has ${boxes} boxes with ${per} stickers each. Shared by ${groups} groups. Stickers per group?`,
              solution: `Total ${total}. Per group ${total}/${groups} = ${total / groups}.`
            };
          }
        ],
        hard: [
          function () {
            const oneWay = generateRandom(2, 6);
            const weeks = generateRandom(2, 6);
            const total = oneWay * 2 * 5 * weeks;
            return {
              question: `A student bikes ${oneWay} km one way to school in Leuven. Distance in ${weeks} school weeks?`,
              solution: `Round trip ${oneWay * 2}/day. In ${weeks} weeks: ${oneWay * 2} x 5 x ${weeks} = ${total} km.`
            };
          },
          function () {
            const rows = generateRandom(6, 12);
            const seats = generateRandom(18, 28);
            const reserved = generateRandom(15, 40);
            const sold = generateRandom(30, rows * seats - reserved - 10);
            const free = rows * seats - (reserved + sold);
            return {
              question: `A theater has ${rows} rows of ${seats} seats. ${reserved} reserved and ${sold} sold. Free seats left?`,
              solution: `Total ${rows * seats}. Used ${reserved + sold}. Free ${free}.`
            };
          },
          function () {
            const p1 = generateRandom(8, 15);
            const p2 = generateRandom(9, 16);
            const p3 = generateRandom(7, 14);
            const q1 = generateRandom(2, 5);
            const q2 = generateRandom(2, 5);
            const q3 = generateRandom(2, 5);
            const total = p1 * q1 + p2 * q2 + p3 * q3;
            return {
              question: `School canteen order: ${q1} meals at EUR ${p1}, ${q2} drinks at EUR ${p2}, ${q3} desserts at EUR ${p3}. Total bill?`,
              solution: `${p1 * q1} + ${p2 * q2} + ${p3 * q3} = EUR ${total}.`
            };
          }
        ]
      }
    }
  ];

  function localizeText(text, lang) {
    if (!text || lang === "en") return text;
    const dictEs = [
      ["Place value", "Valor posicional"],
      ["In ", "En "],
      ["what is the value of the digit in the", "cual es el valor del digito en la posicion de"],
      ["place?", "?"], ["Digit is", "El digito es"], ["so value is", "entonces el valor es"],
      ["Add", "Suma"], ["Subtract", "Resta"], ["Multiply", "Multiplica"], ["Divide", "Divide"],
      ["Missing number pattern", "Patron con numero faltante"],
      ["Pattern adds", "El patron suma"], ["each time", "cada vez"],
      ["Compute", "Calcula"], ["Find x", "Encuentra x"],
      ["Compare fractions", "Compara fracciones"], ["Which is larger", "Cual es mayor"],
      ["Convert to decimal", "Convierte a decimal"], ["Simplify fraction", "Simplifica la fraccion"],
      ["Add fractions", "Suma fracciones"], ["Subtract fractions", "Resta fracciones"],
      ["Add unlike fractions", "Suma fracciones con distinto denominador"],
      ["Convert mixed number to improper fraction", "Convierte numero mixto a fraccion impropia"],
      ["Order from smallest to largest", "Ordena de menor a mayor"],
      ["Angle type", "Tipo de angulo"], ["How many symmetry lines does", "Cuantas lineas de simetria tiene"],
      ["Perimeter of a rectangle", "Perimetro de un rectangulo"], ["Area of a rectangle", "Area de un rectangulo"],
      ["Perimeter of a square", "Perimetro de un cuadrado"],
      ["Convert time", "Convierte tiempo"], ["Convert length", "Convierte longitud"],
      ["Convert mass", "Convierte masa"], ["Convert volume", "Convierte volumen"],
      ["Convert ", "Convierte "], ["minutes", "minutos"], ["hour", "hora"], ["hours", "horas"],
      ["Bar graph", "Grafico de barras"], ["Picture graph", "Grafico de pictogramas"],
      ["Class survey", "Encuesta de clase"], ["difference", "diferencia"], ["range", "rango"],
      ["Word Problems", "Problemas de texto"], ["Total bill", "Costo total"],
      ["Total cost", "Costo total"], ["Total", "Total"], ["solution", "solucion"],
      ["school", "escuela"], ["student", "estudiante"], ["class", "clase"],
      ["equal", "igual"], ["not possible", "no es posible"],
      ["acute", "agudo"], ["right", "recto"], ["obtuse", "obtuso"], ["straight", "llano"],
      ["square meters", "metros cuadrados"], ["square cm", "cm cuadrados"],
      ["Check with", "Verifica con"], ["Start from units, then tens, then hundreds.", "Empieza en unidades, luego decenas y centenas."],
      ["Use denominator", "Usa denominador"], ["simplified", "simplificada"], ["Result", "Resultado"]
    ];
    const dictNl = [
      ["Place value", "Plaatswaarde"], ["what is the value of the digit in the", "wat is de waarde van het cijfer op de"],
      ["Add", "Tel op"], ["Subtract", "Trek af"], ["Multiply", "Vermenigvuldig"], ["Divide", "Deel"],
      ["Missing number pattern", "Getallenpatroon met ontbrekend getal"],
      ["Compute", "Bereken"], ["Find x", "Vind x"], ["Compare fractions", "Vergelijk breuken"],
      ["Which is larger", "Welke is groter"], ["Convert to decimal", "Zet om naar decimaal"],
      ["Simplify fraction", "Vereenvoudig de breuk"], ["Add fractions", "Tel breuken op"],
      ["Subtract fractions", "Trek breuken af"], ["Angle type", "Hoektype"],
      ["Perimeter of a rectangle", "Omtrek van een rechthoek"], ["Area of a rectangle", "Oppervlakte van een rechthoek"],
      ["Perimeter of a square", "Omtrek van een vierkant"], ["Convert time", "Zet tijd om"],
      ["Convert length", "Zet lengte om"], ["Convert mass", "Zet massa om"], ["Convert volume", "Zet volume om"],
      ["Bar graph", "Staafdiagram"], ["Picture graph", "Beelddiagram"], ["Class survey", "Klassenenquete"],
      ["difference", "verschil"], ["range", "spreiding"], ["equal", "gelijk"], ["not possible", "niet mogelijk"],
      ["acute", "scherp"], ["right", "recht"], ["obtuse", "stomp"], ["straight", "gestrekt"],
      ["school", "school"], ["student", "leerling"], ["class", "klas"]
    ];
    const dict = lang === "nl" ? dictNl : dictEs;
    let out = text;
    dict.forEach(([a, b]) => { out = out.replaceAll(a, b); });
    return out;
  }

  function localizeTopic(label, lang) {
    const mapEs = {
      "Numbers and Operations": "Numeros y Operaciones",
      "Fractions & Decimals": "Fracciones y Decimales",
      "Geometry": "Geometria",
      "Measurement": "Medicion",
      "Data & Statistics": "Datos y Estadistica",
      "Word Problems": "Problemas de Texto"
    };
    const mapNl = {
      "Numbers and Operations": "Getallen en Bewerkingen",
      "Fractions & Decimals": "Breuken en Decimalen",
      "Geometry": "Meetkunde",
      "Measurement": "Meten",
      "Data & Statistics": "Gegevens en Statistiek",
      "Word Problems": "Verhaalopgaven"
    };
    if (lang === "nl") return mapNl[label] || label;
    if (lang === "es") return mapEs[label] || label;
    return label;
  }

  function extractExpected(raw) {
    if (raw.answer !== undefined && raw.answer !== null) return String(raw.answer).trim();
    const s = String(raw.solution || "").trim();
    const byEqual = s.match(/=\s*([A-Za-z0-9./%-]+)\.?$/);
    if (byEqual) return byEqual[1].trim();
    const byOn = s.match(/on\s+([A-Za-z]+)\.?$/i);
    if (byOn) return byOn[1].trim();
    const lastNum = s.match(/(\d+\/\d+|\d+(?:\.\d+)?%?)(?!.*(\d+\/\d+|\d+(?:\.\d+)?%?))/);
    if (lastNum) return lastNum[1].trim();
    return "";
  }

  function normalizeAnswer(v) {
    return String(v || "").trim().toLowerCase().replace(",", ".");
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#39;");
  }

  function generateVlaanderenSet(config) {
    const cfg = config || {};
    const topic = cfg.topic || "all";
    const difficulty = cfg.difficulty || "all";
    const lang = cfg.lang || "es";
    const perTopic = Number(cfg.perTopic || 6);

    const selectedTopics = topic === "all"
      ? TOPICS
      : TOPICS.filter((t) => t.key === topic);

    const diffs = difficulty === "all" ? ["easy", "medium", "hard"] : [difficulty];
    const seen = new Set();
    const grouped = [];

    selectedTopics.forEach((topicDef) => {
      const problems = [];
      for (let i = 0; i < perTopic; i++) {
        const diff = diffs[i % diffs.length];
        const templates = topicDef.templates[diff] || [];
        let created = null;
        let attempts = 0;

        while (!created && attempts < 30) {
          const tpl = selectRandomTemplate(templates);
          if (!tpl) break;
          const raw = tpl();
          const signature = `${topicDef.key}|${diff}|${raw.question}`;
          if (!seen.has(signature)) {
            seen.add(signature);
            created = {
              id: `${topicDef.key}_${diff}_${Date.now().toString(36)}_${i}_${generateRandom(100, 999)}`,
              topic: topicDef.topicField,
              difficulty: diff,
              question: localizeText(raw.question, lang),
              solution: localizeText(raw.solution, lang),
              expected: localizeText(extractExpected(raw), lang),
              ...(raw.options ? { options: raw.options.map((o) => localizeText(String(o), lang)) } : {})
            };
          }
          attempts++;
        }

        if (created) problems.push(created);
      }
      grouped.push({ topic: localizeTopic(topicDef.label, lang), problems: problems });
    });

    return grouped;
  }

  function initVlaanderenDashboard() {
    const topicEl = document.getElementById("vlaTopic");
    const levelEl = document.getElementById("vlaLevel");
    const langEl = document.getElementById("vlaLang");
    const countEl = document.getElementById("vlaCount");
    const outputEl = document.getElementById("vlaOutput");
    const statusEl = document.getElementById("vlaStatus");
    const studyListEl = document.getElementById("vlaStudyList");
    const generateBtn = document.getElementById("generateVlaSet");
    const renderStudyBtn = document.getElementById("renderVlaStudy");
    const checkStudyBtn = document.getElementById("checkVlaStudy");
    const copyBtn = document.getElementById("copyVlaJson");
    const downloadBtn = document.getElementById("downloadVlaJson");

    if (!topicEl || !levelEl || !langEl || !countEl || !outputEl || !statusEl || !studyListEl || !generateBtn || !renderStudyBtn || !checkStudyBtn || !copyBtn || !downloadBtn) {
      return;
    }

    let lastPayload = [];

    function renderSet() {
      lastPayload = generateVlaanderenSet({
        topic: topicEl.value,
        difficulty: levelEl.value,
        lang: langEl.value,
        perTopic: Number(countEl.value || 6)
      });
      const total = lastPayload.reduce((sum, g) => sum + g.problems.length, 0);
      outputEl.value = JSON.stringify(lastPayload.map(g => ({
        topic: g.topic,
        problems: g.problems.map(p => {
          const { expected, ...rest } = p;
          return rest;
        })
      })), null, 2);
      statusEl.textContent = `Generados ${total} ejercicios sin duplicados.`;
    }

    function renderStudy() {
      if (!lastPayload.length) renderSet();
      const flat = lastPayload.flatMap((g) => g.problems.map((p) => ({ ...p, topicLabel: g.topic })));
      studyListEl.innerHTML = "";
      flat.forEach((p, i) => {
        const options = Array.isArray(p.options) && p.options.length
          ? `<div class="optionsGrid">${p.options.map(opt => `<button type="button" class="optionBtn" data-vla-opt="${i}" data-vla-val="${escapeHtml(opt)}">${escapeHtml(opt)}</button>`).join("")}</div>`
          : "";
        const card = document.createElement("div");
        card.className = "vlaStudyItem";
        card.innerHTML = `
          <div class="vlaStudyHead"><span>${escapeHtml(p.topicLabel)} • ${escapeHtml(p.difficulty)}</span><span>#${i + 1}</span></div>
          <div class="vlaStudyQ">${escapeHtml(p.question)}</div>
          ${options}
          <input class="vlaStudyInput" data-vla-input="${i}" placeholder="Tu respuesta" />
          <div class="vlaStudyResult" data-vla-result="${i}"></div>
        `;
        studyListEl.appendChild(card);
      });
      studyListEl.querySelectorAll("[data-vla-opt]").forEach((btn) => {
        btn.addEventListener("click", () => {
          const idx = btn.getAttribute("data-vla-opt");
          const value = btn.getAttribute("data-vla-val");
          const input = studyListEl.querySelector(`[data-vla-input="${idx}"]`);
          if (input) input.value = value || "";
          const group = studyListEl.querySelectorAll(`[data-vla-opt="${idx}"]`);
          group.forEach(g => g.classList.remove("selected"));
          btn.classList.add("selected");
        });
      });
      statusEl.textContent = `Modo estudio listo: ${flat.length} ejercicios.`;
    }

    function checkStudy() {
      if (!lastPayload.length) return;
      const flat = lastPayload.flatMap((g) => g.problems.map((p) => ({ ...p, topicLabel: g.topic })));
      let ok = 0;
      flat.forEach((p, i) => {
        const input = studyListEl.querySelector(`[data-vla-input="${i}"]`);
        const result = studyListEl.querySelector(`[data-vla-result="${i}"]`);
        const got = normalizeAnswer(input ? input.value : "");
        const expected = normalizeAnswer(p.expected);
        if (!result) return;
        if (expected && got && got === expected) {
          ok++;
          result.textContent = `Correcto. Solucion: ${p.solution}`;
          result.style.color = "var(--ok)";
        } else {
          result.textContent = `Revisa. Solucion: ${p.solution}`;
          result.style.color = "var(--warn)";
        }
      });
      statusEl.textContent = `Corregido: ${ok}/${flat.length} exactos.`;
    }

    generateBtn.addEventListener("click", renderSet);
    renderStudyBtn.addEventListener("click", renderStudy);
    checkStudyBtn.addEventListener("click", checkStudy);

    copyBtn.addEventListener("click", async function () {
      if (!outputEl.value.trim()) return;
      try {
        await navigator.clipboard.writeText(outputEl.value);
        statusEl.textContent = "JSON copiado al portapapeles.";
      } catch (err) {
        outputEl.select();
        document.execCommand("copy");
        statusEl.textContent = "JSON copiado.";
      }
    });

    downloadBtn.addEventListener("click", function () {
      if (!outputEl.value.trim()) return;
      const blob = new Blob([outputEl.value], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `vlaanderen_grade4_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      statusEl.textContent = "Archivo JSON descargado.";
    });

    renderSet();
  }

  window.generateRandom = generateRandom;
  window.selectRandomTemplate = selectRandomTemplate;
  window.generateVlaanderenSet = generateVlaanderenSet;

  document.addEventListener("DOMContentLoaded", initVlaanderenDashboard);
})();

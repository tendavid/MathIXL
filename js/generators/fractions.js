// js/generators/fractions.js
// Fraction & decimal generators – currently focused on Grade 4 Fractions & Decimals.

(function () {
  function randInt(a, b) {
    a = Math.ceil(a);
    b = Math.floor(b);
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  function difficultyToRange(level, baseMin, baseMax) {
    let n = Math.max(1, Math.min(100, Number(level) || 1));
    const t = (n - 1) / 99; // 0..1
    const span = baseMax - baseMin;
    const maxVal = Math.round(baseMin + span * (0.3 + 0.7 * t));
    return { min: baseMin, max: Math.max(baseMin + 3, maxVal) };
  }

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  function simplify(num, den) {
    const g = gcd(num, den);
    return { n: num / g, d: den / g };
  }

  // Grade 4 – Fractions & Decimals
  window.buildG4FractionsDecimalsQuestion = function (opts) {
    const level = Math.max(1, Math.min(100, Number(opts.number) || 1));

    let mode;
    if (level <= 30) {
      mode = "frac_to_dec";
    } else if (level <= 60) {
      mode = "dec_to_frac";
    } else if (level <= 85) {
      mode = "compare";
    } else {
      mode = "mixed";
    }

    if (mode === "frac_to_dec") {
      const denChoices = level <= 15 ? [10] : [10, 100];
      const den = denChoices[randInt(0, denChoices.length - 1)];
      const num = randInt(1, den - 1);
      const value = num / den;
      return {
        text: `Write ${num}/${den} as a decimal.`,
        answer: Number(value.toFixed(den === 10 ? 1 : 2)),
        concept: "Fractions with denominator 10 or 100 written as decimals",
      };
    }

    if (mode === "dec_to_frac") {
      const places = level <= 45 ? 1 : 2;
      const den = places === 1 ? 10 : 100;
      const num = randInt(1, den - 1);
      const dec = num / den;
      const simp = simplify(num, den);
      return {
        text: `Write ${dec.toFixed(places)} as a fraction in simplest form.`,
        answer: `${simp.n}/${simp.d}`,
        concept: "Decimals to fractions in simplest form",
      };
    }

    if (mode === "compare") {
      const a = randInt(1, 99) / 100;
      const b = randInt(1, 99) / 100;
      const bigger = a === b ? "=" : a > b ? ">" : "<";
      return {
        text: `Fill in the blank with <, > or = : ${a.toFixed(2)} ___ ${b.toFixed(2)}`,
        answer: bigger,
        concept: "Comparing decimals to hundredths",
      };
    }

    // mixed: simple addition / subtraction of tenths & hundredths
    const places = level <= 92 ? 1 : 2;
    const den = places === 1 ? 10 : 100;
    const a = randInt(1, den - 1);
    const b = randInt(1, den - 1);
    const op = Math.random() < 0.5 ? "+" : "-";

    if (op === "+") {
      const sum = (a + b) / den;
      return {
        text: `${(a / den).toFixed(places)} + ${(b / den).toFixed(places)} = ?`,
        answer: Number(sum.toFixed(places)),
        concept: "Addition of decimals",
      };
    } else {
      // ensure a >= b
      const big = Math.max(a, b);
      const small = Math.min(a, b);
      const diff = (big - small) / den;
      return {
        text: `${(big / den).toFixed(places)} - ${(small / den).toFixed(places)} = ?`,
        answer: Number(diff.toFixed(places)),
        concept: "Subtraction of decimals",
      };
    }
  };
})();

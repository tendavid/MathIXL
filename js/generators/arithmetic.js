// js/generators/arithmetic.js
// Core arithmetic & basic topics generators for Grades 1–3 plus a generic mixed placeholder.

(function () {
  // ---------- Helper utilities ----------

  function difficultyToRange(level, baseMin, baseMax) {
    let n = Math.max(1, Math.min(100, Number(level) || 1));
    const t = (n - 1) / 99; // 0..1
    const span = baseMax - baseMin;
    const maxVal = Math.round(baseMin + span * (0.3 + 0.7 * t));
    return { min: baseMin, max: Math.max(baseMin + 3, maxVal) };
  }

  function randInt(a, b) {
    a = Math.ceil(a);
    b = Math.floor(b);
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  // ---------- GRADE 1 ----------

  // G1 – Numbers to 100
  window.buildG1NumbersTo100Question = function (opts) {
    const r = difficultyToRange(opts.number, 1, 100);
    const v = randInt(r.min, r.max);
    const mode =
      opts.number <= 30 ? "read" : opts.number <= 70 ? "place" : "compare";

    if (mode === "read") {
      return {
        text: `What number is this? ${v}`,
        answer: v,
        concept: "Numbers to 100",
      };
    } else if (mode === "place") {
      const tens = Math.floor(v / 10),
        ones = v % 10;
      return {
        text: `${v} = ___ tens and ___ ones. Give your answer as tens,ones`,
        answer: `${tens},${ones}`,
        concept: "Place value (tens/ones)",
      };
    } else {
      const other = randInt(r.min, r.max);
      const bigger = v > other ? v : other;
      return {
        text: `Which is greater: ${v} or ${other}?`,
        answer: bigger,
        concept: "Compare numbers",
      };
    }
  };

  // G1 – Add/Sub within 20
  window.buildG1AddSub20Question = function (opts) {
    const r = difficultyToRange(opts.number, 1, 20);
    const max = Math.min(20, r.max);
    const mode =
      opts.number <= 40 ? "add" : opts.number <= 80 ? "sub" : "missing";

    if (mode === "add") {
      const a = randInt(1, max - 1),
        b = randInt(1, max - a);
      return {
        text: `${a} + ${b} = ?`,
        answer: a + b,
        concept: "Addition within 20",
      };
    } else if (mode === "sub") {
      const a = randInt(5, max),
        b = randInt(1, a - 1);
      return {
        text: `${a} - ${b} = ?`,
        answer: a - b,
        concept: "Subtraction within 20",
      };
    } else {
      const a = randInt(1, max - 1),
        b = randInt(1, max - a);
      const sum = a + b;
      if (Math.random() < 0.5) {
        return {
          text: `___ + ${b} = ${sum}`,
          answer: a,
          concept: "Missing addend within 20",
        };
      } else {
        return {
          text: `${a} + ___ = ${sum}`,
          answer: b,
          concept: "Missing addend within 20",
        };
      }
    }
  };

  // G1 – Add/Sub within 100
  window.buildG1AddSub100Question = function (opts) {
    const r = difficultyToRange(opts.number, 10, 99);
    const mode =
      opts.number <= 40 ? "add2" : opts.number <= 80 ? "sub2" : "mix";

    if (mode === "add2" || (mode === "mix" && Math.random() < 0.5)) {
      const a = randInt(r.min, r.max),
        b = randInt(r.min, r.max);
      return {
        text: `${a} + ${b} = ?`,
        answer: a + b,
        concept: "Addition within 100",
      };
    } else {
      const a = randInt(r.min, r.max),
        b = randInt(r.min, a);
      return {
        text: `${a} - ${b} = ?`,
        answer: a - b,
        concept: "Subtraction within 100",
      };
    }
  };

  // G1 – Shapes & Patterns
  window.buildG1ShapesPatternsQuestion = function (opts) {
    const shapes = ["circle", "square", "triangle", "rectangle", "hexagon"];

    if (opts.number <= 50) {
      const s = shapes[randInt(0, shapes.length - 1)];
      const sideText =
        s === "circle"
          ? "no straight sides"
          : s === "triangle"
          ? "3 sides"
          : s === "square"
          ? "4 equal sides"
          : "4 sides";
      return {
        text: `Name this shape: It has ${sideText}. What is the shape?`,
        answer: s,
        concept: "Basic 2D shapes",
      };
    } else {
      const s1 = shapes[randInt(0, shapes.length - 1)];
      const s2 = shapes[randInt(0, shapes.length - 1)];
      return {
        text: `Look at the pattern: ${s1}, ${s2}, ${s1}, ${s2}, ... What shape comes next?`,
        answer: s1,
        concept: "Repeating patterns",
      };
    }
  };

  // G1 – Measurement
  window.buildG1MeasurementQuestion = function (opts) {
    if (opts.number <= 50) {
      const len1 = randInt(3, 10);
      const len2 = randInt(3, 10);
      const bigger = len1 > len2 ? "first" : "second";
      return {
        text: `Two pencils are ${len1} units and ${len2} units long. Which pencil is longer (first or second)?`,
        answer: bigger,
        concept: "Comparing length",
      };
    } else {
      const len = randInt(5, 15);
      return {
        text: `A rope is ${len} units long. If you cut it into 1-unit pieces, how many pieces do you get?`,
        answer: len,
        concept: "Length as repeated units",
      };
    }
  };

  // G1 – Time
  window.buildG1TimeQuestion = function (opts) {
    const hours = randInt(1, 12);
    if (opts.number <= 50) {
      return {
        text: `What time is this: ${hours}:00? (answer like 3 o'clock)`,
        answer: `${hours} o'clock`,
        concept: "O'clock times",
      };
    } else {
      return {
        text: `What time is this: ${hours}:30? (answer like 3:30)`,
        answer: `${hours}:30`,
        concept: "Half hour times",
      };
    }
  };

  // G1 – Picture Graphs
  window.buildG1PictureGraphQuestion = function (opts) {
    const apples = randInt(1, 5);
    const bananas = randInt(1, 5);

    if (opts.number <= 50) {
      return {
        text: `A picture graph shows ${apples} apples and ${bananas} bananas. How many fruits are there in total?`,
        answer: apples + bananas,
        concept: "Read picture graph (total)",
      };
    } else {
      const more = Math.abs(apples - bananas);
      return {
        text: `A picture graph shows ${apples} apples and ${bananas} bananas. How many more apples than bananas are there (or bananas than apples)?`,
        answer: more,
        concept: "Compare picture graph",
      };
    }
  };

  // ---------- GRADE 2 ----------

  // G2 – Numbers to 1,000
  window.buildG2NumbersTo1000Question = function (opts) {
    const r = difficultyToRange(opts.number, 100, 999);
    const v = randInt(r.min, r.max);
    const mode =
      opts.number <= 30 ? "place" : opts.number <= 70 ? "compare" : "round";

    if (mode === "place") {
      const hundreds = Math.floor(v / 100);
      const tens = Math.floor((v % 100) / 10);
      const ones = v % 10;
      return {
        text: `${v} = ___ hundreds, ___ tens and ___ ones. Give your answer as h,t,o`,
        answer: `${hundreds},${tens},${ones}`,
        concept: "Place value (hundreds/tens/ones)",
      };
    } else if (mode === "compare") {
      const other = randInt(r.min, r.max);
      const bigger = v > other ? v : other;
      return {
        text: `Which is greater: ${v} or ${other}?`,
        answer: bigger,
        concept: "Compare numbers to 1000",
      };
    } else {
      const roundTo = opts.number <= 85 ? 10 : 100;
      const rounded =
        roundTo === 10 ? Math.round(v / 10) * 10 : Math.round(v / 100) * 100;
      return {
        text: `Round ${v} to the nearest ${roundTo}.`,
        answer: rounded,
        concept: "Rounding numbers",
      };
    }
  };

  // G2 – Add/Sub within 1000
  window.buildG2AddSub1000Question = function (opts) {
    const r = difficultyToRange(opts.number, 50, 500);
    const mode =
      opts.number <= 40 ? "add" : opts.number <= 80 ? "sub" : "2step";

    if (mode === "add") {
      const a = randInt(r.min, r.max),
        b = randInt(r.min, r.max);
      return {
        text: `${a} + ${b} = ?`,
        answer: a + b,
        concept: "Addition within 1000",
      };
    } else if (mode === "sub") {
      const a = randInt(r.min, r.max),
        b = randInt(r.min, a);
      return {
        text: `${a} - ${b} = ?`,
        answer: a - b,
        concept: "Subtraction within 1000",
      };
    } else {
      const a = randInt(r.min, r.max);
      const b = randInt(10, 200);
      const c = randInt(10, 200);
      return {
        text: `${a} + ${b} - ${c} = ?`,
        answer: a + b - c,
        concept: "2-step addition/subtraction",
      };
    }
  };

  // G2 – Multiplication
  window.buildG2MultiplicationQuestion = function (opts) {
    const r = difficultyToRange(opts.number, 2, 9);
    const a = randInt(r.min, r.max);
    const b = randInt(r.min, r.max);

    if (opts.number <= 50) {
      return {
        text: `${a} × ${b} = ?`,
        answer: a * b,
        concept: "Multiplication facts",
      };
    } else {
      return {
        text: `There are ${a} rows of ${b} apples. How many apples are there altogether?`,
        answer: a * b,
        concept: "Arrays / repeated addition",
      };
    }
  };

  // G2 – Division
  window.buildG2DivisionQuestion = function (opts) {
    const r = difficultyToRange(opts.number, 2, 9);
    const a = randInt(r.min, r.max);
    const b = randInt(r.min, r.max);
    const prod = a * b;

    if (opts.number <= 50) {
      return {
        text: `${prod} ÷ ${a} = ?`,
        answer: b,
        concept: "Division facts up to 10×10",
      };
    } else {
      return {
        text: `${prod} ÷ ${b} = ?`,
        answer: a,
        concept: "Division facts up to 10×10",
      };
    }
  };

  // G2 – Money
  window.buildG2MoneyQuestion = function (opts) {
    const dollars = randInt(1, 20);
    const cents = randInt(0, 95);
    const priceCents = dollars * 100 + cents;

    if (opts.number <= 50) {
      return {
        text: `A toy costs $${dollars}.${cents
          .toString()
          .padStart(2, "0")}. How many cents is this in total?`,
        answer: priceCents,
        concept: "Money in cents",
      };
    } else {
      const paid = priceCents + randInt(10, 200);
      const change = paid - priceCents;
      return {
        text: `A toy costs $${dollars}.${cents
          .toString()
          .padStart(2, "0")}. If you pay ${paid} cents, how much change do you get (in cents)?`,
        answer: change,
        concept: "Change from cents",
      };
    }
  };

  // G2 – Measurement
  window.buildG2MeasurementQuestion = function (opts) {
    const len1 = randInt(10, 50);
    const len2 = randInt(10, 50);

    if (opts.number <= 50) {
      return {
        text: `A rope is ${len1} cm long and another is ${len2} cm long. What is their total length?`,
        answer: len1 + len2,
        concept: "Add lengths",
      };
    } else {
      const diff = Math.abs(len1 - len2);
      return {
        text: `A rope is ${len1} cm long and another is ${len2} cm long. What is the difference in their lengths?`,
        answer: diff,
        concept: "Compare lengths",
      };
    }
  };

  // G2 – Word problems
  window.buildG2WordProblemQuestion = function (opts) {
    if (opts.number <= 50) {
      const a = randInt(5, 30);
      const b = randInt(5, 30);
      return {
        text: `Skye has ${a} stickers and Jethro has ${b} stickers. How many stickers do they have altogether?`,
        answer: a + b,
        concept: "Add in context",
      };
    } else {
      const total = randInt(20, 50);
      const part = randInt(5, total - 5);
      return {
        text: `There are ${total} apples. Skye eats ${part} of them. How many apples are left?`,
        answer: total - part,
        concept: "Take away in context",
      };
    }
  };

  // ---------- GRADE 3 ----------

  // G3 – Numbers to 10,000
  window.buildG3NumbersTo10000Question = function (opts) {
    const r = difficultyToRange(opts.number, 1000, 9999);
    const v = randInt(r.min, r.max);
    const mode =
      opts.number <= 30 ? "place" : opts.number <= 70 ? "compare" : "round";

    if (mode === "place") {
      const thousands = Math.floor(v / 1000);
      const hundreds = Math.floor((v % 1000) / 100);
      const tens = Math.floor((v % 100) / 10);
      const ones = v % 10;
      return {
        text: `${v} = ___ thousands, ___ hundreds, ___ tens and ___ ones. Give your answer as th,h,t,o`,
        answer: `${thousands},${hundreds},${tens},${ones}`,
        concept: "Place value to 10,000",
      };
    } else if (mode === "compare") {
      const other = randInt(r.min, r.max);
      const bigger = v > other ? v : other;
      return {
        text: `Which is greater: ${v} or ${other}?`,
        answer: bigger,
        concept: "Compare numbers to 10,000",
      };
    } else {
      const roundTo = opts.number <= 85 ? 100 : 1000;
      const rounded =
        roundTo === 100
          ? Math.round(v / 100) * 100
          : Math.round(v / 1000) * 1000;
      return {
        text: `Round ${v} to the nearest ${roundTo}.`,
        answer: rounded,
        concept: "Rounding numbers",
      };
    }
  };

  // G3 – Multiplication & Division
  window.buildG3MulDivQuestion = function (opts) {
    const r = difficultyToRange(opts.number, 2, 12);

    if (opts.number <= 40) {
      const a = randInt(r.min, r.max);
      const b = randInt(r.min, r.max);
      return {
        text: `${a} × ${b} = ?`,
        answer: a * b,
        concept: "Multiplication facts to 12×12",
      };
    } else if (opts.number <= 70) {
      const a = randInt(r.min, r.max);
      const b = randInt(r.min, r.max);
      const prod = a * b;
      return {
        text: `${prod} ÷ ${a} = ?`,
        answer: b,
        concept: "Division facts to 12×12",
      };
    } else {
      const a = randInt(r.min, r.max);
      const b = randInt(r.min, r.max);
      const prod = a * b;
      if (Math.random() < 0.5) {
        return {
          text: `${prod} ÷ ${a} = ?`,
          answer: b,
          concept: "Division facts up to 10×10",
        };
      } else {
        const c = randInt(2, 9);
        return {
          text: `${a} × ${b} + ${c} = ?`,
          answer: prod + c,
          concept: "2-step multiplication expression",
        };
      }
    }
  };

  // G3 – Fractions (Basic) with Singapore-style progression
  window.buildG3FractionsBasicQuestion = function (opts) {
    const level = Math.max(1, Math.min(100, Number((opts && opts.number) || 1)));
    const simpleDenoms = [2, 3, 4, 5, 6, 8, 10, 12];

    function simplify(num, den) {
      function gcd(a, b) {
        while (b) {
          const t = a % b;
          a = b;
          b = t;
        }
        return Math.abs(a);
      }
      const g = gcd(num, den);
      return { n: num / g, d: den / g };
    }

    // Type A: identify fraction of a whole
    function buildIdentify() {
      const maxDen = level <= 10 ? 5 : level <= 20 ? 8 : 12;
      const candidates = simpleDenoms.filter((d) => d <= maxDen);
      const den = candidates[randInt(0, candidates.length - 1)];
      const num = randInt(1, den - 1);
      const frac = simplify(num, den);
      const text = `A shape is divided into ${den} equal parts and ${num} of them are shaded. What fraction of the shape is shaded? (answer like a/b)`;
      const answer = `${frac.n}/${frac.d}`;
      return {
        text,
        answer,
        concept: "Identify fraction of a whole",
      };
    }

    // Type B: compare two fractions
    function buildCompare() {
      const maxDen = level <= 35 ? 10 : 12;
      const candidates = simpleDenoms.filter((d) => d <= maxDen);

      let d1 = candidates[randInt(0, candidates.length - 1)];
      let d2 = candidates[randInt(0, candidates.length - 1)];

      if (level <= 35) {
        d2 = d1; // same denominator at easier levels
      }

      let n1 = randInt(1, d1 - 1);
      let n2 = randInt(1, d2 - 1);

      let tries = 0;
      while (n1 * d2 === n2 * d1 && tries < 10) {
        n2 = randInt(1, d2 - 1);
        tries++;
      }

      const f1 = simplify(n1, d1);
      const f2 = simplify(n2, d2);
      const leftVal = f1.n / f1.d;
      const rightVal = f2.n / f2.d;

      let bigger;
      let relationWord;
      if (leftVal > rightVal) {
        bigger = `${f1.n}/${f1.d}`;
        relationWord = ">";
      } else if (rightVal > leftVal) {
        bigger = `${f2.n}/${f2.d}`;
        relationWord = "<";
      } else {
        bigger = `${f1.n}/${f1.d}`;
        relationWord = "=";
      }

      const useWhich = level <= 40;
      let text, answer;

      if (useWhich) {
        text = `Which fraction is greater: ${f1.n}/${f1.d} or ${f2.n}/${f2.d}?`;
        answer = bigger;
      } else {
        text = `${f1.n}/${f1.d} __ ${f2.n}/${f2.d}  (use >, <, or =)`;
        answer = relationWord;
      }

      return {
        text,
        answer,
        concept: "Compare fractions",
      };
    }

    // Type C: fraction of a whole number
    function buildOfWhole() {
      const maxDen = level <= 65 ? 10 : 12;
      const candidates = simpleDenoms.filter((d) => d <= maxDen);
      const den = candidates[randInt(0, candidates.length - 1)];
      const num = randInt(1, den - 1);
      const frac = simplify(num, den);

      const base = level <= 60 ? 3 : 5;
      const maxMul = level <= 70 ? 10 : 15;
      const multiplier = randInt(base, maxMul);
      const whole = den * multiplier;

      const text = `What is ${frac.n}/${frac.d} of ${whole}?`;
      const answer = (whole * frac.n) / frac.d;

      return {
        text,
        answer,
        concept: "Fraction of a whole number",
      };
    }

    // Type D: 2-step word problems with fractions
    function buildWord() {
      const candidates = [2, 3, 4, 5, 6, 8];
      const den = candidates[randInt(0, candidates.length - 1)];
      const num = randInt(1, den - 1);
      const frac = simplify(num, den);

      const baseTotal = level <= 90 ? 20 : 30;
      const step = den;
      const k = randInt(2, 5);
      const total = baseTotal + step * k;

      if (Math.random() < 0.5) {
        const used = (total * frac.n) / frac.d;
        const remaining = total - used;
        const text = `Skye has ${total} stickers. She uses ${frac.n}/${frac.d} of them in her notebook. How many stickers does she have left?`;
        return {
          text,
          answer: remaining,
          concept: "2-step fraction word problem (remaining)",
        };
      } else {
        const given = (total * frac.n) / frac.d;
        const text = `A class has ${total} books. ${frac.n}/${frac.d} of them are story books and the rest are textbooks. How many story books are there?`;
        return {
          text,
          answer: given,
          concept: "2-step fraction word problem (given amount)",
        };
      }
    }

    let qType;
    if (level <= 20) qType = "identify";
    else if (level <= 50) qType = "compare";
    else if (level <= 80) qType = "ofWhole";
    else qType = "word";

    if (qType === "identify") return buildIdentify();
    if (qType === "compare") return buildCompare();
    if (qType === "ofWhole") return buildOfWhole();
    return buildWord();
  };

  // G3 – Area & Perimeter
  window.buildG3AreaPerimeterQuestion = function (opts) {
    const w = randInt(2, 10);
    const h = randInt(2, 10);

    if (opts.number <= 50) {
      return {
        text: `A rectangle is ${w} units long and ${h} units wide. What is its perimeter?`,
        answer: 2 * (w + h),
        concept: "Perimeter of rectangles",
      };
    } else {
      return {
        text: `A rectangle is ${w} units long and ${h} units wide. What is its area?`,
        answer: w * h,
        concept: "Area of rectangles",
      };
    }
  };

  // G3 – Bar Models
  window.buildG3BarModelQuestion = function (opts) {
    if (opts.number <= 50) {
      const whole = randInt(20, 60);
      const part = randInt(5, whole - 5);
      return {
        text: `A bar model shows a whole of ${whole} and a part of ${part}. What is the other part?`,
        answer: whole - part,
        concept: "Whole-part bar model",
      };
    } else {
      const a = randInt(5, 30);
      const b = randInt(5, 30);
      return {
        text: `Two parts of a bar model are ${a} and ${b}. What is the whole?`,
        answer: a + b,
        concept: "Parts and whole",
      };
    }
  };

  // G3 – Graphs
  window.buildG3GraphQuestion = function (opts) {
    return {
      text: "Class A has 18 students and Class B has 15 students. How many students in total?",
      answer: 33,
      concept: "Graphs (bar graphs)",
    };
  };

  // G3 – Word problems
  window.buildG3WordProblemQuestion = function (opts) {
    return {
      text: "Skye walks 3 km in the morning and 4 km in the evening. How many km does she walk in total?",
      answer: 7,
      concept: "2-step word problems",
    };
  };

  // ---------- Generic mixed placeholder for higher grades ----------

  window.buildGenericMixedQuestion = function (opts) {
    const a = randInt(10, 99);
    const b = randInt(10, 99);
    return {
      text: `Quick practice: ${a} + ${b} = ?`,
      answer: a + b,
      concept: "Mixed practice placeholder",
    };
  };
})();

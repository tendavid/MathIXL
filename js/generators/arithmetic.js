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

  function choice(arr) {
    return arr[randInt(0, arr.length - 1)];
  }

  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randInt(0, i);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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

  // ---------- Grade 1 generators ----------

  window.buildG1NumbersTo100Question = function (opts) {
    const r = difficultyToRange(opts.number, 1, 99);
    const v = randInt(r.min, r.max);
    const mode = opts.number <= 40 ? "before_after" : "compare";

    if (mode === "before_after") {
      if (Math.random() < 0.5) {
        return {
          text: `What number comes just before ${v}?`,
          answer: v - 1,
          concept: "Number before (within 100)",
        };
      } else {
        return {
          text: `What number comes just after ${v}?`,
          answer: v + 1,
          concept: "Number after (within 100)",
        };
      }
    }

    const w = randInt(r.min, r.max);
    const symbol = v === w ? "=" : v > w ? ">" : "<";
    return {
      text: `Fill in the blank with <, > or = : ${v} ___ ${w}`,
      answer: symbol,
      concept: "Compare numbers to 100",
    };
  };

  window.buildG1AddSub20Question = function (opts) {
    const r = difficultyToRange(opts.number, 1, 20);
    const a = randInt(r.min, r.max);
    const b = randInt(r.min, r.max);

    if (Math.random() < 0.5) {
      return {
        text: `${a} + ${b} = ?`,
        answer: a + b,
        concept: "Addition within 20",
      };
    } else {
      const bigger = Math.max(a, b);
      const smaller = Math.min(a, b);
      return {
        text: `${bigger} - ${smaller} = ?`,
        answer: bigger - smaller,
        concept: "Subtraction within 20",
      };
    }
  };

  window.buildG1AddSub100Question = function (opts) {
    const r = difficultyToRange(opts.number, 10, 99);
    const a = randInt(r.min, r.max);
    const b = randInt(1, 9);

    if (Math.random() < 0.5) {
      return {
        text: `${a} + ${b} = ?`,
        answer: a + b,
        concept: "Addition within 100",
      };
    } else {
      return {
        text: `${a} - ${b} = ?`,
        answer: a - b,
        concept: "Subtraction within 100",
      };
    }
  };

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
    }

    const s1 = choice(shapes);
    const s2 = choice(shapes.filter((x) => x !== s1));
    return {
      text: `Look at the pattern: ${s1}, ${s2}, ${s1}, ${s2}, ... What shape comes next?`,
      answer: s1,
      concept: "Simple patterns",
    };
  };

  window.buildG1MeasurementQuestion = function (opts) {
    const items = [
      { name: "pencil", unit: "cm" },
      { name: "watermelon", unit: "kg" },
      { name: "bottle of water", unit: "L" },
    ];
    const it = choice(items);
    return {
      text: `Which is the most suitable unit to measure a ${it.name}? (cm, m, kg, g, L, mL)`,
      answer: it.unit,
      concept: "Choose appropriate units",
    };
  };

  window.buildG1TimeQuestion = function (opts) {
    const hours = randInt(1, 12);
    const minute = Math.random() < 0.5 ? "00" : "30";
    const label = minute === "00" ? "o'clock" : "half past";
    return {
      text: `The clock shows ${hours}:${minute}. How do we say the time in words? (like "3 o'clock" or "half past 5")`,
      answer: minute === "00" ? `${hours} o'clock` : `half past ${hours}`,
      concept: "Telling time to the hour / half hour",
    };
  };

  window.buildG1PictureGraphQuestion = function (opts) {
    const fruits = ["apples", "oranges", "bananas"];
    const counts = fruits.map(() => randInt(1, 5));
    const total = counts.reduce((a, b) => a + b, 0);
    const targetIndex = randInt(0, fruits.length - 1);
    const target = fruits[targetIndex];
    const count = counts[targetIndex];
    return {
      text: `In a picture graph, each picture stands for 1 fruit. There are ${counts[0]} apples, ${counts[1]} oranges and ${counts[2]} bananas.\nHow many ${target} are there?`,
      answer: count,
      concept: "Read simple picture graphs",
    };
  };

  // ---------- Grade 2 generators ----------

  window.buildG2NumbersTo1000Question = function (opts) {
    const r = difficultyToRange(opts.number, 100, 999);
    const v = randInt(r.min, r.max);

    if (opts.number <= 40) {
      const hundreds = Math.floor(v / 100);
      const tens = Math.floor((v % 100) / 10);
      const ones = v % 10;
      return {
        text: `${v} = ___ hundreds, ___ tens and ___ ones. Give your answer as h,t,o`,
        answer: `${hundreds},${tens},${ones}`,
        concept: "Place value to 1,000",
      };
    }

    const w = randInt(r.min, r.max);
    const symbol = v === w ? "=" : v > w ? ">" : "<";
    return {
      text: `Fill in the blank with <, > or = : ${v} ___ ${w}`,
      answer: symbol,
      concept: "Compare numbers to 1,000",
    };
  };

  window.buildG2AddSub1000Question = function (opts) {
    const r = difficultyToRange(opts.number, 100, 999);
    const a = randInt(r.min, r.max);
    const b = randInt(10, 99);

    if (Math.random() < 0.5) {
      return {
        text: `${a} + ${b} = ?`,
        answer: a + b,
        concept: "Addition within 1,000",
      };
    } else {
      return {
        text: `${a} - ${b} = ?`,
        answer: a - b,
        concept: "Subtraction within 1,000",
      };
    }
  };

  window.buildG2MultiplicationQuestion = function (opts) {
    const r = difficultyToRange(opts.number, 2, 9);
    const a = randInt(r.min, r.max);
    const b = randInt(2, 9);
    return {
      text: `${a} × ${b} = ?`,
      answer: a * b,
      concept: "Multiplication as repeated addition",
    };
  };

  window.buildG2DivisionQuestion = function (opts) {
    const r = difficultyToRange(opts.number, 2, 9);
    const divisor = randInt(r.min, r.max);
    const quotient = randInt(2, 9);
    const dividend = divisor * quotient;
    return {
      text: `${dividend} ÷ ${divisor} = ?`,
      answer: quotient,
      concept: "Division as sharing / grouping",
    };
  };

  window.buildG2MoneyQuestion = function (opts) {
    const dollars = randInt(1, 20);
    const cents = randInt(0, 95);
    const price = dollars + cents / 100;
    const pay = price + randInt(1, 5);
    const change = pay - price;
    return {
      text: `A toy costs $${price.toFixed(2)}. Skye pays $${pay.toFixed(2)}. How much change does she receive?`,
      answer: Number(change.toFixed(2)),
      concept: "Money – find change",
    };
  };

  window.buildG2MeasurementQuestion = function (opts) {
    const length = randInt(10, 100);
    const unit = Math.random() < 0.5 ? "cm" : "m";
    return {
      text: `A rope is ${length} ${unit} long. What is the length of the rope?`,
      answer: length,
      concept: "Reading simple length statements",
    };
  };

  window.buildG2WordProblemQuestion = function (opts) {
    const a = randInt(10, 50);
    const b = randInt(10, 50);
    const mode = Math.random() < 0.5 ? "add" : "sub";

    if (mode === "add") {
      return {
        text: `There are ${a} red balloons and ${b} blue balloons. How many balloons are there altogether?`,
        answer: a + b,
        concept: "Addition in word problems",
      };
    } else {
      const total = a + b;
      return {
        text: `There are ${total} sweets. Skye eats ${a} of them. How many sweets are left?`,
        answer: total - a,
        concept: "Subtraction in word problems",
      };
    }
  };

  // ---------- Grade 3 generators ----------

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
    }

    if (mode === "compare") {
      const w = randInt(r.min, r.max);
      const symbol = v === w ? "=" : v > w ? ">" : "<";
      return {
        text: `Fill in the blank with <, > or = : ${v} ___ ${w}`,
        answer: symbol,
        concept: "Compare numbers to 10,000",
      };
    }

    const roundingMode =
      opts.number <= 85 ? (Math.random() < 0.5 ? 10 : 100) : 1000;
    let rounded;
    if (roundingMode === 10) {
      rounded = Math.round(v / 10) * 10;
    } else if (roundingMode === 100) {
      rounded = Math.round(v / 100) * 100;
    } else {
      rounded = Math.round(v / 1000) * 1000;
    }
    const placeName =
      roundingMode === 10
        ? "nearest ten"
        : roundingMode === 100
        ? "nearest hundred"
        : "nearest thousand";

    return {
      text: `Round ${v} to the ${placeName}.`,
      answer: rounded,
      concept: "Rounding whole numbers",
    };
  };

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
        concept: "Division using multiplication facts",
      };
    } else {
      const a = randInt(10, 99);
      const b = randInt(2, 9);
      return {
        text: `${a} × ${b} = ?`,
        answer: a * b,
        concept: "2-digit by 1-digit multiplication",
      };
    }
  };

  window.buildG3FractionsBasicQuestion = function (opts) {
    const level = Math.max(1, Math.min(100, Number(opts.number) || 1));
    const simpleDenoms = [2, 3, 4, 5, 6, 8, 10, 12];

    function simplify(num, den) {
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
      const text = `A shape is divided into ${den} equal parts and ${num} parts are shaded. What fraction of the shape is shaded? (answer like a/b)`;
      const answer = `${frac.n}/${frac.d}`;
      return {
        text,
        answer,
        concept: "Identify fractions of a whole",
      };
    }

    // Type B: equivalent fractions
    function buildEquivalent() {
      const den = choice([2, 3, 4, 5, 6, 8, 10, 12]);
      const num = randInt(1, den - 1);
      const k = randInt(2, 4);
      const num2 = num * k;
      const den2 = den * k;
      const text = `Fill in the blank so the fractions are equivalent: ${num}/${den} = ___/${den2}`;
      const answer = num2;
      return {
        text,
        answer,
        concept: "Equivalent fractions",
      };
    }

    // Type C: compare fractions with same denominator
    function buildCompare() {
      const den = choice([4, 5, 6, 8, 10, 12]);
      const a = randInt(1, den - 1);
      let b = randInt(1, den - 1);
      while (b === a) b = randInt(1, den - 1);
      const symbol = a === b ? "=" : a > b ? ">" : "<";
      const text = `Fill in the blank with <, > or = : ${a}/${den} ___ ${b}/${den}`;
      const answer = symbol;
      return {
        text,
        answer,
        concept: "Compare fractions with same denominator",
      };
    }

    let builder;
    if (level <= 30) builder = buildIdentify;
    else if (level <= 65) builder = buildEquivalent;
    else builder = buildCompare;

    return builder();
  };

  window.buildG3AreaPerimeterQuestion = function (opts) {
    const level = Math.max(1, Math.min(100, Number(opts.number) || 1));
    const width = randInt(2, 15);
    const height = randInt(2, 15);

    if (level <= 50) {
      return {
        text: `A rectangle has length ${width} cm and breadth ${height} cm. What is its perimeter?`,
        answer: 2 * (width + height),
        concept: "Perimeter of rectangles",
      };
    } else {
      return {
        text: `A rectangle has length ${width} cm and breadth ${height} cm. What is its area?`,
        answer: width * height,
        concept: "Area of rectangles",
      };
    }
  };

  window.buildG3BarModelQuestion = function (opts) {
    const total = randInt(40, 120);
    const part = randInt(10, total - 10);
    const other = total - part;
    const mode = Math.random() < 0.5 ? "part" : "total";

    if (mode === "part") {
      return {
        text: `In a bar model, the total is ${total}. One part is ${part}. What is the other part?`,
        answer: other,
        concept: "Part–whole bar model",
      };
    } else {
      return {
        text: `In a bar model, one part is ${part} and the other part is ${other}. What is the total?`,
        answer: total,
        concept: "Part–whole bar model",
      };
    }
  };

  window.buildG3GraphQuestion = function (opts) {
    return {
      text: "Class A has 18 students and Class B has 15 students. How many students in total?",
      answer: 33,
      concept: "Graphs (bar graphs)",
    };
  };

  window.buildG3WordProblemQuestion = function (opts) {
    return {
      text: "Skye walks 3 km in the morning and 4 km in the evening. How many km does she walk in total?",
      answer: 7,
      concept: "2-step word problems",
    };
  };

  // ---------- Grade 4 – Primary 4 generators ----------

  // Numbers to 100,000 – place value, comparing, rounding
  window.buildG4NumbersTo100kQuestion = function (opts) {
    const level = Math.max(1, Math.min(100, Number(opts.number) || 1));
    const range = difficultyToRange(level, 10000, 99999);
    const value = randInt(range.min, range.max);

    let mode;
    if (level <= 30) {
      mode = "place";
    } else if (level <= 70) {
      mode = "compare";
    } else {
      mode = "round";
    }

    if (mode === "place") {
      const tenThousands = Math.floor(value / 10000);
      const thousands = Math.floor((value % 10000) / 1000);
      const hundreds = Math.floor((value % 1000) / 100);
      const tens = Math.floor((value % 100) / 10);
      const ones = value % 10;

      return {
        text: `${value} = ___ ten-thousands, ___ thousands, ___ hundreds, ___ tens and ___ ones. Give your answer as TT,T,H,T,O`,
        answer: `${tenThousands},${thousands},${hundreds},${tens},${ones}`,
        concept: "Place value to 100,000",
      };
    }

    if (mode === "compare") {
      const other = randInt(range.min, range.max);
      const symbol = value === other ? "=" : value > other ? ">" : "<";
      return {
        text: `Fill in the blank with <, > or = : ${value} ___ ${other}`,
        answer: symbol,
        concept: "Comparing 5-digit numbers",
      };
    }

    // rounding
    const roundingMode = level <= 85 ? (Math.random() < 0.5 ? 10 : 100) : 1000;
    let rounded;
    if (roundingMode === 10) {
      rounded = Math.round(value / 10) * 10;
    } else if (roundingMode === 100) {
      rounded = Math.round(value / 100) * 100;
    } else {
      rounded = Math.round(value / 1000) * 1000;
    }
    const placeName =
      roundingMode === 10 ? "nearest ten" : roundingMode === 100 ? "nearest hundred" : "nearest thousand";

    return {
      text: `Round ${value} to the ${placeName}.`,
      answer: rounded,
      concept: "Rounding whole numbers",
    };
  };

  // Factors & multiples – factors, common multiples, LCM (simple)
  window.buildG4FactorsMultiplesQuestion = function (opts) {
    const level = Math.max(1, Math.min(100, Number(opts.number) || 1));

    function getFacts() {
      const base = level <= 40 ? 30 : level <= 70 ? 60 : 90;
      const n = randInt(12, base);
      return n;
    }

    const n = getFacts();

    if (level <= 35) {
      const k = randInt(2, 9);
      const isFactor = n % k === 0;
      const askIsFactor = Math.random() < 0.5;
      if (askIsFactor) {
        return {
          text: `Is ${k} a factor of ${n}? (answer yes or no)`,
          answer: isFactor ? "yes" : "no",
          concept: "Factors of whole numbers",
        };
      } else {
        const multiple = k * randInt(2, 10);
        const isMultiple = multiple % n === 0;
        return {
          text: `Is ${multiple} a multiple of ${n}? (answer yes or no)`,
          answer: isMultiple ? "yes" : "no",
          concept: "Multiples of whole numbers",
        };
      }
    }

    if (level <= 70) {
      const a = randInt(2, 12);
      const b = randInt(2, 12);
      const lcm = (a * b) / gcd(a, b);
      return {
        text: `Find the least common multiple (LCM) of ${a} and ${b}.`,
        answer: lcm,
        concept: "Least common multiple",
      };
    }

    const a = randInt(20, 60);
    const b = randInt(20, 60);
    const g = gcd(a, b);
    return {
      text: `Find the greatest common factor (GCF) of ${a} and ${b}.`,
      answer: g,
      concept: "Greatest common factor",
    };
  };

  // Multi-digit multiplication – up to 4-digit × 1-digit or 2-digit
  window.buildG4MultiDigitMultiplicationQuestion = function (opts) {
    const level = Math.max(1, Math.min(100, Number(opts.number) || 1));

    if (level <= 50) {
      const a = randInt(100, 999);
      const b = randInt(2, 9);
      return {
        text: `${a} × ${b} = ?`,
        answer: a * b,
        concept: "3-digit by 1-digit multiplication",
      };
    }

    const a = randInt(20, 99);
    const b = randInt(10, 99);
    return {
      text: `${a} × ${b} = ?`,
      answer: a * b,
      concept: "2-digit by 2-digit multiplication",
    };
  };

  // Long division – exact quotients only (no remainder for now)
  window.buildG4LongDivisionQuestion = function (opts) {
    const level = Math.max(1, Math.min(100, Number(opts.number) || 1));

    if (level <= 50) {
      const divisor = randInt(2, 9);
      const quotient = randInt(10, 99);
      const dividend = divisor * quotient;
      return {
        text: `${dividend} ÷ ${divisor} = ?`,
        answer: quotient,
        concept: "Long division by 1-digit divisors",
      };
    }

    const divisor = randInt(11, 25);
    const quotient = randInt(10, 40);
    const dividend = divisor * quotient;
    return {
      text: `${dividend} ÷ ${divisor} = ?`,
      answer: quotient,
      concept: "Long division by 2-digit divisors (exact)",
    };
  };

  // Word problems mixing whole numbers & simple fractions/decimals
  window.buildG4WordProblemsMixedQuestion = function (opts) {
    const level = Math.max(1, Math.min(100, Number(opts.number) || 1));
    const mode =
      level <= 35 ? "addsub" : level <= 70 ? "multdiv" : "fraction";

    if (mode === "addsub") {
      const a = randInt(20, 80);
      const b = randInt(10, 40);
      if (Math.random() < 0.5) {
        return {
          text: `Skye has ${a} stickers. She buys ${b} more stickers. How many stickers does she have now?`,
          answer: a + b,
          concept: "Addition in word problems",
        };
      } else {
        const total = a + b;
        return {
          text: `There are ${total} books on a shelf. ${a} of them are story books and the rest are science books. How many are science books?`,
          answer: total - a,
          concept: "Subtraction in word problems",
        };
      }
    }

    if (mode === "multdiv") {
      const groups = randInt(3, 9);
      const size = randInt(4, 12);
      if (Math.random() < 0.5) {
        return {
          text: `A box holds ${size} oranges. There are ${groups} boxes. How many oranges are there altogether?`,
          answer: groups * size,
          concept: "Multiplication in word problems",
        };
      } else {
        const total = groups * size;
        return {
          text: `There are ${total} marbles shared equally among ${groups} children. How many marbles does each child get?`,
          answer: size,
          concept: "Division in word problems",
        };
      }
    }

    // simple fraction word problem
    const total = randInt(20, 60);
    const parts = [2, 3, 4, 5][randInt(0, 3)];
    const used = total / parts;
    return {
      text: `A rope is ${total} m long. Skye uses 1/${parts} of it to tie some boxes. How many metres of rope does she use?`,
      answer: used,
      concept: "Fraction of a quantity in word problems",
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

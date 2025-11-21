// js/curriculum.js

// -----------------------------
// 7 US-style topics per grade
// -----------------------------
const curriculumTopics = {
  1: [
    { name: "Counting & Comparing Numbers to 120", key: "g1_count_compare" },
    { name: "Add & Subtract within 20", key: "g1_add_sub_20" },
    { name: "Place Value (Tens & Ones)", key: "g1_place_value" },
    { name: "Shapes & Equal Parts", key: "g1_shapes" },
    { name: "Length, Time, and Money", key: "g1_measure" },
    { name: "Basic Word Problems (Add/Sub)", key: "g1_word" },
    { name: "Mixed Review (Grade 1 Skills)", key: "g1_mixed" }
  ],
  2: [
    { name: "Place Value to 1000", key: "g2_place_value_1000" },
    { name: "Add & Subtract within 1000", key: "g2_add_sub_1000" },
    { name: "Intro to Multiplication & Division", key: "g2_mul_div_intro" },
    { name: "Time, Money & Measurement", key: "g2_measure" },
    { name: "Shapes & Partitioning", key: "g2_shapes" },
    { name: "Two-Step Word Problems", key: "g2_word" },
    { name: "Mixed Review (Grade 2 Skills)", key: "g2_mixed" }
  ],
  3: [
    { name: "Multiplication & Division Facts", key: "g3_mul_div" },
    { name: "Division with Remainders", key: "g3_div_remainder" },
    { name: "Intro Fractions", key: "g3_fractions" },
    { name: "Area & Perimeter (Rectangles)", key: "g3_area_perimeter" },
    { name: "Number Lines & Fractions", key: "g3_frac_numberline" },
    { name: "Measurement (Mass & Capacity)", key: "g3_measure" },
    { name: "Multi-Step Word Problems", key: "g3_word" }
  ],
  4: [
    { name: "Fractions (Add/Sub Like Denominators)", key: "g4_frac_add_sub" },
    { name: "Fractions (Equivalence & Compare)", key: "g4_frac_compare" },
    { name: "Multi-Digit Multiplication", key: "g4_multi_mul" },
    { name: "Long Division (1-digit divisors)", key: "g4_long_div" },
    { name: "Factors & Multiples", key: "g4_factors" },
    { name: "Angles & Lines", key: "g4_angles" },
    { name: "Word Problems with Fractions", key: "g4_word" }
  ],
  5: [
    { name: "Add & Subtract Fractions", key: "g5_frac_add_sub" },
    { name: "Multiply & Divide Fractions", key: "g5_frac_mul_div" },
    { name: "Decimal Place Value & Operations", key: "g5_decimals" },
    { name: "Volume (Rectangular Prisms)", key: "g5_volume" },
    { name: "Intro to Percent", key: "g5_percent" },
    { name: "Patterns & Graphing", key: "g5_patterns" },
    { name: "Multi-Step Word Problems", key: "g5_word" }
  ],
  6: [
    { name: "Ratios & Unit Rates", key: "g6_ratios" },
    { name: "Fractions, Decimals, Percents", key: "g6_frac_dec_percent" },
    { name: "Expressions & Equations (Intro)", key: "g6_equations" },
    { name: "Area, Surface Area, Volume", key: "g6_geometry" },
    { name: "Statistics: Data & Measures", key: "g6_stats" },
    { name: "Integers & the Number Line", key: "g6_integers" },
    { name: "Rate & Ratio Word Problems", key: "g6_word" }
  ],
  7: [
    { name: "Operations with Rational Numbers", key: "g7_rational" },
    { name: "Algebraic Expressions & Properties", key: "g7_expressions" },
    { name: "Linear Equations in One Variable", key: "g7_linear_eq" },
    { name: "Proportional Relationships", key: "g7_proportion" },
    { name: "Geometry: Angles & Triangles", key: "g7_geometry" },
    { name: "Probability (Intro)", key: "g7_prob" },
    { name: "Algebra & Proportion Word Problems", key: "g7_word" }
  ],
  8: [
    { name: "Linear Equations & Systems", key: "g8_linear_systems" },
    { name: "Functions & Graphs", key: "g8_functions" },
    { name: "Exponents & Scientific Notation", key: "g8_exponents" },
    { name: "Pythagorean Theorem", key: "g8_pythagorean" },
    { name: "Transformations & Similarity", key: "g8_similarity" },
    { name: "Volume of Cylinders & Cones", key: "g8_volume" },
    { name: "Statistics (Two-Variable Data)", key: "g8_stats" }
  ],
  9: [
    { name: "Linear & Quadratic Expressions", key: "g9_expr" },
    { name: "Factoring Quadratics", key: "g9_factoring" },
    { name: "Solving Quadratic Equations", key: "g9_quadratics" },
    { name: "Linear Inequalities", key: "g9_inequalities" },
    { name: "Intro to Functions", key: "g9_functions" },
    { name: "Right Triangle Trigonometry (Intro)", key: "g9_trig" },
    { name: "Geometry: Circles & Area", key: "g9_circles" }
  ],
  10: [
    { name: "Quadratic Functions (Graphs & Roots)", key: "g10_quadratic_functions" },
    { name: "Polynomials (Add/Sub/Multiply)", key: "g10_polynomials" },
    { name: "Rational Expressions (Simplify)", key: "g10_rational" },
    { name: "Exponential Functions", key: "g10_exponential" },
    { name: "Right Triangle Trigonometry", key: "g10_trig" },
    { name: "Coordinate Geometry (Lines)", key: "g10_coordinate" },
    { name: "Statistics (Spread & Variability)", key: "g10_stats" }
  ],
  11: [
    { name: "Exponential & Logarithmic Functions", key: "g11_exp_log" },
    { name: "Quadratic & Polynomial Applications", key: "g11_poly_app" },
    { name: "Sequences & Series", key: "g11_sequences" },
    { name: "Probability & Combinatorics", key: "g11_prob" },
    { name: "Rational Functions (Advanced)", key: "g11_rational" },
    { name: "Trigonometric Functions", key: "g11_trig" },
    { name: "Algebraic Modeling Word Problems", key: "g11_word" }
  ],
  12: [
    { name: "Trigonometric Identities & Equations", key: "g12_trig_id" },
    { name: "Limits (Intro idea)", key: "g12_limits" },
    { name: "Derivatives (Concept & Basics)", key: "g12_derivatives" },
    { name: "Advanced Sequences & Series", key: "g12_sequences" },
    { name: "Vectors (Basics)", key: "g12_vectors" },
    { name: "Statistics (Spread & Normal Ideas)", key: "g12_stats" },
    { name: "Non-Routine Algebra/Function Problems", key: "g12_challenge" }
  ]
};

// -----------------------------
// Core numeric templates used by many grades
// -----------------------------
function buildAddSubQuestion(grade, diff, maxBasic) {
  const max = Math.round(maxBasic + diff * maxBasic * 2);
  let a = randomInt(0, max);
  let b = randomInt(0, max);
  const op = Math.random() < 0.5 ? "+" : "-";
  let text, answer;

  if (op === "+") {
    const prompt = gradePrompt(
      grade,
      `What is ${a} + ${b}?`,
      `Find the value of ${a} + ${b}.`,
      `Evaluate ${a} + ${b}.`
    );
    text = prompt;
    answer = a + b;
  } else {
    const bigger = Math.max(a, b);
    const smaller = Math.min(a, b);
    const prompt = gradePrompt(
      grade,
      `What is ${bigger} - ${smaller}?`,
      `Find the value of ${bigger} - ${smaller}.`,
      `Evaluate ${bigger} - ${smaller}.`
    );
    text = prompt;
    answer = bigger - smaller;
  }

  const concept = "Addition/Subtraction of whole numbers";
  const hint = gradePrompt(
    grade,
    "Think if you are putting numbers together (add) or taking away (subtract).",
    "Decide if this situation adds to or subtracts from the starting amount.",
    "Interpret the operation as combining amounts or computing a difference."
  );
  const explanation =
    "Addition combines quantities. Subtraction finds how much is left or the difference between two numbers.";
  const example =
`Example (step by step):
We want to find 27 − 15.
1. Subtract ones: 7 − 5 = 2.
2. Subtract tens: 2 tens − 1 ten = 1 ten.
3. So 27 − 15 = 12.`;

  return { text, answer, concept, hint, explanation, example };
}

function buildMulDivFactsQuestion(grade, diff) {
  const scale = 5 + diff * 10;
  const maxFactor = Math.max(5, Math.round(scale));
  const a = randomInt(2, maxFactor);
  const b = randomInt(2, maxFactor);
  const useMul = Math.random() < 0.7;
  let text, answer;

  if (useMul) {
    const prompt = gradePrompt(
      grade,
      `What is ${a} × ${b}?`,
      `Find the product of ${a} and ${b}.`,
      `Evaluate ${a} · ${b}.`
    );
    text = prompt;
    answer = a * b;
  } else {
    const product = a * b;
    const prompt = gradePrompt(
      grade,
      `What is ${product} ÷ ${a}?`,
      `Find the value of ${product} ÷ ${a}.`,
      `Evaluate ${product} / ${a}.`
    );
    text = prompt;
    answer = b;
  }

  const concept = "Multiplication and division as equal groups.";
  const hint = gradePrompt(
    grade,
    "Multiplication is 'groups of'. Division is sharing into equal groups.",
    "Think of multiplication as repeated addition, and division as splitting into equal groups.",
    "Model multiplication as repeated addition and division as the inverse operation."
  );
  const example =
`Example (step by step):
There are 4 groups with 6 apples in each group.
1. There are 4 equal groups of 6.
2. Multiply: 4 × 6 = 24.
So there are 24 apples in all.`;

  return { text, answer, concept, hint, explanation: hint, example };
}

function buildFractionOfNumberQuestion(grade, diff) {
  const denomOptions = [2, 3, 4, 5, 6, 8];
  const denom = denomOptions[randomInt(0, denomOptions.length - 1)];
  const numer = randomInt(1, denom - 1);

  const base = 10 + Math.round(diff * 80);
  const whole = denom * randomInt(2, Math.max(3, Math.round(base / denom)));

  const answer = (whole / denom) * numer;

  const prompt = gradePrompt(
    grade,
    `What is ${numer}/${denom} of ${whole}?`,
    `Find ${numer}/${denom} of ${whole}.`,
    `Determine the value of ${numer}/${denom} · ${whole}.`
  );

  const concept = "Fraction of a whole number";
  const hint = gradePrompt(
    grade,
    "Use the bottom number (denominator) to split into equal parts, then count the top number (numerator) of those parts.",
    "Divide the whole by the denominator first, then multiply by the numerator.",
    "Interpret the fraction as (numerator/denominator) and multiply by the whole."
  );
  const explanation =
`To find a fraction of a number:
1. Divide the whole by the denominator to get one part.
2. Multiply that part by the numerator to get the fraction of the whole.`;
  const example =
`Example (step by step):
Find 3/4 of 24.
1. Denominator 4 → split 24 into 4 equal parts: 24 ÷ 4 = 6.
2. Numerator 3 → take 3 parts: 3 × 6 = 18.
So 3/4 of 24 is 18.`;

  return { text: prompt, answer, concept, hint, explanation, example };
}

function buildLinearEquationQuestion(grade, diff) {
  const allowNegative = grade >= 7;
  const maxX = 10 + Math.round(diff * 20);
  const x = allowNegative ? randomInt(-maxX, maxX) : randomInt(1, maxX);
  const a = randomInt(2, 9);
  const b = allowNegative ? randomInt(-20, 20) : randomInt(0, 20);
  const c = a * x + b;

  const text = gradePrompt(
    grade,
    `Solve for x: ${a}x + ${b} = ${c}`,
    `Solve the equation for x: ${a}x + ${b} = ${c}`,
    `Solve for x in ${a}x + ${b} = ${c}.`
  );
  const answer = x;
  const concept = "Solving linear equations in one variable";
  const hint = gradePrompt(
    grade,
    "Undo what happens to x step by step on both sides.",
    "Use inverse operations to isolate x on one side of the equation.",
    "Apply inverse operations to obtain x and keep the equation balanced."
  );
  const explanation =
`To solve a linear equation:
1. Undo addition or subtraction first.
2. Then undo multiplication or division.
3. Whatever you do to one side, do to the other.`;
  const example =
`Example (step by step):
Solve 3x + 5 = 20.
1. Subtract 5 from both sides: 3x = 15.
2. Divide both sides by 3: x = 15 ÷ 3 = 5.
3. Check: 3(5) + 5 = 20 ✔`;

  return { text, answer, concept, hint, explanation, example };
}

function buildIntegerQuestion(grade, diff) {
  const spread = 10 + Math.round(diff * 40);
  const a = randomInt(-spread, spread);
  const b = randomInt(-spread, spread);
  const op = Math.random() < 0.5 ? "+" : "-";

  let text, answer;
  if (op === "+") {
    text = gradePrompt(
      grade,
      `What is (${a}) + (${b})?`,
      `Find the value of (${a}) + (${b}).`,
      `Evaluate (${a}) + (${b}).`
    );
    answer = a + b;
  } else {
    text = gradePrompt(
      grade,
      `What is (${a}) - (${b})?`,
      `Find the value of (${a}) - (${b}).`,
      `Evaluate (${a}) - (${b}).`
    );
    answer = a - b;
  }

  const concept = "Integer addition and subtraction";
  const hint =
    "Think of a number line: adding moves right, subtracting moves left. Negative signs reverse direction.";
  const explanation =
`Negative numbers lie to the left of zero. Adding a negative moves left; subtracting a negative moves right.`;
  const example =
`Example (step by step):
Compute −3 + 7.
1. Start at −3 on the number line.
2. Move 7 steps to the right.
3. You land on 4.
So −3 + 7 = 4.`;

  return { text, answer, concept, hint, explanation, example };
}

function buildRateQuestion(grade, diff) {
  const speed = 20 + Math.round(diff * 60);
  const time = 1 + randomInt(0, 4);
  const distance = speed * time;
  const mode = Math.random();
  let text, answer;

  if (mode < 0.5) {
    text = gradePrompt(
      grade,
      `A car travels at ${speed} miles per hour for ${time} hours. How far does it go? (in miles)`,
      `A car travels at ${speed} mph for ${time} hours. Find the distance (miles).`,
      `A car moves at ${speed} mph for ${time} hours. Determine the distance traveled.`
    );
    answer = distance;
  } else {
    text = gradePrompt(
      grade,
      `A car travels ${distance} miles in ${time} hours. What is its speed? (in miles per hour)`,
      `A car travels ${distance} miles in ${time} hours. Find its speed (mph).`,
      `A car covers ${distance} miles in ${time} hours. Determine the average speed.`
    );
    answer = Math.round(distance / time);
  }

  const concept = "Speed, distance, and time relationship";
  const hint =
    "Use the relationship d = r × t. You can solve for distance, rate, or time by rearranging the formula.";
  const explanation =
`The formula d = r × t links distance, rate, and time.
• To find distance: d = r × t
• To find rate: r = d ÷ t
• To find time: t = d ÷ r`;
  const example =
`Example (step by step):
A car drives at 60 mph for 2 hours.
1. Use d = r × t.
2. Substitute: d = 60 × 2 = 120.
So the car travels 120 miles.`;

  return { text, answer, concept, hint, explanation, example };
}

// Very simple trig template (right triangles)
function buildTrigQuestion(grade, diff) {
  const hyp = randomInt(5, 20);
  const opp = randomInt(3, hyp - 1);
  const useSin = Math.random() < 0.5;

  let text, answer;
  if (useSin) {
    text = gradePrompt(
      grade,
      `In a right triangle, the hypotenuse is ${hyp} and the side opposite angle A is ${opp}. About what is sin A? (Round to 2 decimal places)`,
      `In a right triangle, the hypotenuse is ${hyp} and the side opposite angle A is ${opp}. Approximate sin A to 2 decimal places.`,
      `In a right triangle with hypotenuse ${hyp} and opposite side ${opp} to ∠A, evaluate sin A (2 decimal places).`
    );
    answer = parseFloat((opp / hyp).toFixed(2));
  } else {
    const adj = randomInt(3, hyp - 1);
    text = gradePrompt(
      grade,
      `In a right triangle, the hypotenuse is ${hyp} and the side next to angle B is ${adj}. About what is cos B? (Round to 2 decimal places)`,
      `In a right triangle, the hypotenuse is ${hyp} and the side adjacent to angle B is ${adj}. Approximate cos B to 2 decimal places.`,
      `In a right triangle with hypotenuse ${hyp} and adjacent side ${adj} to ∠B, evaluate cos B (2 decimal places).`
    );
    answer = parseFloat((adj / hyp).toFixed(2));
  }

  const concept = "Trigonometric ratios in right triangles";
  const hint =
    "Use SOH-CAH-TOA: sin = opposite/hypotenuse, cos = adjacent/hypotenuse, tan = opposite/adjacent.";
  const explanation =
`In a right triangle, trigonometric ratios relate sides to angles.
• sin θ = opposite ÷ hypotenuse
• cos θ = adjacent ÷ hypotenuse
• tan θ = opposite ÷ adjacent`;
  const example =
`Example (step by step):
Hypotenuse = 10, opposite to angle A = 6.
1. Use sin A = opposite ÷ hypotenuse.
2. sin A = 6 ÷ 10 = 0.6.
So sin A ≈ 0.60.`;

  return { text, answer, concept, hint, explanation, example };
}

// Basic quadratic template
function buildQuadraticQuestion(grade, diff) {
  const mode = Math.random();
  if (mode < 0.5) {
    const a = randomInt(1, 5);
    const b = randomInt(-5, 5);
    const c = randomInt(-10, 10);
    const x = randomInt(-4, 4);
    const val = a * x * x + b * x + c;
    const text = gradePrompt(
      grade,
      `Let f(x) = ${a}x² + ${b}x + ${c}. What is f(${x})?`,
      `Given f(x) = ${a}x² + ${b}x + ${c}, find f(${x}).`,
      `Evaluate f(${x}) for f(x) = ${a}x² + ${b}x + ${c}.`
    );
    const concept = "Evaluating quadratic functions";
    const hint = "Substitute x into the expression and follow the order of operations.";
    const explanation =
`To evaluate a quadratic function, replace x with the given value and compute carefully, applying exponents before multiplication and addition.`;
    const example =
`Example (step by step):
f(x) = 2x² - 3x + 1, find f(2).
1. Substitute x = 2: f(2) = 2·(2²) - 3·2 + 1.
2. Compute 2² = 4 → 2·4 = 8.
3. Compute -3·2 = -6.
4. So f(2) = 8 - 6 + 1 = 3.`;
    return { text, answer: val, concept, hint, explanation, example };
  } else {
    const r1 = randomInt(-5, 5) || 1;
    const r2 = randomInt(-5, 5) || 2;
    const b = -(r1 + r2);
    const c = r1 * r2;
    const text = gradePrompt(
      grade,
      `Factor the quadratic: x² ${b >= 0 ? "+ " + b : "- " + (-b)}x ${c >= 0 ? "+ " + c : "- " + (-c)}. Give the value of one root.`,
      `Factor x² ${b >= 0 ? "+ " + b : "- " + (-b)}x ${c >= 0 ? "+ " + c : "- " + (-c)}, then state one root.`,
      `Factor x² ${b >= 0 ? "+ " + b : "- " + (-b)}x ${c >= 0 ? "+ " + c : "- " + (-c)} and give one solution of the equation x² + ${b}x + ${c} = 0.`
    );
    const concept = "Factoring simple quadratics and finding roots";
    const hint =
      "Look for two numbers that multiply to c and add to b. Those give you (x - r₁)(x - r₂).";
    const explanation =
`For x² + bx + c, if you can find integers r₁ and r₂ with r₁ + r₂ = -b and r₁·r₂ = c, then
x² + bx + c = (x - r₁)(x - r₂). The roots are x = r₁ and x = r₂.`;
    const example =
`Example (step by step):
Factor x² - 5x + 6.
1. Find two numbers that multiply to 6 and add to -5: -2 and -3.
2. Write x² - 5x + 6 = (x - 2)(x - 3).
3. Roots: x = 2 or x = 3.`;
    return { text, answer: r1, concept, hint, explanation, example };
  }
}

// -----------------------------
// NEW: Word problem builders
// -----------------------------

// Grade 1 one-step add/sub word problem
function buildOneStepWordProblemQuestion(grade, diff) {
  const names = ["Liam", "Emma", "Noah", "Ava", "Mia", "Ethan", "Lucas", "Chloe"];
  const items = ["apples", "stickers", "marbles", "blocks", "pencils", "toy cars"];
  const name = names[randomInt(0, names.length - 1)];
  const item = items[randomInt(0, items.length - 1)];

  const max = 10 + Math.round(diff * 20); // small for G1
  let a = randomInt(3, max);
  let b = randomInt(2, max);

  const useAdd = Math.random() < 0.5;
  let text, answer, concept;

  if (useAdd) {
    text = `${name} has ${a} ${item}. ${gradePrompt(
      grade,
      `Then ${name} gets ${b} more ${item}. How many ${item} does ${name} have now?`,
      `Then ${name} receives ${b} more ${item}. How many ${item} does ${name} have in all?`,
      `Then ${name} receives ${b} additional ${item}. How many ${item} does ${name} have altogether?`
    )}`;
    answer = a + b;
    concept = "One-step addition word problem";
  } else {
    const total = a + b;
    text = `${name} has ${total} ${item}. ${gradePrompt(
      grade,
      `${name} gives ${b} ${item} to a friend. How many ${item} does ${name} have left?`,
      `${name} gives away ${b} ${item}. How many ${item} remain?`,
      `${name} gives away ${b} of them. How many ${item} remain?`
    )}`;
    answer = total - b;
    concept = "One-step subtraction word problem";
  }

  const hint = gradePrompt(
    grade,
    "Decide if the story is putting together (add) or taking away (subtract).",
    "Translate the story into a number sentence using + or −.",
    "Model the situation with an addition or subtraction equation."
  );
  const explanation =
`In a one-step word problem, the story describes a single change:
• If the amount increases, use addition.
• If the amount decreases, use subtraction.`;
  const example =
`Example (step by step):
Mia has 7 apples and gets 5 more. How many apples does she have now?
1. Start with 7 apples.
2. She gets 5 more → add: 7 + 5.
3. 7 + 5 = 12.
So Mia has 12 apples.`;

  return { text, answer, concept, hint, explanation, example };
}

// Grade 2–3 two-step add/sub word problem
function buildTwoStepWordProblemQuestion(grade, diff) {
  const names = ["Liam", "Emma", "Noah", "Ava", "Mia", "Ethan", "Lucas", "Chloe"];
  const items = ["stickers", "marbles", "books", "blocks", "cards", "toy cars"];
  const name = names[randomInt(0, names.length - 1)];
  const item = items[randomInt(0, items.length - 1)];

  const base = 20 + Math.round(diff * 80);
  const start = randomInt(10, base);
  const gain = randomInt(5, Math.max(6, Math.round(base / 2)));
  const lose = randomInt(3, gain - 1);

  const pattern = Math.random() < 0.5 ? "add-then-sub" : "sub-then-add";
  let text, answer;

  if (pattern === "add-then-sub") {
    text = `${name} has ${start} ${item}. ${gradePrompt(
      grade,
      `${name} gets ${gain} more ${item}, then gives ${lose} ${item} to a friend. How many ${item} does ${name} have now?`,
      `${name} receives ${gain} more ${item}, then gives away ${lose}. How many ${item} remain?`,
      `${name} receives ${gain} additional ${item}, then gives ${lose} away. How many ${item} does ${name} have in the end?`
    )}`;
    answer = start + gain - lose;
  } else {
    const total = start + gain;
    text = `${name} has ${total} ${item}. ${gradePrompt(
      grade,
      `${name} gives ${gain} ${item} to a friend, then buys ${lose} more ${item}. How many ${item} does ${name} have now?`,
      `${name} first gives away ${gain} ${item}, then buys ${lose} more. How many ${item} remain?`,
      `${name} gives away ${gain} ${item}, then purchases ${lose} more. How many ${item} does ${name} end with?`
    )}`;
    answer = total - gain + lose;
  }

  const concept = "Two-step word problems with addition and subtraction";
  const hint =
    "Break the story into two simpler steps. Do the first change, then the second. Keep track of the running total.";
  const explanation =
`Two-step word problems have two changes:
1. Use addition for an increase or something gained.
2. Use subtraction for a decrease or something lost.
3. Apply the first step, then use that result for the second step.`;
  const example =
`Example (step by step):
Lena has 35 stickers. She gets 18 more, then gives 12 to her friend. How many stickers does she have now?
1. Start with 35.
2. Add the ones she gets: 35 + 18 = 53.
3. Subtract the ones she gives away: 53 − 12 = 41.
So Lena has 41 stickers.`;

  return { text, answer, concept, hint, explanation, example };
}

// Fraction word problems (Grade 4–5)
function buildFractionWordProblemQuestion(grade, diff) {
  const items = ["pizza", "cake", "chocolate bar", "pan of brownies"];
  const item = items[randomInt(0, items.length - 1)];
  const denomOptions = [2, 3, 4, 5, 6, 8];
  const denom = denomOptions[randomInt(0, denomOptions.length - 1)];
  const numer = randomInt(1, denom - 1);
  const whole = randomInt(1, 5);

  const totalPieces = whole * denom;
  const eaten = (totalPieces / denom) * numer;

  const text = gradePrompt(
    grade,
    `A ${item} is cut into ${denom} equal pieces. There are ${whole} ${item}s. If someone eats ${numer}/${denom} of all the pieces, how many pieces are eaten?`,
    `A ${item} pan is cut into ${denom} equal pieces, and there are ${whole} such pans. Someone eats ${numer}/${denom} of all the pieces. How many pieces is that?`,
    `A ${item} pan is divided into ${denom} congruent pieces, and there are ${whole} pans. If a person eats ${numer}/${denom} of the total pieces, how many pieces do they eat?`
  );

  const concept = "Word problems involving a fraction of a whole";
  const hint =
    "First find how many equal pieces there are in all, then take the fraction of that total.";
  const explanation =
`To solve a fraction word problem:
1. Find the total number of equal parts.
2. Multiply that total by the fraction to see how many parts are used or eaten.`;
  const example =
`Example (step by step):
A cake is cut into 8 pieces. There are 2 cakes. If someone eats 3/8 of all the pieces, how many pieces are eaten?
1. Each cake has 8 pieces; 2 cakes → 2 × 8 = 16 pieces total.
2. Take 3/8 of 16: 16 ÷ 8 = 2, then 2 × 3 = 6.
So 6 pieces are eaten.`;

  return { text, answer: eaten, concept, hint, explanation, example };
}

// NEW: Time / Money / Measurement word problems (G1–G3)
function buildTimeMoneyMeasurementQuestion(grade, diff) {
  const band = getGradeBand(grade);
  const itemSets = [
    ["notebook", "pen"],
    ["toy", "game"],
    ["book", "bookmark"],
    ["t-shirt", "hat"]
  ];
  const pair = itemSets[randomInt(0, itemSets.length - 1)];
  const item1 = pair[0];
  const item2 = pair[1];

  const maxPrice =
    band === "elem"
      ? 20
      : band === "mid"
      ? 40
      : 60;

  function makePrice(max) {
    const dollars = randomInt(1, max);
    const centsOptions = [0, 25, 50, 75];
    const cents = centsOptions[randomInt(0, centsOptions.length - 1)];
    return parseFloat((dollars + cents / 100).toFixed(2));
  }

  const mode = Math.random();
  let text;
  let answer;
  const concept = "Time, money, and measurement word problems";

  if (mode < 0.5) {
    // Money total
    const p1 = makePrice(maxPrice);
    const p2 = makePrice(maxPrice);
    const total = parseFloat((p1 + p2).toFixed(2));
    text = gradePrompt(
      grade,
      `A ${item1} costs $${p1.toFixed(2)} and a ${item2} costs $${p2.toFixed(2)}. How much do they cost together (in dollars)?`,
      `A ${item1} costs $${p1.toFixed(2)} and a ${item2} costs $${p2.toFixed(2)}. Find the total cost in dollars.`,
      `A ${item1} costs $${p1.toFixed(2)} and a ${item2} costs $${p2.toFixed(2)}. Determine the sum of the two prices (in dollars).`
    );
    answer = total;
  } else if (mode < 0.8) {
    // Change from payment
    const price = makePrice(maxPrice);
    const extra = randomInt(1, 5);
    const pay = Math.ceil(price) + extra;
    const change = parseFloat((pay - price).toFixed(2));
    text = gradePrompt(
      grade,
      `An item costs $${price.toFixed(2)}. You pay $${pay.toFixed(
        2
      )}. How much change should you get back (in dollars)?`,
      `An item costs $${price.toFixed(2)}, and you pay $${pay.toFixed(
        2
      )}. Find the change in dollars.`,
      `An item is priced at $${price.toFixed(2)} and you pay $${pay.toFixed(
        2
      )}. Determine the change you should receive (in dollars).`
    );
    answer = change;
  } else {
    // Length measurement
    const unit = "meters";
    const startLen = randomInt(10, 40) + randomInt(0, 9) / 10;
    const cut = parseFloat((randomInt(1, 9) / 10 + randomInt(1, 5)).toFixed(1));
    const remain = parseFloat((startLen - cut).toFixed(1));
    text = gradePrompt(
      grade,
      `A rope is ${startLen.toFixed(1)} ${unit} long. If ${cut.toFixed(
        1
      )} ${unit} are cut off, how many ${unit} of rope remain?`,
      `A rope is ${startLen.toFixed(1)} ${unit} long. ${cut.toFixed(
        1
      )} ${unit} are cut off. Find the remaining length in ${unit}.`,
      `A rope has length ${startLen.toFixed(1)} ${unit}. If ${cut.toFixed(
        1
      )} ${unit} are removed, determine the remaining length (in ${unit}).`
    );
    answer = remain;
  }

  const hint = gradePrompt(
    grade,
    "Decide if you are putting amounts together or finding how much is left.",
    "Translate the situation into addition or subtraction with the units (dollars or meters).",
    "Model the context using an addition or subtraction equation with appropriate units."
  );
  const explanation =
`Time, money, and measurement word problems still use the same basic operations:
• Add amounts when you combine or total things.
• Subtract amounts when you remove something or find what is left.`;
  const example =
`Example (step by step):
A notebook costs $3.50 and a pen costs $2.25. How much do they cost together?
1. Add the dollars and cents: 3.50 + 2.25.
2. 3.50 + 2.25 = 5.75.
So the total cost is $5.75.`;

  return { text, answer, concept, hint, explanation, example };
}

// NEW: Angle questions (supplementary, complementary, triangle sum)
function buildAngleQuestion(grade, diff) {
  const mode = Math.random();
  let text;
  let answer;

  if (mode < 0.4) {
    // Complementary (sum 90)
    const a = randomInt(10, 80);
    answer = 90 - a;
    text = gradePrompt(
      grade,
      `Two angles are complementary. One angle measures ${a}°. What is the measure of the other angle?`,
      `Two angles are complementary (they add to 90°). One angle is ${a}°. Find the measure of the other angle.`,
      `Two angles form a complementary pair. If one angle is ${a}°, determine the measure of the other angle.`
    );
  } else if (mode < 0.8) {
    // Supplementary (sum 180)
    const a = randomInt(30, 150);
    answer = 180 - a;
    text = gradePrompt(
      grade,
      `Two angles are supplementary. One angle measures ${a}°. What is the measure of the other angle?`,
      `Two angles are supplementary (they add to 180°). One angle is ${a}°. Find the measure of the other angle.`,
      `Two angles form a supplementary pair. If one angle is ${a}°, determine the measure of the other angle.`
    );
  } else {
    // Triangle sum
    const a = randomInt(20, 100);
    const b = randomInt(20, 100);
    answer = 180 - a - b;
    text = gradePrompt(
      grade,
      `In a triangle, two angles measure ${a}° and ${b}°. What is the measure of the third angle?`,
      `The measures of two angles in a triangle are ${a}° and ${b}°. Find the measure of the third angle.`,
      `A triangle has angles of ${a}° and ${b}°. Determine the measure of the third angle.`
    );
  }

  const concept = "Angles on a line, in triangles, and complementary/supplementary relationships";
  const hint = gradePrompt(
    grade,
    "Use the facts: a straight line is 180°, complementary angles add to 90°, and the angles in a triangle add to 180°.",
    "Remember: complementary angles sum to 90°, supplementary angles sum to 180°, and triangle angles also sum to 180°.",
    "Apply angle-sum relationships: complementary (90°), supplementary (180°), and triangle sum (180°)."
  );
  const explanation =
`Important angle facts:
• Complementary angles add up to 90°.
• Supplementary angles add up to 180°.
• The three angles in any triangle add up to 180°.`;
  const example =
`Example (step by step):
Two angles are supplementary. One angle is 65°. What is the other angle?
1. Supplementary angles sum to 180°.
2. Subtract: 180° − 65° = 115°.
So the other angle measures 115°.`;

  return { text, answer, concept, hint, explanation, example };
}

// NEW: Area & perimeter for rectangles
function buildAreaPerimeterQuestion(grade, diff) {
  const length = randomInt(3, 15 + Math.round(diff * 10));
  const width = randomInt(2, 15);
  const mode = Math.random();
  let text;
  let answer;
  const unit = "meters";

  if (mode < 0.5) {
    // Area
    answer = length * width;
    text = gradePrompt(
      grade,
      `A rectangle is ${length} ${unit} long and ${width} ${unit} wide. What is its area in square ${unit}?`,
      `A rectangle has length ${length} ${unit} and width ${width} ${unit}. Find its area in square ${unit}.`,
      `A rectangle with dimensions ${length} ${unit} by ${width} ${unit} has what area (in ${unit}²)?`
    );
  } else {
    // Perimeter
    answer = 2 * (length + width);
    text = gradePrompt(
      grade,
      `A rectangle is ${length} ${unit} long and ${width} ${unit} wide. What is its perimeter in ${unit}?`,
      `A rectangle has length ${length} ${unit} and width ${width} ${unit}. Find its perimeter in ${unit}.`,
      `A rectangle with dimensions ${length} ${unit} by ${width} ${unit} has what perimeter (in ${unit})?`
    );
  }

  const concept = "Area and perimeter of rectangles";
  const hint = gradePrompt(
    grade,
    "For area, multiply length × width. For perimeter, add all sides (2 × length + 2 × width).",
    "Use A = l × w for area and P = 2l + 2w for perimeter.",
    "Apply A = lw and P = 2(l + w) for rectangles."
  );
  const explanation =
`For rectangles:
• Area counts how many square units cover the surface: A = length × width.
• Perimeter is the distance all the way around: P = 2·length + 2·width.`;
  const example =
`Example (step by step):
A rectangle is 8 m long and 5 m wide.
1. Area: A = 8 × 5 = 40 m².
2. Perimeter: P = 2(8) + 2(5) = 16 + 10 = 26 m.`;

  return { text, answer, concept, hint, explanation, example };
}

// NEW: Volume of rectangular prisms
function buildVolumeQuestion(grade, diff) {
  const length = randomInt(2, 10 + Math.round(diff * 5));
  const width = randomInt(2, 10);
  const height = randomInt(2, 10);
  const answer = length * width * height;
  const unit = "cm";

  const text = gradePrompt(
    grade,
    `A rectangular prism is ${length} ${unit} long, ${width} ${unit} wide, and ${height} ${unit} tall. What is its volume in cubic ${unit}?`,
    `A rectangular prism has length ${length} ${unit}, width ${width} ${unit}, and height ${height} ${unit}. Find its volume in cubic ${unit}.`,
    `A rectangular prism measures ${length} ${unit} by ${width} ${unit} by ${height} ${unit}. Determine its volume (in ${unit}³).`
  );

  const concept = "Volume of rectangular prisms";
  const hint = gradePrompt(
    grade,
    "Multiply length × width × height to find the number of cubic units.",
    "Use V = l × w × h for rectangular prisms.",
    "Apply V = lwh to compute the volume."
  );
  const explanation =
`Volume measures how much 3D space a solid takes up.
For a rectangular prism: V = length × width × height.`;
  const example =
`Example (step by step):
A box is 4 cm long, 3 cm wide, and 2 cm tall.
1. Multiply: 4 × 3 = 12.
2. Multiply by height: 12 × 2 = 24.
So the volume is 24 cm³.`;

  return { text, answer, concept, hint, explanation, example };
}

// -----------------------------
// Map topic keys → generator functions
// -----------------------------
const topicGenerators = {
  // Grade 1
  g1_count_compare: (g, d) => buildAddSubQuestion(g, d * 0.3, 20),
  g1_add_sub_20: (g, d) => buildAddSubQuestion(g, d * 0.5, 20),
  g1_place_value: (g, d) => buildAddSubQuestion(g, d * 0.4, 99),
  g1_shapes: (g, d) => buildFractionOfNumberQuestion(g, d * 0.2), // equal parts as fractions
  g1_measure: (g, d) => buildTimeMoneyMeasurementQuestion(g, d),
  g1_word: (g, d) => buildOneStepWordProblemQuestion(g, d),
  g1_mixed: (g, d) => buildAddSubQuestion(g, d * 0.6, 50),

  // Grade 2
  g2_place_value_1000: (g, d) => buildAddSubQuestion(g, d * 0.7, 999),
  g2_add_sub_1000: (g, d) => buildAddSubQuestion(g, d * 0.8, 1000),
  g2_mul_div_intro: (g, d) => buildMulDivFactsQuestion(g, d * 0.5),
  g2_measure: (g, d) => buildTimeMoneyMeasurementQuestion(g, d),
  g2_shapes: (g, d) => buildFractionOfNumberQuestion(g, d * 0.3),
  g2_word: (g, d) => buildTwoStepWordProblemQuestion(g, d),
  g2_mixed: (g, d) => buildMulDivFactsQuestion(g, d * 0.7),

  // Grade 3
  g3_mul_div: (g, d) => buildMulDivFactsQuestion(g, d),
  g3_div_remainder: (g, d) => buildMulDivFactsQuestion(g, d),
  g3_fractions: (g, d) => buildFractionOfNumberQuestion(g, d * 0.5),
  g3_area_perimeter: (g, d) => buildAreaPerimeterQuestion(g, d),
  g3_frac_numberline: (g, d) => buildFractionOfNumberQuestion(g, d * 0.6),
  g3_measure: (g, d) => buildTimeMoneyMeasurementQuestion(g, d),
  g3_word: (g, d) => buildTwoStepWordProblemQuestion(g, d),

  // Grade 4
  g4_frac_add_sub: (g, d) => buildFractionOfNumberQuestion(g, d),
  g4_frac_compare: (g, d) => buildFractionOfNumberQuestion(g, d),
  g4_multi_mul: (g, d) => buildMulDivFactsQuestion(g, d * 1.1),
  g4_long_div: (g, d) => buildMulDivFactsQuestion(g, d * 1.1),
  g4_factors: (g, d) => buildMulDivFactsQuestion(g, d * 0.8),
  g4_angles: (g, d) => buildAngleQuestion(g, d),
  g4_word: (g, d) => buildFractionWordProblemQuestion(g, d),

  // Grade 5
  g5_frac_add_sub: (g, d) => buildFractionOfNumberQuestion(g, d),
  g5_frac_mul_div: (g, d) => buildFractionOfNumberQuestion(g, d),
  g5_decimals: (g, d) => buildAddSubQuestion(g, d, 1000),
  g5_volume: (g, d) => buildVolumeQuestion(g, d),
  g5_percent: (g, d) => buildRateQuestion(g, d * 0.6),
  g5_patterns: (g, d) => buildAddSubQuestion(g, d * 0.7, 200),
  g5_word: (g, d) => buildFractionWordProblemQuestion(g, d),

  // Grade 6
  g6_ratios: (g, d) => buildRateQuestion(g, d),
  g6_frac_dec_percent: (g, d) => buildFractionOfNumberQuestion(g, d),
  g6_equations: (g, d) => buildLinearEquationQuestion(g, d * 0.7),
  g6_geometry: (g, d) => buildVolumeQuestion(g, d),
  g6_stats: (g, d) => buildAddSubQuestion(g, d * 0.6, 200),
  g6_integers: (g, d) => buildIntegerQuestion(g, d),
  g6_word: (g, d) => buildRateQuestion(g, d),

  // Grade 7
  g7_rational: (g, d) => buildIntegerQuestion(g, d),
  g7_expressions: (g, d) => buildLinearEquationQuestion(g, d * 0.8),
  g7_linear_eq: (g, d) => buildLinearEquationQuestion(g, d),
  g7_proportion: (g, d) => buildRateQuestion(g, d),
  g7_geometry: (g, d) => buildAngleQuestion(g, d),
  g7_prob: (g, d) => buildAddSubQuestion(g, d * 0.4, 100),
  g7_word: (g, d) => buildLinearEquationQuestion(g, d * 0.7),

  // Grade 8
  g8_linear_systems: (g, d) => buildLinearEquationQuestion(g, d),
  g8_functions: (g, d) => buildLinearEquationQuestion(g, d),
  g8_exponents: (g, d) => buildAddSubQuestion(g, d, 1000),
  g8_pythagorean: (g, d) => buildRateQuestion(g, d),
  g8_similarity: (g, d) => buildAddSubQuestion(g, d, 500),
  g8_volume: (g, d) => buildVolumeQuestion(g, d),
  g8_stats: (g, d) => buildAddSubQuestion(g, d * 0.7, 500),

  // Grade 9
  g9_expr: (g, d) => buildLinearEquationQuestion(g, d),
  g9_factoring: (g, d) => buildQuadraticQuestion(g, d * 0.7),
  g9_quadratics: (g, d) => buildQuadraticQuestion(g, d),
  g9_inequalities: (g, d) => buildLinearEquationQuestion(g, d),
  g9_functions: (g, d) => buildLinearEquationQuestion(g, d),
  g9_trig: (g, d) => buildTrigQuestion(g, d),
  g9_circles: (g, d) => buildAreaPerimeterQuestion(g, d),

  // Grade 10
  g10_quadratic_functions: (g, d) => buildQuadraticQuestion(g, d),
  g10_polynomials: (g, d) => buildLinearEquationQuestion(g, d),
  g10_rational: (g, d) => buildIntegerQuestion(g, d),
  g10_exponential: (g, d) => buildAddSubQuestion(g, d, 2000),
  g10_trig: (g, d) => buildTrigQuestion(g, d),
  g10_coordinate: (g, d) => buildLinearEquationQuestion(g, d),
  g10_stats: (g, d) => buildAddSubQuestion(g, d, 2000),

  // Grade 11
  g11_exp_log: (g, d) => buildAddSubQuestion(g, d, 5000),
  g11_poly_app: (g, d) => buildQuadraticQuestion(g, d),
  g11_sequences: (g, d) => buildAddSubQuestion(g, d, 1000),
  g11_prob: (g, d) => buildAddSubQuestion(g, d, 100),
  g11_rational: (g, d) => buildIntegerQuestion(g, d),
  g11_trig: (g, d) => buildTrigQuestion(g, d),
  g11_word: (g, d) => buildLinearEquationQuestion(g, d),

  // Grade 12
  g12_trig_id: (g, d) => buildTrigQuestion(g, d),
  g12_limits: (g, d) => buildAddSubQuestion(g, d, 5000),
  g12_derivatives: (g, d) => buildLinearEquationQuestion(g, d),
  g12_sequences: (g, d) => buildAddSubQuestion(g, d, 3000),
  g12_vectors: (g, d) => buildIntegerQuestion(g, d),
  g12_stats: (g, d) => buildAddSubQuestion(g, d, 5000),
  g12_challenge: (g, d) => buildQuadraticQuestion(g, d)
};

// -----------------------------
// Main entry for engine.js
// -----------------------------
function generateQuestionFor(grade, progressiveIndex, number) {
  const topics = curriculumTopics[grade];
  if (!topics) {
    const diffFallback = difficultyFromNumber(number);
    return buildAddSubQuestion(grade, diffFallback, 100);
  }

  const topic = topics[progressiveIndex - 1];
  if (!topic) {
    const diffFallback = difficultyFromNumber(number);
    return buildAddSubQuestion(grade, diffFallback, 100);
  }

  const diff = difficultyFromNumber(number);
  const generator = topicGenerators[topic.key];

  let q;
  if (!generator) {
    q = buildAddSubQuestion(grade, diff, 100);
  } else {
    q = generator(grade, diff);
  }

  // Force the Concept chip to match the progressive/topic name
  if (q && topic && topic.name) {
    q.concept = topic.name;
  }

  return q;
}

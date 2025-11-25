function getMax(level){return 10 + level*5;}
// js/generators/highschool.js
// High school generators for Grades 9–12
// Each function returns { text, answer, concept, hint, explanation, example }

(function () {
  function randi(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function choose(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function difficultyScaled(baseMin, baseMax, number) {
    const scale = Math.min(Math.max(number, 1), 100) / 100;
    const range = baseMax - baseMin;
    const extra = Math.floor(range * scale);
    return [baseMin, baseMin + range + extra];
  }

  // ----- GRADE 9: ALGEBRA I -----

  function buildHSLinearEqIneqQuestion(ctx) {
    const [amin, amax] = difficultyScaled(1, 5, ctx.number);
    const a = randi(amin, amax) * choose([-1, 1]);
    const b = randi(1, 12);
    const x = randi(-10, 10);
    const c = a * x + b;

    const isIneq = Math.random() < 0.4;
    const varName = "x";

    if (!isIneq) {
      const text = `Solve for ${varName}: ${a}${varName} + ${b} = ${c}`;
      return {
        text,
        answer: x,
        concept: "Solve one-step and two-step linear equations.",
        hint: "Isolate the variable by undoing addition/subtraction first, then multiplication/division.",
        explanation: `We start with ${a}${varName} + ${b} = ${c}. Subtract ${b} from both sides and then divide by ${a} to solve for ${varName}.`,
        example: `${a}${varName} + ${b} = ${c} → ${a}${varName} = ${c - b} → ${varName} = ${(c - b)}/${a} = ${x}.`
      };
    } else {
      const symbol = choose(["<", ">", "≤", "≥"]);
      const text = `Solve the inequality for ${varName}: ${a}${varName} + ${b} ${symbol} ${c}`;
      const sol = `${varName} ${symbol} ${x}`;
      return {
        text,
        answer: sol,
        concept: "Solve linear inequalities and express solution sets.",
        hint: "Treat it like an equation but remember: if you multiply or divide by a negative, flip the inequality.",
        explanation: `We solve similarly to a linear equation. If we divide by a negative coefficient, the inequality sign reverses.`,
        example: `If ${a}${varName} + ${b} > ${c}, then ${a}${varName} > ${c - b} and ${varName} > ${(c - b)}/${a}.`
      };
    }
  }

  function buildHSSystemsLinearQuestion(ctx) {
    const x = randi(-5, 5);
    const y = randi(-5, 5);

    const a1 = randi(1, 5);
    const b1 = randi(1, 5);
    const c1 = a1 * x + b1 * y;

    const a2 = randi(1, 5);
    const b2 = randi(1, 5);
    const c2 = a2 * x + b2 * y;

    const text = `Solve the system:\n` +
      `${a1}x + ${b1}y = ${c1}\n` +
      `${a2}x + ${b2}y = ${c2}`;

    return {
      text,
      answer: `(${x}, ${y})`,
      concept: "Solve systems of two linear equations.",
      hint: "Try elimination: make one variable cancel by adding or subtracting the equations.",
      explanation: "Use substitution or elimination to solve for one variable, then back-substitute to find the other.",
      example: "Multiply one equation so that coefficients of x or y match, subtract, then solve."
    };
  }

  function buildHSQuadraticQuestion(ctx) {
    // Factorable quadratics
    const p = randi(-5, 5) || 1;
    const q = randi(-5, 5) || -2;
    const a = 1;
    const b = -(p + q);
    const c = p * q;

    const text = `Solve the quadratic equation: x² ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}x ` +
      `${c >= 0 ? "+ " + c : "- " + Math.abs(c)} = 0`;

    const ans = p === q ? `${p}` : `${p}, ${q}`;

    return {
      text,
      answer: ans,
      concept: "Solve quadratic equations by factoring.",
      hint: "Look for two numbers that multiply to c and add to b.",
      explanation: "Rewrite the quadratic as (x − r₁)(x − r₂) = 0 and use the zero product property.",
      example: "If x² − 5x + 6 = 0, factor to (x − 2)(x − 3) = 0 so x = 2 or x = 3."
    };
  }

  function buildHSPolynomialsQuestion(ctx) {
    const a = randi(1, 5);
    const b = randi(1, 5);
    const c = randi(1, 5);
    const d = randi(1, 5);

    const text = `Simplify: (${a}x² + ${b}x) + (${c}x² + ${d}x)`;
    const A = a + c;
    const B = b + d;

    return {
      text,
      answer: `${A}x^2 + ${B}x`,
      concept: "Add and subtract polynomial expressions.",
      hint: "Combine like terms: x² terms together, x terms together.",
      explanation: "Group x² terms and x terms separately, then add coefficients.",
      example: "(3x² + 2x) + (4x² + 5x) = 7x² + 7x."
    };
  }

  function buildHSFunctionsQuestion(ctx) {
    const m = randi(-5, 5) || 2;
    const b = randi(-5, 5);
    const x = randi(-5, 5);
    const fx = m * x + b;

    const text = `Let f(x) = ${m}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}.\n` +
      `Find f(${x}).`;

    return {
      text,
      answer: fx,
      concept: "Evaluate linear functions at a given input.",
      hint: "Substitute the x-value into the rule and simplify.",
      explanation: "A function is a rule. Replace x with the input and compute the result.",
      example: "If f(x) = 2x + 3 and x = 4, then f(4) = 2·4 + 3 = 11."
    };
  }

  function buildHSAlgebraWordProblemQuestion(ctx) {
    const price = randi(5, 20);
    const total = price * randi(2, 8);
    const text = `Each notebook costs $${price}. If the total cost is $${total}, ` +
      `how many notebooks were bought? Let n be the number of notebooks.`;

    const n = total / price;

    return {
      text,
      answer: n,
      concept: "Translate a word problem into a linear equation.",
      hint: "Write an equation: price × n = total, then solve for n.",
      explanation: `We use ${price}·n = ${total}. Divide both sides by ${price} to get n.`,
      example: "If each costs $4 and total is $28, then 4n = 28 → n = 7."
    };
  }

  function buildHSAlgebra1MixedQuestion(ctx) {
    const builders = [
      buildHSLinearEqIneqQuestion,
      buildHSSystemsLinearQuestion,
      buildHSQuadraticQuestion,
      buildHSPolynomialsQuestion,
      buildHSFunctionsQuestion,
      buildHSAlgebraWordProblemQuestion
    ];
    return choose(builders)(ctx);
  }

  // ----- GRADE 10: GEOMETRY -----

  function buildHSGeometryCongSimQuestion(ctx) {
    const scale = randi(2, 5);
    const side = randi(3, 12);
    const bigger = scale * side;

    const text = `Two similar triangles have a side of length ${side} cm in the smaller triangle ` +
      `and the corresponding side is ${bigger} cm in the larger triangle.\n` +
      `What is the scale factor (larger : smaller)?`;

    return {
      text,
      answer: scale,
      concept: "Use similarity to relate side lengths.",
      hint: "Scale factor = (corresponding side in larger) ÷ (corresponding side in smaller).",
      explanation: `Here, scale factor k = ${bigger}/${side} = ${scale}.`,
      example: "If 4 cm corresponds to 10 cm, scale factor is 10/4 = 2.5."
    };
  }

  function buildHSGeometryTrigQuestion(ctx) {
    const opp = randi(3, 12);
    const hyp = randi(opp + 1, opp + 10);
    const text = `In a right triangle, the side opposite angle θ is ${opp} units ` +
      `and the hypotenuse is ${hyp} units.\n` +
      `Compute sin θ as a simplified fraction.`;

    return {
      text,
      answer: `${opp}/${hyp}`,
      concept: "Define sine as opposite over hypotenuse in a right triangle.",
      hint: "sin θ = opposite / hypotenuse.",
      explanation: "Use SOH-CAH-TOA: sine is opposite divided by hypotenuse.",
      example: "If opposite = 3 and hypotenuse = 5, then sin θ = 3/5."
    };
  }

  function buildHSGeometryCirclesQuestion(ctx) {
    const r = randi(3, 15);
    const text = `A circle has radius ${r} cm. Use π ≈ 3.14.\n` +
      `Find the circumference (nearest tenth).`;

    const C = 2 * 3.14 * r;
    const ans = Math.round(C * 10) / 10;

    return {
      text,
      answer: ans,
      concept: "Circumference of a circle.",
      hint: "Use C = 2πr.",
      explanation: "Multiply 2 × π × radius, then round to the given place.",
      example: "If r = 4, C ≈ 2 × 3.14 × 4 = 25.1."
    };
  }

  function buildHSCoordinateGeometryQuestion(ctx) {
    const x1 = randi(-5, 5), y1 = randi(-5, 5);
    const x2 = randi(-5, 5), y2 = randi(-5, 5);

    const text = `Find the slope of the line through (${x1}, ${y1}) and (${x2}, ${y2}).`;
    const num = y2 - y1;
    const den = x2 - x1;
    let ans;
    if (den === 0) {
      ans = "undefined";
    } else {
      ans = num / den;
    }

    return {
      text,
      answer: ans,
      concept: "Slope as rise over run.",
      hint: "Slope m = (y₂ − y₁)/(x₂ − x₁).",
      explanation: "Subtract y-coordinates and x-coordinates in the same order, then divide.",
      example: "Between (1,2) and (4,8), m = (8−2)/(4−1) = 6/3 = 2."
    };
  }

  function buildHSGeometryAreaVolumeQuestion(ctx) {
    const w = randi(2, 10);
    const h = randi(2, 10);
    const l = randi(2, 10);
    const text = `A rectangular prism has length ${l} cm, width ${w} cm, and height ${h} cm.\n` +
      `Find its volume in cubic centimeters.`;

    const V = l * w * h;

    return {
      text,
      answer: V,
      concept: "Volume of a rectangular prism.",
      hint: "Volume = length × width × height.",
      explanation: "Multiply the three side lengths to get cubic units.",
      example: "If l=3, w=4, h=5, then V = 3·4·5 = 60 cm³."
    };
  }

  function buildHSGeometryProofIdeaQuestion(ctx) {
    const text = "A triangle has sides of length 3, 4, and 5. Explain briefly why it must be a right triangle.";
    return {
      text,
      answer: "Because 3² + 4² = 9 + 16 = 25 = 5², satisfying the Pythagorean theorem.",
      concept: "Use the Pythagorean theorem as a converse to identify right triangles.",
      hint: "Check if a² + b² = c² for the largest side.",
      explanation: "If the sum of squares of the two shorter sides equals the square of the longest side, the triangle is right.",
      example: "Sides 5, 12, 13 also form a right triangle because 5² + 12² = 25 + 144 = 169 = 13²."
    };
  }

  function buildHSGeometryMixedQuestion(ctx) {
    const builders = [
      buildHSGeometryCongSimQuestion,
      buildHSGeometryTrigQuestion,
      buildHSGeometryCirclesQuestion,
      buildHSCoordinateGeometryQuestion,
      buildHSGeometryAreaVolumeQuestion,
      buildHSGeometryProofIdeaQuestion
    ];
    return choose(builders)(ctx);
  }

  // ----- GRADE 11: ALGEBRA II -----

  function buildHSAlgebra2PolynomialsQuestion(ctx) {
    const a = randi(1, 4);
    const b = randi(1, 4);
    const c = randi(1, 4);
    const d = randi(1, 4);

    const text = `Multiply and simplify: (${a}x + ${b})(${c}x + ${d})`;
    const A = a * c;
    const B = a * d + b * c;
    const C = b * d;

    return {
      text,
      answer: `${A}x^2 + ${B}x + ${C}`,
      concept: "Multiply binomials (FOIL).",
      hint: "First, Outer, Inner, Last; then combine like terms.",
      explanation: "Multiply each term in the first binomial by each in the second and combine.",
      example: "(2x + 3)(x + 5) = 2x² + 13x + 15."
    };
  }

  function buildHSAlgebra2RationalQuestion(ctx) {
    const a = randi(1, 5);
    const b = randi(1, 5);
    const c = randi(1, 5);
    const d = randi(1, 5);

    const text = `Simplify the rational expression: (${a}/x) + (${b}/x)\n(Assume x ≠ 0.)`;
    const num = a + b;

    return {
      text,
      answer: `${num}/x`,
      concept: "Add rational expressions with like denominators.",
      hint: "Add numerators, keep the common denominator.",
      explanation: "Because denominators are the same, just add the numerators.",
      example: "1/x + 3/x = 4/x."
    };
  }

  function buildHSExpLogQuestion(ctx) {
    const a = randi(2, 8);
    const b = randi(2, 5);
    const value = Math.pow(a, b);

    const text = `Write log base ${a} of ${value} as a single number: log_${a}(${value}).`;

    return {
      text,
      answer: b,
      concept: "Inverse relationship of exponents and logarithms.",
      hint: "logₐ(aᵇ) = b.",
      explanation: "Logs undo exponentials; they ask 'what exponent on a gives this value?'",
      example: "log₂(8) = 3 because 2³ = 8."
    };
  }

  function buildHSSequencesSeriesQuestion(ctx) {
    const a1 = randi(-5, 5);
    const d = randi(1, 6);
    const n = randi(4, 10);
    const an = a1 + (n - 1) * d;

    const text = `In the arithmetic sequence with first term a₁ = ${a1} and common difference d = ${d},\n` +
      `find the ${n}th term a_${n}.`;

    return {
      text,
      answer: an,
      concept: "nth term of an arithmetic sequence.",
      hint: "Use aₙ = a₁ + (n − 1)d.",
      explanation: "Repeatedly adding d builds the sequence; formula jumps directly to term n.",
      example: "If a₁ = 3 and d = 2, then a₅ = 3 + 4·2 = 11."
    };
  }

  function buildHSTrigFunctionsQuestion(ctx) {
    const k = randi(1, 4);
    const angle = choose([0, 30, 45, 60, 90]);
    const text = `Let f(x) = ${k}·sin(x°). Find f(${angle}). Use exact values.`;

    let base;
    switch (angle) {
      case 0: base = 0; break;
      case 30: base = "1/2"; break;
      case 45: base = "√2/2"; break;
      case 60: base = "√3/2"; break;
      case 90: base = 1; break;
    }

    const answer = typeof base === "number" ? base * k : `${k}·${base}`;

    return {
      text,
      answer: answer,
      concept: "Evaluate sine at special angles.",
      hint: "Recall unit circle values for 0°, 30°, 45°, 60°, 90°.",
      explanation: "sin(30°)=1/2, sin(45°)=√2/2, sin(60°)=√3/2, sin(0°)=0, sin(90°)=1.",
      example: "If f(x)=3·sin(x°), then f(30)=3·1/2=3/2."
    };
  }

  function buildHSComplexNumberQuestion(ctx) {
    const a = randi(-5, 5);
    const b = randi(1, 5);
    const c = randi(-5, 5);
    const d = randi(1, 5);

    const text = `Add the complex numbers: (${a} + ${b}i) + (${c} + ${d}i).`;
    const real = a + c;
    const imag = b + d;

    return {
      text,
      answer: `${real} + ${imag}i`,
      concept: "Add complex numbers by combining real and imaginary parts.",
      hint: "Group real parts together, then imaginary parts.",
      explanation: "Treat i like a variable when adding; just don't combine i² here.",
      example: "(2 + 3i) + (4 + 5i) = 6 + 8i."
    };
  }

  function buildHSAlgebra2MixedQuestion(ctx) {
    const builders = [
      buildHSAlgebra2PolynomialsQuestion,
      buildHSAlgebra2RationalQuestion,
      buildHSExpLogQuestion,
      buildHSSequencesSeriesQuestion,
      buildHSTrigFunctionsQuestion,
      buildHSComplexNumberQuestion
    ];
    return choose(builders)(ctx);
  }

  // ----- GRADE 12: PRECALC & STATS -----

  function buildHSPrecalcLimitsQuestion(ctx) {
    const a = randi(-5, 5);
    const b = randi(-5, 5);
    const text = `Evaluate the limit: limₓ→${a} (${b}x + ${a}).`;

    const ans = b * a + a;

    return {
      text,
      answer: ans,
      concept: "Limits of linear functions at a point.",
      hint: "For polynomials and lines, plug the value directly into the expression.",
      explanation: "Continuous functions allow direct substitution in limits.",
      example: "limₓ→2 (3x + 1) = 3·2 + 1 = 7."
    };
  }

  function buildHSTrigIdentitiesQuestion(ctx) {
    const text = "Use a trig identity to simplify: sin(θ)·cos(θ) + sin(θ)·cos(θ).";

    return {
      text,
      answer: "2 sin(θ) cos(θ)",
      concept: "Factor expressions using trig identities.",
      hint: "Factor out the common factor sin(θ)·cos(θ).",
      explanation: "We treat sin and cos like algebraic factors: x + x = 2x.",
      example: "sin(θ)cos(θ) + sin(θ)cos(θ) = 2sin(θ)cos(θ)."
    };
  }

  function buildHSMatricesVectorsQuestion(ctx) {
    const a = randi(1, 5), b = randi(1, 5);
    const c = randi(1, 5), d = randi(1, 5);
    const text = `Compute the sum of matrices:\n` +
      `A = [[${a}, ${b}], [${c}, ${d}]] and B = [[1, 2], [3, 4]].`;

    const A11 = a + 1, A12 = b + 2;
    const A21 = c + 3, A22 = d + 4;

    return {
      text,
      answer: `[[${A11}, ${A12}], [${A21}, ${A22}]]`,
      concept: "Add matrices element-wise.",
      hint: "Add corresponding entries: top-left with top-left, etc.",
      explanation: "Matrix addition is defined by adding each position separately.",
      example: "[[1,2],[3,4]] + [[5,6],[7,8]] = [[6,8],[10,12]]."
    };
  }

  function buildHSProbStatsQuestion(ctx) {
    const total = randi(10, 30);
    const fav = randi(1, total - 1);
    const text = `A jar contains ${total} marbles, of which ${fav} are blue.\n` +
      `If one marble is chosen at random, what is the probability it is blue? Give a simplified fraction.`;

    const g = gcd(fav, total);
    const n = fav / g, d = total / g;

    return {
      text,
      answer: `${n}/${d}`,
      concept: "Classical probability = favorable / total outcomes.",
      hint: "Probability = (number of blue marbles) ÷ (total marbles).",
      explanation: "Count favorable outcomes, divide by total, then simplify the fraction.",
      example: "If 3 of 12 marbles are red, P(red) = 3/12 = 1/4."
    };
  }

  function buildHSRegressionQuestion(ctx) {
    const text = "A scatterplot of study time (hours) vs. test score shows an upward trend. " +
      "Is the correlation positive, negative, or zero?";

    return {
      text,
      answer: "positive",
      concept: "Interpret correlation from a scatterplot.",
      hint: "If points go up as you move right, the correlation is positive.",
      explanation: "More study time tends to give higher scores, so the variables increase together.",
      example: "Height vs. weight typically shows positive correlation."
    };
  }

  function buildHSPrecalcMixedQuestion(ctx) {
    const builders = [
      buildHSPrecalcLimitsQuestion,
      buildHSTrigIdentitiesQuestion,
      buildHSMatricesVectorsQuestion,
      buildHSProbStatsQuestion,
      buildHSRegressionQuestion
    ];
    return choose(builders)(ctx);
  }

  function buildHSHSMixedQuestion(ctx) {
    const builders = [
      buildHSAlgebra1MixedQuestion,
      buildHSGeometryMixedQuestion,
      buildHSAlgebra2MixedQuestion,
      buildHSPrecalcMixedQuestion
    ];
    return choose(builders)(ctx);
  }

  function gcd(a, b) {
    a = Math.abs(a); b = Math.abs(b);
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }

  // expose to window
  window.buildHSLinearEqIneqQuestion = buildHSLinearEqIneqQuestion;
  window.buildHSSystemsLinearQuestion = buildHSSystemsLinearQuestion;
  window.buildHSQuadraticQuestion = buildHSQuadraticQuestion;
  window.buildHSPolynomialsQuestion = buildHSPolynomialsQuestion;
  window.buildHSFunctionsQuestion = buildHSFunctionsQuestion;
  window.buildHSAlgebraWordProblemQuestion = buildHSAlgebraWordProblemQuestion;
  window.buildHSAlgebra1MixedQuestion = buildHSAlgebra1MixedQuestion;

  window.buildHSGeometryCongSimQuestion = buildHSGeometryCongSimQuestion;
  window.buildHSGeometryTrigQuestion = buildHSGeometryTrigQuestion;
  window.buildHSGeometryCirclesQuestion = buildHSGeometryCirclesQuestion;
  window.buildHSCoordinateGeometryQuestion = buildHSCoordinateGeometryQuestion;
  window.buildHSGeometryAreaVolumeQuestion = buildHSGeometryAreaVolumeQuestion;
  window.buildHSGeometryProofIdeaQuestion = buildHSGeometryProofIdeaQuestion;
  window.buildHSGeometryMixedQuestion = buildHSGeometryMixedQuestion;

  window.buildHSAlgebra2PolynomialsQuestion = buildHSAlgebra2PolynomialsQuestion;
  window.buildHSAlgebra2RationalQuestion = buildHSAlgebra2RationalQuestion;
  window.buildHSExpLogQuestion = buildHSExpLogQuestion;
  window.buildHSSequencesSeriesQuestion = buildHSSequencesSeriesQuestion;
  window.buildHSTrigFunctionsQuestion = buildHSTrigFunctionsQuestion;
  window.buildHSComplexNumberQuestion = buildHSComplexNumberQuestion;
  window.buildHSAlgebra2MixedQuestion = buildHSAlgebra2MixedQuestion;

  window.buildHSPrecalcLimitsQuestion = buildHSPrecalcLimitsQuestion;
  window.buildHSTrigIdentitiesQuestion = buildHSTrigIdentitiesQuestion;
  window.buildHSMatricesVectorsQuestion = buildHSMatricesVectorsQuestion;
  window.buildHSProbStatsQuestion = buildHSProbStatsQuestion;
  window.buildHSRegressionQuestion = buildHSRegressionQuestion;
  window.buildHSPrecalcMixedQuestion = buildHSPrecalcMixedQuestion;
  window.buildHSHSMixedQuestion = buildHSHSMixedQuestion;
})();

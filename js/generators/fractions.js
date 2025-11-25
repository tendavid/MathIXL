function getMax(level){return 10 + level*5;}
// js/generators/fractions.js
// Fraction and mixed-number generators for Daily Math Training Lab.

(function () {
  // All generators receive context: { grade, progressiveIndex, number, topic }

  // ---- Grade 3: Intro to Fractions (visual / number line style wording) ----

  window.buildFractionIntroQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    // denominator 2–8 typically, slightly larger for harder
    const maxDen = d < 0.4 ? 6 : 10;
    const den = randomInt(2, maxDen);
    let num = randomInt(1, den - 1);
    const [sn, sd] = simplifyFraction(num, den);
    num = sn;

    const type = randomInt(1, 2);
    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      text = `A whole is cut into ${den} equal parts. If you shade ${num} of those parts, what fraction of the whole is shaded?`;
      answer = `${num}/${den}`;
      concept = "Fraction as part of a whole";
      hint = "The top number tells how many parts are shaded. The bottom number tells how many equal parts the whole has.";
      explanation =
        "Fractions describe equal parts of a whole. If a whole is cut into equal pieces, the denominator counts the total pieces and the numerator counts how many of those pieces we are talking about.";
      example =
        "Example: If a pizza is cut into 4 equal slices and you eat 1 slice, you ate 1/4 of the pizza.\nIf you eat 3 slices, you ate 3/4 of the pizza.";
    } else {
      text = `On a number line from 0 to 1, the distance is split into ${den} equal jumps. After ${num} jumps from 0, what fraction have you reached?`;
      answer = `${num}/${den}`;
      concept = "Fractions on a number line";
      hint = "Each jump is one out of the total number of equal jumps from 0 to 1.";
      explanation =
        "Think of 0 to 1 as one whole length. If that distance is divided into equal jumps, each jump is 1 over the total number of jumps. After some number of jumps, you are at that many over the total.";
      example =
        "Example: If 0 to 1 is split into 5 equal parts, each jump is 1/5.\nAfter 3 jumps from 0, you are at 3/5.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 4: Equivalent fractions & comparing ----

  window.buildEquivalentFractionsQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const baseDen = d < 0.5 ? randomInt(2, 8) : randomInt(3, 10);
    let baseNum = randomInt(1, baseDen - 1);
    [baseNum, baseDen] = simplifyFraction(baseNum, baseDen);

    const factor = randomInt(2, 5);
    const num2 = baseNum * factor;
    const den2 = baseDen * factor;

    const type = randomInt(1, 2);
    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      text = `Fill in the missing numerator to make an equivalent fraction:\n${baseNum}/${baseDen} = ?/${den2}`;
      answer = num2;
      concept = "Equivalent fractions by scaling";
      hint = "Ask: what did we multiply the denominator by to get the new denominator? Multiply the numerator by the same number.";
      explanation =
        "To make an equivalent fraction, multiply or divide both the numerator and denominator by the same non-zero number.";
      example =
        "Example: 2/3 = 4/6 because we multiply top and bottom by 2.\n2 × 2 = 4 and 3 × 2 = 6.";
    } else {
      text = `Are these two fractions equivalent? Answer 1 for yes or 0 for no.\n${baseNum}/${baseDen} and ${num2}/${den2}`;
      answer = 1; // yes
      concept = "Recognizing equivalent fractions";
      hint = "Try simplifying the larger fraction. Do you get the same smaller fraction?";
      explanation =
        "When you can reduce a larger fraction by dividing top and bottom by the same number and get the simpler fraction, they are equivalent.";
      example =
        "Example: 3/4 and 6/8.\n6/8 can be simplified by dividing top and bottom by 2: 6 ÷ 2 = 3 and 8 ÷ 2 = 4, so 6/8 = 3/4.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 4–5: Add/Subtract fractions with like denominators ----

  window.buildFractionAddSubLikeDenQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const den = d < 0.5 ? randomInt(2, 10) : randomInt(6, 12);
    const a = randomInt(1, den - 1);
    const b = randomInt(1, den - 1);
    const op = Math.random() < 0.5 ? "+" : "−";
    let num, text;

    if (op === "+") {
      num = a + b;
      text = `Compute and give your answer as a simplified fraction:\n${a}/${den} + ${b}/${den}`;
    } else {
      // ensure a >= b
      const bigger = Math.max(a, b);
      const smaller = Math.min(a, b);
      num = bigger - smaller;
      text = `Compute and give your answer as a simplified fraction:\n${bigger}/${den} − ${smaller}/${den}`;
    }

    const [sn, sd] = simplifyFraction(num, den);
    const answer = sd === 1 ? `${sn}` : `${sn}/${sd}`;
    const concept = "Adding and subtracting fractions with like denominators";
    const hint =
      "When denominators are the same, only add or subtract the numerators. Keep the same denominator.";
    const explanation =
      "If fractions have the same denominator, you are combining or separating parts of the same size. Add or subtract only the top numbers, and keep the bottom number the same.";
    const example =
      "Example: 1/6 + 3/6 = 4/6, which simplifies to 2/3.\nExample: 5/8 − 3/8 = 2/8, which simplifies to 1/4.";
    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 5: Add/Subtract fractions with unlike denominators ----

  window.buildFractionAddSubUnlikeDenQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    let den1, den2;
    if (d < 0.4) {
      // simple pairs
      const pairs = [
        [2, 4],
        [3, 6],
        [4, 8],
        [3, 9]
      ];
      [den1, den2] = randomChoice(pairs);
    } else {
      den1 = randomInt(2, 10);
      den2 = randomInt(2, 10);
      while (den2 === den1) {
        den2 = randomInt(2, 10);
      }
    }

    const num1 = randomInt(1, den1 - 1);
    const num2 = randomInt(1, den2 - 1);
    const op = Math.random() < 0.5 ? "+" : "−";

    const commonDen = lcm(den1, den2);
    const factor1 = commonDen / den1;
    const factor2 = commonDen / den2;

    let newNum1 = num1 * factor1;
    let newNum2 = num2 * factor2;
    let text;

    if (op === "+") {
      const sum = newNum1 + newNum2;
      const [sn, sd] = simplifyFraction(sum, commonDen);
      const answer = sd === 1 ? `${sn}` : `${sn}/${sd}`;

      text = `Compute and give your answer as a simplified fraction:\n${num1}/${den1} + ${num2}/${den2}`;
      const concept = "Adding fractions with unlike denominators";
      const hint =
        "Find a common denominator first, change both fractions to that denominator, then add the numerators.";
      const explanation =
        "When denominators are different, convert both fractions so they share the same denominator (usually the LCM). Then add the top numbers and simplify.";
      const example =
        "Example: 1/4 + 1/6.\nLCM of 4 and 6 is 12.\n1/4 = 3/12 and 1/6 = 2/12.\n3/12 + 2/12 = 5/12.";
      return { text, answer, concept, hint, explanation, example };
    } else {
      // ensure not negative
      if (newNum2 > newNum1) {
        [newNum1, newNum2] = [newNum2, newNum1];
      }
      const diff = newNum1 - newNum2;
      const [sn, sd] = simplifyFraction(diff, commonDen);
      const answer = sd === 1 ? `${sn}` : `${sn}/${sd}`;

      text = `Compute and give your answer as a simplified fraction:\n${num1}/${den1} − ${num2}/${den2}`;
      const concept = "Subtracting fractions with unlike denominators";
      const hint =
        "Just like addition: find a common denominator, convert both fractions, then subtract the numerators.";
      const explanation =
        "Convert both fractions so they share a common denominator, then subtract the top numbers. Always simplify if possible.";
      const example =
        "Example: 5/6 − 1/4.\nLCM of 6 and 4 is 12.\n5/6 = 10/12 and 1/4 = 3/12.\n10/12 − 3/12 = 7/12.";
      return { text, answer, concept, hint, explanation, example };
    }
  };

  // ---- Grade 5: Multiply fractions and whole numbers ----

  window.buildFractionMultiplicationQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const whole = d < 0.5 ? randomInt(2, 9) : randomInt(2, 15);
    let num = randomInt(1, 9);
    let den = randomInt(2, 10);
    [num, den] = simplifyFraction(num, den);

    const text = `Compute and give your answer as a simplified fraction:\n${whole} × ${num}/${den}`;
    const rawNum = whole * num;
    const [sn, sd] = simplifyFraction(rawNum, den);
    const answer = sd === 1 ? `${sn}` : `${sn}/${sd}`;

    const concept = "Multiplying a whole number by a fraction";
    const hint =
      "Multiply the whole number by the numerator. Keep the same denominator, then simplify.";
    const explanation =
      "Think of the whole number as that many copies of the fraction. If you multiply a whole by a/b, you do whole × a on top and keep b on the bottom.";
    const example =
      "Example: 3 × 2/5.\n3 × 2 = 6, so the answer is 6/5, which can also be written as 1 1/5.";
    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 5–6: Fractions, decimals, percents connections ----
  // This is referenced by curriculum as buildFracDecPercentQuestion, but
  // we implement that in a separate decimals/proportions generator file.
  // Here we keep strictly fraction operations.

})();

// js/generators/arithmetic.js
// Core arithmetic generators: counting, place value, add/sub, mult/div, basic mixed reviews.

(function () {
  // All generators receive a single context object:
  // { grade, progressiveIndex, number, topic }

  // ---- Grade 1: Counting & basic addition/subtraction ----

  window.buildCountingQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    // Decide type: next / previous / missing in sequence
    const type = randomInt(1, 3);
    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      const max = d < 0.3 ? 20 : d < 0.7 ? 50 : 120;
      const n = randomInt(0, max - 1);
      text = `What number comes after ${n}?`;
      answer = n + 1;
      concept = "Counting forward by 1";
      hint = "To find the next number, add 1.";
      explanation =
        "When we count forward, each number is 1 more than the previous one.";
      example =
        "Example: After 12 comes 13 because 12 + 1 = 13.\\nAfter 29 comes 30 because 29 + 1 = 30.";
    } else if (type === 2) {
      const max = d < 0.3 ? 20 : d < 0.7 ? 50 : 120;
      const n = randomInt(1, max);
      text = `What number comes just before ${n}?`;
      answer = n - 1;
      concept = "Counting backward by 1";
      hint = "To find the previous number, subtract 1.";
      explanation =
        "When we count backward, each number is 1 less than the next one.";
      example =
        "Example: Before 10 comes 9 because 10 − 1 = 9.\\nBefore 31 comes 30 because 31 − 1 = 30.";
    } else {
      const start = randomInt(0, 10);
      const step = 1;
      const missingIndex = randomInt(1, 3); // hide one in the middle
      const seq = [];
      for (let i = 0; i < 4; i++) {
        const value = start + i * step;
        seq.push(i === missingIndex ? "?" : value);
      }
      const answerValue = start + missingIndex * step;
      text = `Fill in the missing number:\\n${seq.join(", ")}`;
      answer = answerValue;
      concept = "Number patterns increasing by 1";
      hint = "Look how much each number increases when you move to the right.";
      explanation =
        "In this pattern, each number is 1 more than the previous one. The missing spot should follow the same rule.";
      example =
        "Example: 3, 4, ?, 6 → each step goes up by 1, so the missing number is 5.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  window.buildAddSubWithin20Question = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    // easier: both small; harder: allow up to 20 and unknown position
    const op = Math.random() < 0.5 ? "+" : "−";
    let a, b, text, answer;
    if (op === "+") {
      const max = d < 0.5 ? 10 : 20;
      a = randomInt(0, max);
      b = randomInt(0, max - a);
      text = `Compute: ${a} + ${b} = ?`;
      answer = a + b;
    } else {
      const max = d < 0.5 ? 10 : 20;
      a = randomInt(0, max);
      b = randomInt(0, a);
      text = `Compute: ${a} − ${b} = ?`;
      answer = a - b;
    }
    const concept = "Addition and subtraction within 20";
    const hint =
      "Think about putting together or taking away objects. You can count on your fingers if you need.";
    const explanation =
      "Adding means putting numbers together, subtracting means taking away. Stay within 0–20 for Grade 1–2 fact fluency.";
    const example =
      "Example: 7 + 5 = 12 (count up 5 from 7).\\nExample: 14 − 6 = 8 (start at 14 and count 6 down).";
    return { text, answer, concept, hint, explanation, example };
  };

  window.buildAddSubWithin100Question = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const op = Math.random() < 0.5 ? "+" : "−";
    const max = d < 0.4 ? 50 : 99;
    let a, b, text, answer;

    if (op === "+") {
      a = randomInt(10, max);
      b = randomInt(10, max - a);
      text = `Compute: ${a} + ${b}`;
      answer = a + b;
    } else {
      a = randomInt(10, max);
      b = randomInt(1, a);
      text = `Compute: ${a} − ${b}`;
      answer = a - b;
    }

    const concept = "Two-digit addition and subtraction within 100";
    const hint =
      "You can use place value: add or subtract the tens and ones separately.";
    const explanation =
      "For two-digit numbers, think of tens and ones. For example, 47 = 40 + 7. Add or subtract tens, then ones.";
    const example =
      "Example: 47 + 25 = (40 + 20) + (7 + 5) = 60 + 12 = 72.\\nExample: 63 − 18 = (60 − 10) + (3 − 8) = 50 − 5 = 45.";
    return { text, answer, concept, hint, explanation, example };
  };

  window.buildAddSubWithin1000Question = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const op = Math.random() < 0.5 ? "+" : "−";
    const max = d < 0.5 ? 500 : 999;
    let a, b, text, answer;

    if (op === "+") {
      a = randomInt(100, max);
      b = randomInt(10, max - a);
      text = `Compute: ${a} + ${b}`;
      answer = a + b;
    } else {
      a = randomInt(200, max);
      b = randomInt(10, a);
      text = `Compute: ${a} − ${b}`;
      answer = a - b;
    }

    const concept = "Addition and subtraction within 1000";
    const hint =
      "Use vertical (stacked) addition or subtraction if it helps, aligning hundreds, tens, and ones.";
    const explanation =
      "Within 1000, we still use place value: hundreds, tens, and ones. Borrowing or regrouping is common in subtraction.";
    const example =
      "Example: 438 + 257.\\nAdd ones: 8 + 7 = 15 (write 5, carry 1)\\nAdd tens: 3 + 5 + 1 = 9\\nAdd hundreds: 4 + 2 = 6\\nAnswer = 695.";
    return { text, answer, concept, hint, explanation, example };
  };

  window.buildPlaceValueQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const digits = d < 0.3 ? 2 : d < 0.7 ? 3 : 4;
    const min = digits == 2 ? 10 : digits == 3 ? 100 : 1000;
    const max = digits == 2 ? 99 : digits == 3 ? 999 : 9999;
    const n = randomInt(min, max);
    const str = String(n);
    const positions = ["ones", "tens", "hundreds", "thousands"].slice(
      4 - digits
    );
    const posIndex = randomInt(0, positions.length - 1);
    const placeName = positions[posIndex];

    const placeMap = {
      ones: 0,
      tens: 1,
      hundreds: 2,
      thousands: 3
    };
    const idxFromRight = placeMap[placeName];
    const digit = parseInt(str[str.length - 1 - idxFromRight], 10);

    const text = `In the number ${n}, what digit is in the ${placeName} place?`;
    const answer = digit;
    const concept = "Place value of digits in a whole number";
    const hint =
      "Start from the right: ones, tens, hundreds, thousands. Count places to find the correct digit.";
    const explanation =
      "Each place has a value. The rightmost digit is the ones place, then tens, hundreds, and thousands as you move left.";
    const example =
      "Example: In 3,482 the digits are:\\n2 in the ones place\\n8 in the tens place\\n4 in the hundreds place\\n3 in the thousands place.";
    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Multiplication & Division basics ----

  window.buildMultiplicationFactsQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const maxFactor = d < 0.3 ? 5 : d < 0.7 ? 9 : 12;
    const a = randomInt(0, maxFactor);
    const b = randomInt(0, maxFactor);
    const text = `Compute: ${a} × ${b}`;
    const answer = a * b;
    const concept = "Basic multiplication facts";
    const hint =
      "Remember that multiplication is repeated addition. For example, 4 × 3 means 4 + 4 + 4.";
    const explanation =
      "Fact fluency with small multiplication tables (like 0–12) helps with many later topics.";
    const example =
      "Example: 6 × 4 = 24 because 6 + 6 + 6 + 6 = 24.\\nExample: 3 × 7 = 21 because 7 + 7 + 7 = 21.";
    return { text, answer, concept, hint, explanation, example };
  };

  window.buildDivisionFactsQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const maxFactor = d < 0.3 ? 5 : d < 0.7 ? 9 : 12;
    const b = randomInt(1, maxFactor);
    const a = b * randomInt(0, maxFactor);
    const text = `Compute: ${a} ÷ ${b}`;
    const answer = b === 0 ? 0 : a / b;
    const concept = "Basic division facts";
    const hint =
      "Think: what number multiplied by the divisor gives the dividend?";
    const explanation =
      "Division is the inverse of multiplication: if a × b = c, then c ÷ b = a.";
    const example =
      "Example: 20 ÷ 5 = 4 because 4 × 5 = 20.\\nExample: 36 ÷ 6 = 6 because 6 × 6 = 36.";
    return { text, answer, concept, hint, explanation, example };
  };

  window.buildMultiDigitMultiplicationQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const a =
      d < 0.3 ? randomInt(10, 30) : d < 0.7 ? randomInt(20, 99) : randomInt(30, 999);
    const b = d < 0.5 ? randomInt(2, 9) : randomInt(10, 25);
    const text = `Compute: ${a} × ${b}`;
    const answer = a * b;
    const concept = "Multi-digit multiplication";
    const hint =
      "Use the standard algorithm: multiply by each digit and then add the partial products.";
    const explanation =
      "Break numbers into tens and ones or use the standard vertical format for multi-digit multiplication.";
    const example =
      "Example: 34 × 6.\\n6 × 4 = 24 (write 4, carry 2)\\n6 × 3 = 18, plus 2 = 20\\nAnswer = 204.";
    return { text, answer, concept, hint, explanation, example };
  };

  window.buildLongDivisionQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const divisor = d < 0.4 ? randomInt(2, 9) : randomInt(2, 12);
    const quotient = d < 0.6 ? randomInt(2, 25) : randomInt(10, 50);
    const dividend = divisor * quotient;
    const text = `Compute the quotient: ${dividend} ÷ ${divisor}`;
    const answer = quotient;
    const concept = "Long division with no remainder";
    const hint =
      "Use the long division steps: divide, multiply, subtract, bring down.";
    const explanation =
      "Because the dividend is a multiple of the divisor, the division will come out even with no remainder.";
    const example =
      "Example: 168 ÷ 7.\\n7 goes into 16 two times (2 × 7 = 14, remainder 2).\\nBring down 8 to make 28.\\n7 goes into 28 four times.\\nAnswer = 24.";
    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Mixed reviews for lower grades ----

  function buildMixedFromList(ctx, builders) {
    const fn = randomChoice(builders);
    return fn(ctx);
  }

  window.buildG1MixedReviewQuestion = function (ctx) {
    return buildMixedFromList(ctx, [
      window.buildCountingQuestion,
      window.buildAddSubWithin20Question,
      window.buildPlaceValueQuestion
    ]);
  };

  window.buildG2MixedReviewQuestion = function (ctx) {
    return buildMixedFromList(ctx, [
      window.buildAddSubWithin20Question,
      window.buildAddSubWithin100Question,
      window.buildPlaceValueQuestion
    ]);
  };

  window.buildG3MixedReviewQuestion = function (ctx) {
    return buildMixedFromList(ctx, [
      window.buildMultiplicationFactsQuestion,
      window.buildDivisionFactsQuestion,
      window.buildAddSubWithin100Question
    ]);
  };

  window.buildG4MixedReviewQuestion = function (ctx) {
    return buildMixedFromList(ctx, [
      window.buildMultiDigitMultiplicationQuestion,
      window.buildLongDivisionQuestion,
      window.buildAddSubWithin1000Question
    ]);
  };

})();

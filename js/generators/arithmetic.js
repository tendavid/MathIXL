function getMax(level){return 10 + level*5;}
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
      // Next number
      const start = randomInt(0, 20);
      answer = start + 1;
      text = `What number comes after ${start}?`;
      concept = "Counting forward by 1";
      hint = "Think: when you say the numbers out loud, what comes right after this one?";
      explanation =
        "Counting forward means adding 1 each time. After 5 comes 6, after 6 comes 7, and so on.";
      example = "Example: After 9 comes 10. After 19 comes 20.";
    } else if (type === 2) {
      // Previous number
      const start = randomInt(1, 20);
      answer = start - 1;
      text = `What number comes just before ${start}?`;
      concept = "Counting backward by 1";
      hint = "When you count backward, the numbers go down by 1. What is one less?";
      explanation =
        "Counting backward means subtracting 1 each time. Before 6 comes 5, before 10 comes 9.";
      example =
        "Example: The number before 8 is 7 because 7 is one less than 8.";
    } else {
      // Missing in a short sequence
      const start = randomInt(0, 10);
      const seq = [start, start + 1, start + 2, start + 3];
      const holeIndex = randomInt(0, seq.length - 1);
      answer = seq[holeIndex];
      const display = seq
        .map((n, idx) => (idx === holeIndex ? "□" : n))
        .join(", ");
      text = `What number belongs in the box?\n${display}`;
      concept = "Counting in order";
      hint =
        "The numbers should go up by 1 each time. Look at the neighbors next to the box.";
      explanation =
        "The pattern goes up by 1 each step. Find the number that fits between the numbers you see.";
      example =
        "Example: 4, 5, □, 7 → the missing number is 6.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // Addition / subtraction within 20.
  // For Grade 1 "Word Problems" we switch to a story style based on ctx.topic.code.
  window.buildAddSubWithin20Question = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const grade = ctx.grade || 1;
    const topicCode = ctx.topic && ctx.topic.code;

    // --- Grade 1 Word Problems branch ---
    if (topicCode === "g1_word") {
      const op = Math.random() < 0.5 ? "+" : "−";
      const max = d < 0.5 ? 10 : 20;

      let a, b, answer;
      let text, concept, hint, explanation, example;

      const name = randomChoice(["Lia", "Ben", "Ava", "Noah", "Mila", "Eli"]);
      const item = randomChoice(["apples", "stickers", "blocks", "marbles", "books", "toy cars"]);

      if (op === "+") {
        a = randomInt(0, max - 1);
        b = randomInt(1, max - a);
        answer = a + b;

        text = `${name} has ${a} ${item} in a basket. ${name} gets ${b} more ${item}. How many ${item} are in the basket now?`;
        concept = "Addition word problems within 20";
        hint =
          "Put the two amounts together. You can count on with fingers or draw dots to see the total.";
        explanation =
          "In this story we join two groups. Joining means we add. Start from the first number and count on the second number to find the total.";
        example =
          "Example: If Lia has 7 apples and gets 3 more apples, you can count 7, 8, 9, 10. Lia now has 10 apples.";
      } else {
        a = randomInt(5, max);
        b = randomInt(1, Math.min(10, a));
        answer = a - b;

        text = `${name} has ${a} ${item}. ${b} ${item} are given to a friend. How many ${item} does ${name} have left?`;
        concept = "Subtraction word problems within 20";
        hint =
          "Start with the first amount and take away the second amount. You can cross out or count back.";
        explanation =
          "In this story some things are taken away. Taking away means we subtract. Begin with the starting number and count back the amount that is given away.";
        example =
          "Example: If Ben has 12 crayons and gives 4 crayons to a friend, you can count back 4 from 12 to get 8 crayons left.";
      }

      return { text, answer, concept, hint, explanation, example };
    }

    // --- Normal equation branch (default for other topics) ---
    const op = Math.random() < 0.5 ? "+" : "−";
    let a, b, text, answer;

    if (op === "+") {
      const max = d < 0.5 ? 10 : 20;
      a = randomInt(0, max);
      b = randomInt(0, max - a);
      text = grade <= 4
        ? `What is ${a} + ${b}?`
        : `Compute: ${a} + ${b} = ?`;
      answer = a + b;
    } else {
      const max = d < 0.5 ? 10 : 20;
      a = randomInt(0, max);
      b = randomInt(0, a);
      text = grade <= 4
        ? `What is ${a} − ${b}?`
        : `Compute: ${a} − ${b} = ?`;
      answer = a - b;
    }

    const concept = "Addition and subtraction within 20";
    const hint =
      "Try counting on for addition and counting back for subtraction. You can also use a number line or fingers.";
    const explanation =
      "Fluent addition and subtraction within 20 is a key early skill. Thinking of facts like 8 + 7 = 15 or 14 − 6 = 8 helps later topics.";
    const example =
      "Example: 9 + 6 = 15, 15 − 6 = 9.";

    return { text, answer, concept, hint, explanation, example };
  };

  window.buildAddSubWithin100Question = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const op = Math.random() < 0.5 ? "+" : "−";
    let a, b, text, answer;
    const grade = ctx.grade || 1;

    if (op === "+") {
      const max = d < 0.5 ? 50 : 99;
      a = randomInt(10, max);
      b = randomInt(10, max - a);
      text = grade <= 4
        ? `What is ${a} + ${b}?`
        : `Compute: ${a} + ${b}`;
      answer = a + b;
    } else {
      const max = d < 0.5 ? 50 : 99;
      a = randomInt(10, max);
      b = randomInt(1, a);
      text = grade <= 4
        ? `What is ${a} − ${b}?`
        : `Compute: ${a} − ${b}`;
      answer = a - b;
    }

    const concept = "Two-digit addition and subtraction within 100";
    const hint =
      "Try adding or subtracting tens first, then ones. You can also write the numbers vertically to keep digits lined up.";
    const explanation =
      "Thinking about place value helps: tens and ones. For example, 47 + 25 = (40 + 20) + (7 + 5).";
    const example =
      "Example: 47 + 25 = (40 + 20) + (7 + 5) = 60 + 12 = 72.\nExample: 63 − 18 = (60 − 10) + (3 − 8) = 50 − 5 = 45.";
    return { text, answer, concept, hint, explanation, example };
  };

  window.buildAddSubWithin1000Question = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const op = Math.random() < 0.5 ? "+" : "−";
    const max = d < 0.5 ? 500 : 999;
    let a, b, text, answer;
    const grade = ctx.grade || 1;

    if (op === "+") {
      a = randomInt(100, max);
      b = randomInt(10, max - a);
      text = grade <= 4
        ? `What is ${a} + ${b}?`
        : `Compute: ${a} + ${b}`;
      answer = a + b;
    } else {
      a = randomInt(100, max);
      b = randomInt(10, a);
      text = grade <= 4
        ? `What is ${a} − ${b}?`
        : `Compute: ${a} − ${b}`;
      answer = a - b;
    }

    const concept = "Addition and subtraction within 1000";
    const hint =
      "Line the numbers up by hundreds, tens, and ones. Work one place at a time. If you need to, regroup (borrow/carry).";
    const explanation =
      "We still use place value ideas, just with hundreds as well. Careful regrouping keeps digits in the correct place.";
    const example =
      "Example: 456 + 278 = (400 + 200) + (50 + 70) + (6 + 8) = 600 + 120 + 14 = 734.";
    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Place value questions (Grades 1–3) ----

  window.buildPlaceValueQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const grade = ctx.grade || 1;

    const max = d < 0.3 ? 99 : d < 0.7 ? 999 : 9999;
    const n = randomInt(10, max);
    const placeOptions =
      max <= 99
        ? ["ones", "tens"]
        : max <= 999
        ? ["ones", "tens", "hundreds"]
        : ["ones", "tens", "hundreds", "thousands"];

    const place = randomChoice(placeOptions);
    const str = String(n);
    let answerDigit;

    if (place === "ones") {
      answerDigit = Number(str[str.length - 1]);
    } else if (place === "tens") {
      answerDigit = Number(str[str.length - 2] || 0);
    } else if (place === "hundreds") {
      answerDigit = Number(str[str.length - 3] || 0);
    } else {
      answerDigit = Number(str[str.length - 4] || 0);
    }

    const placeName = place === "ones"
      ? "ones"
      : place === "tens"
      ? "tens"
      : place === "hundreds"
      ? "hundreds"
      : "thousands";

    let text, concept, hint, explanation;

    if (grade <= 2 && placeName === "thousands") {
      text = `In the number ${n}, which digit is in the hundreds place?`;
      answerDigit = Number(str[str.length - 3] || 0);
      concept = "Place value of digits in a whole number (up to 3 digits)";
      hint =
        "Start from the right side: ones is the first digit, tens is the second, hundreds is the third.";
      explanation =
        "We count places from the right: ones, tens, hundreds. The digit in the hundreds place tells how many hundreds are in the number.";
    } else {
      text = `In the number ${n}, what digit is in the ${placeName} place?`;
      concept = "Place value of digits in a whole number";
      hint =
        "Start from the right: ones, tens, hundreds, thousands. Count positions to locate the requested place.";
      explanation =
        "Each place has a value. The rightmost digit is the ones place, then tens, hundreds, and thousands as you move left.";
    }

    const example =
      "Example: In 3,482 the digits are:\n2 in the ones place\n8 in the tens place\n4 in the hundreds place\n3 in the thousands place.";

    return {
      text,
      answer: answerDigit,
      concept,
      hint,
      explanation,
      example
    };
  };

  // ---- Grade 2–3: Multiplication & division basics ----

  window.buildMultiplicationFactsQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const grade = ctx.grade || 1;
    const topicCode = ctx.topic && ctx.topic.code;

    const maxFactor = d < 0.3 ? 5 : d < 0.7 ? 9 : 12;

    // Branches for specific topics that reuse this generator name.
    // Grade 2 – Arrays
    if (topicCode === "g2_arrays") {
      const rows = randomInt(2, maxFactor);
      const perRow = randomInt(2, maxFactor);
      const answer = rows * perRow;

      const text = `${rows} rows of ${perRow} objects are arranged in an array. How many objects are there in all?`;
      const concept = "Arrays and repeated addition";
      const hint =
        "Each row has the same number of objects. You can add the same number again and again or use multiplication.";
      const explanation =
        "Arrays show equal groups. The total number of objects is rows × objects in each row.";
      const example =
        "Example: 3 rows of 4 blocks is 3 × 4 = 12 blocks in all.";

      return { text, answer, concept, hint, explanation, example };
    }

    // Grade 3 – Word Problems (multiplication & division)
    if (topicCode === "g3_word") {
      const type = randomInt(1, 3);
      const name = randomChoice(["Lia", "Ben", "Ava", "Noah", "Mila", "Eli", "Owen", "Sara"]);
      const item = randomChoice(["stickers", "marbles", "pencils", "blocks", "coins", "cards"]);

      let a, b, answer, text, concept, hint, explanation, example;

      if (type === 1) {
        // equal groups (multiplication)
        a = randomInt(2, maxFactor);
        b = randomInt(2, maxFactor);
        answer = a * b;

        text = `${name} makes ${a} equal groups of ${b} ${item}. How many ${item} does ${name} have in all?`;
        concept = "Multiplication word problems with equal groups";
        hint =
          "Think of each group having the same amount. You can add the same number again and again or use multiplication.";
        explanation =
          "When we have equal groups, multiplication tells how many in all. The number of groups times the number in each group gives the total.";
        example =
          "Example: 4 groups of 3 pencils is 4 × 3 = 12 pencils in all.";
      } else if (type === 2) {
        // array / rows (multiplication)
        a = randomInt(2, maxFactor);
        b = randomInt(2, maxFactor);
        answer = a * b;

        text = `${name} arranges ${item} in ${a} rows with ${b} ${item} in each row. How many ${item} are there in all?`;
        concept = "Multiplication word problems with rows and columns";
        hint =
          "Each row has the same number. Multiply the number of rows by the number in each row.";
        explanation =
          "Arrays are another way to see equal groups. Rows × items in each row gives the total number of items.";
        example =
          "Example: 3 rows of 5 cards is 3 × 5 = 15 cards in all.";
      } else {
        // sharing / division
        b = randomInt(2, maxFactor);
        const groups = randomInt(2, maxFactor);
        a = b * groups;
        answer = b;

        text = `${name} has ${a} ${item} and wants to share them equally among ${groups} friends. How many ${item} does each friend get?`;
        concept = "Division word problems with equal sharing";
        hint =
          "You are splitting the total into equal groups. Think: what number in each group makes all groups equal and uses all items?";
        explanation =
          "Equal sharing stories use division. The total number of items is split into a given number of groups. Dividing tells how many go in each group.";
        example =
          "Example: If there are 18 stickers shared equally among 3 friends, each friend gets 18 ÷ 3 = 6 stickers.";
      }

      return { text, answer, concept, hint, explanation, example };
    }

    // Default: straight multiplication fact
    const a = randomInt(0, maxFactor);
    const b = randomInt(0, maxFactor);
    const text =
      grade <= 4 ? `What is ${a} × ${b}?` : `Compute: ${a} × ${b}`;
    const answer = a * b;
    const concept = "Basic multiplication facts";
    const hint =
      "Remember that multiplication is repeated addition. For example, 4 × 3 means 4 + 4 + 4.";
    const explanation =
      "Fact fluency with small multiplication tables (like 0–12) helps with many later topics.";
    const example =
      "Example: 3 × 5 = 15 means 5 + 5 + 5 = 15.\nExample: 6 × 4 = 24.";

    return { text, answer, concept, hint, explanation, example };
  };

  window.buildDivisionFactsQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const maxFactor = d < 0.3 ? 5 : d < 0.7 ? 9 : 12;
    const b = randomInt(1, maxFactor);
    const a = b * randomInt(0, maxFactor);
    const grade = ctx.grade || 1;
    const text =
      grade <= 4 ? `What is ${a} ÷ ${b}?` : `Compute: ${a} ÷ ${b}`;
    const answer = b === 0 ? 0 : a / b;
    const concept = "Basic division facts";
    const hint =
      "Think: what number multiplied by the divisor gives the dividend?";
    const explanation =
      "Division is the inverse of multiplication: if a × b = c, then c ÷ b = a.";
    const example =
      "Example: 20 ÷ 5 = 4 because 4 × 5 = 20.\nExample: 36 ÷ 6 = 6 because 6 × 6 = 36.";
    return { text, answer, concept, hint, explanation, example };
  };

  window.buildMultiDigitMultiplicationQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const a =
      d < 0.3 ? randomInt(10, 30) : d < 0.7 ? randomInt(20, 99) : randomInt(30, 999);
    const b = d < 0.5 ? randomInt(2, 9) : randomInt(10, 25);
    const grade = ctx.grade || 1;
    const text =
      grade <= 4 ? `What is ${a} × ${b}?` : `Compute: ${a} × ${b}`;
    const answer = a * b;
    const concept = "Multi-digit multiplication";
    const hint =
      "Try the standard algorithm or break the numbers into tens, ones, and hundreds to multiply in parts.";
    const explanation =
      "Break apart one or both numbers to make multiplication easier, then combine the partial products.";
    const example =
      "Example: 23 × 14 = (20 + 3) × (10 + 4) = 20×10 + 20×4 + 3×10 + 3×4 = 200 + 80 + 30 + 12 = 322.";
    return { text, answer, concept, hint, explanation, example };
  };

  window.buildLongDivisionQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const divisor = d < 0.5 ? randomInt(2, 9) : randomInt(2, 12);
    const quotient =
      d < 0.3 ? randomInt(2, 20) : d < 0.7 ? randomInt(5, 50) : randomInt(10, 99);
    const remainderAllowed = d >= 0.6 && Math.random() < 0.5;
    const remainder = remainderAllowed ? randomInt(1, divisor - 1) : 0;
    const dividend = divisor * quotient + remainder;
    const grade = ctx.grade || 1;

    let text;
    if (remainder === 0) {
      text =
        grade <= 4
          ? `What is ${dividend} ÷ ${divisor}?`
          : `Compute: ${dividend} ÷ ${divisor}`;
    } else {
      text =
        grade <= 4
          ? `What is ${dividend} ÷ ${divisor}? Give your answer with a remainder.`
          : `Compute: ${dividend} ÷ ${divisor} (include the remainder).`;
    }

    const answer = remainder === 0 ? quotient : `${quotient} r ${remainder}`;
    const concept = "Long division with and without remainders";
    const hint =
      "Use long division: divide, multiply, subtract, bring down. Repeat until there is no number left to bring down.";
    const explanation =
      "Divide the dividend by the divisor step by step. The quotient shows how many groups, and any leftover part is the remainder.";
    const example =
      "Example: 123 ÷ 4 = 30 r 3.\nExample: 96 ÷ 8 = 12 with no remainder.";
    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Fractions & number sense helpers (Grades 3–5) ----

  window.buildFractionIntroQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const type = randomInt(1, 3);
    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      const denom = randomInt(2, 8);
      const num = randomInt(1, denom - 1);
      text = `What fraction of a whole is ${num} shaded out of ${denom}?`;
      answer = `${num}/${denom}`;
      concept = "Understanding fractions as part of a whole";
      hint =
        "The denominator tells how many equal parts in the whole. The numerator tells how many parts are shaded.";
      explanation =
        "When a shape is cut into equal parts, the fraction shaded is (number shaded) ÷ (total parts).";
      example =
        "Example: If 3 out of 4 equal parts are shaded, the fraction is 3/4.";
    } else if (type === 2) {
      const denom = randomInt(2, 10);
      const k = randomInt(2, 5);
      const textLeft = `${k}/${denom}`;
      const textRight = `1/${Math.floor(denom / k)}`;
      answer = k === Math.floor(denom / k) ? "yes" : "no";
      text = `Are the fractions ${textLeft} and ${textRight} equal?`;
      concept = "Comparing simple fractions";
      hint =
        "Think about how big each fraction is compared to 1/2 or 1. Which one represents more of the whole?";
      explanation =
        "Fractions with the same denominator can be compared by their numerators. For more complex pairs, think about benchmarks like 1/2.";
      example =
        "Example: 3/4 is greater than 2/4, and 2/3 is greater than 1/2.";
    } else {
      const denom = randomInt(2, 10);
      const num = randomInt(1, denom - 1);
      const whole = randomInt(1, 3);
      const improperNum = whole * denom + num;
      text = `Write ${improperNum}/${denom} as a mixed number.`;
      answer = `${whole} ${num}/${denom}`;
      concept = "Improper fractions and mixed numbers";
      hint =
        "Divide the numerator by the denominator. The quotient is the whole number, and the remainder is the numerator of the fraction part.";
      explanation =
        "An improper fraction has a numerator larger than the denominator. We can convert it into a whole number plus a proper fraction.";
      example =
        "Example: 11/4 = 2 3/4 because 11 ÷ 4 = 2 remainder 3.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  window.buildEquivalentFractionsQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const baseDenom = randomInt(2, 9);
    const baseNum = randomInt(1, baseDenom - 1);
    const k = randomInt(2, d < 0.6 ? 4 : 8);
    const num2 = baseNum * k;
    const denom2 = baseDenom * k;

    const text = `Which fraction is equivalent to ${baseNum}/${baseDenom}?`;
    const answer = `${num2}/${denom2}`;
    const concept = "Generating equivalent fractions";
    const hint =
      "Multiply the numerator and denominator by the same number to make an equivalent fraction.";
    const explanation =
      "If you multiply or divide the numerator and denominator of a fraction by the same nonzero number, the value of the fraction does not change.";
    const example =
      "Example: 1/2 = 2/4 = 3/6 because we multiply numerator and denominator by the same number.";

    return { text, answer, concept, hint, explanation, example };
  };

  window.buildFractionAddSubLikeDenQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const denom = randomInt(2, d < 0.6 ? 8 : 12);
    let a = randomInt(1, denom - 1);
    let b = randomInt(1, denom - 1);
    const op = Math.random() < 0.5 ? "+" : "−";

    if (op === "−" && a < b) {
      const tmp = a;
      a = b;
      b = tmp;
    }

    const numResult = op === "+" ? a + b : a - b;
    const g = gcd(numResult, denom);
    const simplifiedNum = numResult / g;
    const simplifiedDen = denom / g;
    const text = `What is ${a}/${denom} ${op} ${b}/${denom}?`;
    const answer = `${simplifiedNum}/${simplifiedDen}`;
    const concept = "Adding and subtracting fractions with like denominators";
    const hint =
      "Keep the denominator the same. Add or subtract the numerators, then simplify if you can.";
    const explanation =
      "When fractions have the same denominator, you add or subtract the numerators while keeping the denominator. Then reduce the fraction if possible.";
    const example =
      "Example: 1/6 + 3/6 = 4/6 = 2/3 after simplifying.";
    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Area & perimeter ----

  window.buildAreaPerimeterRectangleQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const length = randomInt(2, d < 0.6 ? 10 : 20);
    const width = randomInt(2, d < 0.6 ? 10 : 20);
    const type = Math.random() < 0.5 ? "area" : "perimeter";

    let text, answer, concept, hint, explanation, example;

    if (type === "area") {
      text = `A rectangle is ${length} units long and ${width} units wide. What is its area?`;
      answer = length * width;
      concept = "Area of rectangles";
      hint =
        "Multiply the length by the width to get the number of square units.";
      explanation =
        "The area of a rectangle is length × width. Think of covering the rectangle with 1-by-1 squares.";
      example =
        "Example: A 4 by 3 rectangle has area 4 × 3 = 12 square units.";
    } else {
      text = `A rectangle is ${length} units long and ${width} units wide. What is its perimeter?`;
      answer = 2 * (length + width);
      concept = "Perimeter of rectangles";
      hint =
        "Add up all the side lengths: length + width + length + width.";
      explanation =
        "Perimeter is the total distance around a shape. For a rectangle, there are two lengths and two widths.";
      example =
        "Example: A 5 by 2 rectangle has perimeter 5 + 2 + 5 + 2 = 14 units.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Mixed review helpers ----

  function buildMixedFromList(ctx, generators) {
    const index = randomInt(0, generators.length - 1);
    return generators[index](ctx);
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
      window.buildAddSubWithin100Question,
      window.buildAddSubWithin1000Question,
      window.buildPlaceValueQuestion,
      window.buildMultiplicationFactsQuestion
    ]);
  };

  window.buildG3MixedReviewQuestion = function (ctx) {
    return buildMixedFromList(ctx, [
      window.buildMultiplicationFactsQuestion,
      window.buildDivisionFactsQuestion
    ]);
  };

  window.buildG4MixedReviewQuestion = function (ctx) {
    return buildMixedFromList(ctx, [
      window.buildMultiDigitMultiplicationQuestion,
      window.buildLongDivisionQuestion,
      window.buildEquivalentFractionsQuestion,
      window.buildFractionAddSubLikeDenQuestion,
      window.buildAreaPerimeterRectangleQuestion
    ]);
  };

  // ---- Shared helpers used in multiple generators ----

  function clampDifficulty(x) {
    if (x < 0) return 0;
    if (x > 1) return 1;
    return x;
  }

  function mapNumberToDifficulty(n) {
    if (typeof n !== "number" || !isFinite(n) || n <= 1) return 0.1;
    if (n >= 100) return 1;
    return n / 100;
  }

  function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    if (!b) return a || 1;
    while (b) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a || 1;
  }
})();

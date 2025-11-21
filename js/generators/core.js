// js/generators/core.js
// All question builders used by curriculum.js
// Each returns: { text, answer, concept, hint, explanation, example }

// NOTE: Uses randomInt, difficultyFromNumber, gradePrompt from utils.js

// ---------- Basic helpers ----------

function clampDifficulty(diff) {
  if (diff < 0) return 0;
  if (diff > 1) return 1;
  return diff;
}

// ---------- Grade 1–4: Counting, add/sub, place value ----------

function buildCountCompareQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const max = diff < 0.4 ? 20 : diff < 0.7 ? 50 : 120;
  const a = randomInt(0, max);
  const b = randomInt(0, max);
  const comparison = a > b ? ">" : a < b ? "<" : "=";

  const text = gradePrompt(
    grade,
    `Compare the two numbers: ${a} __ ${b}\nFill in the blank with >, <, or =.\n(Answer: use 1 for ">", -1 for "<", 0 for "=".)`,
    `Compare ${a} and ${b}. Use 1 for ">", -1 for "<", or 0 for "=" as your answer.`,
    `Compare the two numbers ${a} and ${b}. Respond with 1 if a > b, -1 if a < b, and 0 if a = b.`
  );

  const concept = "Comparing whole numbers";
  const hint = `Think about which number is larger, or if they are the same.`;
  const explanation =
`To compare two numbers:
1. Look at how many ones (and tens) each number has.
2. If the first number is bigger, it's "greater than" (>).
3. If the first number is smaller, it's "less than" (<).
4. If they are the same, use "=".`;
  const example =
`Example:
Compare 7 and 12.
12 is larger than 7, so 7 < 12.
We answer with -1 to show "<".`;

  let answer;
  if (comparison === ">") answer = 1;
  else if (comparison === "<") answer = -1;
  else answer = 0;

  return { text, answer, concept, hint, explanation, example };
}

function buildAddSubQuestion(grade, diff, maxTotal) {
  diff = clampDifficulty(diff);
  const useSub = diff > 0.3 && Math.random() < 0.5;
  const max = maxTotal || 100;

  let a, b, op, answer;

  if (!useSub) {
    a = randomInt(0, max);
    b = randomInt(0, max - a);
    op = "+";
    answer = a + b;
  } else {
    a = randomInt(Math.floor(max * 0.3), max);
    b = randomInt(0, a);
    op = "-";
    answer = a - b;
  }

  const text = gradePrompt(
    grade,
    `What is ${a} ${op} ${b}?`,
    `Compute ${a} ${op} ${b}.`,
    `Evaluate ${a} ${op} ${b}.`
  );

  const concept = "Adding and subtracting whole numbers";
  const hint = useSub
    ? "For subtraction, you can think: starting number – take away."
    : "For addition, you can think: put the groups together.";
  const explanation =
`To solve simple addition and subtraction:
1. For addition, join the two amounts.
2. For subtraction, start with the first number and take away the second.
3. You can use mental math, number lines, or column addition/subtraction.`;
  const example =
`Example (addition):
8 + 6
1. Start at 8.
2. Add 6 more: 8 + 6 = 14.

Example (subtraction):
15 - 9
1. Start at 15.
2. Take away 9: 15 - 9 = 6.`;

  return { text, answer, concept, hint, explanation, example };
}

function buildPlaceValueQuestion(grade, diff, max) {
  diff = clampDifficulty(diff);
  const upper = max || (diff < 0.5 ? 99 : 999);
  const n = randomInt(10, upper);
  const place = Math.random() < 0.5 ? "tens" : "ones";

  let digit;
  if (place === "ones") {
    digit = n % 10;
  } else {
    digit = Math.floor((n % 100) / 10);
  }

  const text = gradePrompt(
    grade,
    `Look at the number ${n}.\nWhat digit is in the ${place} place?`,
    `For the number ${n}, identify the digit in the ${place} place.`,
    `In the number ${n}, determine the digit occupying the ${place} place.`
  );

  const concept = "Place value of digits in whole numbers";
  const hint = `Write the number and label ones, tens, hundreds. Then pick the ${place} digit.`;
  const explanation =
`Place value tells us what each digit means:
- The ones place is the last digit.
- The tens place is one position to the left.
- The hundreds place is two positions to the left.`;
  const example =
`Example:
Number: 47
Ones place: 7
Tens place: 4
So the tens digit is 4.`;

  return { text, answer: digit, concept, hint, explanation, example };
}

// ---------- Geometry: shapes, angles, area, volume ----------

function buildShapesQuestion(grade, diff) {
  const shapes = ["triangle", "square", "rectangle", "circle"];
  const shape = shapes[randomInt(0, shapes.length - 1)];

  const text = gradePrompt(
    grade,
    `A ${shape} is a 2D shape.\nHow many sides does a ${shape} have?`,
    `How many sides does a ${shape} have?`,
    `Determine the number of sides for a ${shape}.`
  );

  let answer;
  if (shape === "circle") answer = 0;
  else if (shape === "triangle") answer = 3;
  else if (shape === "square" || shape === "rectangle") answer = 4;

  const concept = "Basic properties of shapes";
  const hint = `Picture the ${shape} and count each straight side. A circle has no straight sides.`;
  const explanation =
`Polygons have straight sides:
- Triangle → 3 sides
- Square → 4 equal sides
- Rectangle → 4 sides (opposite sides equal)
A circle has a curved edge and no straight sides.`;
  const example =
`Example:
A triangle looks like a three-corner shape: it has 3 sides.`;

  return { text, answer, concept, hint, explanation, example };
}

function buildAreaPerimeterQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const maxSide = diff < 0.5 ? 10 : 25;
  const length = randomInt(2, maxSide);
  const width = randomInt(2, maxSide);
  const askAreaNotPerimeter = Math.random() < 0.5;

  let text, answer, concept, hint, explanation, example;

  if (askAreaNotPerimeter) {
    text = gradePrompt(
      grade,
      `A rectangle is ${length} units long and ${width} units wide.\nWhat is its area?`,
      `Find the area of a rectangle with length ${length} and width ${width}.`,
      `Compute the area of a rectangle with sides ${length} and ${width}.`
    );
    answer = length * width;
    concept = "Area of rectangles";
    hint = "Area of a rectangle is length × width.";
    explanation =
`Area measures how much space a shape covers.
For rectangles:
Area = length × width.`;
    example =
`Example:
Length = 5, Width = 3
Area = 5 × 3 = 15 square units.`;
  } else {
    text = gradePrompt(
      grade,
      `A rectangle is ${length} units long and ${width} units wide.\nWhat is its perimeter?`,
      `Find the perimeter of a rectangle with length ${length} and width ${width}.`,
      `Compute the perimeter of a rectangle with sides ${length} and ${width}.`
    );
    answer = 2 * (length + width);
    concept = "Perimeter of rectangles";
    hint = "Perimeter is the distance around the shape. Add all four sides.";
    explanation =
`Perimeter measures distance around a shape.
For rectangles:
Perimeter = 2 × (length + width).`;
    example =
`Example:
Length = 4, Width = 6
Perimeter = 2 × (4 + 6) = 2 × 10 = 20 units.`;
  }

  return { text, answer, concept, hint, explanation, example };
}

function buildAngleQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const types = ["acute", "right", "obtuse", "straight"];
  const type = types[randomInt(0, types.length - 1)];
  let angle;

  if (type === "acute") {
    angle = randomInt(20, 70);
  } else if (type === "right") {
    angle = 90;
  } else if (type === "obtuse") {
    angle = randomInt(100, 160);
  } else {
    angle = 180;
  }

  const text = gradePrompt(
    grade,
    `An angle measures ${angle}°.\nIs it acute (1), right (2), obtuse (3), or straight (4)?\n(Answer with 1, 2, 3, or 4.)`,
    `Classify an angle of ${angle}° as acute (1), right (2), obtuse (3), or straight (4).`,
    `Given an angle of ${angle}°, classify it: acute (1), right (2), obtuse (3), or straight (4).`
  );

  const concept = "Classifying angles by measure";
  const hint = "Remember: acute < 90°, right = 90°, obtuse is between 90° and 180°, straight = 180°.";
  const explanation =
`Angle types:
- Acute: less than 90°
- Right: exactly 90°
- Obtuse: greater than 90° but less than 180°
- Straight: exactly 180°`;
  const example =
`Example:
Angle = 120°
It's more than 90° but less than 180°, so it is obtuse (3).`;

  let answerVal;
  if (type === "acute") answerVal = 1;
  else if (type === "right") answerVal = 2;
  else if (type === "obtuse") answerVal = 3;
  else answerVal = 4;

  return { text, answer: answerVal, concept, hint, explanation, example };
}

function buildVolumeQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const maxSide = diff < 0.5 ? 5 : 12;
  const l = randomInt(2, maxSide);
  const w = randomInt(2, maxSide);
  const h = randomInt(2, maxSide);

  const text = gradePrompt(
    grade,
    `A box (rectangular prism) is ${l} units long, ${w} units wide, and ${h} units tall.\nWhat is its volume?`,
    `Find the volume of a rectangular prism with dimensions ${l} × ${w} × ${h}.`,
    `Compute the volume of a rectangular prism with side lengths ${l}, ${w}, and ${h}.`
  );

  const answer = l * w * h;
  const concept = "Volume of rectangular prisms";
  const hint = "Volume = length × width × height.";
  const explanation =
`Volume measures how much 3D space an object takes.
For a rectangular prism:
Volume = length × width × height.`;
  const example =
`Example:
Length = 3, Width = 4, Height = 2
Volume = 3 × 4 × 2 = 24 cubic units.`;

  return { text, answer, concept, hint, explanation, example };
}

// ---------- Measurement: time, money, length, mass, capacity ----------

function buildTimeMoneyMeasurementQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const mode = randomInt(1, 3); // 1=time, 2=money, 3=length

  if (mode === 1) {
    // time addition
    const h1 = randomInt(0, 3);
    const m1 = randomInt(0, 45);
    const h2 = randomInt(0, 2);
    const m2 = randomInt(0, 45);

    const totalMins = h1 * 60 + m1 + h2 * 60 + m2;
    const answer = totalMins;

    const text = gradePrompt(
      grade,
      `You spend ${h1} hours ${m1} minutes on homework and ${h2} hours ${m2} minutes playing.\nHow many minutes is that in total?`,
      `Add the times: ${h1} h ${m1} min and ${h2} h ${m2} min.\nGive your answer in minutes.`,
      `Find the total number of minutes in ${h1} h ${m1} min plus ${h2} h ${m2} min.`
    );

    const concept = "Adding time and converting to minutes";
    const hint = "Convert each time to minutes, then add.";
    const explanation =
`To add times:
1. Convert hours to minutes (1 h = 60 min).
2. Add all the minutes together.`;
    const example =
`Example:
1 h 20 min + 40 min
1 h 20 min = 80 min
80 + 40 = 120 minutes.`;

    return { text, answer, concept, hint, explanation, example };
  }

  if (mode === 2) {
    // simple money add
    const dollars1 = randomInt(1, 20);
    const cents1 = randomInt(0, 95);
    const dollars2 = randomInt(1, 20);
    const cents2 = randomInt(0, 95);

    const amount1 = dollars1 + cents1 / 100;
    const amount2 = dollars2 + cents2 / 100;
    const total = Math.round((amount1 + amount2) * 100) / 100;

    const text = gradePrompt(
      grade,
      `You have $${amount1.toFixed(2)} and your friend gives you $${amount2.toFixed(2)}.\nHow much money do you have now? (Answer in dollars, like 5.75)`,
      `Add the money amounts $${amount1.toFixed(2)} and $${amount2.toFixed(2)}.`,
      `Compute the sum of $${amount1.toFixed(2)} and $${amount2.toFixed(2)}.`
    );

    const concept = "Adding money amounts (decimals)";
    const hint = "Line up the decimal points and add dollars and cents.";
    const explanation =
`Money is a real-life example of decimals.
To add money:
1. Line up the decimal points.
2. Add cents, then dollars.`;
    const example =
`Example:
$3.25 + $1.80
3.25
+1.80
=5.05`;

    return { text, answer: total, concept, hint, explanation, example };
  }

  // mode 3: length / measurement comparison
  const cm = randomInt(10, 150);
  const text = gradePrompt(
    grade,
    `A pencil is ${cm} cm long. How many millimeters long is it?`,
    `Convert ${cm} cm to millimeters.`,
    `Express a length of ${cm} cm in millimeters.`
  );
  const answer = cm * 10;
  const concept = "Metric conversions (cm to mm)";
  const hint = "In metric, 1 cm = 10 mm.";
  const explanation =
`Metric length units:
- 1 cm = 10 mm
To convert cm to mm, multiply by 10.`;
  const example =
`Example:
7 cm = 7 × 10 = 70 mm.`;

  return { text, answer, concept, hint, explanation, example };
}

// ---------- Word problems ----------

function buildOneStepWordProblemQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const a = randomInt(3, 20);
  const b = randomInt(3, 20);
  const useAdd = Math.random() < 0.5;

  let text, answer;
  if (useAdd) {
    answer = a + b;
    text = gradePrompt(
      grade,
      `You have ${a} marbles. Your friend gives you ${b} more.\nHow many marbles do you have now?`,
      `A student has ${a} items and gets ${b} more. How many are there in all?`,
      `A quantity increases from ${a} to ${a} + ${b}. Find the final amount.`
    );
  } else {
    const bigger = a + b;
    answer = bigger - a;
    text = gradePrompt(
      grade,
      `You had ${bigger} stickers. You gave away ${a} stickers.\nHow many stickers do you have left?`,
      `A student starts with ${bigger} items and gives away ${a}. How many remain?`,
      `From an initial ${bigger} items, ${a} are removed. Compute what remains.`
    );
  }

  const concept = "One-step word problems with addition or subtraction";
  const hint = "Decide if the story is putting together (add) or taking away (subtract).";
  const explanation =
`To solve one-step word problems:
1. Read carefully and decide if the situation is "join" or "take away".
2. Use addition when two groups are combined.
3. Use subtraction when something is removed.`;
  const example =
`Example:
Sam has 9 apples and buys 4 more.
This is joining: 9 + 4 = 13 apples.`;

  const exampleText = example;

  return { text, answer, concept, hint, explanation, example: exampleText };
}

function buildTwoStepWordProblemQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const a = randomInt(5, 20);
  const b = randomInt(5, 20);
  const c = randomInt(2, 10);

  const text = gradePrompt(
    grade,
    `A class has ${a} red markers and ${b} blue markers.\nThen ${c} markers dry out and must be thrown away.\nHow many markers are left?`,
    `There are ${a} red and ${b} blue markers. After ${c} markers dry out and are discarded, how many remain?`,
    `A collection starts with ${a} red and ${b} blue markers. After ${c} are lost, compute the remaining total.`
  );

  const totalStart = a + b;
  const answer = totalStart - c;

  const concept = "Two-step word problems with addition and subtraction";
  const hint = "First add red and blue markers, then subtract the dried-out markers.";
  const explanation =
`Two-step problems need two operations:
1. Combine or compare amounts first.
2. Then add or subtract again to get the final answer.`;
  const example =
`Example:
8 red, 7 blue, 3 dry out.
Step 1: 8 + 7 = 15 markers at first.
Step 2: 15 - 3 = 12 markers left.`;

  return { text, answer, concept, hint, explanation, example };
}

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
    `A ${item} is cut into ${denom} equal pieces. There are ${whole} ${item}s.\nIf someone eats ${numer}/${denom} of all the pieces, how many pieces are eaten?`,
    `A ${item} pan is cut into ${denom} equal pieces and there are ${whole} pans.\nSomeone eats ${numer}/${denom} of all the pieces. How many pieces is that?`,
    `A ${item} pan is divided into ${denom} congruent pieces, and there are ${whole} pans.\nIf a person eats ${numer}/${denom} of the total pieces, how many pieces do they eat?`
  );

  const concept = "Word problems involving a fraction of a whole";
  const hint = "Find the total number of pieces first, then take the given fraction of that total.";
  const explanation =
`To solve a fraction word problem:
1. Find the total number of equal parts.
2. Multiply that total by the fraction to see how many parts are used or eaten.`;
  const example =
`Example:
A cake is cut into 8 pieces. There are 2 cakes.
If someone eats 3/8 of all the pieces, how many pieces are eaten?
1. Total pieces: 2 × 8 = 16
2. 3/8 of 16: 16 ÷ 8 = 2, then 2 × 3 = 6
So 6 pieces are eaten.`;

  return { text, answer: eaten, concept, hint, explanation, example };
}

// ---------- Fractions & decimals ----------

function buildFractionOfNumberQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const denomOptions = [2, 3, 4, 5, 6, 8, 10, 12];
  const denom = denomOptions[randomInt(0, denomOptions.length - 1)];
  const maxWhole = diff < 0.5 ? 20 : 60;
  const whole = randomInt(1, maxWhole);
  const numer = randomInt(1, denom - 1);

  const text = gradePrompt(
    grade,
    `Find ${numer}/${denom} of ${whole}.`,
    `Compute ${numer}/${denom} × ${whole}.`,
    `Evaluate the product ${numer}/${denom} · ${whole}.`
  );

  const answer = (numer * whole) / denom;
  const concept = "Finding a fraction of a whole number";
  const hint = "Multiply the whole number by the numerator, then divide by the denominator.";
  const explanation =
`To find a fraction of a number:
1. Multiply the number by the numerator.
2. Divide the result by the denominator.`;
  const example =
`Example:
Find 3/4 of 20.
1. 20 × 3 = 60
2. 60 ÷ 4 = 15
So 3/4 of 20 is 15.`;

  return { text, answer, concept, hint, explanation, example };
}

function buildFractionAddSubQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const denomOptions = diff < 0.4 ? [2, 3, 4, 5, 6] : [4, 5, 6, 8, 10, 12];
  const denom = denomOptions[randomInt(0, denomOptions.length - 1)];
  const a = randomInt(1, denom - 1);
  const b = randomInt(1, denom - 1);
  const useAdd = Math.random() < 0.5;
  const op = useAdd ? "+" : "-";

  const numer = useAdd ? a + b : a - b;
  // keep answer as simplified decimal for consistency with number input
  const fracValue = numer / denom;

  const text = gradePrompt(
    grade,
    `Compute: ${a}/${denom} ${op} ${b}/${denom}.\n(Give your answer as a decimal.)`,
    `Add or subtract the fractions: ${a}/${denom} ${op} ${b}/${denom}, and answer as a decimal.`,
    `Evaluate ${a}/${denom} ${op} ${b}/${denom} and express as a decimal.`
  );

  const concept = "Adding and subtracting fractions with like denominators";
  const hint = "When denominators match, add or subtract the numerators and keep the denominator.";
  const explanation =
`For fractions with the same denominator:
1. Add or subtract the numerators.
2. Keep the denominator the same.
3. Convert to a decimal if needed.`;
  const example =
`Example:
3/8 + 2/8
(3 + 2)/8 = 5/8 = 0.625`;

  const answer = Math.round(fracValue * 1000) / 1000;

  return { text, answer, concept, hint, explanation, example };
}

function buildFractionCompareQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const denom1 = randomInt(2, 10);
  const denom2 = randomInt(2, 10);
  const num1 = randomInt(1, denom1 - 1);
  const num2 = randomInt(1, denom2 - 1);

  const val1 = num1 / denom1;
  const val2 = num2 / denom2;
  const cmp = val1 > val2 ? 1 : val1 < val2 ? -1 : 0;

  const text = gradePrompt(
    grade,
    `Compare the fractions ${num1}/${denom1} and ${num2}/${denom2}.\nIs the first bigger (1), smaller (-1), or equal (0)?`,
    `Compare ${num1}/${denom1} and ${num2}/${denom2}. Answer 1 if the first is greater, -1 if smaller, 0 if equal.`,
    `Compare the rational numbers ${num1}/${denom1} and ${num2}/${denom2}. Respond with 1 if the first is larger, -1 if smaller, or 0 if equal.`
  );

  const concept = "Comparing fractions";
  const hint = "You can cross-multiply or convert both fractions to decimals to compare.";
  const explanation =
`To compare fractions a/b and c/d:
1. Compare a × d and c × b (cross-multiply).
2. If a × d > c × b, then a/b > c/d.
3. If a × d < c × b, then a/b < c/d.`;
  const example =
`Example:
Compare 2/3 and 3/5.
2 × 5 = 10
3 × 3 = 9
Since 10 > 9, 2/3 > 3/5. Answer: 1.`;

  return { text, answer: cmp, concept, hint, explanation, example };
}

function buildFractionMulDivQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const useMul = Math.random() < 0.5;
  const denom1 = randomInt(2, 10);
  const denom2 = randomInt(2, 10);
  const num1 = randomInt(1, denom1 - 1);
  const num2 = randomInt(1, denom2 - 1);

  let val;
  let text;

  if (useMul) {
    val = (num1 / denom1) * (num2 / denom2);
    text = gradePrompt(
      grade,
      `Multiply the fractions: ${num1}/${denom1} × ${num2}/${denom2}.\n(Give your answer as a decimal.)`,
      `Compute the product: ${num1}/${denom1} × ${num2}/${denom2}.`,
      `Evaluate ${num1}/${denom1} · ${num2}/${denom2} and express as a decimal.`
    );
  } else {
    val = (num1 / denom1) / (num2 / denom2);
    text = gradePrompt(
      grade,
      `Divide the fractions: (${num1}/${denom1}) ÷ (${num2}/${denom2}).\n(Give your answer as a decimal.)`,
      `Compute the quotient: (${num1}/${denom1}) ÷ (${num2}/${denom2}).`,
      `Evaluate the quotient of ${num1}/${denom1} and ${num2}/${denom2} as a decimal.`
    );
  }

  const answer = Math.round(val * 1000) / 1000;
  const concept = useMul ? "Multiplying fractions" : "Dividing fractions";
  const hint = useMul
    ? "Multiply numerators together and denominators together."
    : "Flip the second fraction (take the reciprocal) and multiply.";
  const explanation =
`Multiplying fractions:
1. Multiply the numerators.
2. Multiply the denominators.
3. Simplify if possible.

Dividing fractions:
1. Keep the first fraction.
2. Flip the second fraction (reciprocal).
3. Multiply as usual.`;
  const example =
`Example:
(2/3) × (3/4) = 6/12 = 1/2
(2/3) ÷ (3/4) = (2/3) × (4/3) = 8/9`;

  return { text, answer, concept, hint, explanation, example };
}

function buildDecimalOperationsQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const maxWhole = diff < 0.5 ? 20 : 100;
  const a = Math.round((randomInt(0, maxWhole * 10)) / 10);
  const b = Math.round((randomInt(0, maxWhole * 10)) / 10);
  const ops = ["+", "-", "*"];
  const op = ops[randomInt(0, ops.length - 1)];

  let answer;
  if (op === "+") answer = a + b;
  else if (op === "-") answer = a - b;
  else answer = a * b;

  answer = Math.round(answer * 1000) / 1000;

  const text = gradePrompt(
    grade,
    `Compute: ${a.toFixed(1)} ${op} ${b.toFixed(1)}.`,
    `Evaluate ${a.toFixed(1)} ${op} ${b.toFixed(1)}.`,
    `Perform the operation ${a.toFixed(1)} ${op} ${b.toFixed(1)} and give a decimal answer.`
  );

  const concept = "Operations with decimals";
  const hint = "Line up decimal points for +/−; for ×, ignore the decimal, multiply, then place it back.";
  const explanation =
`Decimal operations follow place-value rules:
- For +/−, align decimal points.
- For ×, multiply as whole numbers, then count decimal places.
- For ÷, move decimals to make the divisor a whole number, then divide.`;
  const example =
`Example:
3.2 + 1.5 = 4.7
2.5 × 0.4 = 1.0`;

  return { text, answer, concept, hint, explanation, example };
}

function buildPercentQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const base = diff < 0.5 ? randomInt(20, 200) : randomInt(50, 500);
  const pOptions = [5, 10, 15, 20, 25, 30, 40, 50];
  const p = pOptions[randomInt(0, pOptions.length - 1)];

  const text = gradePrompt(
    grade,
    `What is ${p}% of ${base}? (Answer as a number, not a percent.)`,
    `Find ${p}% of ${base}.`,
    `Compute ${p}% of ${base} and give the result as a number.`
  );

  const answer = Math.round(base * (p / 100) * 1000) / 1000;
  const concept = "Percent of a number";
  const hint = "Change the percent to a decimal (divide by 100), then multiply by the number.";
  const explanation =
`To find P% of a number N:
1. Convert P% to decimal: P ÷ 100.
2. Multiply decimal × N.`;
  const example =
`Example:
20% of 50
20% = 0.20
0.20 × 50 = 10`;

  return { text, answer, concept, hint, explanation, example };
}

// ---------- Ratios, rates, integers, stats ----------

function buildRatiosQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const a = randomInt(1, 12);
  const b = randomInt(1, 12);
  const scale = randomInt(2, 5);

  const text = gradePrompt(
    grade,
    `The ratio of cats to dogs is ${a}:${b}.\nIf there are ${a * scale} cats, how many dogs are there?`,
    `In a class, the ratio of boys to girls is ${a}:${b}.\nIf there are ${a * scale} boys, how many girls are there?`,
    `A ratio of ${a}:${b} represents cats:dogs.\nWhen the number of cats is scaled to ${a * scale}, determine the corresponding number of dogs.`
  );

  const answer = b * scale;
  const concept = "Ratios and proportional reasoning";
  const hint = "Use a × scale for the first part, and b × the same scale for the second.";
  const explanation =
`Ratios compare two quantities.
If the ratio is a:b and you multiply a by k, then b must also be multiplied by k to keep the same ratio.`;
  const example =
`Example:
Ratio 2:3, cats:dogs.
If cats = 2 × 4 = 8, then dogs = 3 × 4 = 12.`;

  return { text, answer, concept, hint, explanation, example };
}

function buildFractionDecimalPercentQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const type = randomInt(1, 3); // frac→dec, dec→%, %→dec
  let text, answer, concept, hint, explanation, example;

  if (type === 1) {
    const denomOptions = [2, 4, 5, 8, 10, 20, 25];
    const denom = denomOptions[randomInt(0, denomOptions.length - 1)];
    const numer = randomInt(1, denom - 1);
    const val = numer / denom;
    answer = Math.round(val * 1000) / 1000;

    text = gradePrompt(
      grade,
      `Write the fraction ${numer}/${denom} as a decimal.`,
      `Convert ${numer}/${denom} to decimal form.`,
      `Express ${numer}/${denom} as a decimal.`
    );
    concept = "Converting fractions to decimals";
    hint = "Divide numerator by denominator.";
    explanation =
`To convert a fraction a/b to a decimal, compute a ÷ b.`;
    example =
`Example:
1/4 = 1 ÷ 4 = 0.25`;
  } else if (type === 2) {
    const val = Math.round(randomInt(10, 95));
    answer = val / 100;
    text = gradePrompt(
      grade,
      `Write ${val}% as a decimal.`,
      `Convert ${val}% to decimal form.`,
      `Express ${val}% as a decimal.`
    );
    concept = "Converting percents to decimals";
    hint = "Divide the percent by 100.";
    explanation =
`To change P% to a decimal, compute P ÷ 100.`;
    example =
`Example:
37% = 37 ÷ 100 = 0.37`;
  } else {
    const val = Math.round(randomInt(1, 99)) / 10;
    answer = val * 100;
    text = gradePrompt(
      grade,
      `Write ${val.toFixed(1)} as a percent.`,
      `Convert ${val.toFixed(1)} to percent form.`,
      `Express ${val.toFixed(1)} as a percent.`
    );
    concept = "Converting decimals to percents";
    hint = "Multiply the decimal by 100.";
    explanation =
`To change a decimal d to a percent, compute d × 100.`;
    example =
`Example:
0.6 = 0.6 × 100 = 60%`;
  }

  return { text, answer, concept, hint, explanation, example };
}

function buildEquationsIntroQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const a = randomInt(2, 12);
  const x = randomInt(2, 20);
  const b = a * x + randomInt(-10, 10);

  const useAddFirst = Math.random() < 0.5;
  let text;
  if (useAddFirst) {
    // ax + c = b
    const c = randomInt(-10, 10);
    const rhs = a * x + c;
    text = gradePrompt(
      grade,
      `Solve for x: ${a}x + ${c} = ${rhs}`,
      `Solve the equation ${a}x + ${c} = ${rhs}.`,
      `Find x satisfying ${a}x + ${c} = ${rhs}.`
    );
  } else {
    text = gradePrompt(
      grade,
      `Solve for x: ${a}x = ${b}`,
      `Solve the equation ${a}x = ${b}.`,
      `Find x such that ${a}x = ${b}.`
    );
  }

  const answer = x;
  const concept = "Solving simple linear equations";
  const hint = "Use inverse operations: undo addition/subtraction, then undo multiplication/division.";
  const explanation =
`To solve linear equations:
1. Undo addition or subtraction on x.
2. Then undo multiplication or division on x.
3. Work step by step to get x alone.`;
  const example =
`Example:
3x + 4 = 19
1. Subtract 4: 3x = 15
2. Divide by 3: x = 5`;

  return { text, answer, concept, hint, explanation, example };
}

function buildStatsQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const n = diff < 0.5 ? 5 : 7;
  const data = [];
  for (let i = 0; i < n; i++) {
    data.push(randomInt(1, 20));
  }
  const sorted = data.slice().sort((a, b) => a - b);
  const sum = data.reduce((acc, v) => acc + v, 0);
  const mean = sum / n;
  const median = n % 2 === 1
    ? sorted[(n - 1) / 2]
    : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
  const range = sorted[sorted.length - 1] - sorted[0];

  const mode = randomInt(1, 3);

  let text, answer, concept, hint;
  if (mode === 1) {
    text = gradePrompt(
      grade,
      `Here are some data values: ${data.join(", ")}.\nWhat is the mean (average)?`,
      `Given the data set: ${data.join(", ")}, compute the mean.`,
      `Compute the arithmetic mean of the data: ${data.join(", ")}.`
    );
    answer = Math.round(mean * 1000) / 1000;
    concept = "Mean of a data set";
    hint = "Add all values and divide by how many values there are.";
  } else if (mode === 2) {
    text = gradePrompt(
      grade,
      `Here are some data values: ${data.join(", ")}.\nWhat is the median?`,
      `Given the ordered data set, find the median.`,
      `Determine the median of the data: ${data.join(", ")}.`
    );
    answer = median;
    concept = "Median of a data set";
    hint = "Sort the numbers and find the middle value.";
  } else {
    text = gradePrompt(
      grade,
      `Here are some data values: ${data.join(", ")}.\nWhat is the range?`,
      `Given the data set, compute the range.`,
      `Find the range of the data: ${data.join(", ")}.`
    );
    answer = range;
    concept = "Range of a data set";
    hint = "Subtract the smallest value from the largest value.";
  }

  const explanation =
`Basic statistics measures:
- Mean: sum of values ÷ number of values.
- Median: middle value when data are sorted.
- Range: largest value − smallest value.`;
  const example =
`Example:
Data: 3, 5, 7, 7, 10
Mean = (3+5+7+7+10)/5 = 32/5 = 6.4
Median = 7
Range = 10 − 3 = 7`;

  return { text, answer, concept, hint, explanation, example };
}

function buildIntegersQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const max = diff < 0.5 ? 20 : 50;
  const a = randomInt(-max, max);
  const b = randomInt(-max, max);
  const useAdd = Math.random() < 0.5;
  const op = useAdd ? "+" : "-";

  let answer;
  if (useAdd) {
    answer = a + b;
  } else {
    answer = a - b;
  }

  const text = gradePrompt(
    grade,
    `Compute with integers: ${a} ${op} ${b}.`,
    `Evaluate the integer expression: ${a} ${op} ${b}.`,
    `Simplify ${a} ${op} ${b}.`
  );

  const concept = "Adding and subtracting integers";
  const hint = "Think about number lines: moving right is positive, left is negative.";
  const explanation =
`For integers:
- Adding a positive moves right on the number line.
- Adding a negative moves left.
- Subtracting is the same as adding the opposite.`;
  const example =
`Example:
-3 + 5 = 2
7 - (-4) = 7 + 4 = 11`;

  return { text, answer, concept, hint, explanation, example };
}

function buildRateWordProblemQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const distance = randomInt(30, 300);
  const time = randomInt(2, 10);
  const text = gradePrompt(
    grade,
    `A car travels ${distance} km in ${time} hours.\nWhat is its speed in km per hour?`,
    `A car covers ${distance} km in ${time} hours. Find its speed (km/h).`,
    `Determine the unit rate (km per hour) if a car travels ${distance} km in ${time} h.`
  );

  const answer = Math.round((distance / time) * 1000) / 1000;
  const concept = "Unit rates (distance per time)";
  const hint = "Unit rate = total distance ÷ total time.";
  const explanation =
`A unit rate shows "per 1" of something.
Speed in km/h = total kilometers ÷ total hours.`;
  const example =
`Example:
120 km in 3 hours
Speed = 120 ÷ 3 = 40 km/h`;

  return { text, answer, concept, hint, explanation, example };
}

// ---------- Middle & high school: algebra, exponents, trig, functions, sequences, limits, vectors, etc. ----------

function buildLinearEquationQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const a = randomInt(2, 12);
  const x = randomInt(-10, 10);
  const b = randomInt(-10, 10);
  const rhs = a * x + b;

  const text = gradePrompt(
    grade,
    `Solve for x: ${a}x + ${b} = ${rhs}`,
    `Solve the linear equation: ${a}x + ${b} = ${rhs}.`,
    `Find the solution x for ${a}x + ${b} = ${rhs}.`
  );

  const answer = x;
  const concept = "Solving linear equations";
  const hint = "Subtract b from both sides, then divide by a.";
  const explanation =
`For ax + b = c:
1. Subtract b from both sides → ax = c − b.
2. Divide both sides by a → x = (c − b) / a.`;
  const example =
`Example:
3x + 4 = 19
3x = 15
x = 5`;

  return { text, answer, concept, hint, explanation, example };
}

function buildQuadraticQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const r1 = randomInt(-5, 5);
  const r2 = randomInt(-5, 5);
  const a = 1;
  const b = -(r1 + r2);
  const c = r1 * r2;

  const text = gradePrompt(
    grade,
    `Solve the quadratic equation: x² ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}x ${c >= 0 ? "+ " + c : "- " + Math.abs(c)} = 0.\nGive one root (if two, pick either).`,
    `Find a root of x² ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}x ${c >= 0 ? "+ " + c : "- " + Math.abs(c)} = 0.`,
    `Determine one solution of x² ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}x ${c >= 0 ? "+ " + c : "- " + Math.abs(c)} = 0.`
  );

  const answer = Math.random() < 0.5 ? r1 : r2;
  const concept = "Solving simple quadratic equations by factoring";
  const hint = "Look for two numbers that multiply to c and add to b.";
  const explanation =
`To solve x² + bx + c = 0:
1. Find numbers r₁ and r₂ with r₁ + r₂ = -b and r₁·r₂ = c.
2. Factor as (x − r₁)(x − r₂) = 0.
3. Roots are x = r₁ and x = r₂.`;
  const example =
`Example:
x² − 5x + 6 = 0
Numbers −2 and −3 multiply to 6 and add to −5.
(x − 2)(x − 3) = 0 → x = 2 or x = 3`;

  return { text, answer, concept, hint, explanation, example };
}

function buildTrigQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const hyp = randomInt(5, 15);
  const adj = randomInt(3, hyp - 1);
  const opp = Math.round(Math.sqrt(hyp * hyp - adj * adj));

  const mode = randomInt(1, 3); // sin, cos, tan
  let text, answer, concept, hint;

  if (mode === 1) {
    text = gradePrompt(
      grade,
      `In a right triangle, opposite side = ${opp}, hypotenuse = ${hyp}.\nFind sin(θ) as a decimal (opposite/hypotenuse).`,
      `A right triangle has opposite ${opp} and hypotenuse ${hyp}. Compute sin(θ).`,
      `Given a right triangle with opposite ${opp} and hypotenuse ${hyp}, evaluate sin(θ).`
    );
    answer = Math.round((opp / hyp) * 1000) / 1000;
    concept = "Sine ratio in right triangles";
    hint = "sin(θ) = opposite / hypotenuse.";
  } else if (mode === 2) {
    text = gradePrompt(
      grade,
      `In a right triangle, adjacent side = ${adj}, hypotenuse = ${hyp}.\nFind cos(θ) as a decimal.`,
      `A right triangle has adjacent ${adj} and hypotenuse ${hyp}. Compute cos(θ).`,
      `For a right triangle with adjacent ${adj} and hypotenuse ${hyp}, evaluate cos(θ).`
    );
    answer = Math.round((adj / hyp) * 1000) / 1000;
    concept = "Cosine ratio in right triangles";
    hint = "cos(θ) = adjacent / hypotenuse.";
  } else {
    text = gradePrompt(
      grade,
      `In a right triangle, opposite side = ${opp}, adjacent side = ${adj}.\nFind tan(θ) as a decimal.`,
      `A right triangle has opposite ${opp} and adjacent ${adj}. Compute tan(θ).`,
      `Given opposite ${opp} and adjacent ${adj} in a right triangle, evaluate tan(θ).`
    );
    answer = Math.round((opp / adj) * 1000) / 1000;
    concept = "Tangent ratio in right triangles";
    hint = "tan(θ) = opposite / adjacent.";
  }

  const explanation =
`Right triangle trig:
- sin(θ) = opposite / hypotenuse
- cos(θ) = adjacent / hypotenuse
- tan(θ) = opposite / adjacent`;
  const example =
`Example:
If opposite = 3, hypotenuse = 5:
sin(θ) = 3/5 = 0.6`;

  return { text, answer, concept, hint, explanation, example };
}

function buildExponentsQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const base = randomInt(2, 9);
  const exp = diff < 0.5 ? randomInt(2, 4) : randomInt(2, 5);

  const text = gradePrompt(
    grade,
    `Compute ${base}^${exp}.`,
    `Evaluate ${base} raised to the power ${exp}.`,
    `Compute ${base}^${exp}.`
  );

  const answer = Math.pow(base, exp);
  const concept = "Integer exponents";
  const hint = "Multiply the base by itself exp times.";
  const explanation =
`Exponents tell repeated multiplication:
b^n = b × b × ... × b (n times).`;
  const example =
`Example:
2^4 = 2 × 2 × 2 × 2 = 16`;

  return { text, answer, concept, hint, explanation, example };
}

function buildScientificNotationQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const a = randomInt(1, 9);
  const b = randomInt(10, 99);
  const k = randomInt(2, 5);
  const mode = Math.random() < 0.5 ? "toStandard" : "toSci";

  if (mode === "toStandard") {
    const value = a * Math.pow(10, k);
    const text = gradePrompt(
      grade,
      `Write ${a} × 10^${k} as a standard number.`,
      `Convert ${a} × 10^${k} to standard decimal notation.`,
      `Express ${a} · 10^${k} in standard form.`
    );
    const answer = value;
    const concept = "Scientific notation to standard";
    const hint = "Move the decimal point k places to the right.";
    const explanation =
`For a × 10^k with k > 0, move the decimal k places to the right.`;
    const example =
`Example:
3.2 × 10^3 = 3200`;

    return { text, answer, concept, hint, explanation, example };
  } else {
    const value = (a + b / 100) * Math.pow(10, randomInt(0, 3));
    const text = gradePrompt(
      grade,
      `Approximate ${value} in scientific notation.\nGive just the exponent k such that number ≈ a × 10^k.`,
      `For the number ${value}, estimate the exponent k if written as a × 10^k.`,
      `Given ${value}, determine a reasonable exponent k in scientific notation a · 10^k.`
    );
    const kApprox = Math.floor(Math.log10(value));
    const answer = kApprox;
    const concept = "Estimating order of magnitude";
    const hint = "Count how many times you move the decimal to get a number between 1 and 10.";
    const explanation =
`Scientific notation a × 10^k:
- 1 ≤ a < 10
- k is how many decimal places you move.`;
    const example =
`Example:
5600 ≈ 5.6 × 10^3 → k = 3`;

    return { text, answer, concept, hint, explanation, example };
  }
}

function buildFunctionsQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const m = randomInt(-5, 5) || 1;
  const b = randomInt(-10, 10);
  const x = randomInt(-5, 5);
  const y = m * x + b;

  const text = gradePrompt(
    grade,
    `A function is defined by f(x) = ${m}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}.\nWhat is f(${x})?`,
    `Given f(x) = ${m}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}, find f(${x}).`,
    `Evaluate f(${x}) for f(x) = ${m}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}.`
  );

  const answer = y;
  const concept = "Evaluating linear functions";
  const hint = "Replace x with the given number and simplify.";
  const explanation =
`For a function f(x), to find f(a):
1. Substitute x = a.
2. Simplify the expression.`;
  const example =
`Example:
f(x) = 2x + 3, find f(4).
f(4) = 2·4 + 3 = 8 + 3 = 11`;

  return { text, answer, concept, hint, explanation, example };
}

function buildLinearSystemsQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const x = randomInt(-5, 5);
  const y = randomInt(-5, 5);
  const a1 = randomInt(1, 5);
  const b1 = randomInt(1, 5);
  const c1 = a1 * x + b1 * y;
  const a2 = randomInt(1, 5);
  const b2 = randomInt(1, 5);
  const c2 = a2 * x + b2 * y;

  const text = gradePrompt(
    grade,
    `Solve the system:\n${a1}x + ${b1}y = ${c1}\n${a2}x + ${b2}y = ${c2}\nGive the value of x.`,
    `Solve the linear system and report x:\n${a1}x + ${b1}y = ${c1}, ${a2}x + ${b2}y = ${c2}.`,
    `For the system ${a1}x + ${b1}y = ${c1}, ${a2}x + ${b2}y = ${c2}, determine x.`
  );

  const answer = x;
  const concept = "Solving systems of linear equations";
  const hint = "Use substitution or elimination. You only need x for your answer.";
  const explanation =
`For systems:
- Elimination: combine equations to cancel one variable.
- Substitution: solve one equation for a variable and plug into the other.`;
  const example =
`Example:
x + y = 5
x − y = 1
Add: 2x = 6 → x = 3`;

  return { text, answer, concept, hint, explanation, example };
}

function buildSequenceQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const start = randomInt(-5, 5);
  const step = randomInt(-5, 5) || 2;
  const n = randomInt(4, 7);

  const text = gradePrompt(
    grade,
    `An arithmetic sequence starts at ${start} and adds ${step} each time.\nWhat is the ${n}th term?`,
    `Find the ${n}th term of the arithmetic sequence with a₁ = ${start} and common difference d = ${step}.`,
    `Compute a_${n} for an arithmetic sequence defined by a₁ = ${start}, d = ${step}.`
  );

  const answer = start + (n - 1) * step;
  const concept = "Arithmetic sequences";
  const hint = "Use aₙ = a₁ + (n−1)d.";
  const explanation =
`For arithmetic sequences:
aₙ = a₁ + (n − 1)d, where d is the common difference.`;
  const example =
`Example:
a₁ = 3, d = 4, n = 5
a₅ = 3 + (5 − 1)·4 = 3 + 16 = 19`;

  return { text, answer, concept, hint, explanation, example };
}

function buildLimitQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const a = randomInt(-5, 5);
  const m = randomInt(-3, 3) || 1;
  const b = randomInt(-5, 5);

  const x0 = a;
  const text = gradePrompt(
    grade,
    `Consider f(x) = ${m}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}.\nWhat is the limit of f(x) as x approaches ${x0}?`,
    `For f(x) = ${m}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}, compute limₓ→${x0} f(x).`,
    `Evaluate the limit as x→${x0} of f(x) = ${m}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}.`
  );

  const answer = m * x0 + b;
  const concept = "Limits of continuous linear functions";
  const hint = "For a linear function, the limit as x→a is just f(a).";
  const explanation =
`For continuous functions like lines:
limₓ→a f(x) = f(a).`;
  const example =
`Example:
f(x) = 2x − 1, limₓ→3 f(x)
= f(3) = 2·3 − 1 = 5`;

  return { text, answer, concept, hint, explanation, example };
}

function buildDerivativeConceptQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const m = randomInt(-5, 5) || 2;
  const b = randomInt(-10, 10);
  const x0 = randomInt(-5, 5);

  const text = gradePrompt(
    grade,
    `The graph of f(x) is a straight line: f(x) = ${m}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}.\nWhat is the derivative f'(x)? (Your answer should be the slope.)`,
    `Given f(x) = ${m}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}, what is f'(x)? (Provide the slope as a number.)`,
    `For the linear function f(x) = ${m}x ${b >= 0 ? "+ " + b : "- " + Math.abs(b)}, determine the derivative f'(x); report the constant slope.`
  );

  const answer = m;
  const concept = "Derivative as slope for linear functions";
  const hint = "For f(x) = mx + b, f'(x) = m.";
  const explanation =
`The derivative of a linear function is its slope:
If f(x) = mx + b, then f'(x) = m.`;
  const example =
`Example:
f(x) = 4x − 3
f'(x) = 4`;

  return { text, answer, concept, hint, explanation, example };
}

function buildVectorsQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const ax = randomInt(-5, 5);
  const ay = randomInt(-5, 5);
  const bx = randomInt(-5, 5);
  const by = randomInt(-5, 5);

  const mode = randomInt(1, 2); // magnitude or component

  if (mode === 1) {
    const text = gradePrompt(
      grade,
      `A vector v = ⟨${ax}, ${ay}⟩.\nWhat is its magnitude (length) rounded to the nearest whole number?`,
      `For v = ⟨${ax}, ${ay}⟩, compute |v| ≈ √(${ax}² + ${ay}²), rounded to the nearest integer.`,
      `Given v = ⟨${ax}, ${ay}⟩, find its magnitude |v| to the nearest integer.`
    );
    const len = Math.sqrt(ax * ax + ay * ay);
    const answer = Math.round(len);
    const concept = "Magnitude of a 2D vector";
    const hint = "Use the Pythagorean theorem: |v| = √(x² + y²).";
    const explanation =
`For v = ⟨x, y⟩, magnitude is |v| = √(x² + y²).`;
    const example =
`Example:
v = ⟨3, 4⟩ → |v| = √(3² + 4²) = √25 = 5`;

    return { text, answer, concept, hint, explanation, example };
  } else {
    const k = randomInt(2, 5);
    const text = gradePrompt(
      grade,
      `Let v = ⟨${ax}, ${ay}⟩ and k = ${k}.\nWhat is the x-component of the vector kv?`,
      `Given v = ⟨${ax}, ${ay}⟩ and scalar k = ${k}, find the x-component of kv.`,
      `For v = ⟨${ax}, ${ay}⟩ and scalar k = ${k}, determine the first component of kv.`
    );
    const answer = k * ax;
    const concept = "Scalar multiplication of vectors";
    const hint = "Multiply each component by the scalar.";
    const explanation =
`For scalar k and vector v = ⟨x, y⟩:
kv = ⟨kx, ky⟩.`;
    const example =
`Example:
k = 3, v = ⟨2, −1⟩ → kv = ⟨6, −3⟩`;

    return { text, answer, concept, hint, explanation, example };
  }
}

function buildChallengeQuestion(grade, diff) {
  diff = clampDifficulty(diff);
  const a = randomInt(1, 5);
  const b = randomInt(1, 5);
  const c = randomInt(1, 5);
  const d = randomInt(1, 5);
  const x = randomInt(-5, 5);
  const value = (a * x + b) * (c * x + d);

  const text = gradePrompt(
    grade,
    `Let f(x) = (${a}x + ${b})(${c}x + ${d}).\nEvaluate f(${x}).`,
    `Given f(x) = (${a}x + ${b})(${c}x + ${d}), compute f(${x}).`,
    `Evaluate f(${x}) for f(x) = (${a}x + ${b})(${c}x + ${d}).`
  );

  const answer = value;
  const concept = "Polynomial evaluation and expansion (challenge)";
  const hint = "You can either plug in x first, or expand and then substitute.";
  const explanation =
`To evaluate a product like (ax + b)(cx + d):
1. Either expand to a quadratic and then substitute x,
2. Or plug in x into each factor first, then multiply.`;
  const example =
`Example:
f(x) = (2x + 1)(x − 3), x = 2
f(2) = (2·2 + 1)(2 − 3) = (5)(−1) = −5`;

  return { text, answer, concept, hint, explanation, example };
}

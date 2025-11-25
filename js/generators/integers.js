function getMax(level){return 10 + level*5;}
// js/generators/integers.js
// Integers & Number Line generators (Grades 6–8)

(function () {

  // ---- Grade 6: Integers on Number Line ----
  window.buildIntegersNumberLineQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const max = d < 0.5 ? 15 : 40;

    const type = randomInt(1,3);
    let text, answer, concept, hint, explanation, example;

    if(type===1){
      // Compare
      const a = randomInt(-max, max);
      const b = randomInt(-max, max);
      text = `Which is greater: ${a} or ${b}?`;
      answer = a>b ? `${a}` : `${b}`;
      concept = "Comparing integers";
      hint = "Numbers farther right on the number line are greater.";
      explanation = "Negative numbers are less than positive numbers. Among negatives, -2 is greater than -7 because it is closer to zero.";
      example = "Example: Compare -3 and 4 → 4 is greater.";
    }
    else if(type===2){
      // Opposite integer
      const a = randomInt(-max, max);
      text = `What is the opposite of ${a}?`;
      answer = `${-a}`;
      concept = "Opposites on number line";
      hint = "Opposites are same distance from zero but on opposite sides.";
      explanation = "If a number is n, its opposite is -n.";
      example = "Example: Opposite of -5 is 5.";
    }
    else {
      // Absolute value
      const a = randomInt(-max, max);
      text = `What is the absolute value of ${a}?`;
      answer = `${Math.abs(a)}`;
      concept = "Absolute value";
      hint = "Absolute value measures distance from zero.";
      explanation = "Distance is always positive. Abs(-7)=7.";
      example = "Example: |-9| = 9.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

})();

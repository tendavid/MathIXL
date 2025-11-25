function getMax(level){return 10 + level*5;}
// js/generators/functions.js
// Functions & Input-Output Rules (Grade 8)

(function(){

  // Grade 8: Intro to functions, function notation, and input-output tables
  window.buildFunctionsIntroQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const type = randomInt(1,3); // three styles of problems

    let text, answer, concept, hint, explanation, example;

    // ---- Type 1: Evaluate a function rule f(x) = ax + b ----
    if(type === 1){
      const a = randomInt(-5,5) || 2; // avoid 0
      const b = randomInt(-10,10);
      const x = randomInt(-10,10);
      const y = a * x + b;

      text = `A function is defined by\nf(x) = ${a}x ${b>=0?"+":"-"} ${Math.abs(b)}.\nFind f(${x}).`;
      answer = y;
      concept = "Evaluating a linear function";
      hint = "Replace x with the given value and simplify.";
      explanation = "To evaluate f(x), plug the input into the rule wherever you see x, then follow order of operations.";
      example = "Example: If f(x)=2x+3 and x=4, then f(4)=2·4+3=8+3=11.";
    }

    // ---- Type 2: Fill in an input-output table ----
    else if(type === 2){
      const a = randomInt(1,5);
      const b = randomInt(-5,5);
      const x1 = randomInt(-5,5);
      const x2 = x1 + randomInt(1,3);
      const x3 = x2 + randomInt(1,3);

      const y1 = a*x1 + b;
      const y2 = a*x2 + b;
      const y3 = a*x3 + b;

      // Ask for missing output for x3
      text =
        "A function follows the rule y = ax + b.\n" +
        "Here is an input-output table for the same function:\n\n" +
        `x:  ${x1},  ${x2},  ${x3}\n` +
        `y:  ${y1},  ${y2},   ?\n\n` +
        "What is the missing output value (the y-value for the last input)?";
      answer = y3;
      concept = "Recognizing linear patterns in tables";
      hint = "Look at how y changes when x increases; it should follow a constant pattern.";
      explanation = "In a linear function, each time x increases by 1, y changes by a fixed amount (the slope). Use the pattern from earlier pairs to extend the table.";
      example = "Example: x: 1,2,3 and y: 4,7,10.\nEach time x increases by 1, y increases by 3, so for x=4, y=13.";
    }

    // ---- Type 3: Is this relation a function? (vertical-line-test idea using pairs) ----
    else {
      // Build either a function or not by controlling x-values
      const makeFunction = Math.random() < 0.5;
      const xVals = [];
      const yVals = [];

      if(makeFunction){
        // All x distinct
        const x1 = randomInt(-3,3);
        const x2 = x1 + randomInt(1,3);
        const x3 = x2 + randomInt(1,3);
        const m = randomInt(-3,3) || 1;
        const b = randomInt(-4,4);
        xVals.push(x1,x2,x3);
        yVals.push(m*x1+b, m*x2+b, m*x3+b);
      } else {
        // Repeat x with different y
        const x1 = randomInt(-3,3);
        const x2 = x1; // duplicate x
        const x3 = x1 + randomInt(1,3);
        const m = randomInt(-3,3) || 1;
        const b = randomInt(-4,4);
        xVals.push(x1,x2,x3);
        yVals.push(m*x1+b, m*x1+b+randomInt(1,3), m*x3+b);
      }

      text =
        "Consider this set of ordered pairs:\n" +
        `{ (${xVals[0]}, ${yVals[0]}), (${xVals[1]}, ${yVals[1]}), (${xVals[2]}, ${yVals[2]}) }\n\n` +
        "Does this relation represent a function? Answer with 1 for yes, 0 for no.";
      answer = makeFunction ? 1 : 0;
      concept = "Determining if a relation is a function";
      hint = "Check whether any x-value is used with two different y-values.";
      explanation = "A relation is a function if every input x has exactly one output y. If an x-value is paired with two different y-values, it is not a function.";
      example = "Example: {(1,2), (1,5)} is not a function because x=1 goes to two outputs.\nBut {(1,2), (2,5)} is a function.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

})();

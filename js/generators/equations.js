function getMax(level){return 10 + level*5;}
// js/generators/equations.js
// Equations & Algebraic Expressions (Grades 6–9)

(function () {

  // ---- Grade 6: One-step equations ----
  window.buildOneStepEquationQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const op = randomInt(1,4); // 1:+ 2:- 3:* 4:/
    let x = randomInt(-20,20);
    let a, b, text, answer, concept, hint, explanation, example;

    switch(op){
      case 1: // x + a = b
        a = randomInt(1,20);
        b = x + a;
        text = `Solve for x:\nx + ${a} = ${b}`;
        answer = x;
        concept = "One-step equation (addition)";
        hint = "Undo adding by subtracting.";
        explanation = "To solve x + a = b, subtract a from both sides.";
        example = "Example: x + 7 = 12 → x = 12 − 7 = 5.";
        break;

      case 2: // x - a = b
        a = randomInt(1,20);
        b = x - a;
        text = `Solve for x:\nx − ${a} = ${b}`;
        answer = x;
        concept = "One-step equation (subtraction)";
        hint = "Undo subtraction by adding.";
        explanation = "To solve x − a = b, add a to both sides.";
        example = "Example: x − 6 = 9 → x = 9 + 6 = 15.";
        break;

      case 3: // a*x = b
        a = randomInt(2,12);
        b = a * x;
        text = `Solve for x:\n${a}x = ${b}`;
        answer = x;
        concept = "One-step equation (multiplication)";
        hint = "Undo multiplying by dividing both sides by the coefficient.";
        explanation = "If ax = b, then x = b ÷ a.";
        example = "Example: 4x = 20 → x = 20 ÷ 4 = 5.";
        break;

      case 4: // x/a = b
        a = randomInt(2,12);
        const bInt = randomInt(-15,15);
        x = a * bInt;
        b = bInt;
        text = `Solve for x:\nx ÷ ${a} = ${b}`;
        answer = x;
        concept = "One-step equation (division)";
        hint = "Undo division by multiplying both sides by the divisor.";
        explanation = "If x ÷ a = b, then x = a × b.";
        example = "Example: x ÷ 3 = 7 → x = 21.";
        break;
    }

    return { text, answer, concept, hint, explanation, example };
  };


  // ---- Grade 7–8: Multi-step linear equations ----
  window.buildLinearExpressionQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const a = randomInt(1,10);
    const b = randomInt(1,10);
    const x = randomInt(-10,10);

    // form: a(x + b) = left
    const left = a * (x + b);
    const text = `Solve for x:\n${a}(x + ${b}) = ${left}`;
    const answer = x;

    const concept = "Distributive property & solving linear equations";
    const hint = "Distribute a, then isolate x.";
    const explanation = "Expand a(x+b) to ax + ab, then subtract ab from both sides, then divide by a.";
    const example = "Example: 3(x+4)=27 → 3x+12=27 → 3x=15 → x=5.";

    return { text, answer, concept, hint, explanation, example };
  };


  // ---- Grade 8: Linear equations & graphs ----
  window.buildLinearEquationGraphQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const type = randomInt(1,3);
    let text, answer, concept, hint, explanation, example;

    // Type 1: identify slope from y = mx + b
    if(type === 1){
      const m = randomInt(-5,5) || 2;
      const b = randomInt(-10,10);
      text = `Consider the line with equation:\ny = ${m}x ${b>=0 ? "+" : "-"} ${Math.abs(b)}\nWhat is the slope of this line?`;
      answer = m;
      concept = "Slope from slope-intercept form";
      hint = "In y = mx + b, the slope is m.";
      explanation = "Slope-intercept form y = mx + b shows slope directly as the coefficient of x.";
      example = "Example: y = 3x − 2 has slope 3.";
    }
    // Type 2: identify y-intercept
    else if(type === 2){
      const m = randomInt(-5,5) || 1;
      const b = randomInt(-10,10);
      text = `Consider the line with equation:\ny = ${m}x ${b>=0 ? "+" : "-"} ${Math.abs(b)}\nWhat is the y-intercept of this line?`;
      answer = b;
      concept = "Y-intercept from slope-intercept form";
      hint = "In y = mx + b, the y-intercept is b.";
      explanation = "The y-intercept is where the line crosses the y-axis, at x = 0, so y = b.";
      example = "Example: y = 2x + 5 has y-intercept 5.";
    }
    // Type 3: evaluate y at a given x using the graph equation
    else {
      const m = randomInt(-4,4) || 2;
      const b = randomInt(-8,8);
      const x = randomInt(-5,5);
      const y = m * x + b;
      text = `A line has equation:\ny = ${m}x ${b>=0 ? "+" : "-"} ${Math.abs(b)}\nWhat is the y-value when x = ${x}?`;
      answer = y;
      concept = "Evaluating a linear function from its graph equation";
      hint = "Substitute the x-value into y = mx + b.";
      explanation = "To find a point on the line, plug the x-value into the equation and calculate y.";
      example = "Example: y = 3x + 1, x = 2 → y = 3·2 + 1 = 7.";
    }

    return { text, answer, concept, hint, explanation, example };
  };


  // ---- Grade 8: Systems of equations ----
  window.buildSystemsLinearQuestion = function(ctx){
    const type = randomInt(1,2);
    let text, answer, concept, hint, explanation, example;

    if(type===1){
      // substitution type, simple
      const x = randomInt(-5,5);
      const m = randomInt(-3,3) || 1;
      const b = randomInt(-10,10);
      const y = m*x + b;
      text = `Solve the system:\ny = ${m}x + ${b}\nx + y = ${x+y}`;
      answer = `(${x},${y})`;
      concept = "Systems of equations (substitution)";
      hint = "Substitute the expression for y into the second equation.";
      explanation = "Once y is expressed in terms of x, plug it into the other equation and solve for x, then back-substitute.";
      example = "Example: y=2x+3 and x+y=9 → x+2x+3=9 → 3x=6 → x=2 → y=7.";
    } else {
      // elimination type
      const x = randomInt(-5,5);
      const y = randomInt(-5,5);
      const a = randomInt(1,5);
      const b = randomInt(1,5);
      const c1 = a*x + b*y;
      const c2 = a*x - b*y;
      text = `Solve the system:\n${a}x + ${b}y = ${c1}\n${a}x − ${b}y = ${c2}`;
      answer = `(${x},${y})`;
      concept = "Systems of equations (elimination)";
      hint = "Add or subtract equations to eliminate one variable.";
      explanation = "Here adding or subtracting eliminates y immediately, letting you solve for x, then back-substitute.";
      example = "Example: 3x+2y=13 and 3x−2y=5 → add to eliminate y → 6x=18 → x=3 → y=2.";
    }

    return { text, answer, concept, hint, explanation, example };
  };


  // ---- Grade 9: Quadratic expressions ----
  window.buildQuadraticExpressionQuestion = function(ctx){
    const a = randomInt(1,5);
    const b = randomInt(1,10);
    const x = randomInt(-5,5);
    const val = a*x*x + b*x;
    const text = `Evaluate the expression:\n${a}x² + ${b}x\nwhen x = ${x}`;
    const answer = val;

    const concept = "Evaluating quadratic expressions";
    const hint = "Substitute x and compute x² first.";
    const explanation = "Quadratic expressions involve x². Replace x with the given value and follow order of operations.";
    const example = "Example: 2x²+3x at x=3 → 2(9)+9=27.";

    return { text, answer, concept, hint, explanation, example };
  };


  // ---- Grade 9: Solving Quadratic Equations ----
  window.buildQuadraticSolveQuestion = function(ctx){
    const x = randomInt(-10,10);
    const a = randomInt(1,3);
    const b = randomInt(-5,5);
    const c = a*x*x + b*x; // ensure integer root x

    const text = `Solve the quadratic equation:\n${a}x² + ${b}x + ${c} = 0`;
    const answer = x;

    const concept = "Solving quadratics by factoring or recognition";
    const hint = "Look for a factorable form; one solution is an integer.";
    const explanation = "We generated c so that x is a root. Factor or use trial to find the integer solution.";
    const example = "Example: x²+3x+2=0 → (x+1)(x+2)=0 → x=-1 or -2.";
    return { text, answer, concept, hint, explanation, example };
  };


  // ---- Grade 9: Exponential Functions ----
  window.buildExponentialFunctionsQuestion = function(ctx){
    const a = randomInt(1,4);
    const b = randomInt(2,5);
    const x = randomInt(0,5);
    const val = a * Math.pow(b, x);

    const text = `Evaluate the exponential function:\nf(x) = ${a}·(${b})ˣ\nFind f(${x}).`;
    const answer = val;

    const concept = "Evaluating exponential functions";
    const hint = "Compute bˣ first, then multiply by a.";
    const explanation = "Exponential functions grow by repeated multiplication. Calculate bˣ, then multiply by a.";
    const example = "Example: f(x)=3·2ˣ; f(4)=3·16=48.";

    return { text, answer, concept, hint, explanation, example };
  };


  // ---- Grade 9 Review ----
  window.buildG9MixedReviewQuestion = function(ctx){
    const options = [
      window.buildLinearExpressionQuestion,
      window.buildQuadraticExpressionQuestion,
      window.buildExponentialFunctionsQuestion
    ].filter(fn => typeof fn === "function");
    return randomChoice(options)(ctx);
  };

})();

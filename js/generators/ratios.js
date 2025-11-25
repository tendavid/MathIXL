function getMax(level){return 10 + level*5;}
// js/generators/ratios.js
// Ratios, Unit Rates, Proportions, Percent Problems (Grades 6–7)

(function(){

  // ---- Ratios & Unit Rates (Grade 6) ----
  window.buildRatiosUnitRatesQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const a = randomInt(2, d<0.5?20:50);
    const b = randomInt(1, d<0.5?10:30);

    const type = randomInt(1,3);
    let text, answer, concept, hint, explanation, example;

    if(type===1){
      // Simplify ratio
      const g = gcd(a,b);
      text = `Simplify the ratio ${a}:${b}`;
      answer = `${a/g}:${b/g}`;
      concept = "Simplifying ratios";
      hint = "Divide both numbers by their greatest common factor.";
      explanation = "Ratios are simplified like fractions by dividing both terms by the same factor.";
      example = "Example: 12:8 → divide both by 4 → 3:2.";
    }
    else if(type===2){
      // Unit rate
      text = `Find the unit rate: ${a} miles in ${b} hours.\nGive answer in miles per hour.`;
      answer = Number((a/b).toFixed(2));
      concept = "Unit rate";
      hint = "Divide distance by time.";
      explanation = "Unit rate means per 1 unit. miles ÷ hours gives miles per hour.";
      example = "Example: 60 miles in 3 hours → 20 mph.";
    }
    else {
      // Find missing term in proportion a/b = x/c
      const c = randomInt(2, d<0.5?15:40);
      const x = Number((a*c/b).toFixed(2));
      text = `Solve the proportion:\n${a} / ${b} = x / ${c}`;
      answer = x;
      concept = "Proportions";
      hint = "Cross multiply: a×c = b×x.";
      explanation = "In proportions, cross products are equal. Solve for x using x = (a×c)/b.";
      example = "Example: 3/4 = x/8 → 3×8 = 4x → x = 6.";
    }

    return {text, answer, concept, hint, explanation, example};
  };


  // ---- Proportional Relationships (Grade 7) ----
  window.buildProportionQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const k = randomInt(1, d<0.5?5:12); // constant of proportionality
    const x = randomInt(1,30);
    const y = k*x;

    const type = randomInt(1,2);
    let text, answer, concept, hint, explanation, example;

    if(type===1){
      text = `In a proportional relationship, y = kx.\nIf k = ${k} and x = ${x}, find y.`;
      answer = y;
      concept = "Proportional relationship: y=kx";
      hint = "Multiply x by k.";
      explanation = "In proportional relationships, y grows by a constant multiple of x.";
      example = "Example: k=3, x=5 → y=15.";
    }
    else {
      text = `A table shows a proportional relationship. If y = ${y} when x = ${x}, what is k in y = kx?`;
      answer = k;
      concept = "Finding constant of proportionality";
      hint = "Divide y by x.";
      explanation = "k = y/x for proportional relationships.";
      example = "Example: y=18 when x=6 → k=3.";
    }

    return {text, answer, concept, hint, explanation, example};
  };


  // ---- Percent Word Problems (Grade 7) ----
  window.buildPercentWordProblemQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const base = randomInt(50, d<0.5?200:600);
    const pct = randomInt(5, d<0.5?30:80);

    const type = randomInt(1,3);
    let text, answer, concept, hint, explanation, example;

    if(type===1){
      text = `${pct}% of ${base} is what number?`;
      answer = Number((base*pct/100).toFixed(2));
      concept = "Finding percent of a number";
      hint = "Convert percent to decimal and multiply.";
      explanation = "a% of b = (a/100)×b.";
      example = "Example: 25% of 80 = 0.25×80 = 20.";
    }
    else if(type===2){
      text = `${answer = base*pct/100}\nis ${pct}% of what number?\n(Give your answer rounded to 2 decimals.)`;
      answer = Number((base).toFixed(2));
      concept = "Percent backward problem";
      hint = "Solve base = part ÷ (pct/100).";
      explanation = "If part = pct% of whole, whole = part ÷ (pct/100).";
      example = "Example: 12 is 25% of what? → 12 ÷ 0.25 = 48.";
    }
    else {
      // Percent increase/decrease
      const change = randomInt(5,30);
      const increased = Math.random()<0.5;
      const newVal = increased ? base*(1+change/100) : base*(1-change/100);
      text = `A value was ${base} and then ${increased?"increased":"decreased"} by ${change}%.\nWhat is the new value?`;
      answer = Number(newVal.toFixed(2));
      concept = "Percent increase/decrease";
      hint = increased
        ? "Multiply by (1 + percent/100)."
        : "Multiply by (1 − percent/100).";
      explanation = "Percent increase/decrease scales the number by a factor 1±(percent/100).";
      example = "Example: 100 increased by 10% → 100×1.1 = 110.";
    }

    return {text, answer, concept, hint, explanation, example};
  };

})();

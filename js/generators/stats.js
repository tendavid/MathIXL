function getMax(level){return 10 + level*5;}
// js/generators/stats.js
// Statistics & Mixed Review Generators (Grades 6–9)

(function(){

  // ---- Basic Statistics (Grade 6–7) ----
  window.buildStatsQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const n = d < 0.5 ? 5 : 7; // number of data points
    const data = [];
    for(let i=0;i<n;i++) data.push(randomInt(5,40));

    const type = randomInt(1,3); // mean / median / range
    let text, answer, concept, hint, explanation, example;

    // Mean
    if(type===1){
      const sum = data.reduce((a,b)=>a+b,0);
      const mean = Number((sum/data.length).toFixed(2));

      text = `Given the data set:\n[ ${data.join(", ")} ]\nFind the mean (average).`;
      answer = mean;
      concept = "Mean (average)";
      hint = "Add all numbers and divide by how many data points.";
      explanation = "Mean = (sum of data) ÷ (number of values).";
      example = "Example: [2,4,6] → (2+4+6)/3 = 4.";
    }

    // Median
    else if(type===2){
      const sorted = [...data].sort((a,b)=>a-b);
      let median;
      if(sorted.length%2===1){
        median = sorted[(sorted.length-1)/2];
      } else {
        const mid1 = sorted[sorted.length/2 - 1];
        const mid2 = sorted[sorted.length/2];
        median = Number(((mid1+mid2)/2).toFixed(2));
      }

      text = `Given the data set:\n[ ${data.join(", ")} ]\nFind the median.`;
      answer = median;
      concept = "Median";
      hint = "Sort the numbers and find the middle value.";
      explanation = "Median is the middle value in an ordered list. If even count, average the two middles.";
      example = "Example: [1,5,9] → median = 5.";
    }

    // Range
    else {
      const min = Math.min(...data);
      const max = Math.max(...data);
      const range = max - min;

      text = `Given the data set:\n[ ${data.join(", ")} ]\nFind the range.`;
      answer = range;
      concept = "Range";
      hint = "Subtract smallest from largest.";
      explanation = "Range = max − min.";
      example = "Example: [3,8,10] → range = 10 − 3 = 7.";
    }

    return { text, answer, concept, hint, explanation, example };
  };


  // ---- Two-variable statistics (Grade 8–9) ----
  window.buildTwoVariableStatsQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));

    // Generate simple (x,y) pairs near an exact line
    const m = randomInt(1,5);
    const b = randomInt(-5,5);

    const x1 = randomInt(1,10);
    const y1 = m*x1 + b;

    const x2 = x1 + randomInt(1,4);
    const y2 = m*x2 + b;

    const x3 = x2 + randomInt(1,4);
    const y3 = m*x3 + b;

    const type = randomInt(1,2);
    let text, answer, concept, hint, explanation, example;

    // Predict using linear pattern
    if(type===1){
      const x4 = x3 + randomInt(1,4);
      const y4 = m*x4 + b;

      text =
        "Given these data points that lie on a line:\n" +
        `(${x1}, ${y1}), (${x2}, ${y2}), (${x3}, ${y3})\n` +
        `Predict the y-value when x = ${x4}.`;
      answer = y4;
      concept = "Linear prediction with two-variable data";
      hint = "Data follow a pattern like y = mx + b.";
      explanation = "If data fit a linear model, extend the pattern with y = mx + b to predict new values.";
      example = "Example: slope ≈2 and b≈1 → if x=7, y≈15.";
    }

    // Identify slope given data
    else {
      const slope = m;

      text =
        "These points lie on a line:\n" +
        `(${x1}, ${y1}), (${x2}, ${y2}), (${x3}, ${y3})\n` +
        "What is the slope of the line?";
      answer = slope;
      concept = "Slope from two-variable data";
      hint = "Slope = (change in y) / (change in x).";
      explanation = "Pick any two points and compute (y₂ − y₁)/(x₂ − x₁).";
      example = "Example: (1,3) and (3,7) → slope = (7−3)/(3−1) = 4/2 = 2.";
    }

    return { text, answer, concept, hint, explanation, example };
  };


  // ---- Grade 6 Mixed Review ----
  window.buildG6MixedReviewQuestion = function(ctx){
    // Pull from several Grade 6 topics:
    const options = [
      window.buildRatiosUnitRatesQuestion,
      window.buildFracDecPercentQuestion,
      window.buildIntegersNumberLineQuestion,
      window.buildOneStepEquationQuestion,
      window.buildAreaSurfaceAreaQuestion,
      window.buildStatsQuestion
    ].filter(fn => typeof fn === "function");

    if(options.length === 0){
      throw new Error("No generators available for Grade 6 mixed review.");
    }
    return randomChoice(options)(ctx);
  };


  // ---- Grade 7 Mixed Review ----
  window.buildG7MixedReviewQuestion = function(ctx){
    const options = [
      window.buildProportionQuestion,
      window.buildPercentWordProblemQuestion,
      window.buildLinearExpressionQuestion,
      window.buildInequalityQuestion,
      window.buildGeometryAnglesQuestion,
      window.buildStatsQuestion
    ].filter(fn => typeof fn === "function");

    if(options.length === 0){
      throw new Error("No generators available for Grade 7 mixed review.");
    }
    return randomChoice(options)(ctx);
  };

})();

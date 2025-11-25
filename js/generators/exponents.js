function getMax(level){return 10 + level*5;}
// js/generators/exponents.js
// Integer Exponents Generators (Grade 8)

(function(){

  // Grade 8: Integer exponents, rules, and evaluation
  window.buildIntegerExponentsQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const type = randomInt(1,3); // three styles

    let text, answer, concept, hint, explanation, example;

    // ---- Type 1: Evaluate a^n with integer exponent ----
    if(type === 1){
      const base = randomInt(2, d < 0.5 ? 5 : 10);
      const exp = randomInt(-3, 4);
      const value = Math.pow(base, exp);

      text = `Evaluate the expression:\n${base}^${exp}\n(Give your answer as a decimal or simplified fraction.)`;
      if(exp >= 0){
        answer = value;
      } else {
        // negative exponent → 1 / base^|exp|
        const posExp = -exp;
        const denom = Math.pow(base, posExp);
        answer = `1/${denom}`;
      }

      concept = "Evaluating integer exponents";
      hint = "A negative exponent means reciprocal: a^(-n) = 1 / a^n.";
      explanation = "Positive exponents mean repeated multiplication of the base. Negative exponents mean 1 divided by the base raised to the corresponding positive exponent.";
      example = "Example: 2^3 = 8.\nExample: 2^(-3) = 1/(2^3) = 1/8.";
    }

    // ---- Type 2: Product / quotient rules with same base ----
    else if(type === 2){
      const base = randomInt(2, 9);
      const m = randomInt(-4, 4);
      const nExp = randomInt(-4, 4);

      const chooseProduct = Math.random() < 0.5;

      if(chooseProduct){
        text = `Use exponent rules to simplify:\n${base}^${m} · ${base}^${nExp}\nWrite your answer as ${base}^k. What is k?`;
        answer = m + nExp;
        concept = "Product rule for exponents";
        hint = "When multiplying with the same base, add the exponents.";
        explanation = "a^m · a^n = a^(m+n) as long as the base a is not zero.";
        example = "Example: 3^2 · 3^5 = 3^(2+5) = 3^7.";
      } else {
        // quotient rule, avoid divide by zero exponent
        const textM = m;
        const textN = nExp;
        text = `Use exponent rules to simplify:\n${base}^${textM} ÷ ${base}^${textN}\nWrite your answer as ${base}^k. What is k?`;
        answer = m - nExp;
        concept = "Quotient rule for exponents";
        hint = "When dividing with the same base, subtract exponents: top minus bottom.";
        explanation = "a^m ÷ a^n = a^(m−n), with a ≠ 0.";
        example = "Example: 5^6 ÷ 5^2 = 5^(6−2) = 5^4.";
      }
    }

    // ---- Type 3: Zero & negative exponents concept ----
    else {
      const base = randomInt(2, 9);
      const style = randomInt(1,2);

      if(style === 1){
        text = `Simplify the expression:\n${base}^0`;
        answer = 1;
        concept = "Zero exponent rule";
        hint = "Any non-zero number to the zero power equals 1.";
        explanation = "Patterns like a^3, a^2, a^1, a^0 show that dividing by a each step leads to a^0 = 1.";
        example = "Example: 2^3=8, 2^2=4, 2^1=2, and 2^0=1.";
      } else {
        const exp = randomInt(-3,-1);
        const posExp = -exp;
        const denom = Math.pow(base, posExp);
        text = `Rewrite the expression with a positive exponent:\n${base}^${exp}`;
        answer = `1/${denom}`;
        concept = "Negative exponent rule";
        hint = "a^(-n) = 1 / a^n.";
        explanation = "Negative exponents indicate reciprocals: move the base to the denominator and make the exponent positive.";
        example = "Example: 5^(-2) = 1/5^2 = 1/25.";
      }
    }

    return { text, answer, concept, hint, explanation, example };
  };

})();

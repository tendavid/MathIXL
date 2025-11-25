function getMax(level){return 10 + level*5;}
// js/generators/decimals.js
// Decimals & Percent generators for Grades 4–7.

(function () {

  // ---- Decimal Place Value ----
  window.buildDecimalPlaceValueQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const places = d < 0.4 ? 2 : d < 0.7 ? 3 : 4; 
    let value = (Math.random() * Math.pow(10, places)).toFixed(places);
    const digits = value.split(".")[1].split("");

    const positionNames = ["tenths","hundredths","thousandths","ten-thousandths"];
    const idx = randomInt(0, places-1);
    const posName = positionNames[idx];
    const digit = digits[idx];

    const text = `In the decimal number ${value}, what digit is in the ${posName} place?`;
    const answer = Number(digit);
    const concept = "Decimal place value";
    const hint = "Count places after the decimal: tenths, hundredths, thousandths...";
    const explanation = "Digits to the right of the decimal represent fractional parts: tenths = 1/10, hundredths = 1/100, etc.";
    const example = "Example: In 3.647, the tenths=6, hundredths=4, thousandths=7.";

    return {text, answer, concept, hint, explanation, example};
  };

  // ---- Multiply & Divide Decimals ----
  window.buildDecimalMultDivQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const a = Number((Math.random()*10).toFixed(2));
    const b = Number((Math.random()*(d<0.5?2:5)).toFixed(2));
    const op = Math.random() < 0.5 ? "×" : "÷";

    let answer;
    if(op==="×") answer = Number((a*b).toFixed(4));
    else answer = b===0?0:Number((a/b).toFixed(4));

    const text = `Compute (round to 4 decimal places if needed):\n${a} ${op} ${b}`;
    const concept = "Multiplying and dividing decimals";
    const hint = op==="×" ? "Multiply normally then count total decimal places." : "Move decimal in divisor to make whole, do same to dividend.";
    const explanation = "Decimal multiplication/division follows whole-number rules but requires adjusting decimal places.";
    const example = "Example: 1.5 × 0.2 = 0.30\nExample: 3.6 ÷ 0.4 = 9";

    return {text, answer, concept, hint, explanation, example};
  };

  // ---- Fractions / Decimals / Percents ----
  window.buildFracDecPercentQuestion = function(ctx){
    const type = randomInt(1,3);
    let text, answer, concept, hint, explanation, example;

    if(type===1){
      // fraction → decimal
      const den = randomInt(2,10);
      const num = randomInt(1,den-1);
      answer = Number((num/den).toFixed(4));
      text = `Convert the fraction to a decimal (4 decimal places):\n${num}/${den}`;
      concept = "Fraction → Decimal conversion";
      hint = "Divide numerator by denominator.";
      explanation = "A fraction a/b means a ÷ b.";
      example = "Example: 3/4 = 3 ÷ 4 = 0.75";
    } else if(type===2){
      // decimal → percent
      const dec = Number((Math.random()*1).toFixed(3));
      answer = Number((dec*100).toFixed(2));
      text = `Convert the decimal to a percent:\n${dec}`;
      concept = "Decimal → Percent conversion";
      hint = "Multiply the decimal by 100.";
      explanation = "Percent means out of 100.";
      example = "Example: 0.45 = 45%";
    } else {
      // percent → decimal
      const pct = randomInt(1,120);
      answer = Number((pct/100).toFixed(3));
      text = `Convert the percent to a decimal:\n${pct}%`;
      concept = "Percent → Decimal conversion";
      hint = "Divide by 100.";
      explanation = "To convert percent to decimal, move decimal two places left.";
      example = "Example: 85% = 0.85";
    }

    return {text, answer, concept, hint, explanation, example};
  };

})();

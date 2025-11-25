function getMax(level){return 10 + level*5;}
// js/generators/inequalities.js
// Inequalities Generators (Grades 6–8)

(function(){

  // ---- One-step inequalities (Grade 7) ----
  window.buildInequalityQuestion = function(ctx){
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const op = randomInt(1,4); // + - * /
    let x = randomInt(-20,20);
    let a,b,text,answer,concept,hint,explanation,example;

    if(op===1){
      a=randomInt(1,15);
      b=x+a;
      text=`Solve the inequality:\nx + ${a} > ${b}`;
      answer=`x > ${x}`;
      concept="One-step inequality (addition)";
      hint="Undo +a by subtracting a.";
      explanation="Subtract a from both sides; direction stays the same.";
      example="Example: x+4>10 → x>6.";
    }

    else if(op===2){
      a=randomInt(1,15);
      b=x-a;
      text=`Solve the inequality:\nx − ${a} ≤ ${b}`;
      answer=`x ≤ ${x}`;
      concept="One-step inequality (subtraction)";
      hint="Undo −a by adding a.";
      explanation="Add a to both sides; inequality direction stays same.";
      example="Example: x−5 ≤ 2 → x ≤ 7.";
    }

    else if(op===3){
      a=randomInt(2,10);
      b=a*x;
      text=`Solve the inequality:\n${a}x ≥ ${b}`;
      answer=`x ≥ ${x}`;
      concept="One-step inequality (multiplication)";
      hint="Divide both sides by the coefficient.";
      explanation="Dividing by a positive keeps inequality direction.";
      example="Example: 3x ≥ 12 → x ≥ 4.";
    }

    else { // division
      a=randomInt(2,10);
      let bExact = x / a;
      bExact = Math.floor(bExact);
      x = a * bExact;
      const b = bExact;
      text=`Solve the inequality:\nx ÷ ${a} < ${b}`;
      answer=`x < ${x}`;
      concept="One-step inequality (division)";
      hint="Multiply both sides by the divisor.";
      explanation="Multiplying by a positive keeps inequality direction.";
      example="Example: x÷3 < 4 → x < 12.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

})();

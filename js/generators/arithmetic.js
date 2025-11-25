
(function(){
  function difficultyToRange(level, baseMin, baseMax){
    let n = Math.max(1, Math.min(100, Number(level) || 1));
    const t = (n-1)/99; // 0..1
    const span = baseMax - baseMin;
    const maxVal = Math.round(baseMin + span*(0.3 + 0.7*t));
    return {min: baseMin, max: Math.max(baseMin+3, maxVal)};
  }

  function randInt(a,b){
    a = Math.ceil(a); b = Math.floor(b);
    return Math.floor(Math.random()*(b-a+1))+a;
  }

  // --- G1 NUMBERS ---
  window.buildG1NumbersTo100Question = function(opts){
    const r = difficultyToRange(opts.number, 1, 100);
    const v = randInt(r.min, r.max);
    const mode = (opts.number<=30) ? "read" : (opts.number<=70 ? "place" : "compare");
    if(mode==="read"){
      return { text:`What number is this? ${v}`, answer:v, concept:"Numbers to 100" };
    } else if(mode==="place"){
      const tens = Math.floor(v/10), ones=v%10;
      return { text:`${v} = ___ tens and ___ ones. Give your answer as 'tens,ones'.`, answer:`${tens},${ones}`, concept:"Place value (tens/ones)" };
    } else {
      const other = randInt(r.min, r.max);
      const bigger = v>other ? v : other;
      return { text:`Which is greater: ${v} or ${other}?`, answer:bigger, concept:"Compare numbers to 100" };
    }
  };

  // --- G1 ADD/SUB 20 ---
  window.buildG1AddSub20Question = function(opts){
    const r = difficultyToRange(opts.number, 1, 20);
    const a = randInt(1, 10);
    const b = randInt(1, 10);
    if(opts.number <= 40){
      // single-step within 10
      const add = Math.random()<0.5;
      const aa = randInt(1,9), bb=randInt(1,9);
      const txt = add ? `${aa} + ${bb} = ?` : `${aa+bb} - ${aa} = ?`;
      const ans = add ? aa+bb : bb;
      return {text:txt, answer:ans, concept:"Addition & subtraction within 10"};
    } else if(opts.number <= 80){
      // bridging 10
      const aa = randInt(5,10), bb = randInt(1,10);
      const sum = aa+bb;
      const txt = `${aa} + ${bb} = ?`;
      return {text:txt, answer:sum, concept:"Addition using make-10"};
    } else {
      // simple word problems
      const apples = randInt(3,10), more = randInt(1,5);
      const add = Math.random()<0.5;
      if(add){
        return {
          text:`Skye has ${apples} apples. She gets ${more} more apples. How many apples does she have now?`,
          answer:apples+more,
          concept:"1-step word problems within 20"
        };
      } else {
        const total = apples+more;
        return {
          text:`Skye has ${total} marbles. She gives ${more} marbles to Jethro. How many marbles does she have left?`,
          answer:total-more,
          concept:"1-step subtraction word problems within 20"
        };
      }
    }
  };

  // --- G1 ADD/SUB 100 ---
  window.buildG1AddSub100Question = function(opts){
    const r = difficultyToRange(opts.number, 10, 100);
    const a = randInt(r.min, r.max);
    const b = randInt(1, Math.min(20, a));
    if(opts.number <= 40){
      // 2-digit + 1-digit no regrouping
      const base = randInt(10,50);
      const add = randInt(1,9);
      const txt = `${base} + ${add} = ?`;
      return {text:txt, answer:base+add, concept:"Add within 100 (no regrouping)"};
    } else if(opts.number <= 80){
      // 2-digit + 2-digit maybe regrouping
      const x = randInt(10,80), y=randInt(10,80);
      const txt = `${x} + ${y} = ?`;
      return {text:txt, answer:x+y, concept:"Add within 100 (with regrouping possible)"};
    } else {
      // compare sums
      const x1=randInt(10,50), x2=randInt(10,50);
      const y1=randInt(10,50), y2=randInt(10,50);
      const s1=x1+x2, s2=y1+y2;
      const bigger = s1>s2 ? "first" : (s2>s1 ? "second" : "equal");
      return {
        text:`Which sum is greater: first ${x1}+${x2}, or second ${y1}+${y2}? Answer 'first', 'second', or 'equal'.`,
        answer:bigger,
        concept:"Compare sums within 100"
      };
    }
  };

  // --- SIMPLE STUBS FOR OTHER TOPICS TO AVOID MISMATCHES ---
  window.buildG1ShapesPatternsQuestion = function(opts){
    return { text:"Name a 2D shape that has 3 sides.", answer:"triangle", concept:"Shapes & patterns" };
  };
  window.buildG1MeasurementQuestion = function(opts){
    return { text:"Which is longer: 1 meter or 1 centimeter?", answer:"1 meter", concept:"Measurement length/mass" };
  };
  window.buildG1TimeQuestion = function(opts){
    return { text:"If the time is 3:00, what do we say in words?", answer:"3 o'clock", concept:"Time to the hour" };
  };
  window.buildG1PictureGraphQuestion = function(opts){
    return { text:"A graph shows 3 cats and 2 dogs. How many animals are there?", answer:5, concept:"Picture graphs" };
  };

  window.buildG2NumbersTo1000Question = function(opts){
    const r = difficultyToRange(opts.number, 20, 1000);
    const v = randInt(r.min, r.max);
    const mode = (opts.number<=40) ? "place" : (opts.number<=80 ? "compare" : "round");
    if(mode==="place"){
      const hundreds = Math.floor(v/100);
      const tens = Math.floor((v%100)/10);
      const ones = v%10;
      return { text:`${v} = ___ hundreds, ___ tens, ___ ones. Answer 'h,t,o'.`, answer:`${hundreds},${tens},${ones}`, concept:"Place value to 1,000" };
    } else if(mode==="compare"){
      const other = randInt(r.min, r.max);
      const sign = v>other?">":(v<other?"<":"=");
      return { text:`Fill in with >, <, or = : ${v} _ ${other}`, answer:sign, concept:"Compare numbers to 1,000" };
    } else {
      const base10 = Math.round(v/10)*10;
      return { text:`Round ${v} to the nearest ten.`, answer:base10, concept:"Rounding to tens" };
    }
  };

  window.buildG2AddSub1000Question = function(opts){
    const r = difficultyToRange(opts.number, 20, 500);
    const a = randInt(r.min, r.max);
    const b = randInt(10, Math.min(200,a));
    if(opts.number<=40){
      const txt = `${a} + ${b} = ?`;
      return {text:txt, answer:a+b, concept:"Add within 1,000 (no regrouping emphasis)"};
    } else if(opts.number<=80){
      const bigger = a>b?a:b;
      const smaller = a>b?b:a;
      const txt = `${bigger} - ${smaller} = ?`;
      return {text:txt, answer:bigger-smaller, concept:"Subtract within 1,000"};
    } else {
      const start = randInt(100,300), change = randInt(10,90);
      const add = Math.random()<0.5;
      if(add){
        return {
          text:`Skye reads ${start} pages of a book. She reads ${change} more pages. How many pages has she read?`,
          answer:start+change,
          concept:"Word problems (add within 1,000)"
        };
      } else {
        const total = start+change;
        return {
          text:`A tank can hold ${total} L of water. It currently has ${start} L. How many more liters to fill it?`,
          answer:change,
          concept:"Word problems (subtract within 1,000)"
        };
      }
    }
  };

  window.buildG2MultiplicationQuestion = function(opts){
    const facts = [2,3,4,5];
    const a = facts[randInt(0,facts.length-1)];
    const b = randInt(1,10);
    return { text:`${a} × ${b} = ?`, answer:a*b, concept:"Intro multiplication facts" };
  };
  window.buildG2DivisionQuestion = function(opts){
    const a = randInt(2,5);
    const b = randInt(2,5);
    const prod = a*b;
    return { text:`${prod} ÷ ${a} = ?`, answer:b, concept:"Intro division (sharing)" };
  };
  window.buildG2MoneyQuestion = function(opts){
    const price = randInt(2,9);
    const qty = randInt(2,5);
    return { text:`Each toy costs $${price}. Skye buys ${qty} toys. How much does she pay?`, answer:price*qty, concept:"Money multiplication" };
  };
  window.buildG2MeasurementQuestion = function(opts){
    const length = randInt(10,40);
    const cut = randInt(1,9);
    return { text:`A rope is ${length} cm long. Skye cuts off ${cut} cm. How long is it now?`, answer:length-cut, concept:"Measurement word problem" };
  };
  window.buildG2WordProblemQuestion = function(opts){
    const apples = randInt(5,12);
    const more = randInt(2,8);
    return { text:`Skye has ${apples} apples. Jethro has ${more} fewer apples than Skye. How many apples does Jethro have?`, answer:apples-more, concept:"2-step word problems (comparison)" };
  };

  window.buildG3NumbersTo10000Question = function(opts){
    const r = difficultyToRange(opts.number, 100, 10000);
    const v = randInt(r.min, r.max);
    const mode = (opts.number<=40)?"place":(opts.number<=80?"compare":"round");
    if(mode==="place"){
      const thousands = Math.floor(v/1000);
      const hundreds = Math.floor((v%1000)/100);
      const tens = Math.floor((v%100)/10);
      const ones = v%10;
      return { text:`${v} = ___ thousands, ___ hundreds, ___ tens, ___ ones (answer 't,h,te,o').`, answer:`${thousands},${hundreds},${tens},${ones}`, concept:"Place value to 10,000" };
    } else if(mode==="compare"){
      const other = randInt(r.min, r.max);
      const sign = v>other?">":(v<other?"<":"=");
      return { text:`Fill >, <, or = : ${v} _ ${other}`, answer:sign, concept:"Compare numbers to 10,000" };
    } else {
      const rounded = Math.round(v/100)*100;
      return { text:`Round ${v} to the nearest hundred.`, answer:rounded, concept:"Rounding to hundreds" };
    }
  };

  window.buildG3MulDivQuestion = function(opts){
    const level = opts.number;
    if(level<=50){
      const a = randInt(2,9), b=randInt(2,9);
      return { text:`${a} × ${b} = ?`, answer:a*b, concept:"Multiplication facts up to 10×10" };
    } else {
      const a = randInt(2,9), b=randInt(2,9);
      const prod = a*b;
      if(Math.random()<0.5){
        return { text:`${prod} ÷ ${a} = ?`, answer:b, concept:"Division facts up to 10×10" };
      } else {
        const c = randInt(2,9);
        // 2-step: (a*b)+c
        return { text:`${a} × ${b} + ${c} = ?`, answer:prod+c, concept:"2-step multiplication expression" };
      }
    }
  };

  window.buildG3FractionsBasicQuestion = function(opts){
    return { text:"What fraction of the shape is shaded if 3 out of 4 equal parts are shaded? (write like 3/4)", answer:"3/4", concept:"Basic fractions" };
  };
  window.buildG3AreaPerimeterQuestion = function(opts){
    const w = randInt(2,10), h=randInt(2,10);
    if(opts.number<=50){
      return { text:`A rectangle is ${w} units long and ${h} units wide. What is its area?`, answer:w*h, concept:"Area of rectangles" };
    } else {
      return { text:`A rectangle is ${w} units long and ${h} units wide. What is its perimeter?`, answer:2*(w+h), concept:"Perimeter of rectangles" };
    }
  };
  window.buildG3BarModelQuestion = function(opts){
    return { text:"Skye has 12 stickers. Jethro has 5 fewer stickers than Skye. How many stickers does Jethro have?", answer:7, concept:"Bar model comparison" };
  };
  window.buildG3GraphQuestion = function(opts){
    return { text:"Class A has 18 students and Class B has 15 students. How many students in total?", answer:33, concept:"Graphs (bar graphs)" };
  };
  window.buildG3WordProblemQuestion = function(opts){
    return { text:"Skye walks 3 km in the morning and 4 km in the afternoon. How many kilometers does she walk in total?", answer:7, concept:"2-step word problems" };
  };

  // Generic mixed for higher grades placeholder
  window.buildGenericMixedQuestion = function(opts){
    const a = randInt(10,99), b=randInt(10,99);
    return { text:`Quick practice: ${a} + ${b} = ?`, answer:a+b, concept:"Mixed practice placeholder" };
  };
})();

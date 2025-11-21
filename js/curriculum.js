// curriculum.js (Brand‑New Modular Version)
// Clean mapping for Daily Math Training Lab

const CURRICULUM = {
  1:{name:"Grade 1",progressives:[
    {index:1,code:"g1_count",name:"Counting",generator:"buildCountingQuestion"},
    {index:2,code:"g1_add20",name:"Add/Sub 20",generator:"buildAddSubWithin20Question"},
    {index:3,code:"g1_add100",name:"Add/Sub 100",generator:"buildAddSubWithin100Question"},
    {index:4,code:"g1_place",name:"Place Value",generator:"buildPlaceValueQuestion"},
    {index:5,code:"g1_word",name:"Word Problems",generator:"buildAddSubWithin20Question"},
    {index:6,code:"g1_mix",name:"Mixed",generator:"buildG1MixedReviewQuestion"},
    {index:7,code:"g1_mix2",name:"Extra Mixed",generator:"buildG1MixedReviewQuestion"}
  ]},

  2:{name:"Grade 2",progressives:[
    {index:1,code:"g2_add100",name:"Add/Sub 100",generator:"buildAddSubWithin100Question"},
    {index:2,code:"g2_add1000",name:"Add/Sub 1000",generator:"buildAddSubWithin1000Question"},
    {index:3,code:"g2_place",name:"Place Value",generator:"buildPlaceValueQuestion"},
    {index:4,code:"g2_arrays",name:"Arrays",generator:"buildMultiplicationFactsQuestion"},
    {index:5,code:"g2_measure",name:"Measurement",generator:"buildAddSubWithin100Question"},
    {index:6,code:"g2_mix",name:"Mixed",generator:"buildG2MixedReviewQuestion"},
    {index:7,code:"g2_mix2",name:"Extra Mixed",generator:"buildG2MixedReviewQuestion"}
  ]},

  3:{name:"Grade 3",progressives:[
    {index:1,code:"g3_mult",name:"Multiplication",generator:"buildMultiplicationFactsQuestion"},
    {index:2,code:"g3_div",name:"Division",generator:"buildDivisionFactsQuestion"},
    {index:3,code:"g3_word",name:"Word Problems",generator:"buildMultiplicationFactsQuestion"},
    {index:4,code:"g3_frac_intro",name:"Fraction Intro",generator:"buildFractionIntroQuestion"},
    {index:5,code:"g3_area",name:"Area/Perimeter",generator:"buildAreaPerimeterRectangleQuestion"},
    {index:6,code:"g3_mix",name:"Mixed Review",generator:"buildG3MixedReviewQuestion"},
    {index:7,code:"g3_mix2",name:"Extra Mixed",generator:"buildG3MixedReviewQuestion"}
  ]},

  4:{name:"Grade 4",progressives:[
    {index:1,code:"g4_multid",name:"Multi‑Digit Mult",generator:"buildMultiDigitMultiplicationQuestion"},
    {index:2,code:"g4_div",name:"Long Division",generator:"buildLongDivisionQuestion"},
    {index:3,code:"g4_equiv",name:"Equivalent Fractions",generator:"buildEquivalentFractionsQuestion"},
    {index:4,code:"g4_frac_like",name:"Like‑Den Fractions",generator:"buildFractionAddSubLikeDenQuestion"},
    {index:5,code:"g4_area_vol",name:"Area & Volume",generator:"buildAreaVolumeIntroQuestion"},
    {index:6,code:"g4_mix",name:"Mixed",generator:"buildG4MixedReviewQuestion"},
    {index:7,code:"g4_mix2",name:"Extra Mixed",generator:"buildG4MixedReviewQuestion"}
  ]},

  5:{name:"Grade 5",progressives:[
    {index:1,code:"g5_dec_place",name:"Decimal Place Value",generator:"buildDecimalPlaceValueQuestion"},
    {index:2,code:"g5_frac_unlike",name:"Fraction Add/Sub Unlike",generator:"buildFractionAddSubUnlikeDenQuestion"},
    {index:3,code:"g5_frac_mult",name:"Fraction Mult",generator:"buildFractionMultiplicationQuestion"},
    {index:4,code:"g5_dec_ops",name:"Decimal × ÷",generator:"buildDecimalMultDivQuestion"},
    {index:5,code:"g5_vol",name:"Volume",generator:"buildVolumeRectPrismQuestion"},
    {index:6,code:"g5_fdp",name:"Frac/Dec/Pct",generator:"buildFracDecPercentQuestion"},
    {index:7,code:"g5_mix",name:"Mixed",generator:"buildG4MixedReviewQuestion"}
  ]},

  6:{name:"Grade 6",progressives:[
    {index:1,code:"g6_ratio",name:"Ratios",generator:"buildRatiosUnitRatesQuestion"},
    {index:2,code:"g6_fdp",name:"Fraction/Decimal/Pct",generator:"buildFracDecPercentQuestion"},
    {index:3,code:"g6_int",name:"Integers",generator:"buildIntegersNumberLineQuestion"},
    {index:4,code:"g6_eq",name:"One‑Step Equations",generator:"buildOneStepEquationQuestion"},
    {index:5,code:"g6_sa",name:"Area/Surface Area",generator:"buildAreaSurfaceAreaQuestion"},
    {index:6,code:"g6_stats",name:"Statistics",generator:"buildStatsQuestion"},
    {index:7,code:"g6_mix",name:"Mixed",generator:"buildG6MixedReviewQuestion"}
  ]},

  7:{name:"Grade 7",progressives:[
    {index:1,code:"g7_prop",name:"Proportions",generator:"buildProportionQuestion"},
    {index:2,code:"g7_pct",name:"Percent",generator:"buildPercentWordProblemQuestion"},
    {index:3,code:"g7_lin",name:"Linear Expressions",generator:"buildLinearExpressionQuestion"},
    {index:4,code:"g7_ineq",name:"Inequalities",generator:"buildInequalityQuestion"},
    {index:5,code:"g7_geom",name:"Geometry",generator:"buildGeometryAnglesQuestion"},
    {index:6,code:"g7_stats",name:"Statistics",generator:"buildStatsQuestion"},
    {index:7,code:"g7_mix",name:"Mixed",generator:"buildG7MixedReviewQuestion"}
  ]},

  8:{name:"Grade 8",progressives:[
    {index:1,code:"g8_linear",name:"Linear Equations",generator:"buildLinearEquationGraphQuestion"},
    {index:2,code:"g8_sys",name:"Systems",generator:"buildSystemsLinearQuestion"},
    {index:3,code:"g8_fn",name:"Functions",generator:"buildFunctionsIntroQuestion"},
    {index:4,code:"g8_exp",name:"Exponents",generator:"buildIntegerExponentsQuestion"},
    {index:5,code:"g8_trans",name:"Transformations",generator:"buildTransformationsSimilarityQuestion"},
    {index:6,code:"g8_pyth",name:"Pythagorean",generator:"buildPythagoreanQuestion"},
    {index:7,code:"g8_stats",name:"Stats",generator:"buildTwoVariableStatsQuestion"}
  ]}
};

function getGradesList(){return Object.keys(CURRICULUM).map(g=>({grade:+g,name:CURRICULUM[g].name}));}
function getProgressivesForGrade(g){return CURRICULUM[g]?.progressives||[];}
function getTopicFor(g,i){return CURRICULUM[g]?.progressives.find(p=>p.index===i)||null;}
function generateQuestionFor(g,i,n){
  const t=getTopicFor(g,i);
  if(!t) throw Error("Topic not found");
  const fn=window[t.generator];
  if(typeof fn!=="function") throw Error("Missing generator: "+t.generator);
  return fn({grade:g,progressiveIndex:i,number:n,topic:t});
}

// js/curriculum.js

// -----------------------------
// Topics per grade (7 each)
// -----------------------------
const curriculumTopics = {
  1: [
    { name: "Counting & Comparing Numbers to 120", key: "g1_count_compare" },
    { name: "Add & Subtract within 20", key: "g1_add_sub_20" },
    { name: "Place Value (Tens & Ones)", key: "g1_place_value" },
    { name: "Shapes & Equal Parts", key: "g1_shapes" },
    { name: "Length, Time, and Money", key: "g1_measure" },
    { name: "Basic Word Problems (Add/Sub)", key: "g1_word" },
    { name: "Mixed Review (Grade 1 Skills)", key: "g1_mixed" }
  ],
  2: [
    { name: "Place Value to 1000", key: "g2_place_value_1000" },
    { name: "Add & Subtract within 1000", key: "g2_add_sub_1000" },
    { name: "Intro to Multiplication & Division", key: "g2_mul_div_intro" },
    { name: "Time, Money & Measurement", key: "g2_measure" },
    { name: "Shapes & Partitioning", key: "g2_shapes" },
    { name: "Two-Step Word Problems", key: "g2_word" },
    { name: "Mixed Review (Grade 2 Skills)", key: "g2_mixed" }
  ],
  3: [
    { name: "Multiplication & Division Facts", key: "g3_mul_div" },
    { name: "Division with Remainders", key: "g3_div_remainder" },
    { name: "Intro Fractions", key: "g3_fractions" },
    { name: "Area & Perimeter (Rectangles)", key: "g3_area_perimeter" },
    { name: "Number Lines & Fractions", key: "g3_frac_numberline" },
    { name: "Measurement (Mass & Capacity)", key: "g3_measure" },
    { name: "Multi-Step Word Problems", key: "g3_word" }
  ],
  4: [
    { name: "Fractions (Add/Sub Like Denominators)", key: "g4_frac_add_sub" },
    { name: "Fractions (Equivalence & Compare)", key: "g4_frac_compare" },
    { name: "Multi-Digit Multiplication", key: "g4_multi_mul" },
    { name: "Long Division (1-digit divisors)", key: "g4_long_div" },
    { name: "Factors & Multiples", key: "g4_factors" },
    { name: "Angles & Lines", key: "g4_angles" },
    { name: "Word Problems with Fractions", key: "g4_word" }
  ],
  5: [
    { name: "Add & Subtract Fractions", key: "g5_frac_add_sub" },
    { name: "Multiply & Divide Fractions", key: "g5_frac_mul_div" },
    { name: "Decimal Place Value & Operations", key: "g5_decimals" },
    { name: "Volume (Rectangular Prisms)", key: "g5_volume" },
    { name: "Intro to Percent", key: "g5_percent" },
    { name: "Patterns & Graphing", key: "g5_patterns" },
    { name: "Multi-Step Word Problems", key: "g5_word" }
  ],
  6: [
    { name: "Ratios & Unit Rates", key: "g6_ratios" },
    { name: "Fractions, Decimals, Percents", key: "g6_frac_dec_percent" },
    { name: "Expressions & Equations (Intro)", key: "g6_equations" },
    { name: "Area, Surface Area, Volume", key: "g6_geometry" },
    { name: "Statistics: Data & Measures", key: "g6_stats" },
    { name: "Integers & the Number Line", key: "g6_integers" },
    { name: "Rate & Ratio Word Problems", key: "g6_word" }
  ],
  7: [
    { name: "Operations with Rational Numbers", key: "g7_rational" },
    { name: "Algebraic Expressions & Properties", key: "g7_expressions" },
    { name: "Linear Equations in One Variable", key: "g7_linear_eq" },
    { name: "Proportional Relationships", key: "g7_proportion" },
    { name: "Geometry: Angles & Triangles", key: "g7_geometry" },
    { name: "Probability (Intro)", key: "g7_prob" },
    { name: "Algebra & Proportion Word Problems", key: "g7_word" }
  ],
  8: [
    { name: "Linear Equations & Systems", key: "g8_linear_systems" },
    { name: "Functions & Graphs", key: "g8_functions" },
    { name: "Exponents & Scientific Notation", key: "g8_exponents" },
    { name: "Pythagorean Theorem", key: "g8_pythagorean" },
    { name: "Transformations & Similarity", key: "g8_similarity" },
    { name: "Volume of Cylinders & Cones", key: "g8_volume" },
    { name: "Statistics (Two-Variable Data)", key: "g8_stats" }
  ],
  9: [
    { name: "Linear & Quadratic Expressions", key: "g9_expr" },
    { name: "Factoring Quadratics", key: "g9_factoring" },
    { name: "Solving Quadratic Equations", key: "g9_quadratics" },
    { name: "Linear Inequalities", key: "g9_inequalities" },
    { name: "Intro to Functions", key: "g9_functions" },
    { name: "Right Triangle Trigonometry (Intro)", key: "g9_trig" },
    { name: "Geometry: Circles & Area", key: "g9_circles" }
  ],
  10: [
    { name: "Quadratic Functions (Graphs & Roots)", key: "g10_quadratic_functions" },
    { name: "Polynomials (Add/Sub/Multiply)", key: "g10_polynomials" },
    { name: "Rational Expressions (Simplify)", key: "g10_rational" },
    { name: "Exponential Functions", key: "g10_exponential" },
    { name: "Right Triangle Trigonometry", key: "g10_trig" },
    { name: "Coordinate Geometry (Lines)", key: "g10_coordinate" },
    { name: "Statistics (Spread & Variability)", key: "g10_stats" }
  ],
  11: [
    { name: "Exponential & Logarithmic Functions", key: "g11_exp_log" },
    { name: "Polynomial Applications", key: "g11_poly_app" },
    { name: "Sequences & Series", key: "g11_sequences" },
    { name: "Probability & Counting", key: "g11_prob" },
    { name: "Rational Expressions", key: "g11_rational" },
    { name: "Trigonometry (Unit Circle Intro)", key: "g11_trig" },
    { name: "Algebraic Modeling Word Problems", key: "g11_word" }
  ],
  12: [
    { name: "Trigonometric Identities & Equations", key: "g12_trig_id" },
    { name: "Limits & Continuity", key: "g12_limits" },
    { name: "Derivative Concepts & Applications", key: "g12_derivatives" },
    { name: "Sequences & Series (Advanced)", key: "g12_sequences" },
    { name: "Vectors & Parametric Motion", key: "g12_vectors" },
    { name: "Statistics & Data Interpretation", key: "g12_stats" },
    { name: "Cumulative Challenge Problems", key: "g12_challenge" }
  ]
};

// -----------------------------
// Map topic keys → generator functions (core.js)
// -----------------------------
const topicGenerators = {
  // Grade 1
  g1_count_compare: (g, d) => buildCountCompareQuestion(g, d),
  g1_add_sub_20: (g, d) => buildAddSubQuestion(g, d * 0.6, 20),
  g1_place_value: (g, d) => buildPlaceValueQuestion(g, d, 99),
  g1_shapes: (g, d) => buildShapesQuestion(g, d),
  g1_measure: (g, d) => buildTimeMoneyMeasurementQuestion(g, d),
  g1_word: (g, d) => buildOneStepWordProblemQuestion(g, d),
  g1_mixed: (g, d) => buildAddSubQuestion(g, d * 0.8, 50),

  // Grade 2
  g2_place_value_1000: (g, d) => buildPlaceValueQuestion(g, d, 999),
  g2_add_sub_1000: (g, d) => buildAddSubQuestion(g, d, 1000),
  g2_mul_div_intro: (g, d) => buildFractionOfNumberQuestion(g, d * 0.5),
  g2_measure: (g, d) => buildTimeMoneyMeasurementQuestion(g, d),
  g2_shapes: (g, d) => buildShapesQuestion(g, d),
  g2_word: (g, d) => buildTwoStepWordProblemQuestion(g, d),
  g2_mixed: (g, d) => buildAddSubQuestion(g, d, 200),

  // Grade 3
  g3_mul_div: (g, d) => buildFractionOfNumberQuestion(g, d),
  g3_div_remainder: (g, d) => buildFractionOfNumberQuestion(g, d),
  g3_fractions: (g, d) => buildFractionOfNumberQuestion(g, d * 0.7),
  g3_area_perimeter: (g, d) => buildAreaPerimeterQuestion(g, d),
  g3_frac_numberline: (g, d) => buildFractionOfNumberQuestion(g, d * 0.8),
  g3_measure: (g, d) => buildTimeMoneyMeasurementQuestion(g, d),
  g3_word: (g, d) => buildTwoStepWordProblemQuestion(g, d),

  // Grade 4
  g4_frac_add_sub: (g, d) => buildFractionAddSubQuestion(g, d),
  g4_frac_compare: (g, d) => buildFractionCompareQuestion(g, d),
  g4_multi_mul: (g, d) => buildAddSubQuestion(g, d, 500), // multi-digit multiplication approximated as harder add/sub practice
  g4_long_div: (g, d) => buildFractionOfNumberQuestion(g, d), // division modeled via fraction-of-number
  g4_factors: (g, d) => buildIntegersQuestion(g, d * 0.4),
  g4_angles: (g, d) => buildAngleQuestion(g, d),
  g4_word: (g, d) => buildFractionWordProblemQuestion(g, d),

  // Grade 5
  g5_frac_add_sub: (g, d) => buildFractionAddSubQuestion(g, d),
  g5_frac_mul_div: (g, d) => buildFractionMulDivQuestion(g, d),
  g5_decimals: (g, d) => buildDecimalOperationsQuestion(g, d),
  g5_volume: (g, d) => buildVolumeQuestion(g, d),
  g5_percent: (g, d) => buildPercentQuestion(g, d),
  g5_patterns: (g, d) => buildSequenceQuestion(g, d * 0.4),
  g5_word: (g, d) => buildFractionWordProblemQuestion(g, d),

  // Grade 6
  g6_ratios: (g, d) => buildRatiosQuestion(g, d),
  g6_frac_dec_percent: (g, d) => buildFractionDecimalPercentQuestion(g, d),
  g6_equations: (g, d) => buildEquationsIntroQuestion(g, d),
  g6_geometry: (g, d) => buildVolumeQuestion(g, d),
  g6_stats: (g, d) => buildStatsQuestion(g, d),
  g6_integers: (g, d) => buildIntegersQuestion(g, d),
  g6_word: (g, d) => buildRateWordProblemQuestion(g, d),

  // Grade 7
  g7_rational: (g, d) => buildIntegersQuestion(g, d),
  g7_expressions: (g, d) => buildEquationsIntroQuestion(g, d),
  g7_linear_eq: (g, d) => buildLinearEquationQuestion(g, d),
  g7_proportion: (g, d) => buildRatiosQuestion(g, d),
  g7_geometry: (g, d) => buildAngleQuestion(g, d),
  g7_prob: (g, d) => buildStatsQuestion(g, d),
  g7_word: (g, d) => buildRateWordProblemQuestion(g, d),

  // Grade 8
  g8_linear_systems: (g, d) => buildLinearSystemsQuestion(g, d),
  g8_functions: (g, d) => buildFunctionsQuestion(g, d),
  g8_exponents: (g, d) => buildExponentsQuestion(g, d),
  g8_pythagorean: (g, d) => buildVolumeQuestion(g, d), // reusing volume/Pythagorean style here
  g8_similarity: (g, d) => buildRatiosQuestion(g, d),
  g8_volume: (g, d) => buildVolumeQuestion(g, d),
  g8_stats: (g, d) => buildStatsQuestion(g, d),

  // Grade 9
  g9_expr: (g, d) => buildLinearEquationQuestion(g, d),
  g9_factoring: (g, d) => buildQuadraticQuestion(g, d * 0.7),
  g9_quadratics: (g, d) => buildQuadraticQuestion(g, d),
  g9_inequalities: (g, d) => buildLinearEquationQuestion(g, d),
  g9_functions: (g, d) => buildFunctionsQuestion(g, d),
  g9_trig: (g, d) => buildTrigQuestion(g, d),
  g9_circles: (g, d) => buildAreaPerimeterQuestion(g, d),

  // Grade 10
  g10_quadratic_functions: (g, d) => buildQuadraticQuestion(g, d),
  g10_polynomials: (g, d) => buildChallengeQuestion(g, d * 0.6),
  g10_rational: (g, d) => buildIntegersQuestion(g, d),
  g10_exponential: (g, d) => buildExponentsQuestion(g, d),
  g10_trig: (g, d) => buildTrigQuestion(g, d),
  g10_coordinate: (g, d) => buildFunctionsQuestion(g, d),
  g10_stats: (g, d) => buildStatsQuestion(g, d),

  // Grade 11
  g11_exp_log: (g, d) => buildScientificNotationQuestion(g, d),
  g11_poly_app: (g, d) => buildChallengeQuestion(g, d),
  g11_sequences: (g, d) => buildSequenceQuestion(g, d),
  g11_prob: (g, d) => buildStatsQuestion(g, d),
  g11_rational: (g, d) => buildIntegersQuestion(g, d),
  g11_trig: (g, d) => buildTrigQuestion(g, d),
  g11_word: (g, d) => buildRateWordProblemQuestion(g, d),

  // Grade 12
  g12_trig_id: (g, d) => buildTrigQuestion(g, d),
  g12_limits: (g, d) => buildLimitQuestion(g, d),
  g12_derivatives: (g, d) => buildDerivativeConceptQuestion(g, d),
  g12_sequences: (g, d) => buildSequenceQuestion(g, d),
  g12_vectors: (g, d) => buildVectorsQuestion(g, d),
  g12_stats: (g, d) => buildStatsQuestion(g, d),
  g12_challenge: (g, d) => buildChallengeQuestion(g, d)
};

// -----------------------------
// Main entry for engine.js
// -----------------------------
function generateQuestionFor(grade, progressiveIndex, number) {
  const topics = curriculumTopics[grade];
  if (!topics) {
    const diff = difficultyFromNumber(number);
    return buildAddSubQuestion(grade, diff, 100);
  }
  const topic = topics[progressiveIndex - 1];
  if (!topic) {
    const diff = difficultyFromNumber(number);
    return buildAddSubQuestion(grade, diff, 100);
  }

  const diff = difficultyFromNumber(number);
  const generator = topicGenerators[topic.key];

  if (!generator) {
    return buildAddSubQuestion(grade, diff, 100);
  }

  const q = generator(grade, diff);
  if (q && q.concept) {
    q.concept = `${q.concept}`;
  }
  return q;
}

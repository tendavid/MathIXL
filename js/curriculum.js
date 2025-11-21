// js/curriculum.js
// Daily Math Training Lab
// Curriculum definition + topic → generator mapping.

// Grade structure:
// - grades[gradeNumber] = { name, progressives: [ { index, code, name, generator } ] }

const CURRICULUM = {
  1: {
    name: "Grade 1",
    progressives: [
      { index: 1, code: "g1_nbt_counting", name: "Counting & Comparing to 120", generator: "buildCountingQuestion" },
      { index: 2, code: "g1_add_sub_20", name: "Addition & Subtraction within 20", generator: "buildAddSubWithin20Question" },
      { index: 3, code: "g1_add_sub_100", name: "Addition & Subtraction within 100", generator: "buildAddSubWithin100Question" },
      { index: 4, code: "g1_place_value", name: "Place Value (Ones & Tens)", generator: "buildPlaceValueQuestion" },
      { index: 5, code: "g1_word_problems", name: "One-Step Word Problems within 20", generator: "buildEarlyWordProblemQuestion" },
      { index: 6, code: "g1_time", name: "Time & Measurement Basics", generator: "buildEarlyMeasurementQuestion" },
      { index: 7, code: "g1_review", name: "Mixed Review (Counting & Add/Sub)", generator: "buildG1MixedReviewQuestion" }
    ]
  },

  2: {
    name: "Grade 2",
    progressives: [
      { index: 1, code: "g2_add_sub_100", name: "Addition & Subtraction within 100", generator: "buildAddSubWithin100Question" },
      { index: 2, code: "g2_add_sub_1000", name: "Addition & Subtraction within 1000", generator: "buildAddSubWithin1000Question" },
      { index: 3, code: "g2_place_value", name: "Place Value (Hundreds, Tens, Ones)", generator: "buildPlaceValueQuestion" },
      { index: 4, code: "g2_arrays", name: "Intro to Arrays & Equal Groups", generator: "buildArrayEqualGroupsQuestion" },
      { index: 5, code: "g2_measurement", name: "Length & Simple Word Problems", generator: "buildMeasurementWordProblemQuestion" },
      { index: 6, code: "g2_time_money", name: "Time & Money", generator: "buildTimeMoneyQuestion" },
      { index: 7, code: "g2_review", name: "Mixed Review (Add/Sub & Arrays)", generator: "buildG2MixedReviewQuestion" }
    ]
  },

  3: {
    name: "Grade 3",
    progressives: [
      { index: 1, code: "g3_mult_basic", name: "Basic Multiplication Facts", generator: "buildMultiplicationFactsQuestion" },
      { index: 2, code: "g3_div_basic", name: "Basic Division Facts", generator: "buildDivisionFactsQuestion" },
      { index: 3, code: "g3_mult_div", name: "Multiplication & Division Word Problems", generator: "buildMultDivWordProblemQuestion" },
      { index: 4, code: "g3_fractions_intro", name: "Intro to Fractions (Visual & Number Line)", generator: "buildFractionIntroQuestion" },
      { index: 5, code: "g3_area", name: "Area & Perimeter of Rectangles", generator: "buildAreaPerimeterRectangleQuestion" },
      { index: 6, code: "g3_measurement", name: "Measurement & Data (Graphs)", generator: "buildMeasurementDataQuestion" },
      { index: 7, code: "g3_review", name: "Mixed Review (Mult, Div, Fractions)", generator: "buildG3MixedReviewQuestion" }
    ]
  },

  4: {
    name: "Grade 4",
    progressives: [
      { index: 1, code: "g4_mult_multi", name: "Multi-digit Multiplication", generator: "buildMultiDigitMultiplicationQuestion" },
      { index: 2, code: "g4_division", name: "Long Division (No Remainder)", generator: "buildLongDivisionQuestion" },
      { index: 3, code: "g4_fractions_equiv", name: "Equivalent Fractions & Comparison", generator: "buildEquivalentFractionsQuestion" },
      { index: 4, code: "g4_frac_add_sub", name: "Add & Subtract Fractions (Like Den.)", generator: "buildFractionAddSubLikeDenQuestion" },
      { index: 5, code: "g4_area_volume", name: "Area & Perimeter, Intro Volume", generator: "buildAreaVolumeIntroQuestion" },
      { index: 6, code: "g4_patterns", name: "Number Patterns & Factors", generator: "buildNumberPatternsFactorsQuestion" },
      { index: 7, code: "g4_review", name: "Mixed Review (Mult, Div, Fractions)", generator: "buildG4MixedReviewQuestion" }
    ]
  },

  5: {
    name: "Grade 5",
    progressives: [
      { index: 1, code: "g5_place_value_dec", name: "Place Value with Decimals", generator: "buildDecimalPlaceValueQuestion" },
      { index: 2, code: "g5_add_sub_frac", name: "Add/Subtract Fractions (Unlike Den.)", generator: "buildFractionAddSubUnlikeDenQuestion" },
      { index: 3, code: "g5_mult_frac", name: "Multiply Fractions & Whole Numbers", generator: "buildFractionMultiplicationQuestion" },
      { index: 4, code: "g5_mult_div_dec", name: "Multiply & Divide Decimals", generator: "buildDecimalMultDivQuestion" },
      { index: 5, code: "g5_volume", name: "Volume of Rectangular Prisms", generator: "buildVolumeRectPrismQuestion" },
      { index: 6, code: "g5_graphs", name: "Line Plots & Data", generator: "buildLinePlotStatsQuestion" },
      { index: 7, code: "g5_review", name: "Mixed Review (Fractions & Decimals)", generator: "buildG5MixedReviewQuestion" }
    ]
  },

  6: {
    name: "Grade 6",
    progressives: [
      { index: 1, code: "g6_ratio_rate", name: "Ratios & Unit Rates", generator: "buildRatiosUnitRatesQuestion" },
      { index: 2, code: "g6_fraction_decimal", name: "Fractions, Decimals, Percents", generator: "buildFracDecPercentQuestion" },
      { index: 3, code: "g6_negative_numbers", name: "Integers & Number Line", generator: "buildIntegersNumberLineQuestion" },
      { index: 4, code: "g6_equations", name: "One-Step Equations", generator: "buildOneStepEquationQuestion" },
      { index: 5, code: "g6_area_surface", name: "Area & Surface Area", generator: "buildAreaSurfaceAreaQuestion" },
      { index: 6, code: "g6_data_stats", name: "Statistics: Mean, Median, Range", generator: "buildStatsQuestion" },
      { index: 7, code: "g6_review", name: "Mixed Review (Ratios, Integers, Equations)", generator: "buildG6MixedReviewQuestion" }
    ]
  },

  7: {
    name: "Grade 7",
    progressives: [
      { index: 1, code: "g7_proportions", name: "Proportional Relationships", generator: "buildProportionQuestion" },
      { index: 2, code: "g7_percent", name: "Percent Problems (Tax, Tip, Discount)", generator: "buildPercentWordProblemQuestion" },
      { index: 3, code: "g7_linear_intro", name: "Intro to Linear Expressions & Equations", generator: "buildLinearExpressionQuestion" },
      { index: 4, code: "g7_inequalities", name: "Inequalities & Number Line", generator: "buildInequalityQuestion" },
      { index: 5, code: "g7_geometry", name: "Angles, Triangles, & Circles", generator: "buildGeometryAnglesQuestion" },
      { index: 6, code: "g7_stats", name: "Statistics: Sampling & Inference", generator: "buildStatsQuestion" },
      { index: 7, code: "g7_review", name: "Mixed Review (Proportions & Linear)", generator: "buildG7MixedReviewQuestion" }
    ]
  },

  8: {
    name: "Grade 8",
    progressives: [
      { index: 1, code: "g8_linear_equations", name: "Linear Equations & Graphs", generator: "buildLinearEquationGraphQuestion" },
      { index: 2, code: "g8_systems", name: "Systems of Linear Equations", generator: "buildSystemsLinearQuestion" },
      { index: 3, code: "g8_functions", name: "Functions & Function Notation", generator: "buildFunctionsIntroQuestion" },
      { index: 4, code: "g8_exponents", name: "Integer Exponents & Scientific Notation", generator: "buildIntegerExponentsQuestion" },
      { index: 5, code: "g8_geom", name: "Transformations & Similarity", generator: "buildTransformationsSimilarityQuestion" },
      { index: 6, code: "g8_pythagorean", name: "Pythagorean Theorem & Distance", generator: "buildPythagoreanQuestion" },
      { index: 7, code: "g8_stats", name: "Two-Variable Data & Linear Models", generator: "buildTwoVariableStatsQuestion" }
    ]
  },

  9: {
    name: "Grade 9 (Algebra 1)",
    progressives: [
      { index: 1, code: "g9_linear_mastery", name: "Mastery of Linear Equations & Graphs", generator: "buildLinearEquationGraphQuestion" },
      { index: 2, code: "g9_systems", name: "Systems (Substitution & Elimination)", generator: "buildSystemsLinearQuestion" },
      { index: 3, code: "g9_quadratics_intro", name: "Intro to Quadratic Expressions", generator: "buildQuadraticExpressionQuestion" },
      { index: 4, code: "g9_quadratics_solve", name: "Solving Quadratic Equations", generator: "buildQuadraticSolveQuestion" },
      { index: 5, code: "g9_exponentials", name: "Exponential Functions", generator: "buildExponentialFunctionsQuestion" },
      { index: 6, code: "g9_stats", name: "Statistics & Line of Best Fit", generator: "buildTwoVariableStatsQuestion" },
      { index: 7, code: "g9_review", name: "Mixed Algebra 1 Review", generator: "buildG9MixedReviewQuestion" }
    ]
  },

  10: {
    name: "Grade 10 (Geometry)",
    progressives: [
      { index: 1, code: "g10_triangles", name: "Triangles, Congruence, & Similarity", generator: "buildTrianglesCongruenceQuestion" },
      { index: 2, code: "g10_circles", name: "Circles (Arcs, Chords, Angles)", generator: "buildCirclesQuestion" },
      { index: 3, code: "g10_area_volume", name: "Area & Volume (2D & 3D)", generator: "buildAreaVolumeAdvancedQuestion" },
      { index: 4, code: "g10_right_triangles", name: "Right Triangles & Trig Intro", generator: "buildRightTriangleTrigIntroQuestion" },
      { index: 5, code: "g10_coordinate_geom", name: "Coordinate Geometry", generator: "buildCoordinateGeometryQuestion" },
      { index: 6, code: "g10_transformations", name: "Transformations & Symmetry", generator: "buildTransformationsAdvancedQuestion" },
      { index: 7, code: "g10_review", name: "Mixed Geometry Review", generator: "buildG10MixedReviewQuestion" }
    ]
  },

  11: {
    name: "Grade 11 (Algebra 2 / Pre-Calc A)",
    progressives: [
      { index: 1, code: "g11_polynomials", name: "Polynomials & Factoring", generator: "buildPolynomialsFactoringQuestion" },
      { index: 2, code: "g11_rationals", name: "Rational Expressions & Equations", generator: "buildRationalExpressionsQuestion" },
      { index: 3, code: "g11_radicals", name: "Radicals & Complex Numbers", generator: "buildRadicalsComplexQuestion" },
      { index: 4, code: "g11_log_exp", name: "Exponential & Logarithmic Functions", generator: "buildExpLogQuestion" },
      { index: 5, code: "g11_trig", name: "Trigonometric Functions & Identities", generator: "buildTrigFunctionsQuestion" },
      { index: 6, code: "g11_sequences", name: "Sequences & Series", generator: "buildSequencesSeriesQuestion" },
      { index: 7, code: "g11_review", name: "Mixed Algebra 2 / Pre-Calc A Review", generator: "buildG11MixedReviewQuestion" }
    ]
  },

  12: {
    name: "Grade 12 (Pre-Calc / Advanced Topics)",
    progressives: [
      { index: 1, code: "g12_limits_intro", name: "Intro to Limits & Continuity", generator: "buildLimitsIntroQuestion" },
      { index: 2, code: "g12_trig_advanced", name: "Advanced Trig (Identities & Equations)", generator: "buildTrigAdvancedQuestion" },
      { index: 3, code: "g12_vectors", name: "Vectors & Parametric Equations", generator: "buildVectorsQuestion" },
      { index: 4, code: "g12_matrices", name: "Matrices & Systems", generator: "buildMatricesQuestion" },
      { index: 5, code: "g12_prob_stats", name: "Advanced Probability & Statistics", generator: "buildAdvancedProbabilityStatsQuestion" },
      { index: 6, code: "g12_sequences_series", name: "Series, Sigma Notation, Convergence", generator: "buildSequencesSeriesAdvancedQuestion" },
      { index: 7, code: "g12_challenge", name: "Challenge Problems (Mixed Topics)", generator: "buildG12ChallengeQuestion" }
    ]
  }
};

// ---- Helper functions used by engine.js ----

function getGradesList() {
  return Object.keys(CURRICULUM)
    .map((g) => ({
      grade: Number(g),
      name: CURRICULUM[g].name
    }))
    .sort((a, b) => a.grade - b.grade);
}

function getProgressivesForGrade(grade) {
  const g = CURRICULUM[grade];
  if (!g) return [];
  return g.progressives;
}

function getTopicFor(grade, progressiveIndex) {
  const g = CURRICULUM[grade];
  if (!g) return null;
  return g.progressives.find((p) => p.index === progressiveIndex) || null;
}

// Given grade, progressiveIndex, and number (1–100), return a question object
// by calling the mapped generator function (defined in the modular generator files).
function generateQuestionFor(grade, progressiveIndex, number) {
  const topic = getTopicFor(grade, progressiveIndex);
  if (!topic) {
    throw new Error(`No topic found for grade ${grade}, progressive ${progressiveIndex}`);
  }

  const fnName = topic.generator;
  const fn = typeof window !== "undefined" ? window[fnName] : null;

  if (typeof fn !== "function") {
    throw new Error(`Generator function '${fnName}' is not defined for topic ${topic.code}`);
  }

  // Each generator gets full context so it can adjust difficulty by number.
  return fn({ grade, progressiveIndex, number, topic });
}

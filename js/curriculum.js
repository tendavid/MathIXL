const CURRICULUM = {
  "1": {
    "name": "Grade 1 – Primary 1",
    "levels": 100,
    "progressives": [
      { "index": 1, "code": "g1_numbers100", "name": "Numbers to 100", "generator": "buildG1NumbersTo100Question" },
      { "index": 2, "code": "g1_addsub20", "name": "Addition & Subtraction Within 20", "generator": "buildG1AddSub20Question" },
      { "index": 3, "code": "g1_addsub100", "name": "Addition & Subtraction Within 100", "generator": "buildG1AddSub100Question" },
      { "index": 4, "code": "g1_shapes", "name": "Shapes & Patterns", "generator": "buildG1ShapesPatternsQuestion" },
      { "index": 5, "code": "g1_measure", "name": "Measurement (Length, Mass)", "generator": "buildG1MeasurementQuestion" },
      { "index": 6, "code": "g1_time", "name": "Time (O’clock / Half-Hour)", "generator": "buildG1TimeQuestion" },
      { "index": 7, "code": "g1_graphs", "name": "Picture Graphs", "generator": "buildG1PictureGraphQuestion" }
    ]
  },

  "2": {
    "name": "Grade 2 – Primary 2",
    "levels": 100,
    "progressives": [
      { "index": 1, "code": "g2_numbers1000", "name": "Numbers to 1,000", "generator": "buildG2NumbersTo1000Question" },
      { "index": 2, "code": "g2_addsub1000", "name": "Addition & Subtraction Within 1,000", "generator": "buildG2AddSub1000Question" },
      { "index": 3, "code": "g2_mult", "name": "Multiplication (Arrays / Repeated Addition)", "generator": "buildG2MultiplicationQuestion" },
      { "index": 4, "code": "g2_div", "name": "Division (Sharing / Grouping)", "generator": "buildG2DivisionQuestion" },
      { "index": 5, "code": "g2_money", "name": "Money (Coins & Notes)", "generator": "buildG2MoneyQuestion" },
      { "index": 6, "code": "g2_measure", "name": "Measurement (Length, Mass, Volume, Time, Money)", "generator": "buildG2MeasurementQuestion" },
      { "index": 7, "code": "g2_word", "name": "Word Problems (2-Step, Bar Models Intro)", "generator": "buildG2WordProblemQuestion" }
    ]
  },

  "3": {
    "name": "Grade 3 – Primary 3",
    "levels": 100,
    "progressives": [
      { "index": 1, "code": "g3_numbers10000", "name": "Numbers to 10,000", "generator": "buildG3NumbersTo10000Question" },
      { "index": 2, "code": "g3_muldiv", "name": "Multiplication & Division", "generator": "buildG3MulDivQuestion" },
      { "index": 3, "code": "g3_frac_basic", "name": "Fractions (Basic)", "generator": "buildG3FractionsBasicQuestion" },
      { "index": 4, "code": "g3_area_perim", "name": "Area & Perimeter", "generator": "buildG3AreaPerimeterQuestion" },
      { "index": 5, "code": "g3_bar_models", "name": "Bar Models (Whole-Part / Comparison)", "generator": "buildG3BarModelQuestion" },
      { "index": 6, "code": "g3_graphs", "name": "Graphs (Bar / Line Intro)", "generator": "buildG3GraphQuestion" },
      { "index": 7, "code": "g3_word", "name": "Word Problems (2-Step)", "generator": "buildG3WordProblemQuestion" }
    ]
  },

  "4": {
    "name": "Grade 4 – Primary 4",
    "levels": 100,
    "progressives": [
      { "index": 1, "code": "g4_numbers100k", "name": "Numbers to 100,000", "generator": "buildGenericMixedQuestion" },
      { "index": 2, "code": "g4_factors_multiples", "name": "Factors & Multiples", "generator": "buildGenericMixedQuestion" },
      {
        "index": 3,
        "code": "g4_frac_dec",
        "name": "Fractions & Decimals",
        "generator": "buildG4FractionsDecimalsQuestion"
      },
      { "index": 4, "code": "g4_multidigit_mult", "name": "Multi-Digit Multiplication", "generator": "buildGenericMixedQuestion" },
      { "index": 5, "code": "g4_long_div", "name": "Long Division", "generator": "buildGenericMixedQuestion" },
      { "index": 6, "code": "g4_geometry", "name": "Angles & Symmetry", "generator": "buildGenericMixedQuestion" },
      { "index": 7, "code": "g4_word", "name": "Word Problems (Whole Numbers / Fractions)", "generator": "buildGenericMixedQuestion" }
    ]
  },

  "5": {
    "name": "Grade 5 – Primary 5",
    "levels": 100,
    "progressives": [
      { "index": 1, "code": "g5_whole_dec", "name": "Whole Numbers & Decimals", "generator": "buildGenericMixedQuestion" },
      { "index": 2, "code": "g5_frac_ops", "name": "Fraction Operations", "generator": "buildGenericMixedQuestion" },
      { "index": 3, "code": "g5_percent", "name": "Percentage", "generator": "buildGenericMixedQuestion" },
      { "index": 4, "code": "g5_ratio", "name": "Ratio", "generator": "buildGenericMixedQuestion" },
      { "index": 5, "code": "g5_volume", "name": "Volume of Rectangular Prisms", "generator": "buildGenericMixedQuestion" },
      { "index": 6, "code": "g5_average", "name": "Average", "generator": "buildGenericMixedQuestion" },
      { "index": 7, "code": "g5_word", "name": "Word Problems (Ratio / Percent / Volume)", "generator": "buildGenericMixedQuestion" }
    ]
  },

  "6": {
    "name": "Grade 6 – Primary 6 / Sec 1 Intro",
    "levels": 100,
    "progressives": [
      { "index": 1, "code": "g6_algebra_expr", "name": "Algebraic Expressions", "generator": "buildGenericMixedQuestion" },
      { "index": 2, "code": "g6_eq_one_step", "name": "Equations (One-Step & Two-Step)", "generator": "buildGenericMixedQuestion" },
      { "index": 3, "code": "g6_ratio_rate_speed", "name": "Ratio, Rate & Speed", "generator": "buildGenericMixedQuestion" },
      { "index": 4, "code": "g6_percent_adv", "name": "Percentage (Advanced)", "generator": "buildGenericMixedQuestion" },
      { "index": 5, "code": "g6_area_volume", "name": "Area & Volume (Advanced)", "generator": "buildGenericMixedQuestion" },
      { "index": 6, "code": "g6_geometry", "name": "Geometry (Angles, Triangles, Nets)", "generator": "buildGenericMixedQuestion" },
      { "index": 7, "code": "g6_data_prob", "name": "Data Handling & Probability", "generator": "buildGenericMixedQuestion" }
    ]
  },

  "7": {
    "name": "Grade 7 – Sec 1 / US Grade 7 Blend",
    "levels": 100,
    "progressives": [
      { "index": 1, "code": "g7_integers", "name": "Integers & Rational Numbers", "generator": "buildGenericMixedQuestion" },
      { "index": 2, "code": "g7_lin_eq", "name": "Linear Equations", "generator": "buildGenericMixedQuestion" },
      { "index": 3, "code": "g7_ratio_percent", "name": "Ratio, Rate & Percent", "generator": "buildGenericMixedQuestion" },
      { "index": 4, "code": "g7_geom", "name": "Geometry (Angles, Triangles, Area)", "generator": "buildGenericMixedQuestion" },
      { "index": 5, "code": "g7_pythagoras", "name": "Pythagorean Theorem (Intro)", "generator": "buildGenericMixedQuestion" },
      { "index": 6, "code": "g7_graphs_functions", "name": "Graphs & Functions (Intro)", "generator": "buildGenericMixedQuestion" },
      { "index": 7", "code": "g7_stats", "name": "Statistics (Mean/Median/Mode)", "generator": "buildGenericMixedQuestion" }
    ]
  },

  "8": {
    "name": "Grade 8 – Sec 2 / US Grade 8 Blend",
    "levels": 100,
    "progressives": [
      { "index": 1, "code": "g8_linear_func", "name": "Linear Functions & Slope", "generator": "buildGenericMixedQuestion" },
      { "index": 2, "code": "g8_systems", "name": "Systems of Linear Equations", "generator": "buildGenericMixedQuestion" },
      { "index": 3, "code": "g8_transform", "name": "Transformations & Similarity", "generator": "buildGenericMixedQuestion" },
      { "index": 4, "code": "g8_pythagoras", "name": "Pythagorean Theorem (Applications)", "generator": "buildGenericMixedQuestion" },
      { "index": 5, "code": "g8_exponents", "name": "Exponents & Scientific Notation", "generator": "buildGenericMixedQuestion" },
      { "index": 6, "code": "g8_stats_prob", "name": "Statistics & Probability", "generator": "buildGenericMixedQuestion" },
      { "index": 7, "code": "g8_word", "name": "Word Problems (Functions / Geometry)", "generator": "buildGenericMixedQuestion" }
    ]
  },

  "9": {
    "name": "Grade 9 – Algebra I",
    "levels": 50,
    "progressives": [
      { "index": 1, "code": "g9_lin_eq", "name": "Linear Equations & Inequalities", "generator": "buildGenericMixedQuestion" },
      { "index": 2, "code": "g9_lin_graphs", "name": "Linear Graphs & Slope-Intercept Form", "generator": "buildGenericMixedQuestion" },
      { "index": 3, "code": "g9_sys", "name": "Systems of Linear Equations", "generator": "buildGenericMixedQuestion" },
      { "index": 4, "code": "g9_poly", "name": "Polynomials (Add/Sub/Multiply)", "generator": "buildGenericMixedQuestion" },
      { "index": 5, "code": "g9_factoring", "name": "Factoring (Trinomials & Special)", "generator": "buildGenericMixedQuestion" },
      { "index": 6, "code": "g9_quad_eq", "name": "Quadratic Equations", "generator": "buildGenericMixedQuestion" },
      { "index": 7, "code": "g9_quad_graph", "name": "Quadratic Functions & Graphs", "generator": "buildGenericMixedQuestion" },
      { "index": 8, "code": "g9_word", "name": "Algebra I Word Problems", "generator": "buildGenericMixedQuestion" }
    ]
  },

  "10": {
    "name": "Grade 10 – Geometry",
    "levels": 50,
    "progressives": [
      { "index": 1, "code": "g10_cong_sim", "name": "Congruence & Similarity", "generator": "buildGenericMixedQuestion" },
      { "index": 2, "code": "g10_triangles", "name": "Triangles (Angle Sum / Properties)", "generator": "buildGenericMixedQuestion" },
      { "index": 3, "code": "g10_circles", "name": "Circles (Arcs / Angles)", "generator": "buildGenericMixedQuestion" },
      { "index": 4, "code": "g10_coord_geom", "name": "Coordinate Geometry", "generator": "buildGenericMixedQuestion" },
      { "index": 5, "code": "g10_area_volume", "name": "Area, Surface Area & Volume", "generator": "buildGenericMixedQuestion" },
      { "index": 6, "code": "g10_transform", "name": "Transformations (Rigid & Dilations)", "generator": "buildGenericMixedQuestion" },
      { "index": 7, "code": "g10_trig", "name": "Right Triangle Trigonometry", "generator": "buildGenericMixedQuestion" },
      { "index": 8, "code": "g10_word", "name": "Geometry Word Problems", "generator": "buildGenericMixedQuestion" }
    ]
  },

  "11": {
    "name": "Grade 11 – Algebra II",
    "levels": 50,
    "progressives": [
      { "index": 1, "code": "g11_poly_funcs", "name": "Polynomial Functions", "generator": "buildGenericMixedQuestion" },
      { "index": 2, "code": "g11_rational", "name": "Rational Expressions & Equations", "generator": "buildGenericMixedQuestion" },
      { "index": 3, "code": "g11_exp_log", "name": "Exponential & Logarithmic Functions", "generator": "buildGenericMixedQuestion" },
      { "index": 4, "code": "g11_seq_series", "name": "Sequences & Series", "generator": "buildGenericMixedQuestion" },
      { "index": 5, "code": "g11_trig_funcs", "name": "Trigonometric Functions", "generator": "buildGenericMixedQuestion" },
      { "index": 6, "code": "g11_complex", "name": "Complex Numbers", "generator": "buildGenericMixedQuestion" },
      { "index": 7, "code": "g11_conics", "name": "Conic Sections", "generator": "buildGenericMixedQuestion" },
      { "index": 8, "code": "g11_word", "name": "Algebra II Word Problems", "generator": "buildGenericMixedQuestion" }
    ]
  },

  "12": {
    "name": "Grade 12 – Precalculus & Statistics",
    "levels": 50,
    "progressives": [
      { "index": 1, "code": "g12_limits", "name": "Limits (Conceptual)", "generator": "buildGenericMixedQuestion" },
      { "index": 2, "code": "g12_trig_id", "name": "Trigonometric Identities", "generator": "buildGenericMixedQuestion" },
      { "index": 3, "code": "g12_trig_graphs", "name": "Trig Graphs & Transformations", "generator": "buildGenericMixedQuestion" },
      { "index": 4, "code": "g12_matrix_vector", "name": "Matrices & Vectors", "generator": "buildGenericMixedQuestion" },
      { "index": 5, "code": "g12_prob_stats", "name": "Probability & Statistics", "generator": "buildGenericMixedQuestion" },
      { "index": 6, "code": "g12_regression", "name": "Data Analysis & Regression", "generator": "buildGenericMixedQuestion" },
      { "index": 7, "code": "g12_precalc_mix", "name": "Mixed Precalculus Review", "generator": "buildGenericMixedQuestion" },
      { "index": 8, "code": "g12_hs_mix", "name": "High School Mixed Review (9–12)", "generator": "buildGenericMixedQuestion" }
    ]
  }
};

function getGradesList() {
  return Object.keys(CURRICULUM).map(g => ({
    grade: +g,
    name: CURRICULUM[g].name
  }));
}

function getProgressivesForGrade(g) {
  return CURRICULUM[g]?.progressives || [];
}

function getTopicFor(g, i) {
  return (CURRICULUM[g]?.progressives || []).find(p => p.index === i) || null;
}

function generateQuestionFor(g, i, n) {
  const topic = getTopicFor(g, i);
  if (!topic) throw Error("Topic not found");
  const fn = window[topic.generator];
  if (typeof fn !== "function") {
    throw Error("Missing generator: " + topic.generator);
  }
  return fn({ grade: g, progressiveIndex: i, number: n, topic });
}

const CURRICULUM = {
  "1": {
    "name": "Grade 1 \u2013 Primary 1",
    "levels": 100,
    "progressives": [
      {
        "index": 1,
        "code": "g1_numbers100",
        "name": "Numbers to 100",
        "generator": "buildG1NumbersTo100Question"
      },
      {
        "index": 2,
        "code": "g1_addsub20",
        "name": "Addition & Subtraction Within 20",
        "generator": "buildG1AddSub20Question"
      },
      {
        "index": 3,
        "code": "g1_addsub100",
        "name": "Addition & Subtraction Within 100",
        "generator": "buildG1AddSub100Question"
      },
      {
        "index": 4,
        "code": "g1_shapes",
        "name": "Shapes & Patterns",
        "generator": "buildG1ShapesPatternsQuestion"
      },
      {
        "index": 5,
        "code": "g1_measure",
        "name": "Measurement (Length, Mass)",
        "generator": "buildG1MeasurementQuestion"
      },
      {
        "index": 6,
        "code": "g1_time",
        "name": "Time (O\u2019clock / Half-Hour)",
        "generator": "buildG1TimeQuestion"
      },
      {
        "index": 7,
        "code": "g1_graphs",
        "name": "Picture Graphs",
        "generator": "buildG1PictureGraphQuestion"
      }
    ]
  },
  "2": {
    "name": "Grade 2 \u2013 Primary 2",
    "levels": 100,
    "progressives": [
      {
        "index": 1,
        "code": "g2_numbers1000",
        "name": "Numbers to 1,000",
        "generator": "buildG2NumbersTo1000Question"
      },
      {
        "index": 2,
        "code": "g2_addsub1000",
        "name": "Addition & Subtraction Within 1,000",
        "generator": "buildG2AddSub1000Question"
      },
      {
        "index": 3,
        "code": "g2_mult",
        "name": "Multiplication (Arrays / Repeated Addition)",
        "generator": "buildG2MultiplicationQuestion"
      },
      {
        "index": 4,
        "code": "g2_div",
        "name": "Division (Sharing / Grouping)",
        "generator": "buildG2DivisionQuestion"
      },
      {
        "index": 5,
        "code": "g2_money",
        "name": "Money (Coins & Notes)",
        "generator": "buildG2MoneyQuestion"
      },
      {
        "index": 6,
        "code": "g2_measure",
        "name": "Measurement (Length, Mass, Volume, Time, Money)",
        "generator": "buildG2MeasurementQuestion"
      },
      {
        "index": 7,
        "code": "g2_word",
        "name": "Word Problems (2-Step, Bar Models Intro)",
        "generator": "buildG2WordProblemQuestion"
      }
    ]
  },
  "3": {
    "name": "Grade 3 \u2013 Primary 3",
    "levels": 100,
    "progressives": [
      {
        "index": 1,
        "code": "g3_numbers10000",
        "name": "Numbers to 10,000",
        "generator": "buildG3NumbersTo10000Question"
      },
      {
        "index": 2,
        "code": "g3_muldiv",
        "name": "Multiplication & Division",
        "generator": "buildG3MulDivQuestion"
      },
      {
        "index": 3,
        "code": "g3_frac_basic",
        "name": "Fractions (Basic)",
        "generator": "buildG3FractionsBasicQuestion"
      },
      {
        "index": 4,
        "code": "g3_area_perim",
        "name": "Area & Perimeter",
        "generator": "buildG3AreaPerimeterQuestion"
      },
      {
        "index": 5,
        "code": "g3_bar_models",
        "name": "Bar Models (Whole-Part / Comparison)",
        "generator": "buildG3BarModelQuestion"
      },
      {
        "index": 6,
        "code": "g3_graphs",
        "name": "Graphs (Bar / Line Intro)",
        "generator": "buildG3GraphQuestion"
      },
      {
        "index": 7,
        "code": "g3_word",
        "name": "Word Problems (2-Step)",
        "generator": "buildG3WordProblemQuestion"
      }
    ]
  },
  "4": {
    "name": "Grade 4 \u2013 Placeholder",
    "levels": 100,
    "progressives": [
      {
        "index": 1,
        "code": "g4_mixed",
        "name": "Mixed Practice",
        "generator": "buildGenericMixedQuestion"
      }
    ]
  },
  "5": {
    "name": "Grade 5 \u2013 Placeholder",
    "levels": 100,
    "progressives": [
      {
        "index": 1,
        "code": "g5_mixed",
        "name": "Mixed Practice",
        "generator": "buildGenericMixedQuestion"
      }
    ]
  },
  "6": {
    "name": "Grade 6 \u2013 Placeholder",
    "levels": 100,
    "progressives": [
      {
        "index": 1,
        "code": "g6_mixed",
        "name": "Mixed Practice",
        "generator": "buildGenericMixedQuestion"
      }
    ]
  },
  "7": {
    "name": "Grade 7 \u2013 Placeholder",
    "levels": 100,
    "progressives": [
      {
        "index": 1,
        "code": "g7_mixed",
        "name": "Mixed Practice",
        "generator": "buildGenericMixedQuestion"
      }
    ]
  },
  "8": {
    "name": "Grade 8 \u2013 Placeholder",
    "levels": 100,
    "progressives": [
      {
        "index": 1,
        "code": "g8_mixed",
        "name": "Mixed Practice",
        "generator": "buildGenericMixedQuestion"
      }
    ]
  },
  "9": {
    "name": "Grade 9 \u2013 Placeholder",
    "levels": 50,
    "progressives": [
      {
        "index": 1,
        "code": "g9_mixed",
        "name": "Mixed Practice",
        "generator": "buildGenericMixedQuestion"
      }
    ]
  },
  "10": {
    "name": "Grade 10 \u2013 Placeholder",
    "levels": 50,
    "progressives": [
      {
        "index": 1,
        "code": "g10_mixed",
        "name": "Mixed Practice",
        "generator": "buildGenericMixedQuestion"
      }
    ]
  },
  "11": {
    "name": "Grade 11 \u2013 Placeholder",
    "levels": 50,
    "progressives": [
      {
        "index": 1,
        "code": "g11_mixed",
        "name": "Mixed Practice",
        "generator": "buildGenericMixedQuestion"
      }
    ]
  },
  "12": {
    "name": "Grade 12 \u2013 Placeholder",
    "levels": 50,
    "progressives": [
      {
        "index": 1,
        "code": "g12_mixed",
        "name": "Mixed Practice",
        "generator": "buildGenericMixedQuestion"
      }
    ]
  }
};

function getGradesList() {
  return Object.keys(CURRICULUM).map(g => ({ grade: +g, name: CURRICULUM[g].name }));
}
function getProgressivesForGrade(g) {
  return CURRICULUM[g]?.progressives || [];
}
function getTopicFor(g, i) {
  return (CURRICULUM[g]?.progressives || []).find(p => p.index === i) || null;
}
function generateQuestionFor(g, i, n) {
  const topic = getTopicFor(g,i);
  if (!topic) throw Error("Topic not found");
  const fn = window[topic.generator];
  if (typeof fn !== "function") throw Error("Missing generator: " + topic.generator);
  return fn({grade:g, progressiveIndex:i, number:n, topic});
}

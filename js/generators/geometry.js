// js/generators/geometry.js
// Geometry generators: area, perimeter, volume, angles, transformations, Pythagorean, coordinate geometry, trig.

(function () {
  // ---- Grade 3: Area & Perimeter of Rectangles ----
  window.buildAreaPerimeterRectangleQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const maxSide = d < 0.4 ? 10 : d < 0.8 ? 20 : 30;
    const length = randomInt(2, maxSide);
    const width = randomInt(2, maxSide);
    const askArea = Math.random() < 0.5;

    let text, answer, concept, hint, explanation, example;

    if (askArea) {
      text = `A rectangle is ${length} units long and ${width} units wide.\nWhat is the area of the rectangle in square units?`;
      answer = length * width;
      concept = "Area of a rectangle";
      hint = "Area of a rectangle is length × width.";
      explanation =
        "Area measures how much space covers the surface. For rectangles, multiply the length by the width.";
      example =
        "Example: A rectangle is 5 units long and 3 units wide.\nArea = 5 × 3 = 15 square units.";
    } else {
      text = `A rectangle is ${length} units long and ${width} units wide.\nWhat is the perimeter of the rectangle in units?`;
      answer = 2 * (length + width);
      concept = "Perimeter of a rectangle";
      hint = "Perimeter is the distance all the way around: add all sides.";
      explanation =
        "Perimeter is the total distance around the shape. For rectangles, add length + width and double it.";
      example =
        "Example: A rectangle is 4 units by 7 units.\nPerimeter = 2 × (4 + 7) = 2 × 11 = 22 units.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 4: Area & Intro Volume ----
  window.buildAreaVolumeIntroQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const length = randomInt(2, d < 0.7 ? 10 : 20);
    const width = randomInt(2, d < 0.7 ? 10 : 20);
    const height = randomInt(2, d < 0.7 ? 6 : 12);
    const type = randomInt(1, 2);

    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      text = `A rectangle has length ${length} cm and width ${width} cm.\nWhat is its area in square centimeters?`;
      answer = length * width;
      concept = "Area of rectangle (review)";
      hint = "Multiply length by width.";
      explanation =
        "Area of a rectangle is length × width. Multiply the two side lengths.";
      example =
        "Example: 8 cm by 3 cm → Area = 8 × 3 = 24 cm².";
    } else {
      text = `A rectangular prism has length ${length} cm, width ${width} cm, and height ${height} cm.\nWhat is its volume in cubic centimeters?`;
      answer = length * width * height;
      concept = "Volume of a rectangular prism";
      hint = "Volume = length × width × height.";
      explanation =
        "Volume tells how much 3D space a solid shape occupies. For a rectangular prism, multiply all three side lengths.";
      example =
        "Example: 4 cm × 3 cm × 2 cm → Volume = 4 × 3 × 2 = 24 cm³.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 5: Volume of Rectangular Prisms ----
  window.buildVolumeRectPrismQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const length = randomInt(2, d < 0.5 ? 10 : 20);
    const width = randomInt(2, d < 0.5 ? 10 : 20);
    const height = randomInt(2, d < 0.5 ? 8 : 15);

    const text = `A box (rectangular prism) has length ${length} m, width ${width} m, and height ${height} m.\nWhat is its volume in cubic meters?`;
    const answer = length * width * height;
    const concept = "Volume of rectangular prisms";
    const hint = "Multiply length × width × height.";
    const explanation =
      "Find the area of the base (length × width), then multiply by the height to get volume.";
    const example =
      "Example: A prism 5 m × 3 m × 2 m has volume 5 × 3 × 2 = 30 m³.";
    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 6: Area & Surface Area ----
  window.buildAreaSurfaceAreaQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const length = randomInt(3, d < 0.6 ? 10 : 15);
    const width = randomInt(3, d < 0.6 ? 10 : 15);
    const height = randomInt(3, d < 0.6 ? 10 : 15);
    const type = randomInt(1, 2);

    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      text = `A rectangle has length ${length} units and width ${width} units.\nFind its area in square units.`;
      answer = length * width;
      concept = "Area of rectangles";
      hint = "Area = length × width.";
      explanation =
        "Area of rectangles is still base × height (or length × width).";
      example =
        "Example: 9 × 7 = 63 square units.";
    } else {
      text = `A rectangular prism has length ${length}, width ${width}, and height ${height} (all in units).\nFind its total surface area in square units.`;
      answer =
        2 * (length * width + length * height + width * height);
      concept = "Surface area of rectangular prisms";
      hint =
        "There are 6 faces: 2 of each kind. Compute each pair's area and add them.";
      explanation =
        "Surface area is the sum of the areas of all faces. For a rectangular prism, SA = 2(lw + lh + wh).";
      example =
        "Example: A prism 2 × 3 × 4.\nFaces: 2(2×3) + 2(2×4) + 2(3×4) = 2(6) + 2(8) + 2(12) = 12 + 16 + 24 = 52.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 7: Angles, Triangles, Circles basics ----
  window.buildGeometryAnglesQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const type = randomInt(1, 3);
    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      // Triangle angle sum
      const a = randomInt(30, 100);
      const b = randomInt(20, 100);
      const c = 180 - a - b;
      if (c <= 0) {
        return window.buildGeometryAnglesQuestion(ctx); // regenerate
      }
      text = `Two angles in a triangle measure ${a}° and ${b}°.\nWhat is the measure of the third angle?`;
      answer = c;
      concept = "Sum of angles in a triangle";
      hint = "The three angles of a triangle add to 180°.";
      explanation =
        "In any triangle, the interior angles add up to 180°. Subtract the two known angles from 180° to find the third.";
      example =
        "Example: If angles are 50° and 60°, the third is 180° − 50° − 60° = 70°.";
    } else if (type === 2) {
      // Straight line supplemental
      const a = randomInt(40, 150);
      const b = 180 - a;
      text = `Two angles form a straight line. One angle is ${a}°.\nWhat is the measure of the other angle?`;
      answer = b;
      concept = "Supplementary angles on a line";
      hint = "Angles on a straight line add up to 180°.";
      explanation =
        "If two angles form a straight line, they are supplementary and their measures add to 180°.";
      example =
        "Example: If one angle is 110°, the other is 70° because 110° + 70° = 180°.";
    } else {
      // Circle (central angle fraction of 360)
      const part = randomInt(1, 5);
      const totalParts = randomChoice([4, 6, 8, 12]);
      const angle = (360 / totalParts) * part;
      text = `A circle is 360°. If an arc represents ${part}/${totalParts} of the circle, what is the angle measure of that arc?`;
      answer = angle;
      concept = "Fraction of a circle's full angle";
      hint = "Multiply 360° by the fraction.";
      explanation =
        "A full circle is 360°. To find a fraction of a circle, multiply 360° by that fraction.";
      example =
        "Example: 1/4 of a circle: 360° × 1/4 = 90°.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 8: Transformations & Similarity ----
  window.buildTransformationsSimilarityQuestion = function (ctx) {
    const type = randomInt(1, 3);
    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      text =
        "A figure is moved 5 units to the right and 2 units up on the coordinate plane.\nIs this a translation, rotation, reflection, or dilation?\nAnswer with one word.";
      answer = "translation";
      concept = "Basic rigid motions: translation";
      hint = "Sliding a figure without turning or flipping.";
      explanation =
        "A translation slides every point of a shape the same distance in the same direction.";
      example =
        "Example: (x, y) → (x + 3, y − 1) is a translation 3 units right and 1 unit down.";
    } else if (type === 2) {
      text =
        "Triangle A'B'C' is an enlargement of triangle ABC by a scale factor of 2.\nAre the two triangles similar, congruent, or neither?\nAnswer with one word.";
      answer = "similar";
      concept = "Similarity by dilation";
      hint = "Similarity keeps angle measures but can change side lengths.";
      explanation =
        "A dilation with scale factor k > 0 creates a similar figure: angles stay the same, side lengths are multiplied by k.";
      example =
        "Example: A triangle scaled by factor 3 has side lengths three times as long, but the same angle measures.";
    } else {
      text =
        "A figure is reflected across the y-axis.\nWhat happens to the x-coordinates of its points?\nAnswer using a rule like x → ?. ";
      answer = "x→-x";
      concept = "Reflection across the y-axis";
      hint = "Points on the right move to the left the same distance and vice versa.";
      explanation =
        "Reflecting across the y-axis changes (x, y) to (−x, y). The x-coordinate changes sign, the y-coordinate stays the same.";
      example =
        "Example: (4, 2) reflected across the y-axis becomes (−4, 2).";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 8: Pythagorean Theorem & Distance ----
  window.buildPythagoreanQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const a = randomInt(3, d < 0.5 ? 10 : 20);
    const b = randomInt(3, d < 0.5 ? 10 : 20);
    const type = randomInt(1, 2);

    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      // find hypotenuse, round to 2 decimals
      const c = Math.sqrt(a * a + b * b);
      text = `A right triangle has legs of length ${a} and ${b}.\nUse the Pythagorean Theorem to find the length of the hypotenuse.\nRound your answer to 2 decimal places.`;
      answer = Number(c.toFixed(2));
      concept = "Pythagorean Theorem: finding hypotenuse";
      hint = "Use a² + b² = c², then take the square root.";
      explanation =
        "In a right triangle with legs a and b and hypotenuse c, a² + b² = c². Add the squares of the legs, then take the square root to find c.";
      example =
        "Example: legs 3 and 4 → c² = 3² + 4² = 9 + 16 = 25, so c = 5.";
    } else {
      // distance on coordinate plane between (0,0) and (a,b)
      const dist = Math.sqrt(a * a + b * b);
      text = `On a coordinate plane, one point is at (0, 0) and another is at (${a}, ${b}).\nWhat is the distance between these points?\nRound your answer to 2 decimal places.`;
      answer = Number(dist.toFixed(2));
      concept = "Distance formula from origin";
      hint = "Use the Pythagorean Theorem: distance² = x² + y².";
      explanation =
        "The distance between (0,0) and (x,y) is √(x² + y²). This is the Pythagorean Theorem applied to a right triangle formed with the axes.";
      example =
        "Example: distance from (0,0) to (6,8) is √(6² + 8²) = √(36 + 64) = √100 = 10.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 10: Triangles, congruence, similarity ----
  window.buildTrianglesCongruenceQuestion = function (ctx) {
    const type = randomInt(1, 2);
    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      text =
        "Two triangles each have side lengths 3 cm, 4 cm, and 5 cm.\nAre the triangles congruent, similar, or neither?\nAnswer with one word.";
      answer = "congruent";
      concept = "Triangle congruence by SSS";
      hint = "All three side lengths match exactly.";
      explanation =
        "If all three corresponding sides of two triangles are equal, the triangles are congruent by the SSS condition.";
      example =
        "Example: Triangle A with sides 3, 4, 5 and triangle B with sides 3, 4, 5 are congruent.";
    } else {
      text =
        "Triangle A has side lengths 5, 7, 9. Triangle B has side lengths 10, 14, 18.\nAre the triangles congruent, similar, or neither?\nAnswer with one word.";
      answer = "similar";
      concept = "Triangle similarity by side ratios";
      hint = "Compare ratios of corresponding sides.";
      explanation =
        "If all corresponding side lengths are proportional (have the same scale factor), the triangles are similar.";
      example =
        "Example: sides (3, 4, 5) and (6, 8, 10) show a scale factor of 2, so the triangles are similar.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 10: Circles ----
  window.buildCirclesQuestion = function (ctx) {
    const d = clampDifficulty(mapNumberToDifficulty(ctx.number));
    const r = randomInt(2, d < 0.6 ? 10 : 20);
    const type = randomInt(1, 2);

    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      text =
        `A circle has radius ${r} cm. Use π ≈ 3.14.\nFind the circumference of the circle. Round to 2 decimal places.`;
      answer = Number((2 * 3.14 * r).toFixed(2));
      concept = "Circumference of a circle";
      hint = "Circumference = 2πr.";
      explanation =
        "The circumference is the distance around the circle. Multiply 2 × π × radius.";
      example =
        "Example: r = 5 cm → C ≈ 2 × 3.14 × 5 = 31.40 cm.";
    } else {
      text =
        `A circle has radius ${r} cm. Use π ≈ 3.14.\nFind the area of the circle. Round to 2 decimal places.`;
      answer = Number((3.14 * r * r).toFixed(2));
      concept = "Area of a circle";
      hint = "Area = πr².";
      explanation =
        "The area of a circle is π times the square of the radius: A = πr².";
      example =
        "Example: r = 3 cm → A ≈ 3.14 × 9 = 28.26 cm².";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 10: Area & Volume (Advanced mix) ----
  window.buildAreaVolumeAdvancedQuestion = function (ctx) {
    const type = randomInt(1, 3);
    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      // Triangle area
      const base = randomInt(4, 20);
      const height = randomInt(3, 15);
      text =
        `A triangle has base ${base} cm and height ${height} cm.\nWhat is its area in square centimeters?`;
      answer = (base * height) / 2;
      concept = "Area of a triangle";
      hint = "Area = 1/2 × base × height.";
      explanation =
        "A triangle’s area is half the area of a rectangle with the same base and height.";
      example =
        "Example: base 10, height 6 → A = 1/2 × 10 × 6 = 30 cm².";
    } else if (type === 2) {
      // Volume of cylinder (π≈3.14)
      const r = randomInt(2, 10);
      const h = randomInt(3, 20);
      text =
        `A cylinder has radius ${r} cm and height ${h} cm. Use π ≈ 3.14.\nFind its volume in cubic centimeters, rounded to 2 decimal places.`;
      answer = Number((3.14 * r * r * h).toFixed(2));
      concept = "Volume of a cylinder";
      hint = "Volume = area of base × height; base is a circle.";
      explanation =
        "The volume of a cylinder is πr²h, since its base is a circle and the height stretches that area.";
      example =
        "Example: r = 3, h = 5 → V ≈ 3.14 × 9 × 5 = 141.30 cm³.";
    } else {
      // Surface area of cube
      const s = randomInt(2, 15);
      text =
        `A cube has side length ${s} cm.\nWhat is its total surface area in square centimeters?`;
      answer = 6 * s * s;
      concept = "Surface area of a cube";
      hint = "A cube has 6 square faces.";
      explanation =
        "Each face of a cube is a square with area s². There are 6 faces, so SA = 6s².";
      example =
        "Example: side 4 → each face is 16, so total surface area = 6 × 16 = 96 cm².";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 10: Coordinate Geometry ----
  window.buildCoordinateGeometryQuestion = function (ctx) {
    const type = randomInt(1, 2);
    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      // slope between two points
      const x1 = randomInt(-5, 5);
      const y1 = randomInt(-5, 5);
      let x2 = randomInt(-5, 5);
      while (x2 === x1) x2 = randomInt(-5, 5);
      const y2 = randomInt(-5, 5);

      const m = (y2 - y1) / (x2 - x1);
      text =
        `Find the slope of the line passing through the points (${x1}, ${y1}) and (${x2}, ${y2}).`;
      answer = Number(m.toFixed(3));
      concept = "Slope between two points";
      hint = "Slope m = (y₂ − y₁) / (x₂ − x₁).";
      explanation =
        "Slope measures steepness: change in y over change in x between two points.";
      example =
        "Example: (1,2) and (3,6) → m = (6−2)/(3−1) = 4/2 = 2.";
    } else {
      // midpoint between two points
      const x1 = randomInt(-10, 10);
      const y1 = randomInt(-10, 10);
      const x2 = randomInt(-10, 10);
      const y2 = randomInt(-10, 10);

      const mx = (x1 + x2) / 2;
      const my = (y1 + y2) / 2;
      text =
        `Find the midpoint of the segment with endpoints (${x1}, ${y1}) and (${x2}, ${y2}).\nGive your answer as two numbers: x then y, separated by a comma.`;
      // answer as "mx,my"
      answer = `${mx},${my}`;
      concept = "Midpoint of a segment";
      hint = "Average the x-coordinates and average the y-coordinates.";
      explanation =
        "The midpoint is halfway between the endpoints, so take the mean of the x-values and the mean of the y-values.";
      example =
        "Example: endpoints (0,0) and (4,6) → midpoint is ( (0+4)/2 , (0+6)/2 ) = (2,3).";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 10: Transformations Advanced ----
  window.buildTransformationsAdvancedQuestion = function (ctx) {
    const type = randomInt(1, 2);
    let text, answer, concept, hint, explanation, example;

    if (type === 1) {
      text =
        "A rotation of 90° counterclockwise about the origin sends point (x, y) to what new coordinates?\nAnswer in the form x→?, y→?.";
      answer = "x→-y,y→x";
      concept = "Rotation 90° CCW about origin";
      hint = "Think: (1,0) goes to (0,1).";
      explanation =
        "A 90° counterclockwise rotation about the origin sends (x, y) to (−y, x).";
      example =
        "Example: (2,3) → (−3,2).";
    } else {
      text =
        "Under a dilation with center at the origin and scale factor k = 3, what happens to a point (x, y)?\nAnswer in the form x→?, y→?.";
      answer = "x→3x,y→3y";
      concept = "Dilation from origin";
      hint = "All distances from the origin are multiplied by the scale factor.";
      explanation =
        "A dilation with scale factor k multiplies all coordinates by k; (x, y) becomes (kx, ky).";
      example =
        "Example: (2, −1) with k = 3 becomes (6, −3).";
    }

    return { text, answer, concept, hint, explanation, example };
  };

  // ---- Grade 10: Right Triangle Trigonometry Intro ----
  window.buildRightTriangleTrigIntroQuestion = function(ctx){
    const type = randomInt(1,3);
    let text, answer, concept, hint, explanation, example;

    // Use nice Pythagorean triples to keep ratios clean
    const triples = [
      [3,4,5],
      [5,12,13],
      [8,15,17]
    ];
    const [a,b,c] = randomChoice(triples); // legs a,b, hyp c

    if(type === 1){
      text =
        `In a right triangle, an acute angle θ has opposite side length ${a} and hypotenuse length ${c}.\n` +
        `What is sin(θ)? Give your answer as a simplified fraction.`;
      const g = gcd(a,c);
      const num = a / g;
      const den = c / g;
      answer = `${num}/${den}`;
      concept = "Sine ratio in a right triangle";
      hint = "sin(θ) = opposite / hypotenuse.";
      explanation = "In right triangle trigonometry, sine of an acute angle equals the length of the side opposite the angle divided by the hypotenuse.";
      example = "Example: opposite=3, hyp=5 → sin(θ)=3/5.";
    } else if(type === 2){
      text =
        `In a right triangle, an acute angle θ has adjacent side length ${b} and hypotenuse length ${c}.\n` +
        `What is cos(θ)? Give your answer as a simplified fraction.`;
      const g = gcd(b,c);
      const num = b / g;
      const den = c / g;
      answer = `${num}/${den}`;
      concept = "Cosine ratio in a right triangle";
      hint = "cos(θ) = adjacent / hypotenuse.";
      explanation = "Cosine of an acute angle in a right triangle equals the adjacent side over the hypotenuse.";
      example = "Example: adjacent=4, hyp=5 → cos(θ)=4/5.";
    } else {
      text =
        `In a right triangle, an acute angle θ has opposite side length ${a} and adjacent side length ${b}.\n` +
        `What is tan(θ)? Give your answer as a simplified fraction.`;
      const g = gcd(a,b);
      const num = a / g;
      const den = b / g;
      answer = `${num}/${den}`;
      concept = "Tangent ratio in a right triangle";
      hint = "tan(θ) = opposite / adjacent.";
      explanation = "Tangent of an acute angle equals the opposite side divided by the adjacent side.";
      example = "Example: opposite=3, adjacent=4 → tan(θ)=3/4.";
    }

    return { text, answer, concept, hint, explanation, example };
  };

})();

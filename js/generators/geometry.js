// js/generators/geometry.js
// Geometry generators – currently focused on Grade 4 Angles & Symmetry.

(function () {
  function randInt(a, b) {
    a = Math.ceil(a);
    b = Math.floor(b);
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  // Grade 4 – Angles & Symmetry
  window.buildG4GeometryAnglesSymmetryQuestion = function (opts) {
    const level = Math.max(1, Math.min(100, Number(opts.number) || 1));
    const mode =
      level <= 40 ? "angle_type" : level <= 75 ? "measure" : "symmetry";

    if (mode === "angle_type") {
      const types = [
        { name: "acute", desc: "less than 90°" },
        { name: "right", desc: "exactly 90°" },
        { name: "obtuse", desc: "more than 90° but less than 180°" },
        { name: "straight", desc: "exactly 180°" },
      ];
      const t = types[randInt(0, types.length - 1)];
      return {
        text: `What type of angle is this: an angle that is ${t.desc}?`,
        answer: t.name,
        concept: "Types of angles",
      };
    }

    if (mode === "measure") {
      const base = randInt(20, 160);
      const rounded = Math.round(base / 5) * 5;
      const type =
        rounded < 90 ? "acute" : rounded === 90 ? "right" : rounded < 180 ? "obtuse" : "straight";
      return {
        text: `An angle measures ${rounded}°. Is it acute, right, obtuse or straight?`,
        answer: type,
        concept: "Classifying angles by measure",
      };
    }

    // symmetry
    const shapes = [
      { name: "equilateral triangle", sym: 3 },
      { name: "square", sym: 4 },
      { name: "rectangle (not a square)", sym: 2 },
      { name: "circle", sym: "infinite" },
    ];
    const s = shapes[randInt(0, shapes.length - 1)];

    if (s.sym === "infinite") {
      return {
        text: `How many lines of symmetry does a ${s.name} have? (answer 'infinite')`,
        answer: "infinite",
        concept: "Lines of symmetry",
      };
    }

    return {
      text: `How many lines of symmetry does a ${s.name} have?`,
      answer: s.sym,
      concept: "Lines of symmetry",
    };
  };
})();

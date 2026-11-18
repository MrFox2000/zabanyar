import units14 from "./units-1-4.mjs";
import units58 from "./units-5-8.mjs";
import a2First from "./units-a2-1.mjs";
import a2Rest from "./units-a2-2.mjs";
import a2Third from "./units-a2-3.mjs";
import a2Fourth from "./units-a2-4.mjs";
import b1First from "./units-b1-1.mjs";
import b1Second from "./units-b1-2.mjs";
import b1Third from "./units-b1-3.mjs";
import b1Fourth from "./units-b1-4.mjs";
import b2First from "./units-b2-1.mjs";
import b2Second from "./units-b2-2.mjs";
import b2Third from "./units-b2-3.mjs";
import b2Fourth from "./units-b2-4.mjs";

/** the graded syllabus, keyed by CEFR level, in reading order */
const a1 = [...units14, ...units58].map((unit) => ({ ...unit, level: "A1" }));
const a2 = [...a2First, ...a2Rest, ...a2Third, ...a2Fourth];

const b1 = [...b1First, ...b1Second, ...b1Third, ...b1Fourth];

const b2 = [...b2First, ...b2Second, ...b2Third, ...b2Fourth];

const levels = { a1, a2, b1, b2 };

export default levels;

import units14 from "./units-1-4.mjs";
import units58 from "./units-5-8.mjs";
import a2First from "./units-a2-1.mjs";
import a2Rest from "./units-a2-2.mjs";
import a2Third from "./units-a2-3.mjs";
import a2Fourth from "./units-a2-4.mjs";

/** the graded syllabus, keyed by CEFR level, in reading order */
const a1 = [...units14, ...units58].map((unit) => ({ ...unit, level: "A1" }));
const a2 = [...a2First, ...a2Rest, ...a2Third, ...a2Fourth];

const levels = { a1, a2 };

export default levels;

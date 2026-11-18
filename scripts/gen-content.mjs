/**
 * Content pipeline for زبان‌یار (build-time, offline).
 *
 * Curated source data lives here; this script expands it into the exercise JSON
 * the app ships with. It is deliberately separate from the app: AI may later
 * generate *drafts* into the same shape, reviewed by a human before publishing.
 * The shipped app never depends on a live model for its core content.
 *
 *   node scripts/gen-content.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "..", "src", "content", "a1");

/* ── curated A1 material ─────────────────────────────────────────────── */
// w: [english, persian, emoji] · b: [sentence with ___, answer, persian]
// o: [correct sentence, persian] · e: [words, wrongIndex, fixed sentence]

const UNITS = [
  {
    id: "a1-u1",
    index: 1,
    titleFa: "شروع و آشنایی",
    titleEn: "First words",
    theme: "orange",
    lessons: [
      {
        slug: "hello-name",
        title: "Hello, I'm…",
        titleFa: "سلام کردن",
        goal: "خودت را معرفی کنی و اسم بپرسی",
        buildsOn: [],
        w: [
          ["hello", "سلام", "👋"],
          ["name", "نام", "🏷️"],
          ["friend", "دوست", "🧑‍🤝‍🧑"],
          ["good", "خوب", "👍"],
          ["morning", "صبح", "🌅"],
        ],
        b: [
          ["___ morning!", "Good", "صبح بخیر!"],
          ["My ___ is Ali.", "name", "اسم من علی است."],
        ],
        o: [["My name is Ali.", "اسم من علی است."]],
        e: [[["Hello,", "my", "name", "are", "Sara."], 3, "Hello, my name is Sara."]],
        tip: { title: "am / is / are", body: "با I از am استفاده کن، با he/she/it از is و با you/we/they از are." },
        say: [["Hi, my name is Ali.", "سلام، اسم من علی است."]],
      },
      {
        slug: "from-jobs",
        title: "Where are you from?",
        titleFa: "اهل کجایی؟",
        goal: "بگویی اهل کجایی و شغلت چیست",
        buildsOn: ["hello-name"],
        w: [
          ["from", "از", "📍"],
          ["country", "کشور", "🌍"],
          ["Iran", "ایران", "🇮🇷"],
          ["job", "شغل", "💼"],
          ["student", "دانش‌آموز", "🎒"],
        ],
        b: [
          ["I am ___ Iran.", "from", "من اهل ایران هستم."],
          ["She is a ___.", "student", "او دانش‌آموز است."],
        ],
        o: [["Where are you from?", "تو اهل کجایی؟"]],
        e: [[["He", "are", "a", "student."], 1, "He is a student."]],
        tip: { title: "I am from…", body: "برای گفتن ملیت یا شهر از from استفاده می‌کنیم: I am from Iran." },
        say: [["I am from Iran.", "من اهل ایران هستم."]],
      },
      {
        slug: "numbers-age",
        title: "Numbers and age",
        titleFa: "عددها و سن",
        goal: "تا ده بشماری و سنت را بگویی",
        buildsOn: ["hello-name"],
        w: [
          ["one", "یک", "1️⃣"],
          ["two", "دو", "2️⃣"],
          ["five", "پنج", "5️⃣"],
          ["ten", "ده", "🔟"],
          ["year", "سال", "📅"],
        ],
        b: [
          ["I am ten ___ old.", "years", "من ده ساله هستم."],
          ["I have ___ cats.", "two", "من دو گربه دارم."],
        ],
        o: [["How old are you?", "چند سال داری؟"]],
        e: [[["I", "have", "five", "cat."], 3, "I have five cats."]],
        tip: { title: "جمع بستن", body: "وقتی تعداد بیشتر از یکی است، اسم جمع می‌شود: two cats، five years." },
        say: [["I am twenty years old.", "من بیست ساله هستم."]],
      },
      {
        slug: "polite",
        title: "Please and thank you",
        titleFa: "ادب روزمره",
        goal: "مؤدبانه درخواست کنی و تشکر کنی",
        buildsOn: ["hello-name"],
        w: [
          ["please", "لطفاً", "🙏"],
          ["thanks", "ممنون", "💐"],
          ["sorry", "ببخشید", "😔"],
          ["yes", "بله", "✅"],
          ["no", "نه", "❌"],
        ],
        b: [
          ["___, can I sit here?", "Please", "لطفاً، می‌توانم اینجا بنشینم؟"],
          ["Yes, ___ you.", "thank", "بله، ممنون."],
        ],
        o: [["Thank you very much.", "خیلی ممنون."]],
        e: [[["Please", "help", "I", "."], 2, "Please help me."]],
        tip: { title: "سه کلمهٔ جادویی", body: "Please برای درخواست، Thank you برای تشکر و Sorry برای عذرخواهی." },
        say: [["Excuse me, can you help me, please?", "ببخشید، می‌توانید کمکم کنید، لطفاً؟"]],
      },
    ],
  },
  {
    id: "a1-u2",
    index: 2,
    titleFa: "خانواده و آدم‌ها",
    titleEn: "Family and people",
    theme: "coral",
    lessons: [
      {
        slug: "family",
        title: "My family",
        titleFa: "خانوادهٔ من",
        goal: "اعضای خانواده را معرفی کنی",
        buildsOn: ["a1-u1-hello-name"],
        w: [
          ["mother", "مادر", "👩"],
          ["father", "پدر", "👨"],
          ["sister", "خواهر", "👧"],
          ["brother", "برادر", "👦"],
          ["family", "خانواده", "👨‍👩‍👧"],
        ],
        b: [
          ["This is my ___.", "mother", "این مادرم است."],
          ["I have one ___.", "brother", "من یک برادر دارم."],
        ],
        o: [["I have a big family.", "من یک خانوادهٔ بزرگ دارم."]],
        e: [[["This", "are", "my", "sister."], 1, "This is my sister."]],
        tip: { title: "This is…", body: "برای معرفی یک نفر از This is استفاده کن: This is my father." },
        say: [["This is my family.", "این خانوادهٔ من است."]],
      },
      {
        slug: "have-got",
        title: "I have a pet",
        titleFa: "داشتن",
        goal: "بگویی چه چیزی داری",
        buildsOn: ["family"],
        w: [
          ["have", "داشتن", "🤲"],
          ["has", "دارد", "👉"],
          ["pet", "حیوان خانگی", "🐾"],
          ["cat", "گربه", "🐱"],
          ["dog", "سگ", "🐕"],
        ],
        b: [
          ["I ___ two cats.", "have", "من دو گربه دارم."],
          ["She ___ a dog.", "has", "او یک سگ دارد."],
        ],
        o: [["My sister has a pet.", "خواهرم یک حیوان خانگی دارد."]],
        e: [[["She", "have", "a", "cat."], 1, "She has a cat."]],
        tip: { title: "have یا has", body: "با I/you/we/they از have و با he/she/it از has استفاده می‌کنیم." },
        say: [["I have a cat and a dog.", "من یک گربه و یک سگ دارم."]],
      },
      {
        slug: "describe",
        title: "Describing people",
        titleFa: "توصیف آدم‌ها",
        goal: "ظاهر و اخلاق آدم‌ها را توصیف کنی",
        buildsOn: ["family"],
        w: [
          ["tall", "قدبلند", "📏"],
          ["kind", "مهربان", "💚"],
          ["funny", "بامزه", "😄"],
          ["young", "جوان", "🧒"],
          ["happy", "شاد", "😊"],
        ],
        b: [
          ["My father is very ___.", "kind", "پدرم خیلی مهربان است."],
          ["She is tall and ___.", "funny", "او قدبلند و بامزه است."],
        ],
        o: [["She is kind and funny.", "او مهربان و بامزه است."]],
        e: [[["My", "mother", "are", "kind."], 2, "My mother is kind."]],
        tip: { title: "صفت بعد از is", body: "صفت همیشه بعد از فعل to be می‌آید: He is tall. She is kind." },
        say: [["My brother is young and funny.", "برادرم جوان و بامزه است."]],
      },
      {
        slug: "possessives",
        title: "My, your, his, her",
        titleFa: "مالِ کی؟",
        goal: "بگویی چیزی مال چه کسی است",
        buildsOn: ["family", "a1-u1-hello-name"],
        w: [
          ["my", "مال من", "🙋"],
          ["your", "مال تو", "🫵"],
          ["his", "مال او (مرد)", "👨"],
          ["her", "مال او (زن)", "👩"],
          ["our", "مال ما", "👨‍👩‍👦"],
        ],
        b: [
          ["This is ___ book.", "my", "این کتاب من است."],
          ["___ name is Sara.", "Her", "اسم او ساراست."],
        ],
        o: [["What is your name?", "اسم تو چیست؟"]],
        e: [[["His", "name", "are", "Reza."], 2, "His name is Reza."]],
        tip: { title: "his و her", body: "برای مرد his و برای زن her: his car, her bag." },
        say: [["Her brother is my friend.", "برادر او دوست من است."]],
      },
    ],
  },
  {
    id: "a1-u3",
    index: 3,
    titleFa: "روزمره",
    titleEn: "Every day",
    theme: "mint",
    lessons: [
      {
        slug: "routine",
        title: "My day",
        titleFa: "روز من",
        goal: "کارهای روزانه‌ات را بگویی",
        buildsOn: ["a1-u2-have-got"],
        w: [
          ["wake up", "بیدار شدن", "⏰"],
          ["work", "کار کردن", "💻"],
          ["eat", "خوردن", "🍽️"],
          ["sleep", "خوابیدن", "😴"],
          ["study", "درس خواندن", "📚"],
        ],
        b: [
          ["I ___ breakfast at eight.", "eat", "من ساعت هشت صبحانه می‌خورم."],
          ["I ___ English every day.", "study", "من هر روز انگلیسی می‌خوانم."],
        ],
        o: [["I wake up at seven.", "من ساعت هفت بیدار می‌شوم."]],
        e: [[["I", "wakes", "up", "at", "seven."], 1, "I wake up at seven."]],
        tip: { title: "ترتیب روز", body: "wake up → eat → work → study → sleep. همین ترتیب را حفظ کن." },
        say: [["I wake up, eat breakfast and go to work.", "بیدار می‌شوم، صبحانه می‌خورم و سر کار می‌روم."]],
      },
      {
        slug: "present-simple",
        title: "Every day and always",
        titleFa: "حال ساده",
        goal: "از کارهای همیشگی حرف بزنی",
        buildsOn: ["routine"],
        w: [
          ["go", "رفتن", "🚶"],
          ["like", "دوست داشتن", "❤️"],
          ["live", "زندگی کردن", "🏠"],
          ["play", "بازی کردن", "⚽"],
          ["do", "انجام دادن", "🛠️"],
        ],
        b: [
          ["He ___ in Tehran.", "lives", "او در تهران زندگی می‌کند."],
          ["They ___ football.", "play", "آن‌ها فوتبال بازی می‌کنند."],
        ],
        o: [["She goes to work by bus.", "او با اتوبوس سر کار می‌رود."]],
        e: [[["He", "go", "to", "work."], 1, "He goes to work."]],
        tip: { title: "s سوم‌شخص", body: "با he/she/it به فعل s اضافه می‌شود: he goes, she likes." },
        say: [["She lives in Tehran and works every day.", "او در تهران زندگی می‌کند و هر روز کار می‌کند."]],
      },
      {
        slug: "time",
        title: "What time is it?",
        titleFa: "ساعت و وقت",
        goal: "ساعت و بخش‌های روز را بگویی",
        buildsOn: ["a1-u1-numbers-age"],
        w: [
          ["morning", "صبح", "🌅"],
          ["evening", "عصر", "🌇"],
          ["night", "شب", "🌙"],
          ["time", "زمان", "⏱️"],
          ["clock", "ساعت دیواری", "🕰️"],
        ],
        b: [
          ["Good ___, have a nice day.", "morning", "صبح بخیر، روز خوبی داشته باشی."],
          ["I study at ___ every day.", "night", "من هر شب درس می‌خوانم."],
        ],
        o: [["What time is it now?", "الان ساعت چند است؟"]],
        e: [[["What", "time", "are", "it?"], 2, "What time is it?"]],
        tip: { title: "سه بخش روز", body: "morning تا ظهر، afternoon بعد از ظهر، evening و night بعد از غروب." },
        say: [["I work from morning to evening.", "من از صبح تا عصر کار می‌کنم."]],
      },
      {
        slug: "frequency",
        title: "How often?",
        titleFa: "قیدهای تکرار",
        goal: "بگویی هر چند وقت یک بار کاری می‌کنی",
        buildsOn: ["present-simple"],
        w: [
          ["often", "اغلب", "🔁"],
          ["rarely", "به‌ندرت", "🌘"],
          ["twice", "دو بار", "✌️"],
          ["once", "یک بار", "1️⃣"],
          ["early", "زود", "🐓"],
        ],
        b: [
          ["I ___ go to the gym.", "often", "من اغلب به باشگاه می‌روم."],
          ["She gets up ___.", "early", "او زود بیدار می‌شود."],
        ],
        o: [["I usually study at night.", "من معمولاً شب درس می‌خوانم."]],
        e: [[["He", "usually", "studys", "English."], 2, "He usually studies English."]],
        tip: { title: "جای قید", body: "قید تکرار قبل از فعل اصلی می‌آید: I always eat rice." },
        say: [["I go to the gym twice a week.", "من هفته‌ای دو بار به باشگاه می‌روم."]],
      },
    ],
  },
  {
    id: "a1-u4",
    index: 4,
    titleFa: "خوراک و خرید",
    titleEn: "Food and shopping",
    theme: "sky",
    lessons: [
      {
        slug: "food",
        title: "At the table",
        titleFa: "سر سفره",
        goal: "خوراکی‌های روزمره را بشناسی",
        buildsOn: ["a1-u3-routine"],
        w: [
          ["bread", "نان", "🍞"],
          ["milk", "شیر", "🥛"],
          ["apple", "سیب", "🍎"],
          ["rice", "برنج", "🍚"],
          ["water", "آب", "💧"],
        ],
        b: [
          ["I drink ___ every day.", "water", "من هر روز آب می‌نوشم."],
          ["We eat ___ with lunch.", "rice", "ما ناهار برنج می‌خوریم."],
        ],
        o: [["I want some water, please.", "لطفاً کمی آب می‌خواهم."]],
        e: [[["I", "drink", "bread", "every", "day."], 2, "I drink water every day."]],
        tip: { title: "eat یا drink", body: "خوراکی را eat و نوشیدنی را drink: eat bread, drink milk." },
        say: [["I eat bread and drink milk for breakfast.", "صبحانه نان می‌خورم و شیر می‌نوشم."]],
      },
      {
        slug: "some-any",
        title: "Some and any",
        titleFa: "some و any",
        goal: "دربارهٔ مقدار حرف بزنی",
        buildsOn: ["food"],
        w: [
          ["some", "مقداری", "➕"],
          ["any", "هیچ / مقداری (سؤالی)", "❓"],
          ["much", "زیاد (بی‌شمار)", "📈"],
          ["many", "زیاد (شمارش‌شدنی)", "🔢"],
          ["bottle", "بطری", "🍾"],
        ],
        b: [
          ["Do you have ___ apples?", "any", "سیب داری؟"],
          ["I have ___ bread.", "some", "من کمی نان دارم."],
        ],
        o: [["How much water do you drink?", "چقدر آب می‌نوشی؟"]],
        e: [[["I", "don't", "have", "some", "money."], 3, "I don't have any money."]],
        tip: { title: "some یا any", body: "در جملهٔ مثبت some و در منفی و سؤالی any: I have some rice / I don't have any rice." },
        say: [["I have some milk, but I don't have any water.", "کمی شیر دارم ولی آب ندارم."]],
      },
      {
        slug: "cafe",
        title: "At the café",
        titleFa: "در کافه",
        goal: "سفارش بدهی و صورت‌حساب بخواهی",
        buildsOn: ["food", "a1-u1-polite"],
        w: [
          ["menu", "منو", "📋"],
          ["coffee", "قهوه", "☕"],
          ["tea", "چای", "🍵"],
          ["bill", "صورت‌حساب", "🧾"],
          ["order", "سفارش دادن", "📝"],
        ],
        b: [
          ["Can I have the ___, please?", "bill", "لطفاً صورت‌حساب را می‌دهید؟"],
          ["I would like a ___.", "coffee", "من یک قهوه می‌خواهم."],
        ],
        o: [["Can I have a coffee, please?", "لطفاً یک قهوه می‌دهید؟"]],
        e: [[["I", "like", "would", "a", "tea."], 1, "I would like a tea."]],
        tip: { title: "مؤدبانه سفارش دادن", body: "I would like… مؤدبانه‌تر از I want است: I would like a tea." },
        say: [["I would like a tea and the bill, please.", "لطفاً یک چای و صورت‌حساب می‌خواهم."]],
      },
      {
        slug: "prices",
        title: "How much is it?",
        titleFa: "قیمت و پول",
        goal: "قیمت بپرسی و بگویی گران است",
        buildsOn: ["a1-u1-numbers-age"],
        w: [
          ["price", "قیمت", "🏷️"],
          ["cheap", "ارزان", "🪙"],
          ["expensive", "گران", "💸"],
          ["dollar", "دلار", "💵"],
          ["money", "پول", "💳"],
        ],
        b: [
          ["How ___ is it?", "much", "قیمتش چقدر است؟"],
          ["It is too ___.", "expensive", "خیلی گران است."],
        ],
        o: [["This shirt is very expensive.", "این پیراهن خیلی گران است."]],
        e: [[["How", "many", "is", "this", "book?"], 1, "How much is this book?"]],
        tip: { title: "How much", body: "برای قیمت How much is it? و برای تعداد How many?" },
        say: [["How much is this bag? It is too expensive.", "این کیف چند است؟ خیلی گران است."]],
      },
    ],
  },
  {
    id: "a1-u5",
    index: 5,
    titleFa: "شهر و مسیر",
    titleEn: "In the city",
    theme: "gold",
    lessons: [
      {
        slug: "places",
        title: "Places in town",
        titleFa: "جاهای شهر",
        goal: "جاهای مهم شهر را نام ببری",
        buildsOn: ["a1-u3-routine"],
        w: [
          ["bank", "بانک", "🏦"],
          ["park", "پارک", "🌳"],
          ["shop", "مغازه", "🏪"],
          ["hospital", "بیمارستان", "🏥"],
          ["street", "خیابان", "🛣️"],
        ],
        b: [
          ["The ___ is near the park.", "bank", "بانک نزدیک پارک است."],
          ["I go to the ___ every day.", "shop", "من هر روز به مغازه می‌روم."],
        ],
        o: [["Is there a bank near here?", "اینجا نزدیک بانک هست؟"]],
        e: [[["The", "park", "are", "big."], 2, "The park is big."]],
        tip: { title: "the", body: "وقتی از یک جای مشخص حرف می‌زنی از the استفاده کن: the bank, the park." },
        say: [["There is a shop in my street.", "در خیابان من یک مغازه هست."]],
      },
      {
        slug: "there-is",
        title: "There is / There are",
        titleFa: "هست / هستند",
        goal: "بگویی چیزی جایی هست",
        buildsOn: ["places"],
        w: [
          ["there", "آنجا", "👉"],
          ["near", "نزدیک", "📍"],
          ["next to", "کنارِ", "↔️"],
          ["between", "بینِ", "↕️"],
          ["here", "اینجا", "🫱"],
        ],
        b: [
          ["___ is a park near my house.", "There", "نزدیک خانهٔ من یک پارک هست."],
          ["The shop is ___ the bank.", "next to", "مغازه کنار بانک است."],
        ],
        o: [["There is a hospital near here.", "اینجا نزدیک یک بیمارستان هست."]],
        e: [[["There", "is", "two", "banks."], 1, "There are two banks."]],
        tip: { title: "is یا are", body: "برای یک چیز There is و برای چند چیز There are: There is a park / There are two parks." },
        say: [["There is a café next to the bank.", "کنار بانک یک کافه هست."]],
      },
      {
        slug: "directions",
        title: "Which way?",
        titleFa: "مسیر پرسیدن",
        goal: "راه را بپرسی و مسیر بدهی",
        buildsOn: ["places"],
        w: [
          ["left", "چپ", "⬅️"],
          ["right", "راست", "➡️"],
          ["straight", "مستقیم", "⬆️"],
          ["turn", "پیچیدن", "↩️"],
          ["far", "دور", "🛣️"],
        ],
        b: [
          ["Go ___ ahead.", "straight", "مستقیم برو جلو."],
          ["___ left at the bank.", "Turn", "سر بانک به چپ بپیچ."],
        ],
        o: [["Turn right at the park.", "سر پارک به راست بپیچ."]],
        e: [[["Go", "straight", "and", "turn", "left", "in", "the", "bank"], 5, "Go straight and turn left at the bank."]],
        tip: { title: "at", body: "نقطهٔ پیچیدن با at می‌آید: turn left at the bank." },
        say: [["Go straight, then turn right.", "مستقیم برو، بعد به راست بپیچ."]],
      },
      {
        slug: "prepositions",
        title: "In, on, under",
        titleFa: "حروف مکان",
        goal: "بگویی چیزی کجاست",
        buildsOn: ["places"],
        w: [
          ["in", "در / داخل", "📥"],
          ["on", "روی", "🔝"],
          ["under", "زیر", "⬇️"],
          ["behind", "پشت", "🔙"],
          ["in front of", "جلوی", "🔜"],
        ],
        b: [
          ["The cat is ___ the table.", "under", "گربه زیر میز است."],
          ["My keys are ___ my bag.", "in", "کلیدهایم داخل کیفم هستند."],
        ],
        o: [["The book is on the table.", "کتاب روی میز است."]],
        e: [[["The", "keys", "is", "in", "the", "bag."], 2, "The keys are in the bag."]],
        tip: { title: "in / on / under", body: "in داخل، on روی سطح و under زیر چیزی." },
        say: [["My phone is on the table, behind the cup.", "گوشی‌ام روی میز، پشت فنجان است."]],
      },
    ],
  },
  {
    id: "a1-u6",
    index: 6,
    titleFa: "کار و وقت",
    titleEn: "Work and time",
    theme: "orange",
    lessons: [
      {
        slug: "jobs",
        title: "What do you do?",
        titleFa: "شغل‌ها",
        goal: "شغل خودت و دیگران را بگویی",
        buildsOn: ["a1-u1-from-jobs"],
        w: [
          ["doctor", "پزشک", "🩺"],
          ["driver", "راننده", "🚗"],
          ["cook", "آشپز", "👨‍🍳"],
          ["engineer", "مهندس", "🛠️"],
          ["nurse", "پرستار", "💉"],
        ],
        b: [
          ["She is a ___.", "doctor", "او پزشک است."],
          ["He works as an ___.", "engineer", "او به‌عنوان مهندس کار می‌کند."],
        ],
        o: [["My father is a driver.", "پدرم راننده است."]],
        e: [[["She", "is", "a", "nurses."], 3, "She is a nurse."]],
        tip: { title: "a / an", body: "قبل از حرف صدادار an و قبل از حرف بی‌صدا a: an engineer, a doctor." },
        say: [["I am a cook and my sister is a nurse.", "من آشپزم و خواهرم پرستار است."]],
      },
      {
        slug: "present-continuous",
        title: "Right now",
        titleFa: "حال استمراری",
        goal: "بگویی الان چه کار می‌کنی",
        buildsOn: ["a1-u3-present-simple"],
        w: [
          ["now", "الان", "⌛"],
          ["working", "در حال کار", "💼"],
          ["going", "در حال رفتن", "🚶"],
          ["doing", "در حال انجام", "🛠️"],
          ["waiting", "در حال انتظار", "⏳"],
        ],
        b: [
          ["I am ___ for the bus.", "waiting", "من منتظر اتوبوس هستم."],
          ["She is ___ now.", "working", "او الان مشغول کار است."],
        ],
        o: [["He is working right now.", "او همین الان مشغول کار است."]],
        e: [[["She", "are", "working", "now."], 1, "She is working now."]],
        tip: { title: "am/is/are + ing", body: "کاری که همین حالا در جریان است: I am working, she is waiting." },
        say: [["I am going home now.", "من الان دارم به خانه می‌روم."]],
      },
      {
        slug: "days",
        title: "Days of the week",
        titleFa: "روزهای هفته",
        goal: "روزها و برنامهٔ هفته را بگویی",
        buildsOn: ["a1-u3-time"],
        w: [
          ["Monday", "دوشنبه", "1️⃣"],
          ["Sunday", "یکشنبه", "🌞"],
          ["week", "هفته", "🗓️"],
          ["month", "ماه", "📆"],
          ["weekend", "آخر هفته", "🎉"],
        ],
        b: [
          ["I work from ___ to Friday.", "Monday", "من از دوشنبه تا جمعه کار می‌کنم."],
          ["The ___ is for family.", "weekend", "آخر هفته برای خانواده است."],
        ],
        o: [["I am free on Sunday.", "من یکشنبه آزاد هستم."]],
        e: [[["I", "have", "a", "meeting", "in", "Monday."], 4, "I have a meeting on Monday."]],
        tip: { title: "on + روز", body: "روزهای هفته با on می‌آیند: on Monday, on Friday." },
        say: [["I work on Monday and rest on the weekend.", "دوشنبه کار می‌کنم و آخر هفته استراحت."]],
      },
      {
        slug: "plans",
        title: "Making plans",
        titleFa: "قرار گذاشتن",
        goal: "قرار بگذاری و بگویی آزادی یا مشغولی",
        buildsOn: ["present-continuous"],
        w: [
          ["meeting", "جلسه", "🤝"],
          ["free", "آزاد", "🕊️"],
          ["busy", "مشغول", "🚧"],
          ["tonight", "امشب", "🌃"],
          ["tomorrow", "فردا", "➡️"],
        ],
        b: [
          ["Are you ___ tonight?", "free", "امشب آزادی؟"],
          ["I am sorry, I am ___.", "busy", "متأسفم، سرم شلوغ است."],
        ],
        o: [["Can we meet tomorrow?", "می‌توانیم فردا همدیگر را ببینیم؟"]],
        e: [[["What", "are", "you", "do", "tonight?"], 3, "What are you doing tonight?"]],
        tip: { title: "قرار گذاشتن", body: "برای پیشنهاد قرار: Can we meet…? و برای پرسیدن برنامه: What are you doing…?" },
        say: [["I am busy tonight, but I am free tomorrow.", "امشب سرم شلوغ است، ولی فردا آزادم."]],
      },
    ],
  },
  {
    id: "a1-u7",
    index: 7,
    titleFa: "علاقه‌ها",
    titleEn: "Free time",
    theme: "coral",
    lessons: [
      {
        slug: "hobbies",
        title: "My hobby",
        titleFa: "سرگرمی‌ها",
        goal: "سرگرمی‌هایت را بگویی",
        buildsOn: ["a1-u5-there-is"],
        w: [
          ["reading", "کتاب خواندن", "📖"],
          ["cooking", "آشپزی", "🍳"],
          ["painting", "نقاشی", "🎨"],
          ["hiking", "کوهنوردی", "🥾"],
          ["music", "موسیقی", "🎵"],
        ],
        b: [
          ["My hobby is ___.", "reading", "سرگرمی من کتاب خواندن است."],
          ["I love ___.", "music", "من عاشق موسیقی هستم."],
        ],
        o: [["I like reading books.", "من کتاب خواندن را دوست دارم."]],
        e: [[["I", "like", "read", "books."], 2, "I like reading books."]],
        tip: { title: "like + ing", body: "بعد از like فعل با ing می‌آید: I like reading." },
        say: [["In my free time I like cooking and music.", "در وقت آزادم آشپزی و موسیقی دوست دارم."]],
      },
      {
        slug: "like-ing",
        title: "Love it, hate it",
        titleFa: "دوست داشتن و دوست نداشتن",
        goal: "علاقه‌ات را با فعل ing بگویی",
        buildsOn: ["hobbies"],
        w: [
          ["playing", "بازی کردن", "🎮"],
          ["watching", "تماشا کردن", "📺"],
          ["swimming", "شنا کردن", "🏊"],
          ["running", "دویدن", "🏃"],
          ["cooking", "آشپزی کردن", "🥘"],
        ],
        b: [
          ["I enjoy ___ in the park.", "running", "من از دویدن در پارک لذت می‌برم."],
          ["She loves ___ books.", "reading", "او عاشق کتاب خواندن است."],
        ],
        o: [["I prefer watching films.", "من تماشای فیلم را ترجیح می‌دهم."]],
        e: [[["I", "enjoy", "to", "swim."], 2, "I enjoy swimming."]],
        tip: { title: "enjoy / love / prefer", body: "این فعل‌ها با ing می‌آیند، نه با to: I enjoy swimming." },
        say: [["I enjoy watching films but I hate running.", "از تماشای فیلم لذت می‌برم ولی از دویدن بدم می‌آید."]],
      },
      {
        slug: "sports",
        title: "The match",
        titleFa: "ورزش",
        goal: "دربارهٔ مسابقه و تیم حرف بزنی",
        buildsOn: ["hobbies"],
        w: [
          ["team", "تیم", "👥"],
          ["match", "مسابقه", "🏅"],
          ["win", "بردن", "🏆"],
          ["lose", "باختن", "😞"],
          ["coach", "مربی", "📣"],
        ],
        b: [
          ["Our ___ won the match.", "team", "تیم ما مسابقه را برد."],
          ["I want to ___ the match.", "win", "من می‌خواهم مسابقه را ببرم."],
        ],
        o: [["Our team won the match.", "تیم ما مسابقه را برد."]],
        e: [[["He", "play", "football", "every", "week."], 1, "He plays football every week."]],
        tip: { title: "play + ورزش", body: "با ورزش از play استفاده کن: play football, play tennis." },
        say: [["Our team plays on Friday and our coach is happy.", "تیم ما جمعه بازی می‌کند و مربی‌مان خوشحال است."]],
      },
      {
        slug: "invitations",
        title: "Join us?",
        titleFa: "دعوت کردن",
        goal: "کسی را دعوت کنی و جواب بدهی",
        buildsOn: ["a1-u6-plans"],
        w: [
          ["join", "ملحق شدن", "🤝"],
          ["invite", "دعوت کردن", "✉️"],
          ["maybe", "شاید", "🤔"],
          ["sure", "حتماً", "👍"],
          ["sorry", "متأسفم", "😔"],
        ],
        b: [
          ["Do you want to ___ us?", "join", "می‌خواهی به ما ملحق شوی؟"],
          ["___, I can't come.", "Sorry", "متأسفم، نمی‌توانم بیایم."],
        ],
        o: [["Would you like to join us?", "دوست داری به ما ملحق شوی؟"]],
        e: [[["I", "would", "likes", "to", "come."], 2, "I would like to come."]],
        tip: { title: "دعوت مؤدبانه", body: "Would you like to…? مؤدبانه‌ترین راه دعوت است." },
        say: [["Would you like to join us tonight?", "دوست داری امشب به ما ملحق شوی؟"]],
      },
    ],
  },
  {
    id: "a1-u8",
    index: 8,
    titleFa: "سفر و گذشته",
    titleEn: "Travel and yesterday",
    theme: "mint",
    lessons: [
      {
        slug: "travel",
        title: "At the airport",
        titleFa: "سفر",
        goal: "واژه‌های سفر را بشناسی",
        buildsOn: ["a1-u5-places"],
        w: [
          ["airport", "فرودگاه", "✈️"],
          ["hotel", "هتل", "🏨"],
          ["ticket", "بلیت", "🎫"],
          ["passport", "پاسپورت", "🛂"],
          ["trip", "سفر", "🧳"],
        ],
        b: [
          ["I need a ___ to London.", "ticket", "من یک بلیت به لندن لازم دارم."],
          ["We stayed in a small ___.", "hotel", "ما در یک هتل کوچک ماندیم."],
        ],
        o: [["Where is the airport?", "فرودگاه کجاست؟"]],
        e: [[["I", "need", "a", "tickets."], 3, "I need a ticket."]],
        tip: { title: "a ticket / tickets", body: "یک بلیت a ticket و چند بلیت tickets." },
        say: [["I have my passport and my ticket.", "من پاسپورت و بلیتم را دارم."]],
      },
      {
        slug: "was-were",
        title: "Yesterday",
        titleFa: "بودن در گذشته",
        goal: "بگویی دیروز کجا بودی و چه حالی داشتی",
        buildsOn: ["travel"],
        w: [
          ["was", "بود (مفرد)", "1️⃣"],
          ["were", "بودند", "👥"],
          ["yesterday", "دیروز", "📅"],
          ["ago", "پیش", "⏪"],
          ["last night", "دیشب", "🌙"],
        ],
        b: [
          ["I ___ at home yesterday.", "was", "من دیروز خانه بودم."],
          ["They ___ very happy.", "were", "آن‌ها خیلی خوشحال بودند."],
        ],
        o: [["I was tired last night.", "من دیشب خسته بودم."]],
        e: [[["We", "was", "at", "the", "hotel."], 1, "We were at the hotel."]],
        tip: { title: "was / were", body: "I/he/she/it با was و you/we/they با were." },
        say: [["We were at the hotel two days ago.", "ما دو روز پیش در هتل بودیم."]],
      },
      {
        slug: "past-simple",
        title: "Past simple",
        titleFa: "گذشتهٔ ساده",
        goal: "از کارهای تمام‌شدهٔ دیروز حرف بزنی",
        buildsOn: ["was-were"],
        w: [
          ["went", "رفت", "🚶"],
          ["saw", "دید", "👀"],
          ["ate", "خورد", "🍽️"],
          ["bought", "خرید", "🛍️"],
          ["came", "آمد", "🚪"],
        ],
        b: [
          ["I ___ to the park yesterday.", "went", "من دیروز به پارک رفتم."],
          ["She ___ a new phone.", "bought", "او یک گوشی نو خرید."],
        ],
        o: [["We ate lunch at noon.", "ما ظهر ناهار خوردیم."]],
        e: [[["I", "go", "to", "the", "beach", "yesterday."], 1, "I went to the beach yesterday."]],
        tip: { title: "فعل بی‌قاعده", body: "بعضی فعل‌ها گذشتهٔ بی‌قاعده دارند: go → went, see → saw, eat → ate." },
        say: [["I went to the market and bought bread.", "به بازار رفتم و نان خریدم."]],
      },
      {
        slug: "hotel",
        title: "Checking in",
        titleFa: "در هتل",
        goal: "در هتل اتاق بگیری و کمک بخواهی",
        buildsOn: ["travel"],
        w: [
          ["key", "کلید", "🔑"],
          ["room", "اتاق", "🚪"],
          ["breakfast", "صبحانه", "🥐"],
          ["help", "کمک", "🆘"],
          ["night", "شب", "🌙"],
        ],
        b: [
          ["I would like a ___ for one night.", "room", "من برای یک شب یک اتاق می‌خواهم."],
          ["___ me, please.", "Help", "لطفاً کمکم کنید."],
        ],
        o: [["I would like a room, please.", "لطفاً یک اتاق می‌خواهم."]],
        e: [[["Can", "I", "have", "my", "keys", "please?"], 4, "Can I have my key, please?"]],
        tip: { title: "for one night", body: "مدت اقامت با for می‌آید: for two nights." },
        say: [["I would like a room for two nights, please.", "لطفاً یک اتاق برای دو شب می‌خواهم."]],
      },
    ],
  },
];

/* ── expansion ───────────────────────────────────────────────────────── */

function makeRng(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const hash = (text) => [...text].reduce((acc, ch) => (acc * 31 + ch.codePointAt(0)) % 100000, 7);

const shuffle = (rng, list) => {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

function pickChoices(rng, correct, pool, count) {
  const options = [correct];
  for (const candidate of shuffle(rng, pool)) {
    if (options.length >= count) break;
    if (!options.includes(candidate)) options.push(candidate);
  }
  const ordered = shuffle(rng, options);
  return { choices: ordered, answer: ordered.indexOf(correct) };
}

const lessonIndex = new Map();
for (const unit of UNITS) {
  for (const lesson of unit.lessons) {
    lessonIndex.set(`${unit.id}-${lesson.slug}`, { unit, lesson });
  }
}

function allWords(unit) {
  return unit.lessons.flatMap((l) => l.w);
}

/**
 * Curated data may refer to a prerequisite by bare slug ("family") or by full id
 * ("a1-u1-hello-name"). Everything ships with full ids, so resolve here — a
 * dangling buildsOn would silently lock a lesson forever.
 */
function resolveId(unitId, reference) {
  if (lessonIndex.has(reference)) return reference;
  const sameUnit = `${unitId}-${reference}`;
  if (lessonIndex.has(sameUnit)) return sameUnit;
  return reference;
}

function buildExercises(unit, lesson) {
  const id = `${unit.id}-${lesson.slug}`;
  const rng = makeRng(hash(lesson.slug + unit.id));
  const localEn = lesson.w.map((w) => w[0]);
  const unitFa = [...new Set(allWords(unit).map((w) => w[1]))];
  const unitEn = [...new Set(allWords(unit).map((w) => w[0]))];
  const exercises = [];
  const reviewSource = [];
  for (const prerequisite of lesson.buildsOn) {
    const prereq = resolveId(unit.id, prerequisite);
    const found = lessonIndex.get(prereq);
    if (found) reviewSource.push({ id: prereq, words: found.lesson.w });
  }

  const push = (exercise) => exercises.push({ id: `${id}.${exercises.length + 1}`, ...exercise });

  // 1. meaning of a word
  {
    const word = lesson.w[0];
    const { choices, answer } = pickChoices(rng, word[1], unitFa, 3);
    push({
      kind: "mcq",
      prompt: `معنی «${word[0]}» چیست؟`,
      promptFa: word[1],
      choices,
      answer,
      speak: word[0],
      aiHints: {
        example: `I know the word "${word[0]}".`,
        explanation: `«${word[0]}» یعنی ${word[1]}.`,
      },
    });
  }

  // 2. picture → word
  {
    const word = lesson.w[1];
    const { choices, answer } = pickChoices(rng, word[0], localEn.length > 2 ? localEn : unitEn, 3);
    push({
      kind: "imageWord",
      prompt: "این تصویر کدام کلمه است؟",
      emoji: word[2],
      choices,
      answer,
      speak: word[0],
    });
  }

  // 3. listening
  {
    const word = lesson.w[2];
    const { choices, answer } = pickChoices(rng, word[0], unitEn, 3);
    push({
      kind: "listen",
      prompt: "چه شنیدی؟",
      speak: word[0],
      choices,
      answer,
    });
  }

  // 4. match pairs
  {
    const pairs = lesson.w.slice(0, 4).map(([en, fa]) => ({ en, fa }));
    push({ kind: "match", prompt: "هر کلمه را به معنی‌اش وصل کن", pairs: shuffle(rng, pairs) });
  }

  // 5. fill the blank
  {
    const [sentence, answerWord, fa] = lesson.b[0];
    const { choices, answer } = pickChoices(rng, answerWord, [...unitEn, ...localEn], 3);
    push({
      kind: "fillBlank",
      prompt: "جای خالی را پر کن",
      promptFa: fa,
      sentence,
      choices,
      answer,
    });
  }

  // 6. sentence building
  {
    const [sentence, fa] = lesson.o[0];
    const tokens = shuffle(rng, sentence.replace(/[.!?]$/, "").split(" "));
    push({
      kind: "wordOrder",
      prompt: "جمله را بساز",
      promptFa: fa,
      tokens,
      answer: sentence.replace(/[.!?]$/, ""),
    });
  }

  // 7. spot the mistake
  {
    const [words, wrongIndex, fix] = lesson.e[0];
    push({
      kind: "spotError",
      prompt: "کدام کلمه غلط است؟",
      words,
      answer: wrongIndex,
      fix,
      aiHints: { explanation: `درستش این است: ${fix}` },
    });
  }

  // 8. speed round
  {
    const word = lesson.w[4];
    const other = unitFa.find((fa) => fa !== word[1]) ?? "—";
    const ordered = shuffle(rng, [word[1], other]);
    push({
      kind: "speed",
      prompt: `سریع! «${word[0]}» یعنی چه؟`,
      speak: word[0],
      choices: ordered,
      answer: ordered.indexOf(word[1]),
      ms: 6000,
    });
  }

  // 9–12. interleaved review: 30–40% of the lesson re-uses the prerequisites
  const reviewCount = lesson.buildsOn.length > 0 ? 4 : 1;
  for (let i = 0; i < reviewCount; i += 1) {
    if (reviewSource.length > 0) {
      const source = reviewSource[i % reviewSource.length];
      const word = source.words[(i + 1) % source.words.length];
      const kind = ["mcq", "listen", "imageWord", "speed"][i % 4];
      if (kind === "mcq") {
        const { choices, answer } = pickChoices(rng, word[1], unitFa, 3);
        push({
          kind: "mcq",
          prompt: `یادت هست؟ معنی «${word[0]}»`,
          choices,
          answer,
          speak: word[0],
          reviewOf: source.id,
        });
      } else if (kind === "listen") {
        const { choices, answer } = pickChoices(rng, word[0], unitEn, 3);
        push({ kind: "listen", prompt: "مرور — چه شنیدی؟", speak: word[0], choices, answer, reviewOf: source.id });
      } else if (kind === "imageWord") {
        const { choices, answer } = pickChoices(rng, word[0], unitEn, 3);
        push({
          kind: "imageWord",
          prompt: "مرور — این تصویر کدام کلمه است؟",
          emoji: word[2],
          choices,
          answer,
          speak: word[0],
          reviewOf: source.id,
        });
      } else {
        const other = unitFa.find((fa) => fa !== word[1]) ?? "—";
        const ordered = shuffle(rng, [word[1], other]);
        push({
          kind: "speed",
          prompt: `مرور سریع! «${word[0]}»`,
          speak: word[0],
          choices: ordered,
          answer: ordered.indexOf(word[1]),
          ms: 6000,
          reviewOf: source.id,
        });
      }
    } else {
      const word = lesson.w[3];
      const { choices, answer } = pickChoices(rng, word[1], unitFa, 3);
      push({ kind: "mcq", prompt: `معنی «${word[0]}» چیست؟`, choices, answer, speak: word[0] });
    }
  }

  // 11. second blank, if the lesson has one
  if (lesson.b[1]) {
    const [sentence, answerWord, fa] = lesson.b[1];
    const { choices, answer } = pickChoices(rng, answerWord, [...unitEn, ...localEn], 3);
    push({ kind: "fillBlank", prompt: "یک جای خالی دیگر", promptFa: fa, sentence, choices, answer });
  }

  return exercises;
}

function buildBoss(unit) {
  const rng = makeRng(hash(unit.id + "-boss"));
  const pool = unit.lessons.flatMap((l) => l.w);
  const exercises = [];
  const kinds = ["mcq", "listen", "imageWord", "speed", "mcq", "listen", "imageWord", "speed", "mcq", "listen"];

  for (let i = 0; i < 10; i += 1) {
    const word = pool[(i * 3 + 1) % pool.length];
    const kind = kinds[i];
    const en = [...new Set(pool.map((w) => w[0]))];
    const fa = [...new Set(pool.map((w) => w[1]))];
    const id = `${unit.id}-boss.${i + 1}`;

    if (kind === "mcq" || kind === "speed") {
      const { choices, answer } = pickChoices(rng, word[1], fa, kind === "speed" ? 2 : 3);
      exercises.push({
        id,
        kind,
        prompt: kind === "speed" ? `سریع! «${word[0]}»` : `معنی «${word[0]}»`,
        speak: word[0],
        choices,
        answer,
        ...(kind === "speed" ? { ms: 5000 } : {}),
      });
    } else if (kind === "listen") {
      const { choices, answer } = pickChoices(rng, word[0], en, 3);
      exercises.push({ id, kind, prompt: "چه شنیدی؟", speak: word[0], choices, answer });
    } else {
      const { choices, answer } = pickChoices(rng, word[0], en, 3);
      exercises.push({ id, kind, prompt: "این تصویر کدام کلمه است؟", emoji: word[2], choices, answer, speak: word[0] });
    }
  }

  return {
    id: `${unit.id}-boss`,
    titleFa: `نبرد پایانی — ${unit.titleFa}`,
    hp: 10,
    seconds: 120,
    rewardXp: 120,
    exercises,
  };
}

mkdirSync(outDir, { recursive: true });
let totalExercises = 0;
const manifest = [];

UNITS.forEach((unit, position) => {
  const lessons = unit.lessons.map((lesson) => {
    const exercises = buildExercises(unit, lesson);
    totalExercises += exercises.length;
    return {
      id: `${unit.id}-${lesson.slug}`,
      title: lesson.title,
      titleFa: lesson.titleFa,
      goal: lesson.goal,
      buildsOn: lesson.buildsOn.map((reference) => resolveId(unit.id, reference)),
      exercises,
      youCanSay: lesson.say.map(([en, fa]) => ({ en, fa })),
      xp: 40 + exercises.length * 4,
      ...(lesson.tip ? { tip: lesson.tip } : {}),
    };
  });

  const payload = {
    id: unit.id,
    level: "A1",
    index: unit.index,
    titleFa: unit.titleFa,
    titleEn: unit.titleEn,
    theme: unit.theme,
    lessons,
    boss: buildBoss(unit),
  };

  const file = `unit-${String(position + 1).padStart(2, "0")}.json`;
  writeFileSync(join(outDir, file), JSON.stringify(payload, null, 2) + "\n", "utf8");
  manifest.push({ file, id: unit.id, lessons: lessons.length, exercises: lessons.reduce((n, l) => n + l.exercises.length, 0) });
});

console.log(JSON.stringify({ units: UNITS.length, totalExercises, manifest }, null, 2));

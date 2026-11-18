/**
 * A1 units 1–4 of the graded syllabus.
 *
 * Order matters more than anything else here: an absolute beginner starts with
 * sounds, then the verb "to be", then pointing at things, then counting, and
 * only then daily verbs. Each lesson teaches ONE small grammar point and re-uses
 * the previous ones.
 *
 * w: [english, persian, emoji]
 * b: [sentence with ___, answer, persian]
 * o: [correct sentence, persian]
 * e: [words, wrongIndex, fixed sentence]
 */

const units = [
  {
    id: "a1-u1",
    index: 1,
    titleFa: "صداها و اولین جمله",
    titleEn: "Sounds and first words",
    theme: "orange",
    lessons: [
      {
        slug: "short-sounds",
        title: "Short sounds",
        titleFa: "صداهای کوتاه",
        goal: "صدای کوتاه a، e، i، o، u را بشناسی",
        buildsOn: [],
        // absolute beginners start with sounds, not sentences
        letters: [
          ["a", "/æ/", "cat", "گربه", "🐱"],
          ["e", "/e/", "bed", "تخت", "🛏️"],
          ["i", "/ɪ/", "sit", "نشستن", "🪑"],
          ["o", "/ɒ/", "dog", "سگ", "🐕"],
          ["u", "/ʌ/", "cup", "فنجان", "☕"],
        ],
        w: [
          ["cat", "گربه", "🐱"],
          ["bed", "تخت", "🛏️"],
          ["sit", "نشستن", "🪑"],
          ["dog", "سگ", "🐕"],
          ["cup", "فنجان", "☕"],
        ],
        b: [
          ["A ___ says meow.", "cat", "گربه میو می‌گوید."],
          ["This is my ___.", "cup", "این فنجان من است."],
        ],
        o: [["This is a cat.", "این یک گربه است."]],
        e: [[["This", "is", "a", "cats."], 3, "This is a cat."]],
        tip: {
          title: "هر صدادار دو صدا دارد",
          body: "هر حرف صدادار یک صدای کوتاه دارد. کلمه‌های cat، bed، sit، dog و cup را بلند بخوان و صدای اولشان را بشنو.",
        },
        say: [["cat, bed, dog", "کلمه‌های یک‌صدایی"]],
      },
      {
        slug: "spell-name",
        title: "Spell your name",
        titleFa: "اسمت را هجی کن",
        goal: "اسمت را حرف‌به‌حرف بگویی",
        buildsOn: ["a1-u1-short-sounds"],
        w: [
          ["spell", "هجی کردن", "✍️"],
          ["name", "نام", "🏷️"],
          ["letter", "حرف", "🔤"],
          ["again", "دوباره", "🔁"],
          ["please", "لطفاً", "🙏"],
        ],
        b: [
          ["How do you ___ your name?", "spell", "اسمت را چطور هجی می‌کنی؟"],
          ["Say it ___, please.", "again", "لطفاً دوباره بگو."],
        ],
        o: [["My name is Sara.", "اسم من ساراست."]],
        e: [[["How", "you", "spell", "your", "name?"], 1, "How do you spell your name?"]],
        tip: {
          title: "۵ حرف صدادار",
          body: "حروف صدادار a، e، i، o، u هستند؛ بقیه بی‌صدا. اسم‌ها را حرف‌به‌حرف هجی می‌کنیم.",
        },
        say: [["How do you spell your name?", "اسمت را چطور هجی می‌کنی؟"]],
      },
      {
        slug: "digraphs",
        title: "sh, ch, th",
        titleFa: "صداهای ترکیبی",
        goal: "صداهای sh، ch، th را بشناسی",
        buildsOn: ["a1-u1-short-sounds"],
        letters: [
          ["sh", "/ʃ/", "she", "او", "👩"],
          ["ch", "/tʃ/", "chair", "صندلی", "🪑"],
          ["th", "/θ/", "three", "سه", "3️⃣"],
        ],
        w: [
          ["she", "او (زن)", "👩"],
          ["chair", "صندلی", "🪑"],
          ["three", "سه", "3️⃣"],
          ["shop", "مغازه", "🏪"],
          ["this", "این", "👉"],
        ],
        b: [
          ["___ is my sister.", "She", "او خواهر من است."],
          ["I have ___ books.", "three", "من سه کتاب دارم."],
        ],
        o: [["This is my chair.", "این صندلی من است."]],
        e: [[["She", "have", "a", "chair."], 1, "She has a chair."]],
        tip: {
          title: "دو حرف، یک صدا",
          body: "گاهی دو حرف با هم یک صدا می‌سازند: sh صدای «ش»، ch صدای «چ» و th صدای نوک زبان بین دندان‌هاست.",
        },
        say: [["This shop has three chairs.", "این مغازه سه صندلی دارد."]],
      },
      {
        slug: "first-sentence",
        title: "I am…",
        titleFa: "اولین جمله",
        goal: "با am / is / are جمله بسازی",
        buildsOn: ["a1-u1-digraphs"],
        w: [
          ["I", "من", "🙋"],
          ["am", "هستم", "🟢"],
          ["you", "تو", "🫵"],
          ["is", "است", "🔵"],
          ["are", "هستی / هستند", "🟣"],
        ],
        b: [
          ["I ___ Ali.", "am", "من علی هستم."],
          ["You ___ my friend.", "are", "تو دوست من هستی."],
        ],
        o: [["I am a student.", "من دانش‌آموزم."]],
        e: [[["I", "is", "a", "student."], 1, "I am a student."]],
        tip: {
          title: "فعل بودن",
          body: "I am · you are · he is · she is · it is · we are · they are. با این هفت شکل، نصف جمله‌های اولیه ساخته می‌شود.",
        },
        say: [["I am Ali and you are my friend.", "من علی هستم و تو دوست من هستی."]],
      },
    ],
  },
  {
    id: "a1-u2",
    index: 2,
    titleFa: "من و دیگران",
    titleEn: "Me and others",
    theme: "coral",
    lessons: [
      {
        slug: "to-be",
        title: "Am, is, are",
        titleFa: "am / is / are",
        goal: "برای هر فاعل شکل درست to be را بگویی",
        buildsOn: ["a1-u1-first-sentence"],
        w: [
          ["he", "او (مرد)", "👨"],
          ["she", "او (زن)", "👩"],
          ["we", "ما", "👥"],
          ["they", "آن‌ها", "👨‍👩‍👧"],
          ["it", "آن", "📦"],
        ],
        b: [
          ["He ___ my father.", "is", "او پدر من است."],
          ["They ___ students.", "are", "آن‌ها دانش‌آموز هستند."],
        ],
        o: [["We are ready.", "ما آماده‌ایم."]],
        e: [[["They", "is", "my", "friends."], 1, "They are my friends."]],
        tip: {
          title: "یک قانون، سه شکل",
          body: "I → am. he/she/it → is. you/we/they → are. فقط همین.",
        },
        say: [["He is my brother and they are my friends.", "او برادر من است و آن‌ها دوستان من‌اند."]],
      },
      {
        slug: "this-that",
        title: "This and that",
        titleFa: "this / that / a / an",
        goal: "به چیزهای نزدیک و دور اشاره کنی",
        buildsOn: ["a1-u2-to-be"],
        w: [
          ["this", "این", "👉"],
          ["that", "آن", "👈"],
          ["a", "یک", "1️⃣"],
          ["an", "یک (قبل از صدادار)", "🅰️"],
          ["book", "کتاب", "📕"],
        ],
        b: [
          ["___ is a book.", "This", "این یک کتاب است."],
          ["I have ___ apple.", "an", "من یک سیب دارم."],
        ],
        o: [["That is a chair.", "آن یک صندلی است."]],
        e: [[["This", "are", "a", "book."], 1, "This is a book."]],
        tip: {
          title: "a یا an",
          body: "قبل از a، e، i، o، u از an استفاده کن: an apple، an egg. بقیه با a: a book، a cat.",
        },
        say: [["This is a book and that is an apple.", "این یک کتاب است و آن یک سیب."]],
      },
      {
        slug: "questions-be",
        title: "Yes / no questions",
        titleFa: "سؤال بله و نه",
        goal: "با am / is / are سؤال بسازی و جواب بدهی",
        buildsOn: ["a1-u2-this-that"],
        w: [
          ["are", "هستی", "❓"],
          ["is", "است؟", "❔"],
          ["yes", "بله", "✅"],
          ["no", "نه", "❌"],
          ["not", "نَـ — نمی", "🚫"],
        ],
        b: [
          ["___ you a student?", "Are", "تو دانش‌آموزی؟"],
          ["No, I am ___ a teacher.", "not", "نه، من معلم نیستم."],
        ],
        o: [["Are you from Iran?", "تو اهل ایران هستی؟"]],
        e: [[["You", "is", "a", "teacher?"], 1, "Are you a teacher?"]],
        tip: {
          title: "برای سؤال، جابه‌جا کن",
          body: "You are a student → Are you a student? فعل بودن به اول جمله می‌آید.",
        },
        say: [["Are you from Iran? Yes, I am.", "تو اهل ایران هستی؟ بله."]],
      },
      {
        slug: "where-from",
        title: "Where are you from?",
        titleFa: "اهل کجایی؟",
        goal: "ملیت و شغلت را بگویی",
        buildsOn: ["a1-u2-questions-be"],
        w: [
          ["where", "کجا", "🗺️"],
          ["what", "چه", "❓"],
          ["country", "کشور", "🌍"],
          ["job", "شغل", "💼"],
          ["teacher", "معلم", "👩‍🏫"],
        ],
        b: [
          ["___ are you from?", "Where", "اهل کجایی؟"],
          ["I am a ___.", "teacher", "من معلم هستم."],
        ],
        o: [["I am from Iran.", "من اهل ایران هستم."]],
        e: [[["Where", "you", "are", "from?"], 1, "Where are you from?"]],
        tip: {
          title: "کلمه‌های پرسشی",
          body: "where = کجا، what = چه، who = چه کسی. این کلمه‌ها همیشه اول جمله می‌آیند.",
        },
        say: [["Where are you from? I am from Iran.", "اهل کجایی؟ من اهل ایران هستم."]],
      },
    ],
  },
  {
    id: "a1-u3",
    index: 3,
    titleFa: "چیزها و شمارش",
    titleEn: "Things and numbers",
    theme: "mint",
    lessons: [
      {
        slug: "numbers-plural",
        title: "Numbers and plurals",
        titleFa: "عددها و جمع",
        goal: "تا بیست بشماری و اسم را جمع ببندی",
        buildsOn: ["a1-u2-to-be"],
        w: [
          ["one", "یک", "1️⃣"],
          ["two", "دو", "2️⃣"],
          ["ten", "ده", "🔟"],
          ["twenty", "بیست", "2️⃣0️⃣"],
          ["many", "زیاد", "🔢"],
        ],
        b: [
          ["I have ___ books.", "many", "من کتاب‌های زیادی دارم."],
          ["There are ___ cats.", "two", "دو گربه هست."],
        ],
        o: [["I have ten books.", "من ده کتاب دارم."]],
        e: [[["I", "have", "two", "cat."], 3, "I have two cats."]],
        tip: {
          title: "جمع با s",
          body: "یک چیز cat، چند چیز cats. اگر کلمه به ch، sh، s، x ختم شود es می‌گیرد: boxes.",
        },
        say: [["I have two sisters and ten books.", "من دو خواهر و ده کتاب دارم."]],
      },
      {
        slug: "possessive",
        title: "My, your, his, her",
        titleFa: "مالِ من، مالِ تو",
        goal: "بگویی چیزی مال چه کسی است",
        buildsOn: ["a1-u3-numbers-plural"],
        w: [
          ["my", "مال من", "🙋"],
          ["your", "مال تو", "🫵"],
          ["his", "مال او (مرد)", "👨"],
          ["her", "مال او (زن)", "👩"],
          ["our", "مال ما", "👥"],
        ],
        b: [
          ["This is ___ book.", "my", "این کتاب من است."],
          ["___ name is Sara.", "Her", "اسم او ساراست."],
        ],
        o: [["What is your name?", "اسم تو چیست؟"]],
        e: [[["His", "name", "are", "Reza."], 2, "His name is Reza."]],
        tip: {
          title: "his و her",
          body: "برای مرد his، برای زن her: his car، her bag. برای اشیا از its استفاده می‌کنیم.",
        },
        say: [["Her brother is my friend.", "برادر او دوست من است."]],
      },
      {
        slug: "have-has",
        title: "Have and has",
        titleFa: "داشتن",
        goal: "بگویی چه چیزی داری و او چه دارد",
        buildsOn: ["a1-u3-possessive"],
        w: [
          ["have", "داشتن", "🤲"],
          ["has", "دارد", "👉"],
          ["pet", "حیوان خانگی", "🐾"],
          ["phone", "گوشی", "📱"],
          ["bag", "کیف", "👜"],
        ],
        b: [
          ["I ___ a phone.", "have", "من یک گوشی دارم."],
          ["She ___ a cat.", "has", "او یک گربه دارد."],
        ],
        o: [["My sister has a pet.", "خواهرم یک حیوان خانگی دارد."]],
        e: [[["She", "have", "a", "cat."], 1, "She has a cat."]],
        tip: {
          title: "have یا has",
          body: "با I/you/we/they از have و با he/she/it از has استفاده می‌کنیم.",
        },
        say: [["I have a bag and she has a phone.", "من یک کیف دارم و او یک گوشی دارد."]],
      },
      {
        slug: "there-is",
        title: "There is / There are",
        titleFa: "هست / هستند",
        goal: "بگویی چیزی جایی هست",
        buildsOn: ["a1-u3-have-has"],
        w: [
          ["there", "آنجا", "👉"],
          ["here", "اینجا", "🫱"],
          ["near", "نزدیک", "📍"],
          ["table", "میز", "🪑"],
          ["room", "اتاق", "🚪"],
        ],
        b: [
          ["___ is a table here.", "There", "اینجا یک میز هست."],
          ["___ are two chairs.", "There", "دو صندلی هست."],
        ],
        o: [["There is a book on the table.", "یک کتاب روی میز هست."]],
        e: [[["There", "is", "two", "chairs."], 1, "There are two chairs."]],
        tip: {
          title: "is یا are",
          body: "برای یک چیز There is، برای چند چیز There are: There is a cat / There are two cats.",
        },
        say: [["There is a phone on the table.", "یک گوشی روی میز هست."]],
      },
    ],
  },
  {
    id: "a1-u4",
    index: 4,
    titleFa: "روزمرهٔ من",
    titleEn: "Every day",
    theme: "sky",
    lessons: [
      {
        slug: "present-simple-i",
        title: "I work every day",
        titleFa: "حال ساده با I و we",
        goal: "از کارهای همیشگی‌ات بگویی",
        buildsOn: ["a1-u3-there-is"],
        w: [
          ["work", "کار کردن", "💻"],
          ["live", "زندگی کردن", "🏠"],
          ["eat", "خوردن", "🍽️"],
          ["study", "درس خواندن", "📚"],
          ["every day", "هر روز", "🗓️"],
        ],
        b: [
          ["I ___ in Tehran.", "live", "من در تهران زندگی می‌کنم."],
          ["We ___ English every day.", "study", "ما هر روز انگلیسی می‌خوانیم."],
        ],
        o: [["I work every day.", "من هر روز کار می‌کنم."]],
        e: [[["I", "works", "every", "day."], 1, "I work every day."]],
        tip: {
          title: "حال ساده چیست؟",
          body: "برای کارهای تکراری: I work, you live, we study, they eat. بدون ing و بدون to.",
        },
        say: [["I live in Iran and I study English.", "من در ایران زندگی می‌کنم و انگلیسی می‌خوانم."]],
      },
      {
        slug: "present-simple-s",
        title: "He works",
        titleFa: "حال ساده با he و she",
        goal: "s سوم‌شخص را درست بچسبانی",
        buildsOn: ["a1-u4-present-simple-i"],
        w: [
          ["goes", "می‌رود", "🚶"],
          ["works", "کار می‌کند", "💼"],
          ["likes", "دوست دارد", "❤️"],
          ["plays", "بازی می‌کند", "⚽"],
          ["wakes up", "بیدار می‌شود", "⏰"],
        ],
        b: [
          ["He ___ at seven.", "wakes up", "او ساعت هفت بیدار می‌شود."],
          ["She ___ in a bank.", "works", "او در یک بانک کار می‌کند."],
        ],
        o: [["My brother plays football.", "برادرم فوتبال بازی می‌کند."]],
        e: [[["He", "go", "to", "work."], 1, "He goes to work."]],
        tip: {
          title: "s سوم‌شخص",
          body: "با he/she/it به فعل s اضافه می‌شود: work → works. اگر به o، sh، ch ختم شود es: go → goes.",
        },
        say: [["She works in a bank and he goes to school.", "او در بانک کار می‌کند و او به مدرسه می‌رود."]],
      },
      {
        slug: "do-questions",
        title: "Do you…?",
        titleFa: "سؤال با do و does",
        goal: "با do و does سؤال بسازی و منفی کنی",
        buildsOn: ["a1-u4-present-simple-s"],
        w: [
          ["do", "انجام دادن", "🛠️"],
          ["does", "انجام می‌دهد (سؤال)", "❓"],
          ["don't", "نمی", "🚫"],
          ["doesn't", "نمی (او)", "🚫"],
          ["like", "دوست داشتن", "❤️"],
        ],
        b: [
          ["___ you like tea?", "Do", "چای دوست داری؟"],
          ["She ___ like coffee.", "doesn't", "او قهوه دوست ندارد."],
        ],
        o: [["Do you speak English?", "انگلیسی صحبت می‌کنی؟"]],
        e: [[["Does", "you", "like", "tea?"], 1, "Do you like tea?"]],
        tip: {
          title: "do و does",
          body: "سؤال با do/does و منفی با don't/doesn't. با does، فعل دیگر s نمی‌گیرد: Does she like…?",
        },
        say: [["Do you like tea? No, I don't.", "چای دوست داری؟ نه."]],
      },
      {
        slug: "frequency",
        title: "Always, never",
        titleFa: "قیدهای تکرار",
        goal: "بگویی هر چند وقت یک بار کاری می‌کنی",
        buildsOn: ["a1-u4-do-questions"],
        w: [
          ["always", "همیشه", "♾️"],
          ["usually", "معمولاً", "🔁"],
          ["often", "اغلب", "📈"],
          ["sometimes", "گاهی", "🤔"],
          ["never", "هرگز", "🚫"],
        ],
        b: [
          ["I ___ drink coffee at night.", "never", "من هرگز شب قهوه نمی‌نوشم."],
          ["She ___ works on Friday.", "usually", "او معمولاً جمعه کار می‌کند."],
        ],
        o: [["I always study at night.", "من همیشه شب درس می‌خوانم."]],
        e: [[["He", "usually", "studys", "English."], 2, "He usually studies English."]],
        tip: {
          title: "جای قید",
          body: "قید تکرار قبل از فعل اصلی می‌آید: I always work. ولی بعد از am/is/are: I am always late.",
        },
        say: [["I usually study at night and I never work on Friday.", "من معمولاً شب درس می‌خوانم و هرگز جمعه کار نمی‌کنم."]],
      },
    ],
  },
];

export default units;

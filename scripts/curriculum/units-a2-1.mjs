/**
 * A2 — unit 1 of 10. Same field legend as the A1 files.
 * A2 starts by re-using the past tense learners met at the end of A1, then pushes
 * towards telling a short story.
 */

const units = [
  {
    id: "a2-u1",
    index: 1,
    level: "A2",
    titleFa: "از دیروز بگو",
    titleEn: "Tell me about yesterday",
    theme: "orange",
    lessons: [
      {
        slug: "story-past",
        title: "Irregular past",
        titleFa: "گذشتهٔ بی‌قاعده",
        goal: "با فعل‌های پرکاربرد گذشته داستان بگویی",
        buildsOn: ["a1-u8-past-irregular"],
        w: [
          ["met", "ملاقات کرد", "🤝"],
          ["told", "گفت", "🗣️"],
          ["took", "برد / گرفت", "✋"],
          ["made", "ساخت", "🔨"],
          ["felt", "احساس کرد", "💭"],
        ],
        b: [
          ["I ___ my friend yesterday.", "met", "دیروز دوستم را دیدم."],
          ["She ___ me a story.", "told", "او برایم یک داستان گفت."],
        ],
        o: [["I met my friend last week.", "هفتهٔ پیش دوستم را دیدم."]],
        e: [[["I", "meet", "my", "friend", "yesterday."], 1, "I met my friend yesterday."]],
        tip: {
          title: "شکل فعل عوض می‌شود",
          body: "بعضی فعل‌ها در گذشته ed نمی‌گیرند و شکلشان عوض می‌شود. آن‌ها را با یک جمله حفظ کن، نه با قاعده.",
        },
        say: [["We went to the park and met our friends.", "به پارک رفتیم و دوستانمان را دیدیم."]],
      },
      {
        slug: "story-links",
        title: "First, then, after that",
        titleFa: "ترتیب داستان",
        goal: "داستان را به‌ترتیب تعریف کنی",
        buildsOn: ["a2-u1-story-past"],
        w: [
          ["first", "اول", "🥇"],
          ["then", "بعد", "➡️"],
          ["after that", "بعد از آن", "⏭️"],
          ["finally", "در آخر", "🏁"],
          ["later", "بعدتر", "⏭️"],
        ],
        b: [
          ["___ we went home.", "Then", "بعد به خانه رفتیم."],
          ["We ate, and ___ we talked.", "after that", "غذا خوردیم و بعد از آن حرف زدیم."],
        ],
        o: [["First we ate, then we talked.", "اول غذا خوردیم، بعد حرف زدیم."]],
        e: [[["Then", "we", "go", "home."], 2, "Then we went home."]],
        tip: {
          title: "چهار کلمه برای ترتیب",
          body: "برای تعریف داستان از این‌ها استفاده کن: اول، بعد، بعد از آن، در آخر. جمله‌ها کوتاه بمانند.",
        },
        say: [["First I worked, then I went home.", "اول کار کردم، بعد به خانه رفتم."]],
      },
      {
        slug: "past-questions",
        title: "Did you…?",
        titleFa: "سؤال در گذشته",
        goal: "دربارهٔ دیروز سؤال بپرسی",
        buildsOn: ["a2-u1-story-links"],
        w: [
          ["did", "آیا (گذشته)", "❓"],
          ["didn't", "نکرد", "🚫"],
          ["happen", "اتفاق افتادن", "⚡"],
          ["weekend", "آخر هفته", "🗓️"],
          ["suddenly", "یک‌هو", "💥"],
        ],
        b: [
          ["___ you go out last night?", "Did", "دیشب بیرون رفتی؟"],
          ["I ___ see him.", "didn't", "او را ندیدم."],
        ],
        o: [["Where did you go?", "کجا رفتی؟"]],
        e: [[["Did", "you", "went", "out?"], 2, "Did you go out?"]],
        tip: {
          title: "در سؤال، فعل ساده",
          body: "وقتی با did سؤال می‌پرسی، فعل اصلی ساده می‌ماند: Did you go؟ نه Did you went.",
        },
        say: [["Did you see the film? Yes, I did.", "فیلم را دیدی؟ بله."]],
      },
      {
        slug: "feelings-past",
        title: "I was tired",
        titleFa: "احساس در گذشته",
        goal: "بگویی دیروز چه حالی داشتی",
        buildsOn: ["a2-u1-past-questions"],
        w: [
          ["tired", "خسته", "😴"],
          ["excited", "هیجان‌زده", "🤩"],
          ["bored", "بی‌حوصله", "😑"],
          ["scared", "ترسیده", "😨"],
          ["surprised", "شگفت‌زده", "😮"],
        ],
        b: [
          ["I was very ___ after work.", "tired", "بعد از کار خیلی خسته بودم."],
          ["She was ___ about the trip.", "excited", "او برای سفر هیجان‌زده بود."],
        ],
        o: [["I was happy to see them.", "از دیدنشان خوشحال بودم."]],
        e: [[["I", "were", "happy", "yesterday."], 1, "I was happy yesterday."]],
        tip: {
          title: "احساس با was / were",
          body: "برای یک نفر was و برای چند نفر were: I was tired / we were tired.",
        },
        say: [["I was tired but happy.", "خسته بودم ولی خوشحال."]],
      },
    ],
  },
];

export default units;

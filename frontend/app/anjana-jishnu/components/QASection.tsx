const questions = [
  {
    q: "Who are the bride's parents?",
    a: "Mr. Prakashan M & Mrs. Shobha P, “Gulmohar”, Marikundil P.O., Balla 671531, Kanhangad, Kasaragod.",
  },
  {
    q: "Who are the groom's parents?",
    a: "Late Mr. Sashidharan A.V & Mrs. Mydhily A.V, “Kanchiyil House”, Trikaripur P.O. 671310, Kasaragod.",
  },
  {
    q: "When exactly will the muhurtham take place?",
    a: "On Sunday, 13th September 2026, Muhurtham: 10:40 AM to 11:30 AM.",
  },
  {
    q: "Where is the wedding ceremony?",
    a: "Malabar Ocean Front & Spa, Nileshwar.",
  },
  {
    q: "Whose presence is requested?",
    a: "You and your family — your gracious presence and blessings will make the occasion truly memorable.",
  },
];

export const QASection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#7A2430] drop-shadow-sm">
            Titbits on us
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {questions.map((item, index) => (
            <div
              key={item.q}
              className="p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl rounded-2xl sm:rounded-3xl bg-white animate-fade-in-up border-l-4 border-l-[#C4A574] transition-all duration-300 hover:scale-[1.01]"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <p className="text-base sm:text-lg md:text-xl font-semibold text-[#7A2430] mb-2 sm:mb-3 leading-tight">
                {item.q}
              </p>
              <p className="text-[#5C4A3A] text-sm sm:text-base md:text-lg leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const questions = [
  {
    q: "Tell us about the groom's parents.",
    a: "Smt. Late Bharathi & Sri N. Nagaraju — Retd. Shirastedar, Judicial Dept., Ashwini Extension, CHINTAMANI - 563 125, Chikkaballapur Dist.",
  },
  {
    q: "Who are the bride's parents?",
    a: "Smt. Bhagya & Sri Thimmappa — Kuduvanaghattahalli, Nonavinakere Hobali, Tiptur Taluk, Tumkur Dist.",
  },
  {
    q: "Tell us about the groom.",
    a: "Chi. Ry. Puneeth N. M.A., B.Ed. — Only Son of Smt. Late Bharathi & Sri N. Nagaraju.",
  },
  {
    q: "Tell us about the bride.",
    a: "Chi. Sou. Suma (Narasamma) — Third Daughter of Smt. Bhagya & Sri Thimmappa.",
  },
  {
    q: "When exactly will the marriage take place?",
    a: "On Sunday, 21st June 2026 from 9:00 AM to 9:44 AM at Sri Rama Palace, Mastenahalli Road, Kaiwara, Chintamani Taluk.",
  },
  {
    q: "When is the reception?",
    a: "On Saturday, 20th June 2026 from 7:00 PM onwards at Sri Rama Palace, Mastenahalli Road, Kaiwara, Chintamani Taluk.",
  },
  {
    q: "What is the Lagna?",
    a: "Kataka — the auspicious star alignment for this sacred union.",
  },
];

export const QASection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-fabric-texture relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A962] to-transparent" />
            <div className="w-2 h-2 rounded-full bg-[#C9A962]" />
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#C9A962] to-transparent" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#2D5244] drop-shadow-sm">
            Titbits on us
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {questions.map((item, index) => (
            <div
              key={item.q}
              className="p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl rounded-2xl sm:rounded-3xl bg-silk-texture animate-fade-in-up border-l-4 border-l-[#4A7C59] transition-all duration-300 hover:scale-[1.01] relative overflow-hidden"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <p className="text-base sm:text-lg md:text-xl font-semibold text-[#2D5244] mb-2 sm:mb-3 leading-tight relative z-10">
                {item.q}
              </p>
              <p className="text-[#5C4A3A] text-sm sm:text-base md:text-lg leading-relaxed relative z-10">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const questions = [
  {
    q: "Who are the bride's parents?",
    a: "B.K. Sudhakaran & Sam. C, Parambacheri Road, Mulleria.",
  },
  {
    q: "Who is the groom?",
    a: "Srujith P.B, beloved son of a respected family.",
  },
  {
    q: "When exactly will the muhurtham take place?",
    a: "On Sunday, 12th April 2026, Muhurtham: 11:30 AM to 12:30 PM.",
  },
  {
    q: "Where is the wedding ceremony?",
    a: "Onath Convention Hall, near Sree Chirayil Bhagavathi Temple.",
  },
  {
    q: "Is there a reception and feast?",
    a: "Yes, lunch and hospitality will follow the ceremony.",
  },
  {
    q: "How can we contact the family?",
    a: "Phone: 9497288158, 6235973888.",
  },
];

export const QASection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#9e1c12] drop-shadow-sm">
            Titbits on us
          </h2>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {questions.map((item, index) => (
            <div
              key={item.q}
              className="p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl rounded-2xl sm:rounded-3xl bg-white animate-fade-in-up border-l-4 border-l-[#D4AF37] transition-all duration-300 hover:scale-[1.01]"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <p className="text-base sm:text-lg md:text-xl font-semibold text-[#9e1c12] mb-2 sm:mb-3 leading-tight">
                {item.q}
              </p>
              <p className="text-[#654321] text-sm sm:text-base md:text-lg leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

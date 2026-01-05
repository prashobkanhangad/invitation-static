const questions = [
  {
    q: "Who are the bride's parents?",
    a: "K. V. Suresh Babu & Sumana Suresh from 'Anugraha', Kovval Pally, Kanhangad P.O., Kasaragod District - 671 315. ",
  },
  {
    q: "Tell us about the groom's parents.",
    a: "Shri. K. V. Balakrishnan & Smt. Usha Balakrishnan from Kodoth Valappil House, Kanhangad South P.O.",
  },
  {
    q: "Tell us about the bride.",
    a: "Anupriya K.V., Granddaughter of Smt. V V Bharathi & Late C H Kunhambu, and Smt: Remani K V & Shri. C. Kannan.",
  },
  {
    q: "Tell us about the groom.",
    a: "Adarsh K.V., Son of Shri. K. V. Balakrishnan & Smt. Usha Balakrishnan.",
  },
  {
    q: "When exactly will the muhurtham take place?",
    a: "On Saturday, 10th January 2026 (1201 Dhanu 26), Muhurtham: 11:00 AM to 11:50 AM.",
  },
  {
    q: "Where is the wedding ceremony?",
    a: "Nakshathra Auditorium, Aingoth, Kanhangad.",
  },
];

export const QASection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#9e1c12] drop-shadow-sm">Titbits on us</h2>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {questions.map((item, index) => (
            <div
              key={item.q}
              className="p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl rounded-2xl sm:rounded-3xl bg-white animate-fade-in-up border-l-4 border-l-[#D4AF37] transition-all duration-300 hover:scale-[1.01]"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <p className="text-base sm:text-lg md:text-xl font-semibold text-[#9e1c12] mb-2 sm:mb-3 leading-tight">{item.q}</p>
              <p className="text-[#654321] text-sm sm:text-base md:text-lg leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

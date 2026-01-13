const questions = [
  {
    q: "Who are the bride's parents?",
    a: "Mr. Padmanabhan.P.M & Mrs. Latha.P.M from Puliyakkattu Madam, Padinhattamkozhuval, Nileshwar.P.O, Kasaragod.",
  },
  {
    q: "Tell us about the groom's parents.",
    a: "U.Krishnan Kutty & K.Bindu from Arunodayam, Mannampatta.P.O, Sreekrishnapuram, Palakkad",
  },
  {
    q: "Tell us about the bride.",
    a: "Shilpa.P.M, Granddaughter of (Late) K.M.Kumaran & P.M.Chandravati Amma, and (Late) Shankaran Gurikkal & Sarojini Amma",
  },
  {
    q: "Tell us about the groom.",
    a: "Arun Krishnan, Son of U.Krishnan Kutty & K.Bindu",
  },
  {
    q: "When exactly will the marriage take place?",
    a: "On Wednesday, 21st January 2026 at 10:00 AM at Staydium Bungalow Resort, Kozhikode",
  },
  {
    q: "When is the wedding reception?",
    a: "On Sunday, 25th January 2026 from 11:30 AM to 3:30 PM at Bekal Club & Resort, Kanhangad, Kasaragod",
  },
];

export const QASection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-fabric-texture relative">
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-4 sm:mb-6">
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#B8945F] to-transparent"></div>
            <div className="w-2 h-2 rounded-full bg-[#B8945F]"></div>
            <div className="h-px w-12 sm:w-16 bg-gradient-to-r from-transparent via-[#B8945F] to-transparent"></div>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#7A0F0F] drop-shadow-sm">Titbits on us</h2>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {questions.map((item, index) => (
            <div
              key={item.q}
              className="p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl rounded-2xl sm:rounded-3xl bg-silk-texture animate-fade-in-up border-l-4 border-l-[#B8945F] transition-all duration-300 hover:scale-[1.01] relative overflow-hidden"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%237A0F0F' fill-opacity='1'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2H0v-2h20v-2H0V8h20V6H0V4h20V2H0V0h22v20h-2zm-2 0v2H0v-2h18zm0 4v2H0v-2h18zm0 4v2H0v-2h18z'/%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
              <p className="text-base sm:text-lg md:text-xl font-semibold text-[#7A0F0F] mb-2 sm:mb-3 leading-tight relative z-10">{item.q}</p>
              <p className="text-[#6B4423] text-sm sm:text-base md:text-lg leading-relaxed relative z-10">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

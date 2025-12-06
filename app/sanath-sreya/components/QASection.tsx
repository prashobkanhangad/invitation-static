const questions = [
  {
    q: "Who are the groom's parents?",
    a: "Mrs. Savitha MV & Mr. Vimal Kumar M from Gokulam Muchilote, Kizhakkumkara, Kanhangad. Mobile: +91 98245 04719",
  },
  {
    q: "Tell us about the bride's parents.",
    a: "D/o Mrs. Shiny & Mr. Jayachandran from Shreyas, Sun Village, Thaliyil, PO Parassinikadavu, Kannur.",
  },
  {
    q: "Tell us about the groom.",
    a: "Sanath is the Grandson of Late KPV Raman & Late PV Savitiri and Late MV Karunakaran & MV Nanyayui.",
  },
  {
    q: "Tell us about the bride.",
    a: "Shreya, daughter of Mrs. Shiny & Mr. Jayachandran.",
  },
  {
    q: "When exactly will the muhurtham take place?",
    a: "On Saturday, 13th December 2025, Muhurtham: 11:30 a.m. to 12:15 p.m.",
  },
  {
    q: "Where is the wedding ceremony?",
    a: "Dream Palace Auditorium, Trichambaram Temple Road, Thaliparamba, Kannur.",
  },
  {
    q: "Where is the reception?",
    a: "Gokulam Muchilote, Near Cherichal Muthappan Temple, Kizhakkumkara, Kanhangad. Time: 6:00 p.m. onwards (followed by dinner).",
  },
];

export const QASection = () => {
  return (
    <section className="py-12 sm:py-16 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-[#F5DEB3] via-[#FFF8DC] to-[#F5E6D3]">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#8B0000] drop-shadow-sm">Titbits on us</h2>
        </div>

        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          {questions.map((item, index) => (
            <div
              key={item.q}
              className="p-5 sm:p-6 md:p-8 shadow-lg hover:shadow-xl rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#FFF8DC] to-[#F5E6D3] animate-fade-in-up border-l-4 border-l-[#DAA520] transition-all duration-300 hover:scale-[1.01]"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <p className="text-base sm:text-lg md:text-xl font-semibold text-[#8B0000] mb-2 sm:mb-3 leading-tight">{item.q}</p>
              <p className="text-[#654321] text-sm sm:text-base md:text-lg leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

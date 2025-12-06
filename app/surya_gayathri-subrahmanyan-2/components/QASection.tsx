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
    <section className="py-16 md:py-24 px-4 bg-gradient-to-b from-muted/50 to-background">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground">Titbits on us</h2>
        </div>

        <div className="space-y-6">
          {questions.map((item, index) => (
            <div
              key={item.q}
              className="p-6 md:p-8 shadow-lg rounded-3xl bg-card animate-fade-in-up border-l-4 border-l-primary"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <p className="text-lg md:text-xl font-medium text-foreground mb-3">{item.q}</p>
              <p className="text-muted-foreground text-base md:text-lg">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

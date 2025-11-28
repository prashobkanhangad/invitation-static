const questions = [
  {
    q: "Who are the hosts of this celebration?",
    a: "Mr. Chandran & Mrs. Usha Chandran (Vayakodan Veedu, Melangot, Kanhangad) from 'Sreeram', Alakod, P.O. Pakkam, Via Bekal Fort.",
  },
  {
    q: "Tell us about the groom.",
    a: "Jithendra is the Grand S/o: (Late) B. Kunhiraman & (Late) A. Lakshmi Amma, Grand S/o: (Late) Patten Gopalan Maniyani & Smt. Thambai Amma, N/o. Shri. T. Kunhiraman Thanniyadi.",
  },
  {
    q: "Tell us about the bride.",
    a: "Nanditha is the D/o: Shri. Nandakumar & Smt. Lalitha Nandakumar from 'Indraprasth' House, Pandi, P.O. Pandi – 671543, Kasaragod, N/o. Shri. Anil Kumar, Kudumboor.",
  },
  {
    q: "When exactly will the muhurtham take place?",
    a: "On Sunday, 30th November 2025 between 10:50 AM and 11:50 AM. Exact Muhurtham: 11:27 AM (Mithuna Lagnam).",
  },
  {
    q: "What is the Malayalam calendar date?",
    a: "The ceremony falls on 14th Vrischikam 1201 .",
  },
  {
    q: "Where should we gather to celebrate?",
    a: "At Sumangali Auditorium, Periya—come with your blessings and smiles.",
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

import Image from "next/image";

export default function RSVP() {
  return (
    <section id="rsvp" className="py-20 px-4 bg-gradient-to-br from-[#F5F5F0] to-white">
      <div className="max-w-4xl mx-auto">
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
          <Image
            src="/romanticpage/save-date.jpg"
            alt="Save the Date"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}


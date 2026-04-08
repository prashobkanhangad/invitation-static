const Template = require("../models/Template");

async function seedTemplatesIfNeeded() {
  const existing = await Template.countDocuments();
  if (existing > 0) return;

  const templates = [
    {
      templateId: "album-default",
      title: "Classic album",
      subtitle: "A cherished collection",
      category: "wedding",
      previewVariant: 1,
      coverSrc: "/srideep_shobana/img-36.jpeg",
      coverAlt: "Digital album cover",
      thumbs: [
        "/srideep_shobana/img-13.jpeg",
        "/srideep_shobana/img-17.jpeg",
        "/srideep_shobana/img-18.jpeg",
        "/srideep_shobana/img-12.jpeg",
      ],
      footerText: "Crafted on Invyto",
    },
  ];

  await Template.insertMany(templates);
  // eslint-disable-next-line no-console
  console.log("Seeded templates:", templates.length);
}

module.exports = { seedTemplatesIfNeeded };

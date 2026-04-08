export function openWhatsApp(message?: string) {
  const phone = "918714500637"; // Country code (91 for India) + number
  const baseUrl = `https://wa.me/${phone}`;
  const url = message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}



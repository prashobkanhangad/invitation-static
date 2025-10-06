export function openWhatsApp(message?: string) {
  const phone = "8714500637";
  const baseUrl = `https://wa.me/${phone}`;
  const url = message ? `${baseUrl}?text=${encodeURIComponent(message)}` : baseUrl;
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}



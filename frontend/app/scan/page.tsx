"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, QrCode, RotateCcw } from "lucide-react";

function extractInviteIdFromQrText(text: string): string | null {
  const t = text.trim();
  if (!t) return null;

  // If QR contains a URL.
  try {
    const url = new URL(t);
    const fromParam = url.searchParams.get("inviteId");
    if (fromParam && fromParam.trim()) return fromParam.trim();
    const parts = url.pathname.split("/").filter(Boolean);
    const last = parts[parts.length - 1];
    return last ? last.trim() : null;
  } catch {
    // Not a URL; fall through to heuristic parsing.
  }

  // If QR contains query-string style inviteId=...
  const match = t.match(/inviteId=([^&]+)/i);
  if (match?.[1]) return decodeURIComponent(match[1]).trim();

  // Otherwise, take the last path segment if it looks like a path.
  const parts = t.split("/").filter(Boolean);
  return (parts[parts.length - 1] ?? t).trim();
}

export default function ScanPage() {
  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);

  const [isSupported, setIsSupported] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [manualInviteId, setManualInviteId] = useState("");
  const [lastQrText, setLastQrText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // BarcodeDetector is not supported in every browser.
    setIsSupported(typeof (window as any).BarcodeDetector !== "undefined");
  }, []);

  const statusText = useMemo(() => {
    if (error) return error;
    if (isScanning) return "Scanning for QR code...";
    if (lastQrText) return "QR detected. Redirecting you...";
    return "Point your camera at the QR code at your invitation.";
  }, [error, isScanning, lastQrText]);

  async function stopScanner() {
    setIsScanning(false);

    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  async function startScanner() {
    setError(null);
    setLastQrText(null);

    if (!isSupported) {
      setError("QR scanning isn’t supported in this browser. Use manual input instead.");
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access isn’t available on this device/browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      streamRef.current = stream;

      if (!videoRef.current) throw new Error("Video element missing.");
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const BarcodeDetectorCtor = (window as any).BarcodeDetector as
        | (new (options: any) => { detect: (source: any) => Promise<any[]> })
        | undefined;

      if (!BarcodeDetectorCtor) {
        setError("QR scanning isn’t supported in this browser.");
        await stopScanner();
        return;
      }

      const detector = new BarcodeDetectorCtor({ formats: ["qr_code"] });

      setIsScanning(true);
      intervalRef.current = window.setInterval(async () => {
        try {
          if (!videoRef.current) return;
          const codes = await detector.detect(videoRef.current);
          const rawValue =
            codes?.[0]?.rawValue ??
            // Some browsers may return a different shape.
            codes?.[0]?.data ??
            null;

          if (!rawValue) return;

          const inviteId = extractInviteIdFromQrText(String(rawValue));
          if (!inviteId) return;

          setLastQrText(String(rawValue));
          await stopScanner();
          router.replace(`/guest/${encodeURIComponent(inviteId)}`);
        } catch {
          // Ignore transient camera/decoder errors.
        }
      }, 450);
    } catch {
      setError("Couldn’t access camera. Please allow camera permissions.");
      await stopScanner();
    }
  }

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount.
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onManualGo() {
    const inviteId = manualInviteId.trim();
    if (!inviteId) {
      setError("Please enter the invite code from the QR.");
      return;
    }
    setError(null);
    router.replace(`/guest/${encodeURIComponent(inviteId)}`);
  }

  return (
    <div className="relative z-[2] min-h-screen px-4 sm:px-6">
      <div className="max-w-4xl mx-auto pt-10 sm:pt-16 pb-12">
        <div className="flex items-start justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-display text-[#9e1c12]">
              Scan QR & Upload Photos
            </h1>
            <p className="text-sm sm:text-base text-[#654321] mt-1">
              Scan the code on the invitation to submit your photos.
            </p>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-[#DAA520]/40 bg-white/70 px-4 py-2 text-sm font-semibold text-[#654321] hover:bg-white"
          >
            Home
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#DAA520]/30 bg-white/80 backdrop-blur p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] flex items-center justify-center text-white">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-display text-[#9e1c12]">
                  Camera QR Scanner
                </h2>
                <p className="text-sm text-[#654321] mt-1">{statusText}</p>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-black/5 bg-black/5">
              <video
                ref={videoRef}
                playsInline
                muted
                className="w-full h-[280px] sm:h-[320px] object-cover bg-black/10"
              />
              {!isScanning ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-white/70 border border-black/5 flex items-center justify-center">
                      <QrCode className="w-6 h-6 text-[#9e1c12]" />
                    </div>
                    <p className="mt-3 text-sm text-[#654321]">
                      Tap <b>Start scanner</b> to begin.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={startScanner}
                disabled={isScanning}
                className="rounded-xl bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] text-white px-5 py-3 text-sm font-semibold shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isScanning ? "Scanning..." : "Start scanner"}
              </button>
              <button
                type="button"
                onClick={stopScanner}
                disabled={!isScanning}
                className="rounded-xl border border-[#DAA520]/40 bg-white/70 px-5 py-3 text-sm font-semibold text-[#654321] hover:bg-white disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Stop
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#DAA520]/30 bg-white/80 backdrop-blur p-5 sm:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] flex items-center justify-center text-white">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-display text-[#9e1c12]">
                  Manual Invite Code
                </h2>
                <p className="text-sm text-[#654321] mt-1">
                  {isSupported
                    ? "If scanning fails, enter the invite code."
                    : "Enter the invite code (QR scanning not supported here)."}
                </p>
              </div>
            </div>

            <label className="block text-sm font-medium text-[#654321] mb-2">
              Invite code
            </label>
            <input
              value={manualInviteId}
              onChange={(e) => setManualInviteId(e.target.value)}
              placeholder="e.g., INV-1024"
              className="w-full rounded-xl border border-[#DAA520]/30 bg-white/90 py-3 px-3 text-sm outline-none focus:ring-2 focus:ring-[#DAA520]/60"
            />

            {error ? (
              <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                {error}
              </p>
            ) : null}

            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={onManualGo}
                className="rounded-xl bg-gradient-to-r from-[#B8860B] via-[#DAA520] to-[#B8860B] text-white px-5 py-3 text-sm font-semibold shadow-lg hover:scale-[1.01] transition"
              >
                Continue
              </button>
              <Link
                href="/"
                className="text-sm text-[#654321] underline underline-offset-4 hover:text-[#9e1c12]"
              >
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


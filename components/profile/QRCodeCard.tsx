"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Button } from "@/components/ui/Button";
import type { Dictionary } from "@/lib/i18n/config";

export function QRCodeCard({
  url,
  craftsmanName,
  dict,
}: {
  url: string;
  craftsmanName: string;
  dict: Dictionary;
}) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    QRCode.toDataURL(url, {
      width: 480,
      margin: 2,
      color: { dark: "#2A241D", light: "#FBF7EF" },
    }).then((result) => {
      if (!cancelled) setDataUrl(result);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-ink-500/15 bg-khadi-50 p-6">
      {dataUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={dataUrl}
          alt={`QR code linking to ${craftsmanName}'s KarigarSetu profile`}
          className="h-48 w-48"
        />
      ) : (
        <div className="h-48 w-48 animate-pulse rounded-lg bg-ink-500/10" aria-hidden="true" />
      )}
      <p className="text-center text-sm text-ink-500">{dict.profilePage.qrPrintHint}</p>
      {dataUrl && (
        <a href={dataUrl} download={`${craftsmanName.replace(/\s+/g, "-").toLowerCase()}-qr.png`}>
          <Button variant="secondary">{dict.profilePage.downloadQr}</Button>
        </a>
      )}
    </div>
  );
}

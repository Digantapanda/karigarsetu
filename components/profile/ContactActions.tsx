"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { QRCodeCard } from "@/components/profile/QRCodeCard";
import { reportPilotTask } from "@/app/pilot/task-actions";
import type { Dictionary } from "@/lib/i18n/config";

interface ContactActionsProps {
  craftsmanName: string;
  profileUrl: string;
  shopContactNumber?: string;
  dict: Dictionary;
}

export function ContactActions({ craftsmanName, profileUrl, shopContactNumber, dict }: ContactActionsProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const whatsappMessage = encodeURIComponent(
    `Hello, I found your craftsman profile on KarigarSetu (${profileUrl}). I am interested in your work.`
  );
  // No country code is assumed -- shopContactNumber is stored as entered at
  // registration; wa.me works without one on most devices but a production
  // build should normalize this to E.164 before generating the link.
  const whatsappHref = shopContactNumber
    ? `https://wa.me/${shopContactNumber.replace(/\D/g, "")}?text=${whatsappMessage}`
    : undefined;

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(profileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail on non-HTTPS/local contexts -- fail silently,
      // the link is still visible and selectable on the page.
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${craftsmanName} on KarigarSetu`,
          text: `Discover the craftsmanship of ${craftsmanName} on KarigarSetu.`,
          url: profileUrl,
        });
      } catch {
        // User cancelled the share sheet -- nothing to do.
      }
    } else {
      handleCopyLink();
    }
  }

  function handleMailShareClick() {
    // Fire-and-forget: does nothing outside an active pilot session (see
    // lib/pilot/task-hooks.ts), and doesn't block the mailto: link below
    // from opening the participant's mail client normally either way.
    void reportPilotTask("share_profile");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3">
        {whatsappHref && (
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
            <Button>{dict.profilePage.contactWhatsapp}</Button>
          </a>
        )}
        {shopContactNumber && (
          <a href={`tel:${shopContactNumber}`}>
            <Button variant="secondary">{dict.profilePage.call}</Button>
          </a>
        )}
        {whatsappHref && (
          <a
            href={`https://wa.me/${shopContactNumber?.replace(/\D/g, "")}?text=${encodeURIComponent(
              `Hello, I'd like to request an order. Product: \nQuantity: \nDelivery location: \n(via KarigarSetu: ${profileUrl})`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="secondary">{dict.profilePage.requestOrder}</Button>
          </a>
        )}
        <a
          href={`mailto:?subject=${encodeURIComponent(`${craftsmanName} on KarigarSetu`)}&body=${encodeURIComponent(
            `Take a look at this craftsman profile on KarigarSetu: ${profileUrl}`
          )}`}
          onClick={handleMailShareClick}
        >
          <Button variant="secondary">{dict.profilePage.shareByEmail}</Button>
        </a>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button variant="ghost" onClick={handleShare}>
          {dict.profilePage.shareProfile}
        </Button>
        <Button variant="ghost" onClick={handleCopyLink}>
          {copied ? dict.profilePage.linkCopied : dict.profilePage.copyLink}
        </Button>
        <Button variant="ghost" onClick={() => setShowQR((v) => !v)}>
          {showQR ? dict.profilePage.hideQr : dict.profilePage.generateQr}
        </Button>
      </div>

      {showQR && <QRCodeCard url={profileUrl} craftsmanName={craftsmanName} dict={dict} />}
    </div>
  );
}

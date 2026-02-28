"use client";

import { Share2, Link2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  LinkedinShareButton,
  EmailShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  LinkedinIcon,
  EmailIcon,
  TelegramIcon,
  WhatsappIcon,
} from "react-share";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  docId: string;
};

export default function ShareDialog({ isOpen, onClose, docId }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/view/${docId}`;
  const shareTitle = "Check out this document";
  const shareDescription =
    "I found this document and thought you might find it interesting.";

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!", {
        duration: 3000,
        position: "bottom-right",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link", {
        duration: 4000,
        position: "bottom-right",
      });
    }
  };

  const iconSize = 44;
  const iconBorderRadius = 10;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Share2 className="h-5 w-5 text-slate-700" />
            Share Document
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-2">
          {/* Copy Link Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Document Link
            </label>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={shareUrl}
                className="bg-slate-50 flex-1 text-ellipsis"
              />
              <Button
                onClick={handleCopyLink}
                variant={copied ? "default" : "secondary"}
                className={`flex items-center gap-2 px-4 w-24 ${
                  copied
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : "bg-slate-800 hover:bg-slate-700 text-white"
                }`}
              >
                {copied ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Social Share Options */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-slate-700">
              Share via social media
            </label>
            <div className="grid grid-cols-3 gap-y-6 gap-x-4 justify-items-center">
              <div className="flex flex-col items-center gap-3 group">
                <WhatsappShareButton
                  url={shareUrl}
                  title={shareTitle}
                  separator=" - "
                  className="transition-transform group-hover:scale-105"
                >
                  <WhatsappIcon size={iconSize} borderRadius={iconBorderRadius} />
                </WhatsappShareButton>
                <span className="text-xs font-medium text-slate-600">WhatsApp</span>
              </div>

              <div className="flex flex-col items-center gap-3 group">
                <FacebookShareButton
                  url={shareUrl}
                  title={shareTitle}
                  className="transition-transform group-hover:scale-105"
                >
                  <FacebookIcon size={iconSize} borderRadius={iconBorderRadius} />
                </FacebookShareButton>
                <span className="text-xs font-medium text-slate-600">Facebook</span>
              </div>

              <div className="flex flex-col items-center gap-3 group">
                <FacebookMessengerShareButton
                  url={shareUrl}
                  appId={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || ""}
                  className="transition-transform group-hover:scale-105"
                >
                  <FacebookMessengerIcon size={iconSize} borderRadius={iconBorderRadius} />
                </FacebookMessengerShareButton>
                <span className="text-xs font-medium text-slate-600">Messenger</span>
              </div>

              <div className="flex flex-col items-center gap-3 group">
                <LinkedinShareButton
                  url={shareUrl}
                  title={shareTitle}
                  summary={shareDescription}
                  className="transition-transform group-hover:scale-105"
                >
                  <LinkedinIcon size={iconSize} borderRadius={iconBorderRadius} />
                </LinkedinShareButton>
                <span className="text-xs font-medium text-slate-600">LinkedIn</span>
              </div>

              <div className="flex flex-col items-center gap-3 group">
                <TelegramShareButton
                  url={shareUrl}
                  title={shareTitle}
                  className="transition-transform group-hover:scale-105"
                >
                  <TelegramIcon size={iconSize} borderRadius={iconBorderRadius} />
                </TelegramShareButton>
                <span className="text-xs font-medium text-slate-600">Telegram</span>
              </div>

              <div className="flex flex-col items-center gap-3 group">
                <EmailShareButton
                  url={shareUrl}
                  subject="Document Viewer"
                  body={`${shareTitle}\n\n`}
                  className="transition-transform group-hover:scale-105"
                >
                  <EmailIcon size={iconSize} borderRadius={iconBorderRadius} />
                </EmailShareButton>
                <span className="text-xs font-medium text-slate-600">Email</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

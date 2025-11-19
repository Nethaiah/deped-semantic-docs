"use client";

import { Share2, Link2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  WhatsappShareButton,
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  EmailShareButton,
  TelegramShareButton,
  WhatsappIcon,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  EmailIcon,
  TelegramIcon,
} from "react-share";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  docId: string;
};

export default function ShareDialog({ isOpen, onClose, docId }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/view/${docId}`;
  const shareTitle = "Check out this document";
  const shareDescription = "I found this document and thought you might find it interesting.";

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

  const iconSize = 48;
  const iconBorderRadius = 12;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Share2 className="h-5 w-5 text-slate-700" />
            <h2 className="text-xl font-semibold text-slate-900">Share Document</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 p-1"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {/* Copy Link Section */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 border border-gray-200">
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Document Link
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-white rounded-md px-3 py-2 text-sm text-slate-600 border border-gray-200 overflow-hidden text-ellipsis whitespace-nowrap">
                {shareUrl}
              </div>
              <button
                onClick={handleCopyLink}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
                  copied 
                    ? 'bg-green-500 text-white' 
                    : 'bg-slate-700 hover:bg-slate-800 text-white'
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
              </button>
            </div>
          </div>

          {/* Social Share Options using react-share */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-3 block">
              Share via social media
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center gap-2">
                <WhatsappShareButton
                  url={shareUrl}
                  title={shareTitle}
                  separator=" - "
                  className="hover:opacity-80 transition-opacity"
                >
                  <WhatsappIcon size={iconSize} borderRadius={iconBorderRadius} />
                </WhatsappShareButton>
                <span className="text-xs font-medium text-slate-600">WhatsApp</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <FacebookShareButton
                  url={shareUrl}
                  title={shareTitle}
                  className="hover:opacity-80 transition-opacity"
                >
                  <FacebookIcon size={iconSize} borderRadius={iconBorderRadius} />
                </FacebookShareButton>
                <span className="text-xs font-medium text-slate-600">Facebook</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <TwitterShareButton
                  url={shareUrl}
                  title={shareTitle}
                  className="hover:opacity-80 transition-opacity"
                >
                  <TwitterIcon size={iconSize} borderRadius={iconBorderRadius} />
                </TwitterShareButton>
                <span className="text-xs font-medium text-slate-600">Twitter</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <LinkedinShareButton
                  url={shareUrl}
                  title={shareTitle}
                  summary={shareDescription}
                  className="hover:opacity-80 transition-opacity"
                >
                  <LinkedinIcon size={iconSize} borderRadius={iconBorderRadius} />
                </LinkedinShareButton>
                <span className="text-xs font-medium text-slate-600">LinkedIn</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <EmailShareButton
                  url={shareUrl}
                  subject="Document Viewer"
                  body={`${shareTitle}\n\n`}
                  className="hover:opacity-80 transition-opacity"
                >
                  <EmailIcon size={iconSize} borderRadius={iconBorderRadius} />
                </EmailShareButton>
                <span className="text-xs font-medium text-slate-600">Email</span>
              </div>

              <div className="flex flex-col items-center gap-2">
                <TelegramShareButton
                  url={shareUrl}
                  title={shareTitle}
                  className="hover:opacity-80 transition-opacity"
                >
                  <TelegramIcon size={iconSize} borderRadius={iconBorderRadius} />
                </TelegramShareButton>
                <span className="text-xs font-medium text-slate-600">Telegram</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-md transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

import { Bookmark, Share2, FileDown, Flag } from "lucide-react";
import Link from "next/link";

type Props = {
  sourcePath?: string;
};

export default function DocumentActions({ sourcePath }: Props) {
  return (
    <div className="mt-6 border-t pt-4 space-y-2">
      <button className="w-full text-left bg-slate-100 border border-gray-200 cursor-pointer hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-md flex items-center gap-3 transition-colors">
        <Bookmark className="h-4 w-4" /> Bookmark
      </button>
      
      <button className="w-full text-left bg-slate-100 border border-gray-200 cursor-pointer hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-md flex items-center gap-3 transition-colors">
        <Share2 className="h-4 w-4" /> Share
      </button>
      
      {sourcePath && (
        <Link
          href={sourcePath} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full text-left bg-slate-100 border border-gray-200 cursor-pointer hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-md flex items-center gap-3 transition-colors"
        >
          <FileDown className="h-4 w-4" /> Download PDF
        </Link>
      )}
      
      <button className="w-full text-left bg-slate-100 border border-gray-200 cursor-pointer hover:bg-slate-200 text-slate-700 font-medium py-2 px-3 rounded-md flex items-center gap-3 transition-colors">
        <Flag className="h-4 w-4" /> Report Issue
      </button>
    </div>
  );
}
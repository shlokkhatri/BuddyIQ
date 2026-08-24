import { Video, FileText, ExternalLink, Globe } from "lucide-react";
import type { ResourceItem } from "../../types";

interface ResourceCardProps {
  resource: ResourceItem;
  index: number;
}

export default function ResourceCard({ resource, index }: ResourceCardProps) {
  const isVideo =
    resource.type?.toLowerCase().includes("video") ||
    resource.type?.toLowerCase().includes("vedio") ||
    resource.url?.includes("youtube") ||
    resource.url?.includes("youtu.be");

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-blue-400/80 dark:hover:border-blue-600 hover:shadow-lg hover:shadow-blue-500/10 p-5 transition-all duration-200 flex flex-col justify-between">
      <div className="space-y-3">
        {/* Type & Topic Header */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
              isVideo
                ? "bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                : "bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
            }`}
          >
            {isVideo ? (
              <Video className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
            ) : (
              <FileText className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            )}
            {isVideo ? "Educational Video" : "Article / Guide"}
          </span>

          {resource.topic && (
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
              Topic: {resource.topic}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {resource.title || `Curated Resource #${index + 1}`}
        </h4>

        {/* Description / Summary */}
        {resource.description && (
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
            {resource.description}
          </p>
        )}
      </div>

      {/* Action link */}
      <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
          <Globe className="w-3 h-3" />
          Verified Source
        </span>

        {resource.url ? (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
          >
            <span>Learn More</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">Search recommended topic</span>
        )}
      </div>
    </div>
  );
}

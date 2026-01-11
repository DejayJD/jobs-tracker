"use client";

import { useRef } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export interface CardData {
  id: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export interface JobApplication {
  id: string;
  companyName: string;
  jobTitle: string | null;
  currentColumn: string;
  office: string | null;
  compensation: string | null;
  companySize: string | null;
  notes: string | null;
  status: string | null;
  nextInterviewDate: string | null;
  nextInterviewType: string | null;
  vibeCheck: number | null;
  source: string | null;
  logo: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CompanyLogoProps {
  companyName: string;
  logo?: string | null;
}

function CompanyLogo({ companyName, logo }: CompanyLogoProps) {
  const initials = companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="w-10 h-10 rounded-lg bg-yellow-400 text-gray-900 flex items-center justify-center font-bold text-sm shrink-0">
      {logo ? (
        <img
          src={logo}
          alt={companyName}
          className="w-full h-full rounded-lg object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

interface CalendarViewProps {
  date: string;
  interviewType?: string | null;
}

function CalendarView({ date, interviewType }: CalendarViewProps) {
  const dateObj = new Date(date);
  const month = dateObj.toLocaleString("default", { month: "short" }).toUpperCase();
  const day = dateObj.getDate();

  return (
    <>
      <div className="inline-flex flex-col items-center justify-center px-2 py-1 bg-yellow-50 border border-yellow-300 rounded-md text-yellow-900 min-w-[44px]">
        <span className="text-[9px] uppercase font-bold leading-none mb-0.5">
          {month}
        </span>
        <span className="text-sm font-bold leading-none">
          {day}
        </span>
      </div>
      {interviewType && (
        <span className="text-gray-700 font-medium text-xs">
          {interviewType}
        </span>
      )}
    </>
  );
}

interface WaitingViewProps {
  interviewType?: string | null;
}

function WaitingView({ interviewType }: WaitingViewProps) {
  return (
    <>
      <div className="inline-flex items-center gap-1.5 px-2 py-1.5 bg-gray-100 border border-gray-300 rounded-md text-gray-700">
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <span className="text-gray-700 font-medium text-xs"> Waiting... </span>
    </>
  );
}

interface VibesDisplayProps {
  vibeCheck: number | null;
}

function VibesDisplay({ vibeCheck }: VibesDisplayProps) {
  const getEmoji = (vibe: number | null) => {
    if (vibe === null) return "😐";
    if (vibe === 5) return "😍";
    if (vibe === 4) return "😊";
    if (vibe === 3) return "😐";
    if (vibe === 2) return "😕";
    if (vibe === 1) return "😞";
    return "😞";
  };

  const emoji = getEmoji(vibeCheck);
  const count = vibeCheck ?? 0;

  return (
    <div className="flex items-center gap-1 text-gray-600 text-sm">
      <span>{emoji}</span>
      <span className="font-medium">{count}</span>
    </div>
  );
}

interface CardProps {
  card: CardData | JobApplication;
  onDelete?: (id: string) => void;
  onClick?: (card: CardData | JobApplication) => void;
  isJobApplication?: boolean;
}

export function Card({ card, onDelete, onClick, isJobApplication = false }: CardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);
  const hasMoved = useRef(false);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (onDelete) {
      onDelete(card.id);
    }
  }

  function handleMouseDown(e: React.MouseEvent) {
    // Don't track if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    mouseDownPos.current = { x: e.clientX, y: e.clientY };
    hasMoved.current = false;
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (mouseDownPos.current) {
      const deltaX = Math.abs(e.clientX - mouseDownPos.current.x);
      const deltaY = Math.abs(e.clientY - mouseDownPos.current.y);
      // If moved more than 5px, consider it a drag
      if (deltaX > 5 || deltaY > 5) {
        hasMoved.current = true;
      }
    }
  }

  function handleMouseUp(e: React.MouseEvent) {
    // Don't trigger if clicking on buttons
    if ((e.target as HTMLElement).closest('button')) {
      mouseDownPos.current = null;
      hasMoved.current = false;
      return;
    }
    // Only trigger click if mouse didn't move (it was a click, not a drag)
    if (mouseDownPos.current && !hasMoved.current && onClick) {
      onClick(card);
    }
    mouseDownPos.current = null;
    hasMoved.current = false;
  }

  function handleMouseLeave() {
    // Clean up on mouse leave
    mouseDownPos.current = null;
    hasMoved.current = false;
  }

  function handleTouchStart(e: React.TouchEvent) {
    // Don't track if touching buttons
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    const touch = e.touches[0];
    mouseDownPos.current = { x: touch.clientX, y: touch.clientY };
    hasMoved.current = false;
  }

  function handleTouchMove(e: React.TouchEvent) {
    if (mouseDownPos.current) {
      const touch = e.touches[0];
      const deltaX = Math.abs(touch.clientX - mouseDownPos.current.x);
      const deltaY = Math.abs(touch.clientY - mouseDownPos.current.y);
      // If moved more than 5px, consider it a drag
      if (deltaX > 5 || deltaY > 5) {
        hasMoved.current = true;
      }
    }
  }

  function handleTouchEnd(e: React.TouchEvent) {
    // Don't trigger if touching buttons
    if ((e.target as HTMLElement).closest('button')) {
      mouseDownPos.current = null;
      hasMoved.current = false;
      return;
    }
    // Only trigger click if touch didn't move (it was a tap, not a drag)
    if (mouseDownPos.current && !hasMoved.current && onClick) {
      onClick(card);
    }
    mouseDownPos.current = null;
    hasMoved.current = false;
  }

  // Legacy CardData format
  if (!isJobApplication) {
    const legacyCard = card as CardData;
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4 hover:shadow-md transition-shadow relative group"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div {...listeners} className="flex items-start gap-3 cursor-grab active:cursor-grabbing">
          <div className="flex-1 flex items-start gap-3">
            {legacyCard.icon && (
              <div className="shrink-0 mt-0.5">{legacyCard.icon}</div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-gray-900 text-sm">
                {legacyCard.title}
              </div>
              {legacyCard.subtitle && (
                <div className="text-gray-600 text-sm mt-1">{legacyCard.subtitle}</div>
              )}
            </div>
          </div>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
              aria-label="Delete"
            >
              <svg
                className="w-5 h-5 text-gray-500 hover:text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }

  // New JobApplication format
  const jobApp = card as JobApplication;
  
  // Determine if we should show calendar or waiting view
  const nextInterviewDate = jobApp.nextInterviewDate;
  const hasInterviewDate = nextInterviewDate !== null;
  const interviewDate = hasInterviewDate ? new Date(nextInterviewDate) : null;
  const isDateInPast = interviewDate ? interviewDate < new Date() : false;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="group w-full bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 relative overflow-hidden"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div {...listeners} className="cursor-grab active:cursor-grabbing">
        <div className="flex items-start gap-3 mb-3 relative">
          <CompanyLogo companyName={jobApp.companyName} logo={jobApp.logo} />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 leading-tight">
              {jobApp.companyName}
            </h3>
            {jobApp.jobTitle && (
              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                {jobApp.jobTitle}
              </p>
            )}
          </div>
          {onDelete && (
            <button
              onClick={handleDelete}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded shrink-0"
              aria-label="Delete"
            >
              <svg
                className="w-5 h-5 text-gray-500 hover:text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3 text-xs">
          {!hasInterviewDate || isDateInPast ? (
            <WaitingView interviewType={jobApp.nextInterviewType} />
          ) : (
            <CalendarView date={nextInterviewDate} interviewType={jobApp.nextInterviewType} />
          )}

          {jobApp.office && (
            <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 border border-purple-300 rounded-md text-purple-900 ml-auto">
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="font-medium text-xs">{jobApp.office}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          {jobApp.compensation && (
            <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
              <span className="text-xs">$</span>
              <span>
                {jobApp.compensation.startsWith("$") 
                  ? jobApp.compensation.slice(1)
                  : jobApp.compensation}
              </span>
            </div>
          )}
          <VibesDisplay vibeCheck={jobApp.vibeCheck} />
        </div>
      </div>
    </div>
  );
}

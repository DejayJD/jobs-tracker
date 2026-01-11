"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// Icon components
function XIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  );
}

function DollarSignIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
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
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function SmileIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function Building2Icon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a2 2 0 012-2h2a2 2 0 012 2v5m-4 0h4"
      />
    </svg>
  );
}

function getCompanyInitial(companyName: string): string {
  return companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getVibeEmoji(rating: number | null | undefined): string {
  if (!rating) return "😐";
  if (rating >= 5) return "🤩";
  if (rating >= 4) return "😊";
  if (rating >= 3) return "😐";
  if (rating >= 2) return "😕";
  return "😫";
}

function formatInterviewDate(dateString: string | null | undefined): { month: string; day: string } | null {
  if (!dateString) return null;
  try {
    const date = new Date(dateString);
    const month = date.toLocaleString("default", { month: "short" }).toUpperCase();
    const day = date.getDate().toString();
    return { month, day };
  } catch {
    return null;
  }
}

interface FormData {
  title: string;
  name: string;
  office?: string;
  compensation?: string;
  companySize?: string;
  notes?: string;
  status?: string;
  nextInterviewDate?: string;
  nextInterviewType?: string;
  vibeCheck?: number;
  source?: string;
  logo?: string;
}

interface CreateCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  defaultColumn?: string;
}

export function CreateCardModal({
  isOpen,
  onClose,
  onSubmit,
  defaultColumn,
}: CreateCardModalProps) {
  const [isSearchingLogo, setIsSearchingLogo] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      name: "",
      office: "",
      compensation: "",
      companySize: "",
      notes: "",
      status: "",
      nextInterviewDate: "",
      nextInterviewType: "",
      vibeCheck: 3,
      source: "",
      logo: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      // Reset form when modal opens
      reset({
        title: "",
        name: "",
        office: "",
        compensation: "",
        companySize: "",
        notes: "",
        status: "",
        nextInterviewDate: "",
        nextInterviewType: "",
        vibeCheck: 3,
        source: "",
        logo: "",
      });
    }
  }, [isOpen, defaultColumn, reset]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const [isVisible, setIsVisible] = useState(false);

  // Handle animation state
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible && !isOpen) return null;

  async function onSubmitForm(data: FormData) {
    try {
      // Clean up empty strings and convert to undefined
      const cleanedData: FormData = {
        ...data,
        office: data.office?.trim() || undefined,
        compensation: data.compensation?.trim() || undefined,
        companySize: data.companySize?.trim() || undefined,
        notes: data.notes?.trim() || undefined,
        status: data.status?.trim() || undefined,
        nextInterviewDate: data.nextInterviewDate?.trim() || undefined,
        nextInterviewType: data.nextInterviewType?.trim() || undefined,
        vibeCheck: data.vibeCheck,
        source: data.source?.trim() || undefined,
        logo: data.logo?.trim() || undefined,
      };
      await onSubmit(cleanedData);
      onClose();
    } catch (error) {
      console.error("Failed to create card:", error);
    }
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  async function handleLogoClick() {
    const companyName = watch("title");
    if (!companyName) {
      alert("Please enter a company name first");
      return;
    }

    setIsSearchingLogo(true);
    try {
      const response = await fetch(`/api/logo-search?companyName=${encodeURIComponent(companyName)}`);
      if (!response.ok) {
        throw new Error("Failed to search for logo");
      }
      const data = await response.json();
      
      if (data.logo) {
        setValue("logo", data.logo);
      } else {
        alert("No logo found for this company");
      }
    } catch (error) {
      console.error("Failed to search for logo:", error);
      alert(`Failed to search for logo: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setIsSearchingLogo(false);
    }
  }

  const companyInitial = getCompanyInitial(watch("title") || "");
  const interviewDate = formatInterviewDate(watch("nextInterviewDate"));
  const vibeCheckValue = watch("vibeCheck") ?? 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className={`relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out flex flex-col max-h-[90vh] overflow-hidden ${isOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmitForm)} className="flex flex-col h-full">
          {/* Header Section */}
          <div className="flex items-start justify-between p-6 sm:p-8 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-start gap-5 flex-1">
              {/* Company Logo / Initial */}
              <div 
                onClick={handleLogoClick}
                className={`flex items-center justify-center w-16 h-16 rounded-xl bg-blue-100 text-blue-600 text-2xl font-bold shadow-sm shrink-0 cursor-pointer hover:bg-blue-200 transition-colors relative ${isSearchingLogo ? 'opacity-50' : ''}`}
                title="Click to search for company logo"
              >
                {isSearchingLogo ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    {watch("logo") ? (
                      <img
                        src={watch("logo")}
                        alt={watch("title") || "Company"}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      companyInitial || "?"
                    )}
                  </>
                )}
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <input
                  id="title"
                  type="text"
                  {...register("title", { required: true })}
                  placeholder="Company Name"
                  className="text-2xl font-bold text-gray-900 leading-tight w-full bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-gray-400"
                />
                <input
                  id="name"
                  type="text"
                  {...register("name", { required: true })}
                  placeholder="Job Title"
                  className="text-lg text-gray-600 font-medium w-full bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-gray-400"
                />
                <input
                  id="source"
                  type="url"
                  {...register("source")}
                  placeholder="Job Posting URL"
                  className="text-sm text-gray-500 font-normal w-full bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-gray-400"
                />
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
              aria-label="Close modal"
              type="button"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto p-6 sm:p-8 flex-1 min-h-0">
            <div className="grid grid-cols-2 gap-8 h-full">
              {/* Left Column - Form Fields */}
              <div className="space-y-8 min-w-0 overflow-x-hidden">
                {/* Key Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                  {/* Next Interview */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      Next Interview
                    </span>
                    <div className="flex items-center gap-3">
                      {interviewDate ? (
                        <>
                          <div className="inline-flex flex-col items-center justify-center px-3 py-1.5 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-900 font-medium min-w-[60px]">
                            <span className="text-[10px] uppercase font-bold leading-none mb-0.5">
                              {interviewDate.month}
                            </span>
                            <span className="text-lg font-bold leading-none">
                              {interviewDate.day}
                            </span>
                          </div>
                          <input
                            id="nextInterviewType"
                            type="text"
                            {...register("nextInterviewType")}
                            placeholder="Interview Type"
                            className="text-gray-700 font-medium w-full bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-gray-400"
                          />
                        </>
                      ) : (
                        <div className="flex items-center gap-3 w-full">
                          <input
                            id="nextInterviewDate"
                            type="date"
                            {...register("nextInterviewDate")}
                            className="text-gray-700 font-medium bg-transparent border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <input
                            id="nextInterviewType"
                            type="text"
                            {...register("nextInterviewType")}
                            placeholder="Interview Type"
                            className="text-gray-700 font-medium flex-1 bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-gray-400"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Compensation */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSignIcon className="w-3.5 h-3.5" />
                      Compensation
                    </span>
                    <input
                      id="compensation"
                      type="text"
                      {...register("compensation")}
                      placeholder="Enter compensation"
                      className="text-xl font-semibold text-green-600 w-full bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-green-400"
                    />
                  </div>

                  {/* Office Req */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      Location Type
                    </span>
                    <input
                      id="office"
                      type="text"
                      {...register("office")}
                      placeholder="Enter location type"
                      className="text-gray-900 font-medium w-full bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Company Size */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <UsersIcon className="w-3.5 h-3.5" />
                      Company Size
                    </span>
                    <input
                      id="companySize"
                      type="text"
                      {...register("companySize")}
                      placeholder="Enter company size"
                      className="text-gray-900 font-medium w-full bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Vibe Check */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <SmileIcon className="w-3.5 h-3.5" />
                      Vibe Check
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl" role="img" aria-label="vibe emoji">
                        {getVibeEmoji(vibeCheckValue)}
                      </span>
                      <div className="flex items-center">
                        <input
                          type="number"
                          min="1"
                          max="5"
                          step="1"
                          {...register("vibeCheck", { 
                            valueAsNumber: true,
                            min: 1,
                            max: 5
                          })}
                          className="text-lg font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 inline-block w-[1ch] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-lg font-bold text-gray-500 ml-0.5">
                          /5
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Notes Section */}
              <div className="space-y-3 flex flex-col h-full min-h-0">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                  <Building2Icon className="w-3.5 h-3.5" />
                  Notes
                </span>
                <textarea
                  id="notes"
                  {...register("notes")}
                  placeholder="Enter notes..."
                  className="w-full flex-1 min-h-0 bg-gray-50 rounded-xl p-4 text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

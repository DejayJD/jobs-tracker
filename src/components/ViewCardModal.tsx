"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { JobApplication } from "./Card";

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
  office?: string | null;
  compensation?: string | null;
  companySize?: string | null;
  notes?: string | null;
  status?: string | null;
  nextInterviewDate?: string | null;
  nextInterviewType?: string | null;
  vibeCheck?: number | null;
  source?: string | null;
  logo?: string | null;
}

interface ViewCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: FormData) => Promise<void>;
  jobApplication: JobApplication | null;
}

export function ViewCardModal({
  isOpen,
  onClose,
  onUpdate,
  jobApplication,
}: ViewCardModalProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [isSearchingLogo, setIsSearchingLogo] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
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
    if (isOpen && jobApplication) {
      reset({
        title: jobApplication.companyName,
        name: jobApplication.jobTitle || "",
        office: jobApplication.office || "",
        compensation: jobApplication.compensation || "",
        companySize: jobApplication.companySize || "",
        notes: jobApplication.notes || "",
        status: jobApplication.status || "",
        nextInterviewDate: jobApplication.nextInterviewDate 
          ? new Date(jobApplication.nextInterviewDate).toISOString().split('T')[0]
          : "",
        nextInterviewType: jobApplication.nextInterviewType || "",
        vibeCheck: jobApplication.vibeCheck ?? 3,
        source: jobApplication.source || "",
        logo: jobApplication.logo || "",
      });
      setEditingField(null);
    }
  }, [isOpen, jobApplication, reset]);

  useEffect(() => {
    if (!isOpen) return;

    function handleEscapeKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (editingField) {
          setEditingField(null);
        } else {
          onClose();
        }
      }
    }

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose, editingField]);

  if (!isOpen || !jobApplication) return null;

  async function onSubmitForm(data: FormData) {
    if (!jobApplication) return;
    
    try {
      // Clean up empty strings - convert to null for optional fields, keep required fields
      const cleanedData: FormData = {
        title: data.title?.trim() || "",
        name: data.name?.trim() || "",
        office: data.office?.trim() || null,
        compensation: data.compensation?.trim() || null,
        companySize: data.companySize?.trim() || null,
        notes: data.notes?.trim() || null,
        status: data.status?.trim() || null,
        nextInterviewDate: data.nextInterviewDate?.trim() || null,
        nextInterviewType: data.nextInterviewType?.trim() || null,
        vibeCheck: data.vibeCheck ?? null,
        source: data.source?.trim() || null,
        logo: data.logo?.trim() || null,
      };
      console.log("Submitting form data:", cleanedData);
      await onUpdate(jobApplication.id, cleanedData);
      setEditingField(null);
      console.log("Update successful");
    } catch (error) {
      console.error("Failed to update card:", error);
      alert(`Failed to save changes: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) {
      if (editingField) {
        // Save before closing edit mode
        const currentValues = getValues();
        await onSubmitForm(currentValues);
      } else {
        onClose();
      }
    }
  }

  async function handleFieldClick(fieldName: string) {
    // If switching fields, save the current one first
    if (editingField && editingField !== fieldName) {
      const currentValues = getValues();
      await onSubmitForm(currentValues);
    }
    setEditingField(fieldName);
  }

  async function handleFieldBlur(fieldName: string) {
    // Only auto-save if the field was actually edited
    if (editingField === fieldName) {
      // Use getValues to get current form state and submit directly
      const currentValues = getValues();
      await onSubmitForm(currentValues);
    }
  }

  async function handleClearInterview() {
    if (!jobApplication) return;
    
    try {
      const currentValues = getValues();
      const cleanedData: FormData = {
        ...currentValues,
        nextInterviewDate: null,
        nextInterviewType: null,
      };
      await onUpdate(jobApplication.id, cleanedData);
      // Reset the form fields
      reset({
        ...currentValues,
        nextInterviewDate: "",
        nextInterviewType: "",
      });
      setEditingField(null);
    } catch (error) {
      console.error("Failed to clear interview:", error);
      alert(`Failed to clear interview: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  }

  async function handleLogoClick() {
    if (!jobApplication) return;
    
    const companyName = watch("title") || jobApplication.companyName;
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
        // Auto-save the logo
        const currentValues = getValues();
        await onSubmitForm({
          ...currentValues,
          logo: data.logo,
        });
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

  function renderField(
    fieldName: keyof FormData,
    label: string,
    type: "text" | "textarea" | "range" | "date" = "text",
    placeholder?: string,
    rows?: number
  ) {
    const isEditing = editingField === fieldName;
    const value = watch(fieldName);

    if (isEditing) {
      if (type === "textarea") {
        return (
          <textarea
            {...register(fieldName)}
            placeholder={placeholder}
            rows={rows || 3}
            autoFocus
            onBlur={() => handleFieldBlur(fieldName)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) {
                handleFieldBlur(fieldName);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      } else if (type === "range") {
        return (
          <div>
            <input
              type="range"
              min="1"
              max="5"
              step="1"
              {...register(fieldName, { valueAsNumber: true })}
              autoFocus
              onBlur={() => handleFieldBlur(fieldName)}
              className="w-full"
            />
            <div className="text-sm text-gray-600 mt-1">
              Value: {watch(fieldName) || 3}
            </div>
          </div>
        );
      } else {
        return (
          <input
            type={type}
            {...register(fieldName)}
            placeholder={placeholder}
            autoFocus
            onBlur={() => handleFieldBlur(fieldName)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleFieldBlur(fieldName);
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        );
      }
    } else {
      let displayValue: string;
      if (fieldName === "vibeCheck") {
        displayValue = value ? String(value) : "Not set";
      } else if (fieldName === "nextInterviewDate" && value) {
        // Format date for display
        try {
          const date = new Date(value as string);
          displayValue = date.toLocaleDateString();
        } catch {
          displayValue = String(value);
        }
      } else {
        displayValue = (value as string) || "Click to edit";
      }
      const isEmpty = !value || value === "";

      return (
        <div
          onClick={() => handleFieldClick(fieldName)}
          className={`w-full px-3 py-2 border border-transparent rounded-md cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors ${
            isEmpty ? "text-gray-400 italic" : "text-gray-900"
          }`}
        >
          {type === "textarea" ? (
            <div className="whitespace-pre-wrap min-h-12">
              {displayValue}
            </div>
          ) : (
            <div>{displayValue}</div>
          )}
        </div>
      );
    }
  }

  const companyInitial = getCompanyInitial(watch("title") || jobApplication.companyName);
  const interviewDate = formatInterviewDate(jobApplication.nextInterviewDate || watch("nextInterviewDate"));
  const vibeCheckValue = watch("vibeCheck") ?? jobApplication.vibeCheck ?? 3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ease-out"
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl transform transition-all duration-300 ease-out flex flex-col max-h-[95vh] overflow-hidden"
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
                    {watch("logo") || jobApplication.logo ? (
                      <img
                        src={watch("logo") || jobApplication.logo || ""}
                        alt={watch("title") || jobApplication.companyName}
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      companyInitial
                    )}
                  </>
                )}
              </div>

              <div className="space-y-1 flex-1 min-w-0">
                <div
                  onClick={() => handleFieldClick("title")}
                  className="cursor-pointer hover:bg-gray-100/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
                >
                  {editingField === "title" ? (
                    <input
                      {...register("title")}
                      autoFocus
                      onBlur={() => handleFieldBlur("title")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleFieldBlur("title");
                        }
                      }}
                      className="text-2xl font-bold text-gray-900 leading-tight w-full bg-transparent border-none outline-none focus:ring-0 p-0"
                    />
                  ) : (
                    <h2
                      id="modal-title"
                      className="text-2xl font-bold text-gray-900 leading-tight"
                    >
                      {watch("title") || jobApplication.companyName || "Click to edit"}
                    </h2>
                  )}
                </div>
                <div
                  onClick={() => handleFieldClick("name")}
                  className="cursor-pointer hover:bg-gray-100/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
                >
                  {editingField === "name" ? (
                    <input
                      {...register("name")}
                      autoFocus
                      onBlur={() => handleFieldBlur("name")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleFieldBlur("name");
                        }
                      }}
                      className="text-lg text-gray-600 font-medium w-full bg-transparent border-none outline-none focus:ring-0 p-0"
                    />
                  ) : (
                    <p className="text-lg text-gray-600 font-medium">
                      {watch("name") || jobApplication.jobTitle || "Click to edit"}
                    </p>
                  )}
                </div>
                <div
                  onClick={() => handleFieldClick("source")}
                  className="cursor-pointer hover:bg-gray-100/50 rounded px-2 py-1 -mx-2 -my-1 transition-colors"
                >
                  {editingField === "source" ? (
                    <input
                      {...register("source")}
                      autoFocus
                      onBlur={() => handleFieldBlur("source")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleFieldBlur("source");
                        }
                      }}
                      placeholder="Job Posting URL"
                      className="text-sm text-gray-500 font-normal w-full bg-transparent border-none outline-none focus:ring-0 p-0 placeholder:text-gray-400"
                    />
                  ) : (
                    <p className="text-sm text-gray-500 font-normal">
                      {watch("source") || jobApplication.source ? (
                        <a
                          href={watch("source") || jobApplication.source || ""}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-600 underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {watch("source") || jobApplication.source}
                        </a>
                      ) : (
                        "Click to add job posting"
                      )}
                    </p>
                  )}
                </div>
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
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        Next Interview
                      </span>
                      {interviewDate && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearInterview();
                          }}
                          className="text-xs text-gray-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
                          type="button"
                          title="Clear interview"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      {interviewDate || editingField === "nextInterviewDate" ? (
                        <>
                          {editingField === "nextInterviewDate" ? (
                            <input
                              type="date"
                              {...register("nextInterviewDate")}
                              autoFocus
                              onBlur={() => handleFieldBlur("nextInterviewDate")}
                              className="text-gray-700 font-medium bg-transparent border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            <div
                              onClick={() => handleFieldClick("nextInterviewDate")}
                              className="inline-flex flex-col items-center justify-center px-3 py-1.5 bg-yellow-50 border border-yellow-300 rounded-lg text-yellow-900 font-medium min-w-[60px] cursor-pointer hover:bg-yellow-100 transition-colors"
                              title="Click to edit date"
                            >
                              <span className="text-[10px] uppercase font-bold leading-none mb-0.5">
                                {interviewDate?.month}
                              </span>
                              <span className="text-lg font-bold leading-none">
                                {interviewDate?.day}
                              </span>
                            </div>
                          )}
                          <div
                            onClick={() => handleFieldClick("nextInterviewType")}
                            className="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 transition-colors flex-1"
                          >
                            {editingField === "nextInterviewType" ? (
                              <input
                                {...register("nextInterviewType")}
                                autoFocus
                                onBlur={() => handleFieldBlur("nextInterviewType")}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleFieldBlur("nextInterviewType");
                                  }
                                }}
                                className="text-gray-700 font-medium w-full bg-transparent border-none outline-none focus:ring-0 p-0"
                              />
                            ) : (
                              <span className="text-gray-700 font-medium">
                                {watch("nextInterviewType") || jobApplication.nextInterviewType || "Click to edit"}
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <div
                          onClick={() => handleFieldClick("nextInterviewDate")}
                          className="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 transition-colors text-gray-400 italic"
                        >
                          {editingField === "nextInterviewDate" ? (
                            <input
                              type="date"
                              {...register("nextInterviewDate")}
                              autoFocus
                              onBlur={() => handleFieldBlur("nextInterviewDate")}
                              className="text-gray-700 font-medium bg-transparent border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          ) : (
                            "Click to add date"
                          )}
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
                    <div
                      onClick={() => handleFieldClick("compensation")}
                      className="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 transition-colors"
                    >
                      {editingField === "compensation" ? (
                        <input
                          {...register("compensation")}
                          autoFocus
                          onBlur={() => handleFieldBlur("compensation")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleFieldBlur("compensation");
                            }
                          }}
                          className="text-xl font-semibold text-green-600 w-full bg-transparent border-none outline-none focus:ring-0 p-0"
                        />
                      ) : (
                        <div className="text-xl font-semibold text-green-600">
                          {watch("compensation") || jobApplication.compensation || "Click to edit"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Office Req */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPinIcon className="w-3.5 h-3.5" />
                      Location Type
                    </span>
                    <div
                      onClick={() => handleFieldClick("office")}
                      className="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 transition-colors"
                    >
                      {editingField === "office" ? (
                        <input
                          {...register("office")}
                          autoFocus
                          onBlur={() => handleFieldBlur("office")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleFieldBlur("office");
                            }
                          }}
                          className="text-gray-900 font-medium w-full bg-transparent border-none outline-none focus:ring-0 p-0"
                        />
                      ) : (
                        <div className="text-gray-900 font-medium">
                          {watch("office") || jobApplication.office || "Click to edit"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Company Size */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <UsersIcon className="w-3.5 h-3.5" />
                      Company Size
                    </span>
                    <div
                      onClick={() => handleFieldClick("companySize")}
                      className="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 transition-colors"
                    >
                      {editingField === "companySize" ? (
                        <input
                          {...register("companySize")}
                          autoFocus
                          onBlur={() => handleFieldBlur("companySize")}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleFieldBlur("companySize");
                            }
                          }}
                          className="text-gray-900 font-medium w-full bg-transparent border-none outline-none focus:ring-0 p-0"
                        />
                      ) : (
                        <div className="text-gray-900 font-medium">
                          {watch("companySize") || jobApplication.companySize || "Click to edit"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Vibe Check */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                      <SmileIcon className="w-3.5 h-3.5" />
                      Vibe Check
                    </span>
                    <div
                      onClick={() => handleFieldClick("vibeCheck")}
                      className="cursor-pointer hover:bg-gray-50 rounded px-2 py-1 -mx-2 transition-colors flex items-center gap-2"
                    >
                      {editingField === "vibeCheck" ? (
                        <div className="flex items-center gap-2 w-full">
                          <span className="text-2xl" role="img" aria-label="vibe emoji">
                            {getVibeEmoji(watch("vibeCheck") ?? vibeCheckValue)}
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
                              autoFocus
                              onBlur={() => handleFieldBlur("vibeCheck")}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleFieldBlur("vibeCheck");
                                }
                              }}
                              className="text-lg font-bold text-gray-900 bg-transparent border-none outline-none focus:ring-0 p-0 inline-block w-[1ch] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-lg font-bold text-gray-500 ml-0.5">
                              /5
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="text-2xl" role="img" aria-label="vibe emoji">
                            {getVibeEmoji(vibeCheckValue)}
                          </span>
                          <span className="text-lg font-bold text-gray-900">
                            {vibeCheckValue}/5
                          </span>
                        </>
                      )}
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
                <div
                  onClick={() => handleFieldClick("notes")}
                  className="cursor-pointer hover:bg-gray-100 rounded-xl p-4 text-gray-700 leading-relaxed whitespace-pre-wrap border border-gray-100 bg-gray-50 transition-colors flex-1 min-h-0 flex flex-col"
                >
                  {editingField === "notes" ? (
                    <textarea
                      {...register("notes")}
                      autoFocus
                      onBlur={() => handleFieldBlur("notes")}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && e.ctrlKey) {
                          handleFieldBlur("notes");
                        }
                      }}
                      className="w-full h-full bg-transparent border-none outline-none focus:ring-0 p-0 resize-none"
                    />
                  ) : (
                    <div className="flex-1 overflow-y-auto">
                      {watch("notes") || jobApplication.notes || "Click to add notes"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex justify-end">
            <span className="text-xs text-gray-400 font-medium">
              Last updated {jobApplication.updatedAt ? new Date(jobApplication.updatedAt).toLocaleString() : "just now"}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}


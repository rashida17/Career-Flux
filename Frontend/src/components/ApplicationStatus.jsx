
import { useMemo, useState } from "react";
import { ArrowRight, FileText } from "lucide-react";

const statusConfig = [
  { key: "applied", label: "Applied", color: "#C84B31" },
  { key: "in_review", label: "In Review", color: "#E59836" },
  { key: "accepted", label: "Accepted", color: "#2A9D8F" },
  { key: "rejected", label: "Rejected", color: "#8B3A2B" },
];

export default function ApplicationStatus({
  userApplications = [],
  onNavigate,
}) {
  const [activeStatus, setActiveStatus] = useState(null);

  const counts = useMemo(() => {
    const result = {
      applied: 0,
      in_review: 0,
      accepted: 0,
      rejected: 0,
    };

    userApplications.forEach((application) => {
      const status = String(application.status || "")
        .toLowerCase()
        .replace(/[\s-]+/g, "_");

      if (Object.prototype.hasOwnProperty.call(result, status)) {
        result[status] += 1;
      }
    });

    return result;
  }, [userApplications]);

  const total = Object.values(counts).reduce(
    (sum, value) => sum + value,
    0
  );

  const activeStatuses = statusConfig.filter(
    (status) => counts[status.key] > 0
  );

  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  const chartSegments = statusConfig.map((status, index) => {
    const value = counts[status.key];

    const segmentLength =
      total > 0 ? (value / total) * circumference : 0;
    const dashOffset = statusConfig
      .slice(0, index)
      .reduce(
        (length, previous) =>
          length + (total > 0 ? (counts[previous.key] / total) * circumference : 0),
        0,
      );

    const segment = {
      ...status,
      value,
      dashArray: `${segmentLength} ${circumference}`,
      dashOffset: -dashOffset,
    };

    return segment;
  });

  const selectedStatus = statusConfig.find(
    (status) => status.key === activeStatus
  );

  const centerValue = selectedStatus
    ? counts[selectedStatus.key]
    : total;

  const centerLabel = selectedStatus
    ? selectedStatus.label
    : "Applications";

  const handleStatusEnter = (key) => setActiveStatus(key);
  const handleStatusLeave = () => setActiveStatus(null);

  return (
    <section className="w-full min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md sm:p-5">

      {/* HEADER */}
      <div className="mb-5 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <h2 className="text-base font-extrabold text-stone-800">
            Application Status
          </h2>

          <p className="mt-1 text-xs text-stone-500">
            Track your job application progress
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate?.("My Applications")}
          className="flex shrink-0 items-center gap-1 text-xs font-semibold text-[#C84B31] transition-all hover:gap-2"
        >
          View All
          <ArrowRight size={14} />
        </button>
      </div>

      {total > 0 ? (
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">

          {/* DONUT CHART */}
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center sm:h-32 sm:w-32">
            <svg
              viewBox="0 0 120 120"
              className="h-full w-full -rotate-90 overflow-visible"
            >
              <circle
                cx="60"
                cy="60"
                r={radius}
                fill="none"
                stroke="#F5F5F4"
                strokeWidth="12"
              />

              {chartSegments.map((segment) => {
                if (segment.value === 0) return null;

                const isActive = activeStatus === segment.key;
                const hasActive = activeStatus !== null;

                return (
                  <circle
                    key={segment.key}
                    cx="60"
                    cy="60"
                    r={radius}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth={isActive ? 16 : 12}
                    strokeDasharray={segment.dashArray}
                    strokeDashoffset={segment.dashOffset}
                    strokeLinecap="butt"
                    opacity={hasActive && !isActive ? 0.25 : 1}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      transform: isActive ? "scale(1.04)" : "scale(1)",
                      transformOrigin: "60px 60px",
                    }}
                    onMouseEnter={() =>
                      handleStatusEnter(segment.key)
                    }
                    onMouseLeave={handleStatusLeave}
                  />
                );
              })}
            </svg>

            {/* CENTER VALUE */}
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-extrabold tracking-tight text-stone-800 transition-all sm:text-3xl">
                {centerValue}
              </span>

              <span className="mt-1 text-[9px] font-medium text-stone-500 sm:text-[10px]">
                {centerLabel}
              </span>
            </div>
          </div>

          {/* ACTIVE STATUS LIST */}
          <div className="min-w-0 flex-1 space-y-1">
            {activeStatuses.map((status) => {
              const isActive = activeStatus === status.key;

              return (
                <div
                  key={status.key}
                  onMouseEnter={() =>
                    handleStatusEnter(status.key)
                  }
                  onMouseLeave={handleStatusLeave}
                  className={`flex w-full min-w-0 cursor-pointer items-center justify-between gap-1 rounded-lg px-1.5 py-2 transition-all duration-200 sm:px-2 ${
                    isActive
                      ? "bg-stone-50"
                      : "bg-transparent hover:bg-stone-50/70"
                  }`}
                >
                  {/* LABEL */}
                  <div className="flex min-w-0 items-center gap-1.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full transition-transform duration-200 sm:h-2.5 sm:w-2.5"
                      style={{
                        backgroundColor: status.color,
                        transform: isActive ? "scale(1.35)" : "scale(1)",
                      }}
                    />

                    <span
                      className={`truncate text-[11px] transition-colors sm:text-xs ${
                        isActive
                          ? "font-bold text-stone-900"
                          : "font-medium text-stone-600"
                      }`}
                    >
                      {status.label}
                    </span>
                  </div>

                  {/* NUMBER */}
                  <span
                    className={`w-5 shrink-0 text-right text-xs tabular-nums transition-all sm:text-sm ${
                      isActive
                        ? "scale-110 font-extrabold text-stone-900"
                        : "font-bold text-stone-700"
                    }`}
                  >
                    {counts[status.key]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-7 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400">
            <FileText size={25} />
          </div>

          <h3 className="text-sm font-bold text-stone-700">
            No Applications Yet
          </h3>

          <p className="mt-1 max-w-xs text-xs leading-5 text-stone-500">
            Your application statistics will appear here once you start
            applying for jobs.
          </p>

          <button
            type="button"
            onClick={() => onNavigate?.("Find Jobs")}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#C84B31] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#A93823]"
          >
            Explore Jobs
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </section>
  );
}

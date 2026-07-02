import React from "react";
import { XCircle } from "lucide-react";

const STAGES = [
  { key: "placed", label: "Placed" },
  { key: "preparing", label: "Preparing" },
  { key: "delivered", label: "Delivered" },
];

function getStageIndex(status) {
  if (status === "Placed" || status === "Confirmed") return 0;
  if (status === "Preparing" || status === "Out for Delivery") return 1;
  if (status === "Delivered") return 2;
  return -1;
}

export default function OrderStatusTracker({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 rounded-xl">
        <XCircle size={18} className="text-red-500" />
        <span className="text-sm font-semibold text-red-600">Order Cancelled</span>
      </div>
    );
  }

  const currentIndex = getStageIndex(status);
  const progress = currentIndex >= 0 ? ((currentIndex + 1) / STAGES.length) * 100 : 0;

  return (
    <div>
      {/* Progress bar */}
      <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Stage labels */}
      <div className="flex justify-between mt-2">
        {STAGES.map((stage, i) => {
          const isComplete = i < currentIndex;
          const isActive = i === currentIndex;
          return (
            <div key={stage.key} className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full transition-all ${
                  isComplete
                    ? "bg-green-500"
                    : isActive
                    ? "bg-orange-500 ring-2 ring-orange-200"
                    : "bg-gray-200"
                }`}
              />
              <span
                className={`text-[11px] font-medium transition-colors ${
                  isActive
                    ? "text-orange-600"
                    : isComplete
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
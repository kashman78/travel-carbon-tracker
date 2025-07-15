import { cn } from "@/lib/utils";

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressStepper({ currentStep, totalSteps }: ProgressStepperProps) {
  const steps = [
    { number: 1, label: "Basic Info" },
    { number: 2, label: "Travel Details" },
    { number: 3, label: "Review & Submit" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                  currentStep >= step.number
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-gray-600"
                )}
              >
                {step.number}
              </div>
              <span
                className={cn(
                  "ml-3 text-sm font-medium transition-colors",
                  currentStep >= step.number
                    ? "text-primary"
                    : "text-gray-500"
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-gray-300 mx-4 min-w-16"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

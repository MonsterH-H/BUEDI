
import * as React from "react"
import { cn } from "@/lib/utils"

interface MultiStepFormProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number
  totalSteps: number
}

const MultiStepForm = React.forwardRef<HTMLDivElement, MultiStepFormProps>(
  ({ className, currentStep, totalSteps, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("grid gap-6 w-full", className)}
      {...props}
    />
  )
)
MultiStepForm.displayName = "MultiStepForm"

const MultiStepFormHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("space-y-3", className)}
    {...props}
  />
))
MultiStepFormHeader.displayName = "MultiStepFormHeader"

const MultiStepFormFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-between mt-6", className)}
    {...props}
  />
))
MultiStepFormFooter.displayName = "MultiStepFormFooter"

interface MultiStepFormBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  showContent: boolean
}

const MultiStepFormBody = React.forwardRef<HTMLDivElement, MultiStepFormBodyProps>(
  ({ className, showContent, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "space-y-4 transition-all duration-300",
        showContent ? "opacity-100" : "opacity-0 absolute -z-10",
        className
      )}
      {...props}
    />
  )
)
MultiStepFormBody.displayName = "MultiStepFormBody"

interface StepIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number
  totalSteps: number
  labels?: string[]
}

const StepIndicator = React.forwardRef<HTMLDivElement, StepIndicatorProps>(
  ({ className, currentStep, totalSteps, labels, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between", className)}
        {...props}
      >
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors",
                index < currentStep
                  ? "bg-green-600 border-green-600 text-white"
                  : index === currentStep
                  ? "border-yellow-400 bg-yellow-400 text-white"
                  : "border-slate-200 bg-white text-slate-400"
              )}
            >
              {index < currentStep ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            {labels && (
              <span className={cn(
                "text-xs mt-1 font-medium",
                index === currentStep ? "text-slate-800" : "text-slate-500"
              )}>
                {labels[index]}
              </span>
            )}
          </div>
        ))}
      </div>
    )
  }
)
StepIndicator.displayName = "StepIndicator"

export {
  MultiStepForm,
  MultiStepFormHeader,
  MultiStepFormBody,
  MultiStepFormFooter,
  StepIndicator
}

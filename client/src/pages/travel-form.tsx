import { useState } from "react";
import { Card } from "@/components/ui/card";
import { ProgressStepper } from "@/components/travel-form/progress-stepper";
import { BasicInfoStep } from "@/components/travel-form/basic-info-step";
import { TravelDetailsStep } from "@/components/travel-form/travel-details-step";
import { ReviewStep } from "@/components/travel-form/review-step";
import { UserCog } from "lucide-react";

interface FormData {
  travelerName: string;
  baseLocation: string;
  travelDate: string;
  multipleTransport: boolean;
  segments: Array<{
    transportMode: "car" | "train" | "air" | "bus" | "bike";
    fromLocation: string;
    fromCoordinates: string;
    toLocation: string;
    toCoordinates: string;
  }>;
}

export default function TravelForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    travelerName: "",
    baseLocation: "",
    travelDate: "",
    multipleTransport: false,
    segments: [
      {
        transportMode: "car",
        fromLocation: "",
        fromCoordinates: "",
        toLocation: "",
        toCoordinates: "",
      },
    ],
  });

  const handleBasicInfoNext = (data: Pick<FormData, 'travelerName' | 'baseLocation' | 'travelDate'>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(2);
  };

  const handleTravelDetailsNext = (data: Pick<FormData, 'multipleTransport' | 'segments'>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  const handleEdit = (step: number) => {
    setCurrentStep(step);
  };

  const handleSuccess = () => {
    // Reset form and go back to step 1
    setFormData({
      travelerName: "",
      baseLocation: "",
      travelDate: "",
      multipleTransport: false,
      segments: [
        {
          transportMode: "car",
          fromLocation: "",
          fromCoordinates: "",
          toLocation: "",
          toCoordinates: "",
        },
      ],
    });
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <UserCog className="text-primary text-2xl h-6 w-6" />
            <h1 className="text-xl font-medium text-gray-900">Travel Itinerary & Carbon Tracker</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <ProgressStepper currentStep={currentStep} totalSteps={3} />
        
        <Card className="bg-white shadow-sm border">
          {currentStep === 1 && (
            <BasicInfoStep
              data={{
                travelerName: formData.travelerName,
                baseLocation: formData.baseLocation,
                travelDate: formData.travelDate,
              }}
              onNext={handleBasicInfoNext}
            />
          )}
          
          {currentStep === 2 && (
            <TravelDetailsStep
              data={{
                multipleTransport: formData.multipleTransport,
                segments: formData.segments,
              }}
              onNext={handleTravelDetailsNext}
              onBack={handleBack}
            />
          )}
          
          {currentStep === 3 && (
            <ReviewStep
              data={formData}
              onBack={handleBack}
              onEdit={handleEdit}
              onSuccess={handleSuccess}
            />
          )}
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>Travel Itinerary & Carbon Emissions Tracker • Built for sustainable travel planning</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

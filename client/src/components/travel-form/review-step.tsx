import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, Check, Edit, User, Route, UserCog } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { calculateDistance, calculateEmissions, getEmissionsByMode } from "@/lib/carbon-calculator";

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

interface ReviewStepProps {
  data: FormData;
  onBack: () => void;
  onEdit: (step: number) => void;
  onSuccess: () => void;
}

const transportIcons: Record<string, string> = {
  car: "🚗",
  train: "🚊",
  air: "✈️",
  bus: "🚌",
  bike: "🚴",
};

const baseLocationLabels: Record<string, string> = {
  "delhi": "Delhi",
  "bangalore": "Bangalore",
  "chhattisgarh": "Chhattisgarh",
  "jharkhand": "Jharkhand",
  "madhya-pradesh": "Madhya Pradesh",
  "maharashtra": "Maharashtra",
  "west-bengal": "West Bengal",
  "tanzania": "Tanzania",
  "zambia": "Zambia",
  "united-states": "United States",
};

export function ReviewStep({ data, onBack, onEdit, onSuccess }: ReviewStepProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Calculate emissions for preview
  const segmentsWithEmissions = data.segments.map(segment => {
    const fromCoords = segment.fromCoordinates.split(',').map(Number);
    const toCoords = segment.toCoordinates.split(',').map(Number);
    const distance = calculateDistance(fromCoords[0], fromCoords[1], toCoords[0], toCoords[1]);
    const emissions = calculateEmissions(segment.transportMode, distance);
    
    return {
      ...segment,
      distance,
      emissions,
    };
  });

  const emissionsByMode = getEmissionsByMode(segmentsWithEmissions);
  const totalEmissions = Object.values(emissionsByMode).reduce((sum, emissions) => sum + emissions, 0);

  const submitMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest("POST", "/api/itineraries", formData);
      return response.json();
    },
    onSuccess: (result) => {
      toast({
        title: "Success!",
        description: "Your travel itinerary has been submitted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/itineraries"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit itinerary. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    submitMutation.mutate(data);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">Review & Submit</h2>
        <p className="text-gray-600">Review your travel itinerary before submission.</p>
      </div>

      <div className="space-y-6">
        {/* Basic Info Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <User className="mr-2 h-5 w-5 text-primary" />
                Basic Information
              </span>
              <Button variant="ghost" size="sm" onClick={() => onEdit(1)}>
                <Edit className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm text-gray-500">Traveler</span>
                <p className="font-medium">{data.travelerName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Base Location</span>
                <p className="font-medium">{baseLocationLabels[data.baseLocation] || data.baseLocation}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Travel Date</span>
                <p className="font-medium">{new Date(data.travelDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Travel Itinerary Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Route className="mr-2 h-5 w-5 text-primary" />
                Travel Itinerary
              </span>
              <Button variant="ghost" size="sm" onClick={() => onEdit(2)}>
                <Edit className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {segmentsWithEmissions.map((segment, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded border">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium mr-4">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">
                        {transportIcons[segment.transportMode]} {segment.transportMode.charAt(0).toUpperCase() + segment.transportMode.slice(1)}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {segment.fromLocation.length > 30 ? segment.fromLocation.substring(0, 30) + "..." : segment.fromLocation} → {segment.toLocation.length > 30 ? segment.toLocation.substring(0, 30) + "..." : segment.toLocation}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Distance: ~{Math.round(segment.distance)} km • Estimated CO2: {Math.round(segment.emissions)} kg
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Carbon Emissions Summary */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center text-green-800">
              <UserCog className="mr-2 h-5 w-5" />
              Carbon Emissions Estimate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center p-4 bg-white rounded border">
                <span className="text-2xl mb-2 block">🚗</span>
                <p className="text-2xl font-bold text-gray-900">{Math.round(emissionsByMode.car)}</p>
                <p className="text-sm text-gray-500">kg CO2 (Car)</p>
              </div>
              <div className="text-center p-4 bg-white rounded border">
                <span className="text-2xl mb-2 block">🚊</span>
                <p className="text-2xl font-bold text-gray-900">{Math.round(emissionsByMode.train)}</p>
                <p className="text-sm text-gray-500">kg CO2 (Train)</p>
              </div>
              <div className="text-center p-4 bg-white rounded border">
                <span className="text-2xl mb-2 block">✈️</span>
                <p className="text-2xl font-bold text-gray-900">{Math.round(emissionsByMode.air)}</p>
                <p className="text-sm text-gray-500">kg CO2 (Air)</p>
              </div>
              <div className="text-center p-4 bg-white rounded border">
                <span className="text-2xl mb-2 block">🚌</span>
                <p className="text-2xl font-bold text-gray-900">{Math.round(emissionsByMode.bus)}</p>
                <p className="text-sm text-gray-500">kg CO2 (Bus)</p>
              </div>
              <div className="text-center p-4 bg-white rounded border">
                <span className="text-2xl mb-2 block">🚴</span>
                <p className="text-2xl font-bold text-gray-900">{Math.round(emissionsByMode.bike)}</p>
                <p className="text-sm text-gray-500">kg CO2 (Bike)</p>
              </div>
              <div className="text-center p-4 bg-green-600 text-white rounded">
                <UserCog className="mx-auto text-2xl mb-2 h-6 w-6" />
                <p className="text-2xl font-bold">{Math.round(totalEmissions)}</p>
                <p className="text-sm opacity-90">Total kg CO2</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Actions */}
        <div className="flex justify-between pt-6 border-t">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Edit
          </Button>
          <div className="space-x-3">
            <Button
              onClick={handleSubmit}
              disabled={submitMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitMutation.isPending ? (
                "Submitting..."
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Submit Itinerary
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

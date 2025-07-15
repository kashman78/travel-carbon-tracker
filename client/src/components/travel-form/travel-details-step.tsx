import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, Plus, Trash2, Info } from "lucide-react";
import { LocationSearch } from "./location-search";

const travelSegmentSchema = z.object({
  transportMode: z.enum(["car", "train", "air", "bus", "bike"]),
  fromLocation: z.string().min(1, "From location is required"),
  fromCoordinates: z.string().min(1, "From coordinates are required"),
  toLocation: z.string().min(1, "To location is required"),
  toCoordinates: z.string().min(1, "To coordinates are required"),
});

const travelDetailsSchema = z.object({
  multipleTransport: z.boolean(),
  segments: z.array(travelSegmentSchema).min(1, "At least one travel segment is required").max(5, "Maximum 5 travel segments allowed"),
});

type TravelDetailsData = z.infer<typeof travelDetailsSchema>;

interface TravelDetailsStepProps {
  data: TravelDetailsData;
  onNext: (data: TravelDetailsData) => void;
  onBack: () => void;
}

const transportModes = [
  { value: "car", label: "🚗 Car", emoji: "🚗" },
  { value: "train", label: "🚊 Train/Metro", emoji: "🚊" },
  { value: "air", label: "✈️ Air", emoji: "✈️" },
  { value: "bus", label: "🚌 Bus", emoji: "🚌" },
  { value: "bike", label: "🚴 Bike", emoji: "🚴" },
];

export function TravelDetailsStep({ data, onNext, onBack }: TravelDetailsStepProps) {
  const form = useForm<TravelDetailsData>({
    resolver: zodResolver(travelDetailsSchema),
    defaultValues: data,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "segments",
  });

  const multipleTransport = form.watch("multipleTransport");

  const handleMultipleTransportChange = (value: string) => {
    const isMultiple = value === "true";
    form.setValue("multipleTransport", isMultiple);
    
    // If switching to single transport, keep only the first segment
    if (!isMultiple && fields.length > 1) {
      for (let i = fields.length - 1; i > 0; i--) {
        remove(i);
      }
    }
  };

  const addSegment = () => {
    if (fields.length < 5) {
      append({
        transportMode: "car",
        fromLocation: "",
        fromCoordinates: "",
        toLocation: "",
        toCoordinates: "",
      });
    }
  };

  const removeSegment = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const onSubmit = (formData: TravelDetailsData) => {
    onNext(formData);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">Travel Details</h2>
        <p className="text-gray-600">Configure your travel itinerary and transportation modes.</p>
      </div>

      <Alert className="mb-6 border-amber-200 bg-amber-50">
        <Info className="h-4 w-4 text-amber-600" />
        <AlertDescription className="text-amber-800">
          <div>
            <h4 className="font-medium mb-1">Google Maps API Configuration</h4>
            <p className="text-sm">
              API Key: <code className="bg-amber-100 px-2 py-1 rounded text-xs">
                {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? "Configured" : "YOUR_GOOGLE_MAPS_API_KEY"}
              </code>
            </p>
          </div>
        </AlertDescription>
      </Alert>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Transport Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="multipleTransport"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Will you use multiple modes of transport?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={handleMultipleTransportChange}
                        value={field.value ? "true" : "false"}
                        className="flex space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="multiple-yes" />
                          <label htmlFor="multiple-yes" className="text-sm">Yes, multiple modes</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="multiple-no" />
                          <label htmlFor="multiple-no" className="text-sm">No, single mode</label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Travel Segment {index + 1}</span>
                  {multipleTransport && fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSegment(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name={`segments.${index}.transportMode`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Mode of Transport <span className="text-red-500">*</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select transport mode" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transportModes.map((mode) => (
                            <SelectItem key={mode.value} value={mode.value}>
                              {mode.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`segments.${index}.fromLocation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Travel From <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <LocationSearch
                          value={field.value}
                          onLocationSelect={(address, coordinates) => {
                            form.setValue(`segments.${index}.fromLocation`, address);
                            form.setValue(`segments.${index}.fromCoordinates`, coordinates);
                          }}
                          placeholder="Search for starting location..."
                          required
                        />
                      </FormControl>
                      {form.watch(`segments.${index}.fromCoordinates`) && (
                        <p className="text-xs text-gray-500">
                          GPS coordinates: {form.watch(`segments.${index}.fromCoordinates`)}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`segments.${index}.toLocation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Travel To <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <LocationSearch
                          value={field.value}
                          onLocationSelect={(address, coordinates) => {
                            form.setValue(`segments.${index}.toLocation`, address);
                            form.setValue(`segments.${index}.toCoordinates`, coordinates);
                          }}
                          placeholder="Search for destination..."
                          required
                        />
                      </FormControl>
                      {form.watch(`segments.${index}.toCoordinates`) && (
                        <p className="text-xs text-gray-500">
                          GPS coordinates: {form.watch(`segments.${index}.toCoordinates`)}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}

          {multipleTransport && fields.length < 5 && (
            <Card className="border-dashed">
              <CardContent className="pt-6">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={addSegment}
                  className="w-full border-dashed border-2 border-gray-300 h-20 hover:border-primary"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Travel Segment
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between pt-6 border-t">
            <Button type="button" variant="outline" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button type="submit" className="bg-primary hover:bg-blue-700">
              Review & Submit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

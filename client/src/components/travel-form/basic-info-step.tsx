import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight } from "lucide-react";

const basicInfoSchema = z.object({
  travelerName: z.string().min(1, "Traveler name is required"),
  baseLocation: z.string().min(1, "Base location is required"),
  travelDate: z.string().min(1, "Travel date is required"),
});

type BasicInfoData = z.infer<typeof basicInfoSchema>;

interface BasicInfoStepProps {
  data: BasicInfoData;
  onNext: (data: BasicInfoData) => void;
}

const baseLocations = [
  { value: "delhi", label: "Delhi" },
  { value: "bangalore", label: "Bangalore" },
  { value: "chhattisgarh", label: "Chhattisgarh" },
  { value: "jharkhand", label: "Jharkhand" },
  { value: "madhya-pradesh", label: "Madhya Pradesh" },
  { value: "maharashtra", label: "Maharashtra" },
  { value: "west-bengal", label: "West Bengal" },
  { value: "tanzania", label: "Tanzania" },
  { value: "zambia", label: "Zambia" },
  { value: "united-states", label: "United States" },
];

export function BasicInfoStep({ data, onNext }: BasicInfoStepProps) {
  const form = useForm<BasicInfoData>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: data,
  });

  const onSubmit = (formData: BasicInfoData) => {
    onNext(formData);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">Basic Information</h2>
        <p className="text-gray-600">Tell us about your travel details to get started.</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="travelerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Traveler Name <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="baseLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Base Location <span className="text-red-500">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your base location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {baseLocations.map((location) => (
                      <SelectItem key={location.value} value={location.value}>
                        {location.label}
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
            name="travelDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Travel Date (Start of Journey) <span className="text-red-500">*</span>
                </FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" className="bg-primary hover:bg-blue-700">
              Next Step
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

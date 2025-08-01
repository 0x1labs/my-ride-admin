import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect } from "react";
import { useUpdateVehicle } from "@/hooks/useVehicles";
import { Vehicle } from "@/types/vehicle";
import { toast } from "sonner";

const vehicleSchema = z.object({
  type: z.enum(["car", "bike"]),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  variant: z.string().optional(),
  year: z.coerce.number().min(1900, "Invalid year").max(new Date().getFullYear() + 1, "Invalid year"),
  owner: z.string().min(1, "Owner name is required"),
  phone: z.string().min(1, "Phone number is required"),
  lastService: z.string().min(1, "Last service date is required"),
  nextService: z.string().min(1, "Next service date is required"),
  lastServiceKilometers: z.coerce.number().min(0),
  currentKilometers: z.coerce.number().min(0),
  status: z.enum(["active", "overdue", "upcoming"]),
});

type VehicleFormData = z.infer<typeof vehicleSchema>;

interface EditVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle | null;
}

const EditVehicleModal = ({ isOpen, onClose, vehicle }: EditVehicleModalProps) => {
  const { mutate: updateVehicle, isPending } = useUpdateVehicle();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
  });

  useEffect(() => {
    if (vehicle) {
      reset({
        ...vehicle,
        lastService: vehicle.lastService.split('T')[0],
        nextService: vehicle.nextService.split('T')[0],
      });
    }
  }, [vehicle, reset]);

  const onSubmit = (data: VehicleFormData) => {
    if (!vehicle) return;
    updateVehicle(
      { id: vehicle.id, updates: data },
      {
        onSuccess: () => {
          toast.success("Motorbike updated successfully!");
          onClose();
        },
        onError: (error) => {
          toast.error(`Failed to update motorbike: ${error.message}`);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-ktm-dark-gray text-white">
        <DialogHeader>
          <DialogTitle className="text-ktm-orange">Edit Motorbike</DialogTitle>
          <DialogDescription className="text-ktm-light-gray">
            Update the details for {vehicle?.make} {vehicle?.model}.
          </DialogDescription>
        </DialogHeader>
        <form id="edit-vehicle-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-6">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="type" className="text-right text-ktm-light-gray">Type</Label>
            <Controller name="type" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="col-span-3 bg-ktm-black"><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent className="bg-ktm-dark-gray text-white">
                    <SelectItem value="car">Car</SelectItem>
                    <SelectItem value="bike">Bike</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            {errors.type && <p className="col-span-4 text-red-500 text-sm">{errors.type.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="make" className="text-right text-ktm-light-gray">Make</Label>
            <Controller name="make" control={control} render={({ field }) => <Input id="make" {...field} className="col-span-3 bg-ktm-black border-ktm-orange" />} />
            {errors.make && <p className="col-span-4 text-red-500 text-sm">{errors.make.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="model" className="text-right text-ktm-light-gray">Model</Label>
            <Controller name="model" control={control} render={({ field }) => <Input id="model" {...field} className="col-span-3 bg-ktm-black border-ktm-orange" />} />
            {errors.model && <p className="col-span-4 text-red-500 text-sm">{errors.model.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="variant" className="text-right text-ktm-light-gray">Variant</Label>
            <Controller name="variant" control={control} render={({ field }) => <Input id="variant" {...field} className="col-span-3 bg-ktm-black border-ktm-orange" />} />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right text-ktm-light-gray">Year</Label>
            <Controller name="year" control={control} render={({ field }) => <Input id="year" type="number" {...field} className="col-span-3 bg-ktm-black border-ktm-orange" />} />
            {errors.year && <p className="col-span-4 text-red-500 text-sm">{errors.year.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="owner" className="text-right text-ktm-light-gray">Owner</Label>
            <Controller name="owner" control={control} render={({ field }) => <Input id="owner" {...field} className="col-span-3 bg-ktm-black border-ktm-orange" />} />
            {errors.owner && <p className="col-span-4 text-red-500 text-sm">{errors.owner.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right text-ktm-light-gray">Phone</Label>
            <Controller name="phone" control={control} render={({ field }) => <Input id="phone" {...field} className="col-span-3 bg-ktm-black border-ktm-orange" />} />
            {errors.phone && <p className="col-span-4 text-red-500 text-sm">{errors.phone.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastService" className="text-right text-ktm-light-gray">Last Service</Label>
            <Controller name="lastService" control={control} render={({ field }) => <Input id="lastService" type="date" {...field} className="col-span-3 bg-ktm-black border-ktm-orange" />} />
            {errors.lastService && <p className="col-span-4 text-red-500 text-sm">{errors.lastService.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="nextService" className="text-right text-ktm-light-gray">Next Service</Label>
            <Controller name="nextService" control={control} render={({ field }) => <Input id="nextService" type="date" {...field} className="col-span-3 bg-ktm-black border-ktm-orange" />} />
            {errors.nextService && <p className="col-span-4 text-red-500 text-sm">{errors.nextService.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="lastServiceKilometers" className="text-right text-ktm-light-gray">Last Svc KM</Label>
            <Controller name="lastServiceKilometers" control={control} render={({ field }) => <Input id="lastServiceKilometers" type="number" {...field} className="col-span-3 bg-ktm-black border-ktm-orange" />} />
            {errors.lastServiceKilometers && <p className="col-span-4 text-red-500 text-sm">{errors.lastServiceKilometers.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentKilometers" className="text-right text-ktm-light-gray">Current KM</Label>
            <Controller name="currentKilometers" control={control} render={({ field }) => <Input id="currentKilometers" type="number" {...field} className="col-span-3 bg-ktm-black border-ktm-orange" />} />
            {errors.currentKilometers && <p className="col-span-4 text-red-500 text-sm">{errors.currentKilometers.message}</p>}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right text-ktm-light-gray">Status</Label>
            <Controller name="status" control={control} render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="col-span-3 bg-ktm-black border-ktm-orange-dim"><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent className="bg-ktm-dark-gray border-ktm-orange-dim text-white">
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              )} />
            {errors.status && <p className="col-span-4 text-red-500 text-sm">{errors.status.message}</p>}
          </div>
        </form>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="bg-ktm-black text-white">Cancel</Button>
          <Button type="submit" form="edit-vehicle-form" disabled={isPending} className="bg-ktm-orange text-white">
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditVehicleModal;
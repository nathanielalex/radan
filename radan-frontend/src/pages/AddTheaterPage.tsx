import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getCities, type CityResponse } from "@/services/cityService";
import {
  createTheater,
  type CreateTheaterPayload,
  type PriceRequest,
} from "@/services/theaterService";
import { navigateTo } from "@/utils/navigation";
import axios from "axios";
import { ChevronLeft, PlusCircle, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoadingPage } from "./LoadingPage";
import {
  getStudioTypes,
  type StudioTypeResponse,
} from "@/services/studioTypeService";
import {
  getStudioLayouts,
  type StudioLayoutResponse,
} from "@/services/studioLayoutService";
import { Link } from "react-router";
import { ErrorPage } from "./ErrorPage";

// --- Mock Data (replace with API calls) ---
// const mockCities = [
//   { id: 1, name: "Jakarta" },
//   { id: 2, name: "Surabaya" },
//   { id: 3, name: "Bandung" },
//   { id: 4, name: "Medan" },
// ];

// const mockStudioTypes = [
//   { id: 1, name: "Regular" },
//   { id: 2, name: "Premium" },
//   { id: 3, name: "IMAX" },
// ];

// const mockStudioLayouts = [
//   { id: 1, name: "Layout A - 120 Seats" },
//   { id: 2, name: "Layout B - 150 Seats" },
//   { id: 3, name: "Layout C - 80 Seats (Premium)" },
// ];

// --- Type Definitions ---
interface Studio {
  id: string; // Temporary unique ID for mapping
  name: string;
  studioTypeId: number;
  studioLayoutId: number;
}

export default function AddTheaterPage() {
  const [branchName, setBranchName] = useState("");
  const [address, setAddress] = useState("");
  const [cityId, setCityId] = useState("");
  const [studios, setStudios] = useState<Studio[]>([]);
  const [selectedStudios, setSelectedStudios] = useState<number[]>([]);
  const [prices, setPrices] = useState<{
    [key: number]: { price: string; holidayPrice: string };
  }>({});
  const [loading, setLoading] = useState(true);
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [studioTypes, setStudioTypes] = useState<StudioTypeResponse[]>([]);
  const [studioLayouts, setStudioLayouts] = useState<StudioLayoutResponse[]>(
    []
  );
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [cityData, studioTypeData, studioLayouts] = await Promise.all([
          getCities(),
          getStudioTypes(),
          getStudioLayouts(),
        ]);

        setCities(cityData);
        setStudioTypes(studioTypeData);
        setStudioLayouts(studioLayouts);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const errorMsg =
            error.response?.data?.message || "Failed to fetch data.";
          setError(errorMsg);
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          console.error(error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStudioToggle = (id: number) => {
    setSelectedStudios((prev) =>
      prev.includes(id)
        ? prev.filter((studioId) => studioId !== id)
        : [...prev, id]
    );
  };

  const handlePriceChange = (
    id: number,
    field: "price" | "holidayPrice",
    value: string
  ) => {
    setPrices((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  // --- Handlers ---
  const handleAddStudio = () => {
    setStudios([
      ...studios,
      {
        id: crypto.randomUUID(),
        name: "",
        studioTypeId: 0,
        studioLayoutId: 0,
      },
    ]);
  };

  const handleRemoveStudio = (id: string) => {
    setStudios(studios.filter((studio) => studio.id !== id));
  };

  const handleStudioChange = (
    id: string,
    field: keyof Omit<Studio, "id">,
    value: string
  ) => {
    setStudios(
      studios.map((studio) =>
        studio.id === id ? { ...studio, [field]: value } : studio
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const priceRequests: PriceRequest[] = selectedStudios.map((id) => ({
      studioTypeId: id,
      price: Number(prices[id]?.price || 0),
      holidayPrice: Number(prices[id]?.holidayPrice || 0),
    }));

    const formData: CreateTheaterPayload = {
      name: branchName,
      location: address,
      cityId: Number(cityId),
      studios: studios.map(({ id, ...rest }) => rest), // Exclude temporary id
      prices: priceRequests,
    };
    console.log("Form Submitted:", formData);

    try {
      const response = await createTheater(formData);
      console.log(response);
      toast("Theater created successfully");
      setTimeout(() => {
        navigateTo("/dashboard/theaters");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message || "Failed to create theater.";
        toast(errorMsg);
      } else if (error instanceof Error) {
        toast(error.message);
      } else {
        console.error(error);
      }
    }
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <form onSubmit={handleSubmit}>
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <div className="flex items-center gap-4">
            <Link to="/dashboard/theaters">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Button>
            </Link>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Add New Theater
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button type="submit" size="sm">
                Save Theater
              </Button>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-4 grid w-full max-w-6xl grid-cols-1 gap-6">
          {/* Theater Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Branch Details</CardTitle>
              <CardDescription>
                Enter the main details for this theater branch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="grid gap-3">
                    <Label htmlFor="branchName">Branch Name</Label>
                    <Input
                      id="branchName"
                      type="text"
                      placeholder="e.g. Cinema XXI AEON Mall"
                      value={branchName}
                      onChange={(e) => setBranchName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="city">City</Label>
                    <Select onValueChange={setCityId} value={cityId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a city" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={String(city.id)}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Enter the full address of the theater"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="min-h-24"
                    required
                  />
                </div>
                <div className="grid gap-5">
                  <Label className="text-base font-semibold">
                    Select Studio Types
                  </Label>
                  <div className="flex flex-wrap gap-4">
                    {studioTypes.map((type) => (
                      <div
                        key={type.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`studio-type-${type.id}`}
                          checked={selectedStudios.includes(type.id)}
                          onCheckedChange={() => handleStudioToggle(type.id)}
                        />
                        <label
                          htmlFor={`studio-type-${type.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type.name}
                        </label>
                      </div>
                    ))}
                  </div>

                  {selectedStudios.length > 0 && (
                    <div className="grid gap-4">
                      {/* <Label className="text-base font-semibold">
                        Studios by Type
                      </Label> */}
                      <div className="grid gap-6">
                        {selectedStudios.map((id) => {
                          const type = studioTypes.find((t) => t.id === id);
                          if (!type) return null;

                          return (
                            <div
                              key={id}
                              className="grid gap-3 border p-4 rounded-md shadow-sm"
                            >
                              <p className="text-sm font-medium">{type.name}</p>
                              <div className="grid gap-3 md:grid-cols-3">
                                <div className="grid gap-1">
                                  <Label htmlFor={`studio-${id}-price`}>
                                    Price
                                  </Label>
                                  <Input
                                    id={`studio-${id}-price`}
                                    type="number"
                                    placeholder="e.g. 50000"
                                    min={0}
                                    value={prices[id]?.price || ""}
                                    onChange={(e) =>
                                      handlePriceChange(
                                        id,
                                        "price",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="grid gap-1">
                                  <Label htmlFor={`studio-${id}-holiday-price`}>
                                    Holiday Price
                                  </Label>
                                  <Input
                                    id={`studio-${id}-holiday-price`}
                                    type="number"
                                    placeholder="e.g. 75000"
                                    min={0}
                                    value={prices[id]?.holidayPrice || ""}
                                    onChange={(e) =>
                                      handlePriceChange(
                                        id,
                                        "holidayPrice",
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Studios Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Studios</CardTitle>
                <CardDescription>
                  Add and configure the studios for this theater.
                </CardDescription>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={handleAddStudio}
              >
                <PlusCircle className="h-4 w-4" />
                Add Studio
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-6">
                {studios.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-8">
                    No studios added yet. Click "Add Studio" to begin.
                  </div>
                ) : (
                  studios.map((studio) => (
                    <div
                      key={studio.id}
                      className="rounded-lg border bg-card p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold">Studio Details</h3>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveStudio(studio.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Remove Studio</span>
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Studio Name */}
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor={`studioName-${studio.id}`}>
                            Studio Name
                          </Label>
                          <Input
                            id={`studioName-${studio.id}`}
                            placeholder="e.g. Studio 1"
                            value={studio.name}
                            onChange={(e) =>
                              handleStudioChange(
                                studio.id,
                                "name",
                                e.target.value
                              )
                            }
                          />
                        </div>

                        {/* Studio Type */}
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor={`studioType-${studio.id}`}>
                            Studio Type
                          </Label>
                          <Select
                            value={studio.studioTypeId.toString()}
                            onValueChange={(value) =>
                              handleStudioChange(
                                studio.id,
                                "studioTypeId",
                                value
                              )
                            }
                          >
                            <SelectTrigger id={`studioType-${studio.id}`}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {studioTypes.map((type) => (
                                <SelectItem
                                  key={type.id}
                                  value={String(type.id)}
                                >
                                  {type.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Studio Layout */}
                        <div className="flex flex-col space-y-2">
                          <Label htmlFor={`studioLayout-${studio.id}`}>
                            Studio Layout
                          </Label>
                          <Select
                            value={studio.studioLayoutId.toString()}
                            onValueChange={(value) =>
                              handleStudioChange(
                                studio.id,
                                "studioLayoutId",
                                value
                              )
                            }
                          >
                            <SelectTrigger id={`studioLayout-${studio.id}`}>
                              <SelectValue placeholder="Select layout" />
                            </SelectTrigger>
                            <SelectContent>
                              {studioLayouts.map((layout) => (
                                <SelectItem
                                  key={layout.id}
                                  value={String(layout.id)}
                                >
                                  {layout.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 md:hidden">
          <Button type="submit" size="sm" className="w-full">
            Save Theater
          </Button>
        </div>
      </form>
    </main>
  );
}

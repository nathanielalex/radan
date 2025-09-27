import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCities, type CityResponse } from "@/services/cityService";
import {
  getTheatersByCity,
  type TheaterDetailResponse,
} from "@/services/theaterService";
import axios from "axios";
import { useEffect, useState } from "react";
import { LoadingPage } from "./LoadingPage";
import { ErrorPage } from "./ErrorPage";

// const mockCities = ["South Tangerang", "Jakarta", "Bandung"];

// interface TheaterBranch {
//   id: string;
//   name: string;
//   location: string;
//   auditoriums: number;
//   city: string;
//   studioTypes: string[];
// }

// const mockTheaters: TheaterBranch[] = [
//   {
//     id: "TH001",
//     name: "Cinema XXI AEON Mall",
//     location: "AEON Mall BSD City",
//     auditoriums: 8,
//     city: "South Tangerang",
//     studioTypes: ["Regular", "Premium", "IMAX"],
//   },
//   {
//     id: "TH002",
//     name: "CGV Teras Kota",
//     location: "Teras Kota, BSD",
//     auditoriums: 6,
//     city: "South Tangerang",
//     studioTypes: ["Regular", "4DX", "Velvet"],
//   },
//   {
//     id: "TH003",
//     name: "Cinepolis Living World",
//     location: "Living World, Alam Sutera",
//     auditoriums: 10,
//     city: "South Tangerang",
//     studioTypes: ["Regular", "VIP"],
//   },
//   {
//     id: "TH004",
//     name: "Cinema XXI Gandaria City",
//     location: "Gandaria City Mall",
//     auditoriums: 8,
//     city: "Jakarta",
//     studioTypes: ["Regular", "The Premiere"],
//   },
//   {
//     id: "TH005",
//     name: "CGV Grand Indonesia",
//     location: "Grand Indonesia",
//     auditoriums: 11,
//     city: "Jakarta",
//     studioTypes: ["Regular", "Starium", "SphereX"],
//   },
//   {
//     id: "TH006",
//     name: "Cinepolis Paris Van Java",
//     location: "Paris Van Java Mall",
//     auditoriums: 9,
//     city: "Bandung",
//     studioTypes: ["Regular", "Macro XE"],
//   },
// ];

export default function TheatersPage() {
  const [selectedCityId, setSelectedCityId] = useState<number | undefined>(
    undefined
  );

  const [selectedCity, setSelectedCity] = useState<CityResponse | undefined>(
    undefined
  );
  const [cities, setCities] = useState<CityResponse[]>([]);
  const [theaters, setTheaters] = useState<TheaterDetailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const cityData = await getCities();
        setCities(cityData);
        if (cityData.length > 0) {
          setSelectedCityId(cityData[0].id);
        }
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetching new theater")
        setLoading(true);
        if (!selectedCity) return;
        const theaterData = await getTheatersByCity(selectedCity.id);
        setTheaters(theaterData);
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
  }, [selectedCity]);

  useEffect(() => {
    if (!selectedCityId) {
      setSelectedCity(undefined);
      return;
    }
    const city = cities.find((c) => c.id === selectedCityId);
    setSelectedCity(city);
  }, [selectedCityId, cities]);

  const handleCityChange = (cityId: string) => {
    setSelectedCityId(Number(cityId));
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <div className="py-8 px-8">
      <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Theaters</h1>
          <p className="text-muted-foreground">
            Find a cinema near you and see what's playing.
          </p>
        </div>
        <div className="w-full md:w-64">
          <Label htmlFor="city-select" className="sr-only">
            Select City
          </Label>
          <Select
            value={selectedCityId?.toString() || ""}
            onValueChange={handleCityChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.id.toString()}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {theaters.map((theater) => (
          <Card key={theater.id}>
            <CardHeader>
              <CardTitle className="text-xl">{theater.name}</CardTitle>
              <CardDescription>{theater.location}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Studio Types</h4>
                <div className="flex flex-wrap gap-2">
                  {theater.studioTypeDetailDTOs.map((type) => (
                    <Badge key={type.studioTypeName} variant="secondary">
                      {type.studioTypeName}
                    </Badge>
                  ))}
                </div>
              </div>
              <Button className="w-full">View Schedule</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

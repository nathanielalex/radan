import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PlusCircle,
  Trash,
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import {
  createSchedule,
  type CreateSchedulePayload,
  type ShowtimeRequest,
} from "@/services/movieTheaterScheduleService";
import { toast } from "sonner";
import { navigateTo } from "@/utils/navigation";
import axios from "axios";
import type { DateRange } from "react-day-picker";
import { Link, useParams } from "react-router";
import { getStudiosByTheater, type Studio } from "@/services/studioService";
import { ErrorPage } from "./ErrorPage";
import { LoadingPage } from "./LoadingPage";

// --- Mock Data (Copied from the detail page for context) ---

// interface Movie {
//   id: string;
//   title: string;
//   genre: string;
//   duration: number;
//   rating: string;
// }

// interface StudioType {
//   name: string;
//   studios: string[];
//   price: number;
//   holidayPrice: number;
// }

// interface TheaterBranch {
//   id: string;
//   name: string;
//   location: string;
//   auditoriums: number;
//   city: string;
//   studioTypes: StudioType[];
// }

// const mockStudios = [
//   { id: 1, name: "Regular 1" },
//   { id: 2, name: "Regular 2" },
//   { id: 3, name: "Premium 1" },
//   { id: 4, name: "IMAX 1" },
// ];

// const selectedTheater: TheaterBranch = {
//   id: "TH001",
//   name: "Cinema XXI AEON Mall",
//   location: "AEON Mall BSD City",
//   auditoriums: 8,
//   city: "South Tangerang",
//   studioTypes: [
//     {
//       name: "Regular",
//       studios: ["1", "2", "3", "4", "5"],
//       price: 45000,
//       holidayPrice: 55000,
//     },
//     {
//       name: "The Premiere",
//       studios: ["P1", "P2"],
//       price: 100000,
//       holidayPrice: 150000,
//     },
//     { name: "IMAX", studios: ["IMAX 1"], price: 60000, holidayPrice: 75000 },
//   ],
// };

// const allMovies: Movie[] = [
//   {
//     id: "M01",
//     title: "Dune: Part Two",
//     genre: "Sci-Fi",
//     duration: 166,
//     rating: "PG-13",
//   },
//   {
//     id: "M02",
//     title: "Kung Fu Panda 4",
//     genre: "Animation",
//     duration: 94,
//     rating: "PG",
//   },
//   {
//     id: "M03",
//     title: "Godzilla x Kong: The New Empire",
//     genre: "Action",
//     duration: 115,
//     rating: "PG-13",
//   },
//   { id: "M04", title: "Exhuma", genre: "Horror", duration: 134, rating: "R" },
//   {
//     id: "M05",
//     title: "Agak Laen",
//     genre: "Comedy",
//     duration: 119,
//     rating: "PG-13",
//   },
// ];

export default function AddMovieSchedule() {
  const { theaterId, movieId } = useParams<{
    theaterId: string;
    movieId: string;
  }>();
  const [selectedStudioId, setSelectedStudioId] = useState<string | undefined>(
    undefined
  );
  // const [selectedStudio, setSelectedStudio] = useState<Studio>();
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const [showtimes, setShowtimes] = useState<string[]>(["12:00"]);

  const [studios, setStudios] = useState<Studio[]>([])
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // const allStudios = selectedTheater.studioTypes.flatMap((st) => st.studios);
  // const selectedMovie = allMovies.find((m) => m.id === selectedMovieId);

  useEffect(() => {
    const fetchStudios = async () => {
      if (!theaterId) return;

      try {
        setLoading(true);
        const data = await getStudiosByTheater(Number(theaterId))

        setStudios(data);

        // Set the first city as the default selected city
        if (data.length > 0) {
          setSelectedStudioId(data[0].id.toString());
        }
      } catch (err) {
        const errorMessage =
          axios.isAxiosError(err) && err.response?.data?.message
            ? err.response.data.message
            : "Failed to load studios.";
        setError(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudios();
  }, [theaterId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //add validation
    if (
      !date?.from ||
      !date.to ||
      !movieId ||
      !theaterId ||
      !selectedStudioId
    ) {
      toast("Please fill all required fields.");
      return;
    }
    
    const studioId = Number(selectedStudioId);
    const showtimeRequests: ShowtimeRequest[] = showtimes.map((time) => ({
      studioId,
      startTime: time,
    }));

    const formData: CreateSchedulePayload = {
      movieId: movieId,
      theaterId: theaterId,
      releaseDate: date.from.toISOString().split("T")[0],
      endDate: date.to.toISOString().split("T")[0],
      showtimes: showtimeRequests,
    };
    console.log("Form Submitted:", formData);

    try {
      const response = await createSchedule(formData);
      console.log(response);
      toast("Schedule created successfully");
      setTimeout(() => {
        navigateTo(`/dashboard/theaters/${theaterId}`);
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message || "Failed to create schedule.";
        toast(errorMsg);
      } else if (error instanceof Error) {
        toast(error.message);
      } else {
        console.error(error);
      }
    }
  };

  const handleAddShowtime = () => {
    setShowtimes([...showtimes, ""]);
  };

  const handleRemoveShowtime = (indexToRemove: number) => {
    setShowtimes(showtimes.filter((_, index) => index !== indexToRemove));
  };

  const handleShowtimeChange = (indexToChange: number, value: string) => {
    const newShowtimes = showtimes.map((time, index) =>
      index === indexToChange ? value : time
    );
    setShowtimes(newShowtimes);
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    setDate(range ?? { from: undefined, to: undefined });
  };

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      {/* --- Page Header --- */}
      <div className="flex items-center gap-4">
        <Link to={`/dashboard/theaters/${theaterId}`}>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">Add Movie Schedule</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            For Cinema XXI AEON Mall
            {/* TODO */}
          </p>
        </div>
      </div>

      {/* --- Add Schedule Form --- */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Schedule Details</CardTitle>
            <CardDescription>
              Select a studio, date range, and showtimes.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="studio">Studio</Label>
                <Select
                  onValueChange={setSelectedStudioId}
                  value={selectedStudioId}
                >
                  <SelectTrigger id="studio">
                    <SelectValue placeholder="Select a studio" />
                  </SelectTrigger>
                  <SelectContent>
                    {studios.map((studio) => (
                      <SelectItem key={studio.id} value={studio.id.toString()}>
                        {studio.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Range Picker */}
            <div className="grid gap-2">
              <Label>Release & End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Showtimes */}
            <div className="grid gap-2">
              <Label>Showtimes</Label>
              <div className="grid gap-3">
                {showtimes.map((time, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) =>
                        handleShowtimeChange(index, e.target.value)
                      }
                      className="w-full"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveShowtime(index)}
                      className="text-destructive h-8 w-8"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 w-fit"
                onClick={handleAddShowtime}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Showtime
              </Button>
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit">Save Schedule</Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

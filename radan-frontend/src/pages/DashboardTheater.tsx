import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllTheaters, type Theater } from "@/services/theaterService";
import axios from "axios";
import { FilePenLine, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { LoadingPage } from "./LoadingPage";

const mockTheaters: Theater[] = [
  {
    id: 1,
    name: "Cinema XXI AEON Mall",
    location: "AEON Mall BSD City",
  },
  {
    id: 2,
    name: "CGV Teras Kota",
    location: "Teras Kota, BSD",
  },
  {
    id: 3,
    name: "Cinepolis Living World",
    location: "Living World, Alam Sutera",
  },
  {
    id: 4,
    name: "Cinema XXI The Premiere",
    location: "Bintaro Xchange Mall",
  },
];

export default function DashboardTheater() {
  const [theaters, setMovies] = useState<Theater[]>(mockTheaters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const theaterData = await getAllTheaters();
        setMovies(theaterData);
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

  if (loading) return <LoadingPage />;
  // if (error) return <ErrorPage />;

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Theater Branches</h1>
        <div className="ml-auto flex items-center gap-2">
          <Link to="/dashboard/theaters/add">
            <Button size="sm" className="h-8 gap-1">
              <PlusCircle className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Add Branch
              </span>
            </Button>
          </Link>
        </div>
      </div>
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Branch Name</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {theaters.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.id}</TableCell>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell className="max-w-24 truncate">
                    {t.location}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/dashboard/theaters/${t.id}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FilePenLine className="h-4 w-4" />
                      </Button>
                    </Link>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

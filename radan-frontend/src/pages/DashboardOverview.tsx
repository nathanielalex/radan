import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatPrice } from "@/utils/price";

const adminStats = {
  revenue: 42550000,
  ticketsSold: 785,
  newUsers: 12,
};

const mockTopMovies = [
  { title: "Cosmic Odyssey", ticketsSold: 350, revenue: 21000000 },
  { title: "Midnight Heist", ticketsSold: 280, revenue: 15400000 },
  { title: "Echoes of the Past", ticketsSold: 250, revenue: 12500000 },
  { title: "The Last Stand", ticketsSold: 190, revenue: 9500000 },
];

const mockCinemaPerformance = [
  { name: "Cinema XXI AEON Mall", city: "South Tangerang", occupancy: "85%" },
  { name: "CGV Grand Indonesia", city: "Jakarta", occupancy: "82%" },
  { name: "Cinepolis Paris Van Java", city: "Bandung", occupancy: "78%" },
  { name: "Cinema XXI Gandaria City", city: "Jakarta", occupancy: "75%" },
];

export default function DashboardOverview() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(adminStats.revenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tickets Sold Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{adminStats.ticketsSold}</div>
            <p className="text-xs text-muted-foreground">
              +180.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              New Users Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{adminStats.newUsers}</div>
            <p className="text-xs text-muted-foreground">
              +19% from last month
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Movies</CardTitle>
            <CardDescription>
              This week's top movies by revenue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Movie</TableHead>
                  <TableHead className="text-right">Tickets Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTopMovies.map((movie) => (
                  <TableRow key={movie.title}>
                    <TableCell className="font-medium">{movie.title}</TableCell>
                    <TableCell className="text-right">
                      {movie.ticketsSold}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatPrice(movie.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cinema Performance</CardTitle>
            <CardDescription>
              Occupancy rates for top locations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cinema</TableHead>
                  <TableHead className="text-right">Occupancy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCinemaPerformance.map((cinema) => (
                  <TableRow key={cinema.name}>
                    <TableCell>
                      <div className="font-medium">{cinema.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {cinema.city}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {cinema.occupancy}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
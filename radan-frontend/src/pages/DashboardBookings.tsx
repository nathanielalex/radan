import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "lucide-react";


const mockBookings = [
  {
    id: "BK12945",
    customer: "John Doe",
    movie: "Cosmic Odyssey",
    tickets: 2,
    total: 120000,
    status: "Confirmed",
    date: "2025-08-31",
  },
  {
    id: "BK12944",
    customer: "Jane Smith",
    movie: "Midnight Heist",
    tickets: 3,
    total: 165000,
    status: "Confirmed",
    date: "2025-08-31",
  },
  {
    id: "BK12943",
    customer: "Bob Johnson",
    movie: "Echoes of the Past",
    tickets: 1,
    total: 50000,
    status: "Confirmed",
    date: "2025-08-31",
  },
  {
    id: "BK12942",
    customer: "Alice Williams",
    movie: "Cosmic Odyssey",
    tickets: 4,
    total: 240000,
    status: "Confirmed",
    date: "2025-08-30",
  },
];

export default function DashboardBookings() {
  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Bookings</h1>
      </div>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Movie</TableHead>
                <TableHead>Tickets</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBookings.map((b) => (
                <TableRow key={b.id}>
                  <TableCell className="font-mono text-xs">{b.id}</TableCell>
                  <TableCell className="font-medium">{b.customer}</TableCell>
                  <TableCell>{b.movie}</TableCell>
                  <TableCell>{b.tickets}</TableCell>
                  <TableCell>
                    <Badge>{b.status}</Badge>
                  </TableCell>
                  <TableCell>{b.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};
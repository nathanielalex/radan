import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createStudioLayout,
  type CreateStudioLayoutPayload,
  type LayoutSeatRequest,
} from "@/services/studioLayoutService";
import { navigateTo } from "@/utils/navigation";
import axios from "axios";
import { Armchair, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

// The final data structure for a single seat, matching the database schema.
// interface Seat {
//   id: number;
//   showtime_id: number;
//   seat_number: string;
//   row_number: number;
//   column_number: number;
//   is_booked: boolean;
// }

// The state for each cell in the layout grid.
type CellType = "seat" | "space";

export default function MakeSeatLayoutPage() {
  const [rows, setRows] = useState(10);
  const [cols, setCols] = useState(12);
  const [layoutName, setLayoutName] = useState("");
  const [layout, setLayout] = useState<{ [key: string]: CellType }>({});
  const [seatData, setSeatData] = useState<LayoutSeatRequest[]>([]);
  const [generatedJson, setGeneratedJson] = useState<string>("");

  // Initialize the grid with all cells as 'seat'.
  // This runs when the component mounts or when rows/cols change.
  useEffect(() => {
    const initialLayout: { [key: string]: CellType } = {};
    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const key = `${r}-${c}`;
        initialLayout[key] = "seat";
      }
    }
    setLayout(initialLayout);
    setGeneratedJson(""); // Clear previous JSON output
  }, [rows, cols]);

  // Toggles a cell between 'seat' and 'space'.
  const handleCellClick = (row: number, col: number) => {
    const key = `${row}-${col}`;
    setLayout((prevLayout) => ({
      ...prevLayout,
      [key]: prevLayout[key] === "seat" ? "space" : "seat",
    }));
    setGeneratedJson(""); // Clear previous JSON output as the layout has changed
  };

  // Generates the final JSON output based on the current layout.
  const handleSaveLayout = () => {
    const tempSeatData: LayoutSeatRequest[] = [];
    let rowCounter = 1;

    for (let r = 1; r <= rows; r++) {
      for (let c = 1; c <= cols; c++) {
        const key = `${r}-${c}`;
        if (layout[key] === "seat") {
          const seat: LayoutSeatRequest = {
            seatNumber: `${String.fromCharCode(64 + r)}${rowCounter}`, // A1, B2, etc.
            rowNumber: r,
            columnNumber: c,
          };
          tempSeatData.push(seat);
          rowCounter += 1;
        }
      }
      rowCounter = 1;
    }
    setSeatData(tempSeatData);
    setGeneratedJson(JSON.stringify(tempSeatData, null, 2));
  };

  const handleSubmit = async () => {
    //add more validation

    const payload: CreateStudioLayoutPayload = {
      name: layoutName,
      layoutSeats: seatData,
    };
    console.log(payload)

    try {
      const response = await createStudioLayout(payload);
      console.log(response);
      toast("Layout created successfully");
      setTimeout(() => {
        navigateTo("/dashboard");
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg =
          error.response?.data?.message || "Failed to create movie.";
        toast(errorMsg);
      } else if (error instanceof Error) {
        toast(error.message);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="container pb-32 pt-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Create Seat Layout</h1>
        <p className="text-muted-foreground">
          Define grid size and click cells to mark them as spaces.
        </p>
      </div>

      {/* Input Controls */}
      <div className="flex flex-col gap-4 mb-8 p-4 bg-secondary/50 rounded-lg max-w-md mx-auto">
        <div className="grid w-full max-w-sm items-center gap-1.5 mx-auto">
          <Label htmlFor="layoutName">Layout Name</Label>
          <Input
            type="text"
            id="layoutName"
            value={layoutName}
            onChange={(e) => setLayoutName(e.target.value)}
            placeholder="Enter layout name"
          />
        </div>
        <div className="flex justify-center gap-6 items-end mx-auto">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="rows">Rows</Label>
            <Input
              type="number"
              id="rows"
              value={rows}
              onChange={(e) =>
                setRows(Math.max(1, parseInt(e.target.value) || 1))
              }
              min="1"
              max="26" // Limited to A-Z
            />
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="cols">Columns</Label>
            <Input
              type="number"
              id="cols"
              value={cols}
              onChange={(e) =>
                setCols(Math.max(1, parseInt(e.target.value) || 1))
              }
              min="1"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {/* Screen */}
        <div className="w-full max-w-4xl">
          <div className="h-2 bg-muted w-full rounded-t-full"></div>
          <div className="h-8 border-x-4 border-b-4 border-muted w-full flex items-center justify-center">
            <p className="text-sm font-semibold text-muted-foreground tracking-widest">
              SCREEN
            </p>
          </div>
        </div>

        {/* Seat Layout Grid */}
        <div className="flex flex-col gap-2 my-8">
          {Array.from({ length: rows }, (_, r_idx) => (
            <div
              key={r_idx}
              className="flex flex-row gap-2 justify-center items-center"
            >
              <span className="w-8 text-center text-muted-foreground">
                {String.fromCharCode(65 + r_idx)}
              </span>
              {Array.from({ length: cols }, (_, c_idx) => {
                const r = r_idx + 1;
                const c = c_idx + 1;
                const key = `${r}-${c}`;
                const cellType = layout[key] || "space";

                return (
                  <div
                    key={key}
                    className={`flex items-center justify-center w-8 h-8 rounded-md transition-all cursor-pointer ${
                      cellType === "seat"
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                    onClick={() => handleCellClick(r, c)}
                    title={`Row ${r}, Col ${c}`}
                  >
                    {cellType === "seat" ? (
                      <Armchair className="w-5 h-5" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-muted-foreground/50" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="flex flex-col space-y-4">
          {/* TODO: make this a copy text button instead */}
          <Button
            variant="secondary"
            className="px-10 py-6"
            onClick={handleSaveLayout}
          >
            Preview Seat Layout
          </Button>
          <Button className="px-10 py-6" onClick={handleSubmit}>
            Save Seat Layout
          </Button>
        </div>
      </div>

      {/* Generated JSON Output */}
      {generatedJson && (
        <div className="mt-12 max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Generated JSON Data
          </h2>
          <pre className="bg-secondary/50 p-4 rounded-lg text-sm overflow-x-auto">
            <code>{generatedJson}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

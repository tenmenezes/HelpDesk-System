import { table } from "console";
import { Button } from "./ui/button";
import { Table } from "./ui/table";

export default function Pagination() {
    return (
      <>
        <div className="flex items-center justify-center space-x-2 py-4 gap-10">
          <Button
            variant="outline"
            className="cursor-pointer"
            size="sm"
            onClick={() => Table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span>
            Página {table.getState().pagination.pageIndex + 1} -{" "}
            {table.getPageCount()}
          </span>
          <Button
            variant="outline"
            className="cursor-pointer"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </>
    );
}
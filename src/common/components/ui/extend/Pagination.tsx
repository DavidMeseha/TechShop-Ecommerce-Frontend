import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "../pagination";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChang: (page: number) => void;
};

export default function DataPagination({ currentPage, totalPages, onPageChang }: Props) {
  const handleClicks = (page: number) => {
    if (page <= 0 || page > totalPages) return;
    onPageChang(page);
  };

  if (totalPages === 0)
    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              className={currentPage <= 1 ? "cursor-not-allowed opacity-40 hover:bg-transparent" : ""}
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink isActive>{currentPage}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext
              className={currentPage >= totalPages ? "cursor-not-allowed opacity-40 hover:bg-transparent" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            className={currentPage <= 1 ? "cursor-not-allowed opacity-40 hover:bg-transparent" : ""}
            onClick={() => handleClicks(currentPage - 1)}
          />
        </PaginationItem>
        {currentPage - 2 > 0 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        {currentPage + 1 > totalPages && totalPages > 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => handleClicks(currentPage - 2)}>{currentPage - 2}</PaginationLink>
          </PaginationItem>
        )}
        {currentPage - 1 > 0 && (
          <PaginationItem>
            <PaginationLink onClick={() => handleClicks(currentPage - 1)}>{currentPage - 1}</PaginationLink>
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationLink isActive>{currentPage}</PaginationLink>
        </PaginationItem>
        {currentPage + 1 <= totalPages && (
          <PaginationItem>
            <PaginationLink onClick={() => handleClicks(currentPage + 1)}>{currentPage + 1}</PaginationLink>
          </PaginationItem>
        )}
        {currentPage - 1 <= 0 && totalPages > 2 && (
          <PaginationItem>
            <PaginationLink onClick={() => handleClicks(currentPage + 2)}>{currentPage + 2}</PaginationLink>
          </PaginationItem>
        )}
        {currentPage + 1 < totalPages && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        <PaginationItem>
          <PaginationNext
            className={currentPage >= totalPages ? "cursor-not-allowed opacity-40 hover:bg-transparent" : ""}
            onClick={() => handleClicks(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

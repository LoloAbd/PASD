import React from "react";

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const renderPageNumbers = () => {
    const pages = [];
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, currentPage + 1);

    if (currentPage <= 2) {
      startPage = 1;
      endPage = Math.min(3, totalPages);
    } else if (currentPage >= totalPages - 1) {
      startPage = Math.max(totalPages - 2, 1);
      endPage = totalPages;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          className={`page-button ${currentPage === i ? "active" : ""}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination">
      {currentPage > 1 && (
        <button className="arrow-button" onClick={() => onPageChange(currentPage - 1)}>
          &laquo;
        </button>
      )}
      {renderPageNumbers()}
      {currentPage < totalPages && (
        <button className="arrow-button" onClick={() => onPageChange(currentPage + 1)}>
          &raquo;
        </button>
      )}
    </div>
  );
};

export default Pagination;

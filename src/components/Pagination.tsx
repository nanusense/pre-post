import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  basePath: string
}

export default function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null

  function pageHref(page: number) {
    return page === 1 ? basePath : `${basePath}?page=${page}`
  }

  // Build the list of page numbers to show, with -1 representing ellipsis
  const pages: number[] = []
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== -1) {
      pages.push(-1)
    }
  }

  return (
    <nav className="flex items-center justify-center gap-1 mt-8" aria-label="Pagination">
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Previous
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm rounded-lg text-gray-300 dark:text-gray-600">Previous</span>
      )}

      {pages.map((page, idx) =>
        page === -1 ? (
          <span key={`ellipsis-${idx}`} className="px-2 py-2 text-sm text-gray-400 dark:text-gray-500">
            &hellip;
          </span>
        ) : page === currentPage ? (
          <span
            key={page}
            className="px-3 py-2 text-sm rounded-lg bg-black dark:bg-white text-white dark:text-black"
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={pageHref(page)}
            className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          className="px-3 py-2 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          Next
        </Link>
      ) : (
        <span className="px-3 py-2 text-sm rounded-lg text-gray-300 dark:text-gray-600">Next</span>
      )}
    </nav>
  )
}

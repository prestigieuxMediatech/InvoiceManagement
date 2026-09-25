import React from "react";

const SkeletonBox = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded-lg bg-violet-100/70 ${className}`}
    />
  );
};

const AllInvoiceSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#faf9ff] text-slate-900">
      <main className="mx-auto w-full max-w-[1500px] px-3 py-5 sm:px-6 sm:py-6 lg:px-10">

        {/* =====================================================
            HEADER SKELETON
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-4 sm:mb-7 sm:flex-row sm:items-center sm:justify-between">

          <div className="min-w-0">

            <div className="flex items-center gap-2">
              <SkeletonBox className="h-9 w-9 rounded-xl" />
              <SkeletonBox className="h-3 w-32 rounded-md" />
            </div>

            <SkeletonBox className="mt-3 h-8 w-48 rounded-lg sm:h-9" />

            <SkeletonBox className="mt-2 h-4 w-72 max-w-full rounded-md" />

          </div>

          <SkeletonBox className="h-11 w-full rounded-xl sm:w-[160px]" />

        </div>

        {/* =====================================================
            STAT CARDS SKELETON
        ====================================================== */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-4">

          {Array.from({ length: 4 }).map((_, index) => (

            <div
              key={index}
              className="
                rounded-2xl
                border
                border-violet-100
                bg-white
                p-4
                shadow-[0_8px_30px_rgba(124,58,237,0.06)]
                sm:p-5
              "
            >

              <div className="flex items-start justify-between gap-3">

                <div className="min-w-0 flex-1">

                  {/* Label */}

                  <SkeletonBox className="h-3 w-24 rounded-md" />

                  {/* Amount */}

                  <SkeletonBox className="mt-3 h-8 w-32 rounded-lg" />

                  {/* Description */}

                  <SkeletonBox className="mt-2 h-3 w-36 rounded-md" />

                </div>

                {/* Icon */}

                <SkeletonBox className="h-10 w-10 shrink-0 rounded-xl sm:h-11 sm:w-11" />

              </div>

            </div>

          ))}

        </div>

        {/* =====================================================
            INVOICE LIST
        ====================================================== */}

        <section
          className="
            mt-5
            overflow-hidden
            rounded-2xl
            border
            border-violet-100
            bg-white
            shadow-[0_10px_40px_rgba(124,58,237,0.06)]
            sm:mt-6
          "
        >

          {/* =================================================
              TOOLBAR SKELETON
          ================================================== */}

          <div className="border-b border-violet-100 p-4 sm:p-6">

            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

              {/* Title */}

              <div>

                <SkeletonBox className="h-6 w-32 rounded-lg" />

                <SkeletonBox className="mt-2 h-3 w-28 rounded-md" />

              </div>

              {/* Search + Filter */}

              <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">

                <SkeletonBox className="h-11 w-full rounded-xl sm:w-[280px]" />

                <SkeletonBox className="h-11 w-full rounded-xl sm:w-[170px]" />

              </div>

            </div>

          </div>

          {/* =================================================
              MOBILE SCROLL HINT
          ================================================== */}

          <div
            className="
              flex
              items-center
              justify-between
              border-b
              border-violet-100
              bg-violet-50/60
              px-3
              py-2
              md:hidden
            "
          >
            <SkeletonBox className="h-3 w-20 rounded-md" />

            <SkeletonBox className="h-3 w-24 rounded-md" />
          </div>

          {/* =================================================
              TABLE
          ================================================== */}

          <div className="w-full overflow-x-auto">

            <table
              className="
                w-full
                min-w-[760px]
                table-auto
                border-collapse
              "
            >

              {/* TABLE HEADER */}

              <thead>
                <tr className="border-b border-violet-100 bg-violet-50/70">

                  {[
                    "Invoice",
                    "Customer",
                    "Issue Date",
                    "Due Date",
                    "Amount",
                    "Status",
                    "Action",
                  ].map((_, index) => (

                    <th
                      key={index}
                      className={`
                        px-4
                        py-4
                        sm:px-5
                        ${
                          index === 6
                            ? "sticky right-0 z-20 bg-violet-50"
                            : ""
                        }
                      `}
                    >
                      <SkeletonBox
                        className={`
                          h-3
                          rounded-md
                          ${
                            index === 0
                              ? "w-16"
                              : index === 1
                              ? "w-20"
                              : index === 2
                              ? "w-20"
                              : index === 3
                              ? "w-16"
                              : index === 4
                              ? "w-16"
                              : index === 5
                              ? "w-14"
                              : "ml-auto w-12"
                          }
                        `}
                      />
                    </th>

                  ))}

                </tr>
              </thead>

              {/* TABLE BODY */}

              <tbody className="divide-y divide-violet-50">

                {Array.from({ length: 7 }).map(
                  (_, index) => (

                    <tr key={index}>

                      {/* INVOICE */}

                      <td className="bg-white px-3 py-4 sm:px-5 sm:py-5">

                        <div className="flex items-center gap-2.5 sm:gap-3">

                          <SkeletonBox className="h-8 w-8 shrink-0 rounded-lg sm:h-10 sm:w-10 sm:rounded-xl" />

                          <div className="min-w-0">

                            <SkeletonBox className="h-4 w-24 rounded-md" />

                            <SkeletonBox className="mt-2 h-2.5 w-12 rounded-md" />

                          </div>

                        </div>

                      </td>

                      {/* CUSTOMER */}

                      <td className="px-4 py-4 sm:px-5 sm:py-5">

                        <SkeletonBox className="h-4 w-32 max-w-full rounded-md" />

                        <SkeletonBox className="mt-2 h-3 w-28 max-w-full rounded-md" />

                      </td>

                      {/* ISSUE DATE */}

                      <td className="px-4 py-4 sm:px-5 sm:py-5">

                        <div className="flex items-center gap-2">

                          <SkeletonBox className="h-4 w-4 rounded-md" />

                          <SkeletonBox className="h-4 w-20 rounded-md" />

                        </div>

                      </td>

                      {/* DUE DATE */}

                      <td className="px-4 py-4 sm:px-5 sm:py-5">

                        <SkeletonBox className="h-4 w-20 rounded-md" />

                      </td>

                      {/* AMOUNT */}

                      <td className="px-4 py-4 sm:px-5 sm:py-5">

                        <SkeletonBox className="h-4 w-20 rounded-md" />

                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-4 sm:px-5 sm:py-5">

                        <SkeletonBox className="h-7 w-20 rounded-full" />

                      </td>

                      {/* ACTION */}

                      <td
                        className="
                          sticky
                          right-0
                          z-10
                          bg-white
                          px-3
                          py-4
                          sm:px-5
                          sm:py-5
                        "
                      >

                        <div className="flex justify-end">

                          <SkeletonBox className="h-8 w-8 rounded-lg sm:h-9 sm:w-9" />

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

          {/* =================================================
              FOOTER
          ================================================== */}

          <div className="border-t border-violet-100 bg-violet-50/40 px-4 py-4 sm:px-5">

            <div className="flex items-center gap-2">

              <SkeletonBox className="h-3 w-14 rounded-md" />

              <SkeletonBox className="h-3 w-5 rounded-md" />

              <SkeletonBox className="h-3 w-5 rounded-md" />

              <SkeletonBox className="h-3 w-16 rounded-md" />

              <SkeletonBox className="h-3 w-5 rounded-md" />

              <SkeletonBox className="h-3 w-16 rounded-md" />

            </div>

          </div>

        </section>

      </main>
    </div>
  );
};

export default AllInvoiceSkeleton;
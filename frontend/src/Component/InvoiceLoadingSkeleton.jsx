import React from "react";

const InvoiceLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
      {/* Loading Header */}
      <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between">
        <div className="space-y-2">
          <div className="h-7 w-40 animate-pulse rounded-lg bg-gray-300" />
          <div className="h-4 w-56 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="hidden gap-3 sm:flex">
          <div className="h-10 w-28 animate-pulse rounded-xl bg-gray-300" />
          <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-300" />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* Invoice Preview */}
          <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

            {/* Fake Invoice Header */}
            <div className="relative overflow-hidden bg-gray-200 px-6 py-8 sm:px-10">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/30 to-transparent" />

              <div className="relative flex items-start justify-between">
                <div className="space-y-4">
                  <div className="h-14 w-40 animate-pulse rounded-xl bg-gray-300" />

                  <div className="space-y-2">
                    <div className="h-3 w-32 animate-pulse rounded bg-gray-300" />
                    <div className="h-3 w-44 animate-pulse rounded bg-gray-300" />
                  </div>
                </div>

                <div className="space-y-3 text-right">
                  <div className="ml-auto h-8 w-32 animate-pulse rounded-lg bg-gray-300" />
                  <div className="ml-auto h-4 w-24 animate-pulse rounded bg-gray-300" />
                </div>
              </div>
            </div>

            {/* Invoice Body */}
            <div className="p-6 sm:p-10">

              {/* Client Information */}
              <div className="mb-10 grid gap-8 sm:grid-cols-2">

                <div className="space-y-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-300" />

                  <div className="h-6 w-48 animate-pulse rounded bg-gray-200" />

                  <div className="space-y-2">
                    <div className="h-3 w-56 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-48 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>

                <div className="space-y-4 sm:text-right">
                  <div className="ml-auto h-4 w-20 animate-pulse rounded bg-gray-300" />

                  <div className="ml-auto h-6 w-40 animate-pulse rounded bg-gray-200" />

                  <div className="space-y-2">
                    <div className="ml-auto h-3 w-48 animate-pulse rounded bg-gray-200" />
                    <div className="ml-auto h-3 w-36 animate-pulse rounded bg-gray-200" />
                    <div className="ml-auto h-3 w-44 animate-pulse rounded bg-gray-200" />
                  </div>
                </div>

              </div>

              {/* Invoice Table */}
              <div className="overflow-hidden rounded-xl border border-gray-200">

                {/* Table Header */}
                <div className="grid grid-cols-[1fr_70px_100px] gap-4 bg-gray-100 px-4 py-4 sm:grid-cols-[1fr_80px_110px_110px]">
                  <div className="h-3 w-24 animate-pulse rounded bg-gray-300" />
                  <div className="hidden h-3 w-12 animate-pulse rounded bg-gray-300 sm:block" />
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-300" />
                  <div className="h-3 w-16 animate-pulse rounded bg-gray-300" />
                </div>

                {/* Rows */}
                {[1, 2, 3, 4, 5].map((row) => (
                  <div
                    key={row}
                    className="grid grid-cols-[1fr_70px_100px] items-center gap-4 border-t border-gray-200 px-4 py-5 sm:grid-cols-[1fr_80px_110px_110px]"
                  >
                    <div className="space-y-2">
                      <div
                        className="h-4 w-40 animate-pulse rounded bg-gray-200"
                        style={{
                          animationDelay: `${row * 100}ms`,
                        }}
                      />
                      <div
                        className="h-3 w-24 animate-pulse rounded bg-gray-100"
                        style={{
                          animationDelay: `${row * 100 + 50}ms`,
                        }}
                      />
                    </div>

                    <div className="hidden h-4 w-8 animate-pulse rounded bg-gray-200 sm:block" />

                    <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />

                    <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                  </div>
                ))}
              </div>

              {/* Bottom */}
              <div className="mt-10 grid gap-10 sm:grid-cols-2">

                {/* Notes */}
                <div className="space-y-4">
                  <div className="h-4 w-20 animate-pulse rounded bg-gray-300" />

                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3"
                    >
                      <div className="h-2 w-2 animate-pulse rounded-full bg-gray-300" />

                      <div
                        className="h-3 animate-pulse rounded bg-gray-200"
                        style={{
                          width: `${150 + item * 30}px`,
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                  </div>

                  <div className="flex justify-between">
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
                  </div>

                  <div className="flex justify-between">
                    <div className="h-4 w-28 animate-pulse rounded bg-gray-300" />
                    <div className="h-6 w-32 animate-pulse rounded-lg bg-gray-300" />
                  </div>

                  <div className="h-14 w-full animate-pulse rounded-xl bg-gray-200" />
                </div>

              </div>
            </div>

            {/* Invoice Footer */}
            <div className="border-t border-gray-200 px-6 py-6 sm:px-10">
              <div className="mx-auto h-4 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          </div>

          {/* Right Side Skeleton */}
          <div className="hidden space-y-5 lg:block">

            {/* Action Card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-5 h-5 w-32 animate-pulse rounded bg-gray-300" />

              <div className="space-y-3">
                <div className="h-11 w-full animate-pulse rounded-xl bg-gray-200" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-gray-200" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-gray-200" />
              </div>
            </div>

            {/* Invoice Info */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-5 h-5 w-28 animate-pulse rounded bg-gray-300" />

              <div className="space-y-5">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="flex items-center justify-between"
                  >
                    <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
                    <div className="h-4 w-20 animate-pulse rounded bg-gray-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Progress */}
            <div className="rounded-2xl bg-white p-5 shadow-sm">
              <div className="mb-4 h-5 w-36 animate-pulse rounded bg-gray-300" />

              <div className="mb-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div className="h-full w-2/3 animate-pulse rounded-full bg-gray-300" />
              </div>

              <div className="h-3 w-40 animate-pulse rounded bg-gray-200" />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceLoadingSkeleton;
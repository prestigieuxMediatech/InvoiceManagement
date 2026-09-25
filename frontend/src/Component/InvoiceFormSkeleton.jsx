import React from "react";

const InvoiceFormSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#f7f5ff] pb-28 text-slate-800">
      {/* =====================================================
          HEADER SKELETON
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-violet-100 bg-white">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 animate-pulse">

          <div className="flex min-w-0 items-center gap-3">

            {/* Back button */}
            <div className="h-10 w-10 shrink-0 rounded-xl bg-slate-200" />

            <div className="flex items-center gap-3">

              {/* Icon */}
              <div className="h-10 w-10 shrink-0 rounded-xl bg-violet-100" />

              <div className="space-y-2">
                {/* Title */}
                <div className="h-4 w-32 rounded bg-slate-200 sm:w-40" />

                {/* Subtitle */}
                <div className="hidden h-3 w-48 rounded bg-slate-100 sm:block" />
              </div>

            </div>

          </div>

          {/* Save Draft */}
          <div className="h-10 w-28 rounded-xl bg-violet-100" />

        </div>
      </header>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-6 lg:px-8">

        {/* ===================================================
            INVOICE INFORMATION
        ==================================================== */}

        <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm animate-pulse">

          {/* Header */}

          <div className="flex items-center justify-between border-b border-violet-100 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-xl bg-violet-100" />

              <div className="space-y-2">

                <div className="h-4 w-40 rounded bg-slate-200" />

                <div className="h-3 w-32 rounded bg-slate-100" />

              </div>

            </div>

            <div className="hidden h-6 w-20 rounded-full bg-violet-100 sm:block" />

          </div>


          {/* Inputs */}

          <div className="flex flex-wrap gap-5 p-5">

            {[1, 2, 3].map((item) => (

              <div
                key={item}
                className="w-full md:w-[calc(50%-10px)] xl:flex-1"
              >

                <div className="mb-2 h-3 w-24 rounded bg-slate-100" />

                <div className="h-11 w-full rounded-xl bg-slate-100" />

              </div>

            ))}

          </div>

        </section>


        {/* ===================================================
            SELLER + CUSTOMER
        ==================================================== */}

        <div className="flex flex-col gap-5 xl:flex-row">

          {/* SELLER */}

          <section className="flex-1 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm animate-pulse">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-violet-100 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 rounded-xl bg-violet-100" />

                <div className="space-y-2">

                  <div className="h-4 w-32 rounded bg-slate-200" />

                  <div className="h-3 w-40 rounded bg-slate-100" />

                </div>

              </div>

              <div className="h-6 w-14 rounded-full bg-violet-100" />

            </div>


            {/* Form */}

            <div className="flex flex-wrap gap-5 p-5">

              {/* Business */}

              <div className="w-full">

                <div className="mb-2 h-3 w-28 rounded bg-slate-100" />

                <div className="h-11 w-full rounded-xl bg-slate-100" />

              </div>


              {/* Email */}

              <div className="w-full sm:w-[calc(50%-10px)]">

                <div className="mb-2 h-3 w-16 rounded bg-slate-100" />

                <div className="h-11 w-full rounded-xl bg-slate-100" />

              </div>


              {/* Phone */}

              <div className="w-full sm:w-[calc(50%-10px)]">

                <div className="mb-2 h-3 w-16 rounded bg-slate-100" />

                <div className="h-11 w-full rounded-xl bg-slate-100" />

              </div>


              {/* Address */}

              <div className="w-full">

                <div className="mb-2 h-3 w-20 rounded bg-slate-100" />

                <div className="h-[90px] w-full rounded-xl bg-slate-100" />

              </div>

            </div>

          </section>


          {/* CUSTOMER */}

          <section className="flex-1 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm animate-pulse">

            {/* Header */}

            <div className="flex items-center justify-between border-b border-violet-100 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 rounded-xl bg-violet-100" />

                <div className="space-y-2">

                  <div className="h-4 w-36 rounded bg-slate-200" />

                  <div className="h-3 w-44 rounded bg-slate-100" />

                </div>

              </div>

              <div className="h-6 w-14 rounded-full bg-violet-100" />

            </div>


            {/* Form */}

            <div className="flex flex-wrap gap-5 p-5">

              {/* Name */}

              <div className="w-full">

                <div className="mb-2 h-3 w-28 rounded bg-slate-100" />

                <div className="h-11 w-full rounded-xl bg-slate-100" />

              </div>


              {/* Email */}

              <div className="w-full sm:w-[calc(50%-10px)]">

                <div className="mb-2 h-3 w-16 rounded bg-slate-100" />

                <div className="h-11 w-full rounded-xl bg-slate-100" />

              </div>


              {/* Phone */}

              <div className="w-full sm:w-[calc(50%-10px)]">

                <div className="mb-2 h-3 w-16 rounded bg-slate-100" />

                <div className="h-11 w-full rounded-xl bg-slate-100" />

              </div>


              {/* Address */}

              <div className="w-full">

                <div className="mb-2 h-3 w-32 rounded bg-slate-100" />

                <div className="h-[90px] w-full rounded-xl bg-slate-100" />

              </div>

            </div>

          </section>

        </div>


        {/* ===================================================
            ITEMS
        ==================================================== */}

        <section className="overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm animate-pulse">

          {/* Header */}

          <div className="flex items-center justify-between border-b border-violet-100 px-5 py-4">

            <div className="flex items-center gap-3">

              <div className="h-10 w-10 rounded-xl bg-violet-100" />

              <div className="space-y-2">

                <div className="h-4 w-36 rounded bg-slate-200" />

                <div className="h-3 w-48 rounded bg-slate-100" />

              </div>

            </div>

            <div className="h-10 w-28 rounded-xl bg-violet-100" />

          </div>


          {/* Empty / table skeleton */}

          <div className="overflow-x-auto">

            <div className="min-w-[850px]">

              {/* Table header */}

              <div className="grid grid-cols-[2fr_.6fr_1fr_1fr_1fr_1fr_.4fr] gap-4 border-b border-violet-100 bg-violet-50/50 px-5 py-4">

                {[1, 2, 3, 4, 5, 6, 7].map((item) => (

                  <div
                    key={item}
                    className="h-3 rounded bg-violet-100"
                  />

                ))}

              </div>


              {/* Rows */}

              {[1, 2].map((row) => (

                <div
                  key={row}
                  className="grid grid-cols-[2fr_.6fr_1fr_1fr_1fr_1fr_.4fr] items-center gap-4 border-b border-violet-50 px-5 py-5"
                >

                  <div className="flex items-center gap-3">

                    <div className="h-9 w-9 rounded-lg bg-violet-100" />

                    <div className="space-y-2">

                      <div className="h-3 w-40 rounded bg-slate-200" />

                      <div className="h-2.5 w-24 rounded bg-slate-100" />

                    </div>

                  </div>

                  {[1, 2, 3, 4, 5].map((item) => (

                    <div
                      key={item}
                      className="ml-auto h-3 w-12 rounded bg-slate-100"
                    />

                  ))}

                  <div className="h-8 w-8 rounded-lg bg-slate-100" />

                </div>

              ))}

            </div>

          </div>

        </section>


        {/* ===================================================
            ADDITIONAL INFO + SUMMARY
        ==================================================== */}

        <div className="flex flex-col gap-5 xl:flex-row">

          {/* ADDITIONAL INFO */}

          <section className="flex-[5] overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm animate-pulse">

            <div className="flex items-center justify-between border-b border-violet-100 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 rounded-xl bg-violet-100" />

                <div className="space-y-2">

                  <div className="h-4 w-44 rounded bg-slate-200" />

                  <div className="h-3 w-28 rounded bg-slate-100" />

                </div>

              </div>

              <div className="h-9 w-24 rounded-lg bg-violet-100" />

            </div>


            <div className="p-5">

              <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">

                <div className="mb-3 h-3 w-32 rounded bg-violet-100" />

                <div className="space-y-3">

                  <div className="h-3 w-[90%] rounded bg-slate-100" />

                  <div className="h-3 w-[75%] rounded bg-slate-100" />

                  <div className="h-3 w-[85%] rounded bg-slate-100" />

                </div>

              </div>

            </div>

          </section>


          {/* SUMMARY */}

          <section className="flex-[4] overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-sm animate-pulse">

            <div className="border-b border-violet-100 bg-violet-50 px-5 py-4">

              <div className="flex items-center gap-3">

                <div className="h-10 w-10 rounded-xl bg-white" />

                <div className="space-y-2">

                  <div className="h-4 w-32 rounded bg-violet-100" />

                  <div className="h-3 w-28 rounded bg-violet-50" />

                </div>

              </div>

            </div>


            <div className="space-y-4 p-5">

              {[1, 2, 3].map((item) => (

                <div
                  key={item}
                  className="flex items-center justify-between"
                >

                  <div className="h-3 w-20 rounded bg-slate-100" />

                  <div className="h-3 w-16 rounded bg-slate-200" />

                </div>

              ))}

              <div className="border-t border-violet-100" />

              <div className="rounded-xl bg-violet-50 p-4">

                <div className="flex items-end justify-between">

                  <div className="space-y-2">

                    <div className="h-2.5 w-20 rounded bg-violet-100" />

                    <div className="h-7 w-28 rounded bg-violet-100" />

                  </div>

                  <div className="h-9 w-9 rounded-full bg-white" />

                </div>

              </div>

              <div className="h-10 w-full rounded-xl bg-slate-100" />

            </div>

          </section>

        </div>

      </main>


      {/* =====================================================
          BOTTOM BAR
      ====================================================== */}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-violet-100 bg-white">

        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8 animate-pulse">

          <div className="hidden space-y-2 sm:block">

            <div className="h-3 w-28 rounded bg-slate-100" />

            <div className="h-4 w-20 rounded bg-slate-200" />

          </div>

          <div className="flex w-full items-center justify-end gap-3 sm:w-auto">

            <div className="h-11 w-24 rounded-xl bg-slate-100" />

            <div className="h-11 w-36 rounded-xl bg-violet-100" />

          </div>

        </div>

      </div>

    </div>
  );
};

export default InvoiceFormSkeleton;
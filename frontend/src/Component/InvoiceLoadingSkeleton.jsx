import React from "react";

const SkeletonBox = ({
  className = "",
}) => {
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 ${className}`}
    />
  );
};

const InvoiceLoadingSkeleton = () => {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-200 py-4 sm:py-10">

      {/* =====================================================
          TOP ACTION BUTTONS
      ====================================================== */}

      <div className="mx-auto flex max-w-[794px] justify-center gap-3 px-4">

        <SkeletonBox className="h-10 w-32 rounded-lg bg-gray-300" />

        <SkeletonBox className="h-10 w-44 rounded-lg bg-gray-300" />

      </div>

      {/* =====================================================
          INVOICE SCALE CONTAINER
      ====================================================== */}

      <div className="mx-auto mt-8 w-[calc(100%-24px)] overflow-hidden">

        <div
          className="
            relative
            mx-auto
            h-[1000px]
            w-[794px]
            origin-top-left
            overflow-hidden
            bg-white
            font-sans
            shadow-xl
          "
        >

          {/* =====================================================
              BLUE / DARK HEADER
          ====================================================== */}

          <div
            className="
              relative
              h-[190px]
              overflow-hidden
              bg-[#084783]
            "
          >

            {/* Dark background */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-gray-800
                via-gray-700
                to-gray-800
              "
            />

            {/* =================================================
                TOP WAVE SKELETON
            ================================================== */}

            <div
              className="
                absolute
                left-0
                top-0
                h-[75px]
                w-full
                bg-gray-600/40
              "
            />

            <div
              className="
                absolute
                left-0
                top-8
                h-3
                w-[55%]
                animate-pulse
                rounded-r-full
                bg-gray-500/60
              "
            />

            <div
              className="
                absolute
                left-0
                top-16
                h-2
                w-[70%]
                animate-pulse
                rounded-r-full
                bg-gray-500/40
              "
            />

            {/* =================================================
                BOTTOM WHITE CURVE
            ================================================== */}

            <div
              className="
                absolute
                bottom-[-45px]
                left-[-5%]
                h-[100px]
                w-[110%]
                rounded-[50%]
                bg-white
              "
            />

            {/* =================================================
                HEADER CONTENT
            ================================================== */}

            <div
              className="
                relative
                z-10
                flex
                items-start
                justify-between
                px-8
                pt-12
                sm:px-12
              "
            >

              {/* LOGO */}

              <SkeletonBox
                className="
                  h-36
                  w-36
                  rounded-xl
                  bg-gray-500/70
                "
              />

              {/* INVOICE NUMBER */}

              <div className="space-y-2 pt-3">

                <SkeletonBox
                  className="
                    ml-auto
                    h-5
                    w-32
                    bg-gray-500/70
                  "
                />

                <SkeletonBox
                  className="
                    ml-auto
                    h-3
                    w-24
                    bg-gray-600/60
                  "
                />

              </div>

            </div>
          </div>

          {/* =====================================================
              MAIN CONTENT
          ====================================================== */}

          <main
            className="
              px-7
              pb-12
              sm:px-12
            "
          >

            {/* =================================================
                BILL TO / FROM
            ================================================== */}

            <section
              className="
                grid
                grid-cols-2
                gap-6
                sm:gap-12
              "
            >

              {/* ================= BILL TO ================= */}

              <div>

                <SkeletonBox
                  className="
                    h-5
                    w-20
                    bg-gray-300
                  "
                />

                <div className="mt-3 space-y-2">

                  <SkeletonBox
                    className="
                      h-5
                      w-40
                      bg-gray-300
                    "
                  />

                  <SkeletonBox
                    className="
                      h-3
                      w-44
                    "
                  />

                  <SkeletonBox
                    className="
                      h-3
                      w-32
                    "
                  />

                  <SkeletonBox
                    className="
                      h-3
                      w-52
                    "
                  />

                </div>

              </div>

              {/* ================= FROM ================= */}

              <div className="text-right">

                <SkeletonBox
                  className="
                    ml-auto
                    h-5
                    w-20
                    bg-gray-300
                  "
                />

                <div className="mt-3 space-y-2">

                  <SkeletonBox
                    className="
                      ml-auto
                      h-5
                      w-48
                      bg-gray-300
                    "
                  />

                  <SkeletonBox
                    className="
                      ml-auto
                      h-3
                      w-56
                    "
                  />

                  <SkeletonBox
                    className="
                      ml-auto
                      h-3
                      w-32
                    "
                  />

                  <SkeletonBox
                    className="
                      ml-auto
                      h-3
                      w-44
                    "
                  />

                </div>

              </div>

            </section>

            {/* =================================================
                DATE
            ================================================== */}

            <div className="mt-8">

              <SkeletonBox
                className="
                  h-4
                  w-36
                  bg-gray-300
                "
              />

            </div>

            {/* =====================================================
                INVOICE TABLE
            ====================================================== */}

            <section className="mt-8">

              <div
                className="
                  overflow-hidden
                  rounded-sm
                  border
                  border-gray-200
                "
              >

                {/* =================================================
                    TABLE HEADER
                ================================================== */}

                <div
                  className="
                    grid
                    grid-cols-[1.6fr_.4fr_.7fr_.8fr]
                    bg-gray-700
                  "
                >

                  {/* DESCRIPTION */}

                  <div className="border-r border-white/10 px-3 py-3">

                    <SkeletonBox
                      className="
                        h-3
                        w-24
                        bg-gray-500
                      "
                    />

                  </div>

                  {/* QTY */}

                  <div className="border-r border-white/10 px-1 py-3">

                    <SkeletonBox
                      className="
                        mx-auto
                        h-3
                        w-8
                        bg-gray-500
                      "
                    />

                  </div>

                  {/* PRICE */}

                  <div className="border-r border-white/10 px-1 py-3">

                    <SkeletonBox
                      className="
                        mx-auto
                        h-3
                        w-10
                        bg-gray-500
                      "
                    />

                  </div>

                  {/* TOTAL */}

                  <div className="bg-gray-500 px-1 py-3">

                    <SkeletonBox
                      className="
                        mx-auto
                        h-3
                        w-10
                        bg-gray-400
                      "
                    />

                  </div>

                </div>

                {/* =================================================
                    TABLE ROWS
                ================================================== */}

                {[1, 2, 3, 4].map(
                  (row) => (
                    <div
                      key={row}
                      className="
                        grid
                        min-h-[52px]
                        grid-cols-[1.6fr_.4fr_.7fr_.8fr]
                        bg-white
                      "
                    >

                      {/* DESCRIPTION */}

                      <div
                        className="
                          flex
                          items-center
                          border-r
                          border-gray-200
                          px-3
                          py-3
                        "
                      >

                        <div className="w-full space-y-2">

                          <SkeletonBox
                            className="h-3 w-40"
                          />

                          <SkeletonBox
                            className="h-2 w-28 bg-gray-100"
                          />

                        </div>

                      </div>

                      {/* QTY */}

                      <div
                        className="
                          flex
                          items-center
                          justify-center
                          border-r
                          border-gray-200
                        "
                      >

                        <SkeletonBox
                          className="h-3 w-6"
                        />

                      </div>

                      {/* PRICE */}

                      <div
                        className="
                          flex
                          items-center
                          justify-center
                          border-r
                          border-gray-200
                        "
                      >

                        <SkeletonBox
                          className="h-3 w-14"
                        />

                      </div>

                      {/* TOTAL */}

                      <div
                        className="
                          flex
                          items-center
                          justify-center
                          bg-gray-50
                        "
                      >

                        <SkeletonBox
                          className="
                            h-3
                            w-16
                            bg-gray-200
                          "
                        />

                      </div>

                    </div>
                  )
                )}

              </div>

              {/* =================================================
                  SUBTOTAL
              ================================================== */}

              <div className="mt-3 flex justify-end">

                <div
                  className="
                    flex
                    w-[230px]
                    items-center
                    justify-between
                    border
                    border-gray-200
                    bg-gray-50
                  "
                >

                  <div
                    className="
                      border-r
                      border-gray-200
                      px-5
                      py-2.5
                    "
                  >

                    <SkeletonBox
                      className="
                        h-3
                        w-16
                        bg-gray-300
                      "
                    />

                  </div>

                  <div className="px-5 py-2.5">

                    <SkeletonBox
                      className="
                        h-4
                        w-20
                        bg-gray-300
                      "
                    />

                  </div>

                </div>

              </div>

            </section>

            {/* =====================================================
                NOTES + SIGNATURE
            ====================================================== */}

            <section
              className="
                mt-8
                grid
                grid-cols-2
                items-end
                gap-8
              "
            >

              {/* =================================================
                  NOTES
              ================================================== */}

              <div>

                {/* Notes heading */}

                <div
                  className="
                    mb-3
                    flex
                    items-center
                    gap-3
                  "
                >

                  <SkeletonBox
                    className="
                      h-5
                      w-16
                      bg-gray-300
                    "
                  />

                  <SkeletonBox
                    className="
                      h-[1px]
                      flex-1
                      bg-gray-200
                    "
                  />

                </div>

                {/* Notes */}

                <div className="space-y-3">

                  {[1, 2, 3].map(
                    (item) => (
                      <div
                        key={item}
                        className="
                          flex
                          items-start
                          gap-2
                        "
                      >

                        <SkeletonBox
                          className="
                            mt-1
                            h-2
                            w-2
                            shrink-0
                            rounded-full
                            bg-gray-300
                          "
                        />

                        <SkeletonBox
                          className="
                            h-3
                            rounded
                            bg-gray-200
                          "
                          style={{
                            width:
                              `${120 + item * 30}px`,
                          }}
                        />

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* =================================================
                  SIGNATURE
              ================================================== */}

              <div
                className="
                  flex
                  flex-col
                  items-center
                  justify-end
                  pb-1
                "
              >

                {/* Signature placeholder */}

                <SkeletonBox
                  className="
                    h-20
                    w-28
                    rounded-lg
                    bg-gray-200
                    sm:h-24
                    sm:w-32
                  "
                />

                {/* Line */}

                <SkeletonBox
                  className="
                    mt-2
                    h-[1px]
                    w-32
                    bg-gray-300
                    sm:w-36
                  "
                />

                {/* Label */}

                <SkeletonBox
                  className="
                    mt-2
                    h-3
                    w-28
                    bg-gray-200
                  "
                />

              </div>

            </section>

            {/* =====================================================
                THANK YOU
            ====================================================== */}

            <div className="mt-10 flex justify-end">

              <SkeletonBox
                className="
                  mr-5
                  h-10
                  w-44
                  rounded-lg
                  bg-gray-300
                "
              />

            </div>

          </main>

          {/* =====================================================
              BOTTOM BLUE ACCENT
          ====================================================== */}

          <div
            className="
              absolute
              bottom-0
              left-0
              h-[7px]
              w-full
              bg-gray-300
            "
          />

        </div>

      </div>

    </div>
  );
};

export default InvoiceLoadingSkeleton;
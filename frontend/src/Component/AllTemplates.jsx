
import React, { useContext, useEffect, useRef, useState } from "react";
import { Check, ArrowRight } from "lucide-react";

import InvoiceTemplate from "./InvoiceTemplate";
import InvoiceTemplate2 from "./InvoiceTemplate2";
import { InvoiceContext } from "../Context/InvoiceContext";

/*
  Standard A4 preview dimensions.

  Most invoice templates are designed around:
  794px × 1123px

  The preview automatically scales this down
  according to the available container width.
*/
const INVOICE_WIDTH = 794;
const INVOICE_HEIGHT = 1123;

/* -------------------------------------------------
   Responsive Invoice Preview
------------------------------------------------- */

const InvoicePreview = ({ component: TemplateComponent }) => {
  const containerRef = useRef(null);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const updateScale = () => {
      const availableWidth = container.clientWidth;

      if (!availableWidth) return;

      const newScale = Math.min(
        availableWidth / INVOICE_WIDTH,
        1
      );

      setScale(newScale);
    };

    updateScale();

    const resizeObserver = new ResizeObserver(updateScale);

    resizeObserver.observe(container);

    window.addEventListener("resize", updateScale);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  /*
    The outer container reserves the correct scaled height.

    This prevents:
    - clipping
    - extra empty space
    - overlapping
    - half-hidden invoice
  */
  const previewHeight = INVOICE_HEIGHT * scale;

  return (
    <div
      ref={containerRef}
      className="
        relative
        w-full
        overflow-hidden
        rounded-lg
        bg-white
      "
      style={{
        height: `${previewHeight}px`,
      }}
    >
      <div
        className="
          absolute
          left-1/2
          top-0
          origin-top
        "
        style={{
          width: `${INVOICE_WIDTH}px`,
          transform: `translateX(-50%) scale(${scale})`,
        }}
      >
        <TemplateComponent />
      </div>
    </div>
  );
};

/* -------------------------------------------------
   Main Component
------------------------------------------------- */

const AllTemplates = ({ onSelectTemplate }) => {

  const{navigate}=useContext(InvoiceContext)
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const templates = [
    {
      id: "template1",
      name: "Classic",
      description: "Clean and professional invoice layout",
      component: InvoiceTemplate,
    },
    {
      id: "template2",
      name: "Modern",
      description: "Modern and elegant invoice layout",
      component: InvoiceTemplate2,
    },
  ];

  const handleSelect = (id) => {
    setSelectedTemplate(id);
  };

  const handleContinue = () => {
    navigate('/createinvoice',{state:selectedTemplate})
  };


  useEffect(()=>{
    console.log(selectedTemplate)
  },[selectedTemplate])

  return (
    <main className="min-h-screen w-full bg-gray-50">
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-5 sm:py-6 lg:px-8 lg:py-8">

        {/* =========================================
            HEADER
        ========================================= */}

        <header className="mb-5 sm:mb-7 lg:mb-8">
          <h1
            className="
              text-xl
              font-bold
              tracking-tight
              text-gray-900
              sm:text-2xl
              lg:text-3xl
            "
          >
            Choose Invoice Template
          </h1>

          <p
            className="
              mt-1
              text-sm
              leading-5
              text-gray-500
              sm:text-base
            "
          >
            Select a template for your invoice
          </p>
        </header>

        {/* =========================================
            TEMPLATE GRID
        ========================================= */}

        <div
          className="
            grid
            w-full
            grid-cols-1
            gap-5
            md:gap-6
            lg:grid-cols-2
            lg:gap-8
          "
        >
          {templates.map((template) => {
            const isSelected =
              selectedTemplate === template.id;

            return (
              <section
                key={template.id}
                className={`
                  w-full
                  overflow-hidden
                  rounded-2xl
                  border
                  bg-white
                  shadow-sm
                  transition-all
                  duration-200

                  ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-100"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                  }
                `}
              >
                {/* =====================================
                    TEMPLATE HEADER
                ===================================== */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    border-b
                    border-gray-100
                    px-4
                    py-3
                    sm:px-5
                    sm:py-4
                  "
                >
                  <div className="min-w-0">
                    <h2
                      className="
                        truncate
                        text-sm
                        font-semibold
                        text-gray-900
                        sm:text-base
                      "
                    >
                      {template.name}
                    </h2>

                    <p
                      className="
                        mt-0.5
                        line-clamp-2
                        text-xs
                        leading-5
                        text-gray-500
                        sm:text-sm
                      "
                    >
                      {template.description}
                    </p>
                  </div>

                  {/* Selection Indicator */}

                  <button
                    type="button"
                    onClick={() => handleSelect(template.id)}
                    aria-label={`Select ${template.name}`}
                    className={`
                      flex
                      h-8
                      w-8
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border
                      transition-all
                      sm:h-9
                      sm:w-9

                      ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-gray-300 bg-white text-transparent hover:border-blue-400"
                      }
                    `}
                  >
                    <Check size={16} strokeWidth={2.5} />
                  </button>
                </div>

                {/* =====================================
                    RESPONSIVE INVOICE PREVIEW
                ===================================== */}

                <div
                  className="
                    w-full
                    bg-gray-100
                    p-2
                    sm:p-4
                    lg:p-5
                  "
                >
                  <div
                    className="
                      mx-auto
                      w-full
                      max-w-[794px]
                      overflow-hidden
                      rounded-lg
                      bg-white
                      shadow-sm
                    "
                  >
                    <InvoicePreview
                      component={template.component}
                    />
                  </div>
                </div>

                {/* =====================================
                    SELECT BUTTON
                ===================================== */}

                <div className="p-3 sm:p-5">
                  <button
                    type="button"
                    onClick={() => handleSelect(template.id)}
                    className={`
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      transition-all
                      duration-200
                      active:scale-[0.99]

                      ${
                        isSelected
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-900 text-white hover:bg-gray-800"
                      }
                    `}
                  >
                    {isSelected ? (
                      <>
                        <Check size={17} strokeWidth={2.5} />
                        Selected
                      </>
                    ) : (
                      "Use This Template"
                    )}
                  </button>
                </div>
              </section>
            );
          })}
        </div>

        {/* =========================================
            CONTINUE BAR
        ========================================= */}

        <div
          className="
            sticky
            bottom-0
            z-30
            mt-5
            border-t
            border-gray-200
            bg-gray-50/95
            py-3
            backdrop-blur
            sm:mt-7
            sm:py-4
          "
        >
          <div
            className="
              mx-auto
              flex
              w-full
              max-w-7xl
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
              sm:justify-end
            "
          >
            {/* Selected template information */}

            <div
              className="
                hidden
                text-sm
                text-gray-500
                sm:block
              "
            >
              {selectedTemplate
                ? `Selected: ${
                    templates.find(
                      (template) =>
                        template.id === selectedTemplate
                    )?.name
                  }`
                : "No template selected"}
            </div>

            {/* Continue */}

            <button
              type="button"
              disabled={!selectedTemplate}
              onClick={handleContinue}
              className={`
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                px-5
                py-3
                text-sm
                font-semibold
                transition-all
                sm:w-auto
                sm:min-w-[220px]

                ${
                  selectedTemplate
                    ? "bg-blue-600 text-white shadow-sm hover:bg-blue-700 active:scale-[0.98]"
                    : "cursor-not-allowed bg-gray-200 text-gray-400"
                }
              `}
            >
              Continue with Template

              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AllTemplates;

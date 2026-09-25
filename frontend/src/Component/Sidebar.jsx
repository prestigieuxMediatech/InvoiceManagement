import { useContext, useEffect, useState } from "react";
import {
  Home,
  FileText,
  LayoutTemplate,
  Plus,
  ChevronRight,
  X,
  BookAIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { LogOut } from "lucide-react";
import { InvoiceContext } from "../Context/InvoiceContext";
const menuItems = [
  {
    name: "Home",
    href: "/home",
    icon: Home,
  },

  {
    name: "All Item",
    href: "/allitem",
    icon: LayoutTemplate,
  },

   {
    name: "Qoutation",
    href: "/allqoutation",
    icon: BookAIcon,
  },

   {
    name: "Connext WhatsApp",
    href: "/connect-whatsapp",
    icon: Plus,
    
  },

 
  
  {
    name: "Create Invoice",
    href: "/alltemplate",
    icon: Plus,
    primary: true,
  },


  
  
];

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const { backendUrl, deleteCookie, navigate}=useContext(InvoiceContext)

  // On desktop, sidebar is always visible.
  // On mobile, it starts closed.
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleScreenChange = (event) => {
      if (event.matches) {
        setOpen(false);
      }
    };

    mediaQuery.addEventListener("change", handleScreenChange);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenChange);
    };
  }, []);

  return (
    <>
      {/* =====================================================
          MOBILE ONLY
          Company icon when sidebar is closed
      ====================================================== */}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
          className="
            fixed
            left-4
            top-4
            z-[60]
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-violet-600
            p-2
            shadow-lg
            shadow-violet-900/20
            transition-all
            duration-200

            hover:scale-105
            hover:bg-violet-700

            md:hidden
          "
        >
          <img
            src="./logowithouttext.png"
            alt="Company Logo"
            className="h-full w-full object-contain"
          />
        </button>
      )}

      {/* =====================================================
          SIDEBAR
          Mobile  -> only when open
          Desktop -> always visible
      ====================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-[270px]
          bg-violet-600
          shadow-xl
          shadow-violet-900/20
          transition-transform
          duration-300
          ease-in-out

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }
        `}
      >
        <div className="flex h-full flex-col">

          {/* =================================================
              LOGO HEADER
          ================================================= */}

          <div
            className="
              flex
              h-[82px]
              shrink-0
              items-center
              justify-between
              border-b
              border-violet-500/50
              px-6
            "
          >
            <div className="flex h-28 w-28 items-center justify-center">
              <img
                src="./White Logo.png"
                alt="Company Logo"
                className="h-full w-full object-contain"
              />
            </div>

            {/* 
              Close button:
              Mobile -> visible
              Desktop -> hidden
            */}

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close sidebar"
              className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                text-white/70
                transition-all
                hover:bg-violet-500
                hover:text-white

                md:hidden
              "
            >
              <X size={18} />
            </button>
          </div>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav className="flex-1 overflow-y-auto px-3 py-7">

            <p
              className="
                mb-4
                px-3
                text-[10px]
                font-bold
                uppercase
                tracking-[0.18em]
                text-violet-200
              "
            >
              Workspace
            </p>

            <div className="space-y-2">

              {menuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    onClick={() => {
                      // Close only on mobile
                      if (
                        window.matchMedia(
                          "(max-width: 767px)"
                        ).matches
                      ) {
                        setOpen(false);
                      }
                    }}
                    className={({ isActive }) => `
                      group
                      relative
                      flex
                      h-12
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-3
                      transition-all
                      duration-200

                      ${
                        item.primary
                          ? `
                            bg-white
                            text-violet-700
                            shadow-md
                            shadow-violet-900/10
                            hover:bg-violet-50
                          `
                          : isActive
                          ? `
                            bg-violet-500
                            text-white
                          `
                          : `
                            text-white/85
                            hover:bg-violet-500
                            hover:text-white
                          `
                      }
                    `}
                  >

                    {/* Active Indicator */}

                    {!item.primary && (
                      <span
                        className="
                          absolute
                          left-0
                          top-1/2
                          h-6
                          w-[3px]
                          -translate-y-1/2
                          rounded-r-full
                          bg-white
                          opacity-0
                          transition-all
                          duration-200
                          group-hover:opacity-100
                        "
                      />
                    )}

                    {/* Icon */}

                    <Icon
                      size={19}
                      strokeWidth={1.8}
                      className={`
                        shrink-0
                        transition-transform
                        duration-200
                        group-hover:scale-105

                        ${
                          item.primary
                            ? "text-violet-600"
                            : "text-white/80 group-hover:text-white"
                        }
                      `}
                    />

                    {/* Text */}

                    <span className="whitespace-nowrap text-sm font-medium">
                      {item.name}
                    </span>

                    {/* Arrow */}

                    {item.primary && (
                      <ChevronRight
                        size={16}
                        className="
                          ml-auto
                          text-violet-400
                          transition-transform
                          duration-200
                          group-hover:translate-x-1
                        "
                      />
                    )}

                  </NavLink>
                );
              })}

            </div>
          </nav>




{/* ================================================
    LOGOUT
================================================= */}

<div className="shrink-0 border-t border-violet-500/50 px-3 py-4">
  <button
  onClick={()=>{
    deleteCookie("token")
    navigate("/")
  }}
    type="button"
    className="
      group
      flex
      h-11
      w-full
      items-center
      gap-3
      rounded-xl
      px-3
      text-sm
      font-medium
      text-white/85
      transition-all
      duration-200

      hover:bg-white/10
      hover:text-white

      active:scale-[0.98]
    "
  >
    <LogOut
      size={19}
      strokeWidth={1.8}
      className="
        shrink-0
        text-white/75
        transition-all
        duration-200
        group-hover:translate-x-0.5
        group-hover:text-white
      "
    />

    <span>Logout</span>
  </button>
</div>


        </div>
      </aside>

      {/* =====================================================
          MOBILE OVERLAY
          Only visible when sidebar is open
      ====================================================== */}

      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setOpen(false)}
          className="
            fixed
            inset-0
            z-40
            bg-slate-950/20
            md:hidden
          "
        />
      )}
    </>
  );
};

export default Sidebar;
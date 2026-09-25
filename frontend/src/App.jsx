import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";
import "./template2.css";

import Sidebar from "./Component/Sidebar";

import AllTemplates from "./Component/AllTemplates";
import InvoiceForm from "./Component/InvoiceForm";
import Allinvoices from "./Component/Allinvoices";
import Login from "./Component/Login";

import InvoiceTemplate from "./Component/InvoiceTemplate";
import InvoiceTemplate2 from "./Component/InvoiceTemplate2";
import UpdateInvoice from "./Component/UpdateInvoice";

import Items from "./Component/Items";
import AddItem from "./Component/AddItem";

import Quatation from "./Component/Quatation";
import QuotationForm from "./Component/QuotationForm";
import AllQuotation from "./Component/AllQoutation";
import EditQoutation from "./Component/EditQoutation";

import WhatsAppConnect from "./Component/WhatsAppConnect";

import ProtectedRoute from "./Component/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gray-50">

      <Routes>

        {/* ================= LOGIN ================= */}

        <Route
          path="/"
          element={<Login />}
        />


        {/* ================= PROTECTED ROUTES ================= */}

        <Route element={<ProtectedRoute />}>

          {/* ================= DASHBOARD LAYOUT ================= */}

          <Route
            element={
              <>
                <Sidebar />

                <main
                  className="
                    min-h-screen
                    w-full
                    p-3
                    sm:p-5
                    lg:ml-[270px]
                    lg:w-[calc(100%-270px)]
                    lg:p-8
                    transition-all
                    duration-300
                  "
                >
                  <Outlet />
                </main>
              </>
            }
          >

            {/* ================= HOME ================= */}

            <Route
              path="/home"
              element={<Allinvoices />}
            />


            {/* ================= INVOICE TEMPLATES ================= */}

            <Route
              path="/template"
              element={<InvoiceTemplate />}
            />

            <Route
              path="/template1"
              element={<InvoiceTemplate2 />}
            />

            <Route
              path="/alltemplate"
              element={<AllTemplates />}
            />


            {/* ================= ITEMS ================= */}

            <Route
              path="/allitem"
              element={<Items />}
            />

            <Route
              path="/additem"
              element={<AddItem />}
            />


            {/* ================= INVOICES ================= */}

            <Route
              path="/createinvoice"
              element={<InvoiceForm />}
            />

            <Route
              path="/updateinvoice"
              element={<UpdateInvoice />}
            />


            {/* ================= QUOTATIONS ================= */}

            <Route
              path="/allqoutation"
              element={<AllQuotation />}
            />

            <Route
              path="/qoutation"
              element={<Quatation />}
            />

            <Route
              path="/createqoutation"
              element={<QuotationForm />}
            />

            <Route
              path="/edit-qoutation"
              element={<EditQoutation />}
            />


            {/* ================= WHATSAPP ================= */}

            <Route
              path="/connect-whatsapp"
              element={<WhatsAppConnect />}
            />

          </Route>

        </Route>

      </Routes>

    </div>
  );
}

export default App;
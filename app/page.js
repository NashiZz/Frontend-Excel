"use client";

import { ToastContainer } from "react-toastify";
import AppRouter from "./RootProvider";

export default function Home() {
  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
}

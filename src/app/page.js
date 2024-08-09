"use client";
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    if (localStorage.getItem("jwt")) {
      redirect("/dashboard/employee");
    } else {
      redirect("/login");
    }
  }, []);

  return <></>;
};
export default Home;

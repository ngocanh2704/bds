"use client";
import { getCookie } from 'cookies-next';
import { redirect } from "next/navigation";
import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
  const token = getCookie('token')
    if (token) {
      redirect("/dashboard/employee");
    } else {
      redirect("/login");
    }
  }, []);
};
export default Home;

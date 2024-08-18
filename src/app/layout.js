"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import AntdStyledComponentsRegistry from "./AntdStyledComponentsRegistry";
import { AntdRegistry } from "@ant-design/nextjs-registry";


const inter = Inter({ subsets: ["latin"] });

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AntdRegistry>
        {children}
        </AntdRegistry>
      </body>
    </html>
  );
};

export default RootLayout;

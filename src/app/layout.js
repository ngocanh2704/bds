"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import AntdStyledComponentsRegistry from "./AntdStyledComponentsRegistry";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import allReducer from "./reducers/allReducer";
import {thunk} from "redux-thunk";


const inter = Inter({ subsets: ["latin"] });
const store = createStore(allReducer, applyMiddleware(thunk))

const RootLayout = ({ children }) => {
  return (
    <Provider store={store} stabilityCheck="never">
      <html lang="en">
        <body className={inter.className}>
          <AntdRegistry>
            {children}
          </AntdRegistry>
        </body>
      </html>
    </Provider>
  );
};

export default RootLayout;

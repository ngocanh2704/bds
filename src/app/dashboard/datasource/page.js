"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Input, Row, Tabs } from "antd";
import ALl from "./all";
import My from "./my";
import Sale from "./sale";
import Buy from "./buy";
import Approve from "./approve";
import Request from "./request";
import axios from "axios";
import ModalData from "./ModalData";
import ModalUpload from "./ModalUpload";
import { redirect } from "next/navigation";

const DataSource = () => {
  const [dataAll, setDataAll] = useState([]);
  const [key, setKey] = useState("");
  const [open, setOpen] = useState(false);
  const [on, setOn] = useState(false);
  const [id, setId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const changeOpen = () => {
    setOpen(!open);
  };

  const changeOn = () => {
    setOn(!on);
  };

  const changeLoading = () => {
    setIsLoading(!isLoading)
  }
  

  // useEffect(() => {
  //   var jwt = ''
  //   if(typeof window !== 'undefined'){
  //     jwt = localStorage.getItem('jwt') || ''
  //   }
  //   const getData = () => {
  //   axios
  //     .get("https://api.connecthome.vn/apartment", {
  //       headers: {
  //         Authorization: `Bearer ${jwt}`,
  //       },
  //     })
  //     .then((res) => {
  //       setDataAll(res.data.data);
  //       setIsLoading(false);
  //     })
  //     .catch((e) => {
  //       redirect('/login')
  //     });
  // };
  //   getData();
  // }, [key, isLoading]);
  const onChange = (key) => {
    setKey(key, open);
  };
  const changeId = (id) => {
    setId(id);
  };
  const items = [
    {
      key: "1",
      label: "Tất cả",
      children: (
        <ALl
          changeOn={() => changeOn()}
          data={dataAll}
          changeOpen={() => changeOpen()}
          changeId={(id) => changeId(id)}
          isLoading={isLoading}
          onDelete={() => onDelete(id)}
          changeLoading={()=>changeLoading()}
        />
      ),
    },
    {
      key: "2",
      label: "Của tôi",
      children: <My />,
    },
    {
      key: "3",
      label: "Kho bán",
      children: <Sale data={dataAll} />,
    },
    {
      key: "4",
      label: "Kho mua",
      children: <Buy data={dataAll} />,
    },
    {
      key: "5",
      label: "Duyệt yêu cầu số điện thoại",
      children: <Request data={dataAll} />,
    },
    {
      key: "6",
      label: "Yêu cầu số điện thoại",
      children: <Approve data={dataAll} />,
    },
  ];

  

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => {
          setOpen(true);
          setId("");
        }}
      >
        Thêm mới
      </Button>
      <ModalUpload open={on} hideModal={() => changeOn()} id={id} />
      <ModalData open={open} hideModal={() => changeOpen()} id={id} />
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
};
export default DataSource;

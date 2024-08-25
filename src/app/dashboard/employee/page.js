"use client";
import React, { useEffect, useState } from "react";
import { Button, Image, Table, Flex, message, Input, Space } from "antd";
import axios from "axios";
// import CreateEmployee from "./CreateEmployee";
import moment from "moment";
// import { getNewToken } from "@/app/auth";
// import { redirect } from "next/navigation";
import useSWR, { mutate } from "swr";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

const config = {
  headers: { Authorization: `Bearer ${getCookie("token")}` },
};
const fetcher = (url) => axios.get(url, config).then((res) => res.data);
const DynamicCreateEmployee = dynamic(() => import("./CreateEmployee"), {
  ssr: false,
});

const Employee = () => {
  const { Search } = Input;

  const [dataStatus, setDataStatus] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState([]);
  const [id, setId] = useState("");

  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => {
        return <>{index + 1}</>;
      },
    },
    {
      title: "Họ và tên",
      dataIndex: "employee_name",
      key: "employee_name",
    },
    {
      title: "Ngày bắt đầu làm việc",
      dataIndex: "start_date",
      key: "start_date",
      render: (record) => (
        <>{record ? moment(record).format("Do MM YY") : ""}</>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (record) => <>{record == true ? "Nam" : "Nữ"}</>,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone_number",
      key: "phone_number",
    },
    {
      title: "Email",
      dataIndex: "email_address",
      key: "email_address",
    },
    {
      title: "Ngày sinh",
      dataIndex: "dob",
      key: "dob",
      render: (record) => (
        <>{record ? moment(record).format("Do MM YY") : ""}</>
      ),
    },
    {
      title: "CCCD/CMND",
      dataIndex: "cccd_image",
      key: "cccd_image",
      render: (_, { cccd_image }) => (
        <>
          <Image
            src={"http://localhost:3001" + cccd_image}
            style={{ width: 150, height: 80 }}
            alt="..."
          />
        </>
      ),
    },
    {
      title: "Tình trạng làm việc",
      dataIndex: "employment_status_id",
      key: "employment_status_id",
      render: (item) => Object.values(item)[1],
    },
    {
      title: "Action",
      dataIndex: "_id",
      key: "_id",
      render: (record) => (
        <Flex gap="small" wrap>
          <Button
            type="primary"
            style={{ backgroundColor: "rgb(250, 173, 20)" }}
            onClick={() => {
              setOpen(true), setId(record);
            }}
          >
            Sửa
          </Button>
          <Button type="primary" danger onClick={() => onDelete(record)}>
            Xoá
          </Button>
        </Flex>
      ),
    },
  ];

  const changeLoading = () => {
    setIsLoading(true);
  };

  const changeOpen = () => {
    setOpen(false);
  };

  const onDelete = (id) => {
    axios
      .post("http://localhost:3001/employee/delete", { id: id })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: res.data.message,
        }),
          mutate("http://localhost:3001/employee");
      });
  };

  const { data, error, isLoading } = useSWR(
    `http://localhost:3001/employee`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    var token = getCookie("token");
    const currentTime = Date.now() / 1000;
    if (token == undefined) {
      redirect("/login");
    } else {
      if (jwtDecode(token).exp < currentTime) {
        deleteCookie("token");
        mutate("http://localhost:3001/employee");
        redirect("/login");
      }
    }
  }, [isLoading]);

  return (
    <div>
      {contextHolder}
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          // changDataForOptions();
          setId("");
        }}
        style={{ marginBottom: 20 }}
      >
        Thêm mới
      </Button>
      <div style={{ maxWidth: "100%" }}>
        <Search
          allowClear
          placeholder="Tên nhân viên"
          enterButton="Search"
          size="middle"
          // onSearch={onSearch}
          style={{
            marginBottom: 20,
            width: 500,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
      </div>
      <DynamicCreateEmployee
        open={open}
        hideModal={() => changeOpen()}
        status={data?.dataStatus}
        id={id}
        isLoading={() => changeLoading()}
      />
      <Table columns={columns} dataSource={data?.data} loading={isLoading} size="small" />
    </div>
  );
};
export default Employee;

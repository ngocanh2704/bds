"use client";
import React, { useEffect, useState } from "react";
import { Button, Image, Table, Flex, message, Input, Space } from "antd";
import axios from "axios";
import CreateEmployee from "./CreateEmployee";
import moment from "moment";
// import { getNewToken } from "@/app/auth";
import { redirect } from "next/navigation";

const Employee = () => {
  const { Search } = Input;

  const [data, setData] = useState([]);
  const [dataStatus, setDataStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageApi, contextHolder] = message.useMessage();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState([]);
  const [id, setId] = useState("");

  const columns = [
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
            src={"https://api.connecthome.vn" + cccd_image}
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

  const getData = () => {
    // getNewToken(localStorage.getItem('refreshJWT'))
    var jwt = ''
    if(typeof window !== 'undefined'){
      jwt = localStorage.getItem('jwt') || ''
    }
    axios
      .get("https://api.connecthome.vn/employee",{
        headers: {
          Authorization: `Bearer ${jwt}`,
        }
      })
      .then((res) => {
        setData(res.data);
        setDataStatus(res.data.dataStatus), setIsLoading(false);
      })
      .catch((e) => {
        redirect("/login");
      });
  };
  const changeLoading = () => {
    setIsLoading(true);
  };

  const changeOpen = () => {
    setOpen(false);
  };

  const onDelete = (id) => {
    axios
      .post("https://api.connecthome.vn/employee/delete", { id: id })
      .then((res) => {
        messageApi.open({
          type: "success",
          content: res.data.message,
        }),
          setIsLoading(true);
      });
  };

  useEffect(getData, [isLoading]);
  return (
    <>
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
      <CreateEmployee
        open={open}
        hideModal={() => changeOpen()}
        status={dataStatus}
        id={id}
        isLoading={() => changeLoading()}
      />
      <Table columns={columns} dataSource={data.data} loading={isLoading} />
    </>
  );
};
export default Employee;

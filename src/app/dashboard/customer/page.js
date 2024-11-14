"use client";
import { useEffect, useState } from "react";
import { Table, Button, Flex } from "antd";
import ModalCustomer from "./ModalCustomer";
import { useDispatch, useSelector } from "react-redux";
import { actFetchCustomer } from "@/actions/actionCustonmer";
import moment from "moment";

const Customer = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const getData = () => dispatch(actFetchCustomer());
  const data = useSelector((state) => state.customer.data);

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "STT",
      dataIndex: "_id",
      key: "_id",
      render: (text, record, index) => {
        return <>{index + 1}</>;
      },
    },
    { title: "Tên khách hàng", dataIndex: "name", key: "name" },
    { title: "Số điện thoại", dataIndex: "phone_number", key: "phone_number" },
    { title: "Mã căn hộ", dataIndex: "apartment_name", key: "apartment_name" },
    {
      title: "Lọc (Thuê/Mua bán)",
      dataIndex: "status",
      key: "status",
      render: (record) => <>{record == true ? "Mua bán" : "Thuê"}</>,
    },
    {
      title: "Ngày ký hợp đồng",
      dataIndex: "day_sign",
      key: "day_sign",
      render: (record) => moment(record).format("DD/MM/YYYY"),
    },
    {
      title: "Lọc ngày sinh",
      dataIndex: "bod",
      key: "bod",
      render: (record) => moment(record).format("DD/MM/YYYY"),
    },
    { title: "Note", dataIndex: "note", key: "note" },
    {
      title: "Actions",
      dataIndex: "_id",
      key: "_id",
      render: (record) => (
        <Flex gap={"small"} wrap>
          <Button
            type="primary"
            style={{ backgroundColor: "rgb(250, 173, 20)" }}
          >
            Sửa
          </Button>
          <Button type="primary" danger>
            Xoá
          </Button>
        </Flex>
      ),
    },
  ];

  const changeOpen = () => {
    setOpen(false);
  };

  return (
    <>
      <Button
        type="primary"
        style={{ marginBottom: 20 }}
        onClick={() => {
          setOpen(true);
        }}
      >
        Thêm mới
      </Button>
      <ModalCustomer open={open} hideModal={() => changeOpen()} />
      <Table
        columns={columns}
        size="small"
        dataSource={data}
        pagination={{
          defaultPageSize: 50,
        }}
      />
    </>
  );
};

export default Customer;

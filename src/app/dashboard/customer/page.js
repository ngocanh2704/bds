"use client";
import { useEffect, useState } from "react";
import { Table, Button, Flex, Form, Input, DatePicker } from "antd";
import ModalCustomer from "./ModalCustomer";
import { useDispatch, useSelector } from "react-redux";
import { actDeleteCustomer, actFetchCustomer } from "@/actions/actionCustonmer";
import moment from "moment";
import axios from "axios";

const Customer = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const getData = () => dispatch(actFetchCustomer());
  const data = useSelector((state) => state.customer.data);
  const handleDelete = (id) => dispatch(actDeleteCustomer(id));
  const mergeValue = new Set();

  useEffect(() => {
    getData();
    mergeValue.clear();
  }, []);

  const onFinish = (values) => {
    console.log(values);
  };

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
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
      onCell: (record, index) => {
        if (mergeValue.has(record.name)) {
          return { rowSpan: 0 };
        } else {
          const rowCount = data.filter(
            (item) => item.name === record.name
          ).length;
          mergeValue.add(record.name);
          return { rowSpan: rowCount };
        }
        return {};
      },
    },
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
      onCell: (record, index) => {
        // return   moment(record.bod).format("DD/MM/YYYY")
        if (mergeValue.has(record.bod)) {
          return { rowSpan: 0 };
        } else {
          const rowCount = data.filter(
            (item) =>
              moment(item.bod).format("DD/MM/YYYY") ===
              moment(record.bod).format("DD/MM/YYYY")
          ).length;
          mergeValue.add(record.bod);
          return { rowSpan: rowCount };
        }
        return {};
      },
    },
    { title: "Note", dataIndex: "note", key: "note" },
    {
      title: "Actions",
      dataIndex: "_id",
      key: "_id",
      render: (item) => (
        <Flex gap={"small"} wrap>
          <Button
            type="primary"
            style={{ backgroundColor: "rgb(250, 173, 20)" }}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              handleDelete(item);
            }}
          >
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
      <Form layout="inline" style={{ marginBottom: 20 }} onFinish={onFinish}>
        <Form.Item name={"name"}>
          <Input style={{ width: 200 }} placeholder="Tên khách hàng" />
        </Form.Item>
        <Form.Item name={"bod"}>
          <DatePicker
            style={{ width: 200 }}
            placeholder="Năm sinh khách hàng"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Tìm
          </Button>
        </Form.Item>
      </Form>
      <ModalCustomer open={open} hideModal={() => changeOpen()} />
      <Table
        rowKey={"_id"}
        columns={columns}
        size="small"
        dataSource={data}
        pagination={{
          defaultPageSize: 50,
        }}
        bordered={true}
      />
    </>
  );
};

export default Customer;

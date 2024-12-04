"use client";
import { useEffect, useState } from "react";
import { Table, Button, Flex, Form, Input, DatePicker } from "antd";
import ModalCustomer from "./ModalCustomer";
import { useDispatch, useSelector } from "react-redux";
import { actDeleteCustomer, actFetchCustomer } from "@/actions/actionCustonmer";
import moment from "moment";
import axios from "axios";
import { useRouter } from "next/navigation";

const Customer = () => {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const getData = () => dispatch(actFetchCustomer());
  const data = useSelector((state) => state.customer.data);
  const handleDelete = (id) => dispatch(actDeleteCustomer(id));
  const mergeValue = new Set();
  const mergeBod = new Set();
  const names = new Set();

  useEffect(() => {
    getData();
    mergeValue.clear();
    mergeBod.clear();
    names.clear();
  }, []);

  const { push } = useRouter();

  useEffect(() => {
    var role = getCookie("role");
    if (role == "staff") {
      push("/dashboard/datasource");
    }
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
      onCell: (value, row, index) => {
        const obj = {
          children: value,
          props: {}
        };
        
        if (names.has(value)) {
          obj.props.rowSpan = 0;
        } else {
          const occurCount = data.filter((data) => data.name === value).length;
          
          obj.props.rowSpan = occurCount;
          names.add(value);
        }
    
        return obj;
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
      // onCell: (record, index) => {
      //   // return   moment(record.bod).format("DD/MM/YYYY")
      //   if (mergeBod.has(record.bod)) {
      //     return { rowSpan: 0 };
      //   } else {
      //     const rowCount = data.filter(
      //       (item) =>
      //       item.bod ===
      //       record.bod
      //     ).length;
      //     mergeBod.add(record.bod);
      //     return { rowSpan: rowCount };
      //   }
      //   return {};
      // },
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

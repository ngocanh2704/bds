"use client";
import { useEffect, useState } from "react";
import { Table, Button, Flex, Form, Input, DatePicker } from "antd";
import ModalCustomer from "./ModalCustomer";
import { useDispatch, useSelector } from "react-redux";
import { actDeleteCustomer, actFetchCustomer, searchCustomer } from "@/actions/actionCustonmer";
import moment from "moment";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getCookie } from "cookies-next";
import dynamic from "next/dynamic";

const DynamicModalCustomer = dynamic(() => import('./ModalCustomer'))

const Customer = () => {
  const [open, setOpen] = useState(false);
  const [id, setId] = useState("");
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const getData = (page) => dispatch(actFetchCustomer(page));
  const searchData = (data) => dispatch(searchCustomer(data))
  const data = useSelector((state) => state.customer.data);
  const total_page = useSelector((state) => state.customer.total_page);
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
    values.page = page
    axios.post('https://api.connecthome.vn/customer/search', values).then(res => searchData(res.data)).catch(e => console.log(e))
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
      render: (text, record, index) => {
        // Kiểm tra giá trị trước đó có giống giá trị hiện tại hay không
        const rowSpan =
          index === 0 || data[index].name !== data[index - 1].name
            ? data.filter((item, i) => item.name === text && i >= index).length
            : 0;
        return {
          children: text,
          props: {
            rowSpan,
          },
        };
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
      // onCell: (value, row, index) => {
      //   // return   moment(record.bod).format("DD/MM/YYYY")
      //   if (mergeBod.has(moment(value.bod).format("DD/MM/YYYY"))) {
      //     return { rowSpan: 0 };
      //   } else {
      //     const rowCount = data.filter(
      //       (item) =>
      //         moment(item.bod).format("DD/MM/YYYY") ===
      //       moment(value.bod).format("DD/MM/YYYY")
      //     ).length;
      //     mergeBod.add(moment(value.bod).format("DD/MM/YYYY"));
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
            onClick={() => {
              setOpen(true), setId(item);
            }}
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
          setId("");
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
      <DynamicModalCustomer open={open} hideModal={() => changeOpen()} page={page} id={id} />
      <Table
        rowKey={"_id"}
        columns={columns}
        size="small"
        dataSource={data}
        pagination={{
          defaultPageSize: 20,
          total: total_page
        }}
        onChange={(pagination) => {
          setPage(pagination.current),
            getData(pagination.current)
        }}
        bordered={true}
      />
    </>
  );
};

export default Customer;

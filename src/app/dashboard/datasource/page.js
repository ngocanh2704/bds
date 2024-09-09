"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  message,
  Row,
  Select,
  Tabs,
} from "antd";
import My from "./my";
import Sale from "./sale";
import Buy from "./buy";
import Approve from "./approve";
import Request from "./request";
import axios from "axios";
import ModalData from "./ModalData";
import ModalUpload from "./ModalUpload";
import dynamic from "next/dynamic";
import useSWR, { mutate } from "swr";
import { SearchOutlined } from "@ant-design/icons";
import { getCookie } from "cookies-next";

const DynamicAll = dynamic(() => import("./all"));
const DynamicSale = dynamic(() => import("./sale"));
const DynamicBuy = dynamic(() => import("./buy"));
const DynamicRequest = dynamic(() => import("./request"));
const DynamicApprove = dynamic(() => import("./approve"));
const DynamicModalData = dynamic(() => import("./ModalData"));
const fetcher = (url) => axios.get(url).then((res) => res.data);

const DataSource = () => {
  const [dataAll, setDataAll] = useState([]);
  const [key, setKey] = useState("");
  const [open, setOpen] = useState(false);
  const [on, setOn] = useState(false);
  const [id, setId] = useState("");
  const [project, setProject] = useState([]);
  const [building, setBuilding] = useState([]);
  const [property, setProperty] = useState([]);
  const [balconyDirection, setBalconyDirection] = useState([]);
  const [axis, setAxis] = useState([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [itemsYeuCau, setItemsYeuCau] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [role, setRole] = useState("");

  const changeOpen = () => {
    setOpen(!open);
  };

  const changeOn = () => {
    setOn(!on);
  };

  const changeLoading = () => {
    setIsLoading(!isLoading);
  };

  const onChange = (key) => {
    setKey(key);
    // if (key == '5') {
    //   mutate("https://connecthome.vn/apartment/request");
    // } else if (key == '6') {
    //   mutate("https://connecthome.vn/apartment/approve");
    // }
    const checkKey = {
      1: mutate("httpe//localhost:3001/apartment"),
      2: mutate("https://connecthome.vn/apartment/khosale"),
      3: mutate('https://connecthome.vn/apartment/khomua')
    };
    checkKey(key);
  };
  const changeId = (id) => {
    setId(id);
  };
  const items = [
    {
      key: "1",
      label: "Tất cả",
      children: (
        <DynamicAll
          changeOn={() => changeOn()}
          data={dataAll}
          changeOpen={() => changeOpen()}
          changeId={(id) => changeId(id)}
          onDelete={() => onDelete(id)}
          changeLoading={() => changeLoading()}
          yeuCauDongLoat={(items) => yeuCauDongLoat(items)}
        />
      ),
    },
    {
      key: "2",
      label: "Kho bán",
      children: (
        <DynamicSale
          changeOn={() => changeOn()}
          data={key}
          changeOpen={() => changeOpen()}
          changeId={(id) => changeId(id)}
          onDelete={() => onDelete(id)}
          changeLoading={() => changeLoading()}
          yeuCauDongLoat={(items) => yeuCauDongLoat(items)}
        />
      ),
    },
    {
      key: "3",
      label: "Kho Thuê",
      children: (
        <DynamicBuy
          changeOn={() => changeOn()}
          data={dataAll}
          changeOpen={() => changeOpen()}
          changeId={(id) => changeId(id)}
          onDelete={() => onDelete(id)}
          changeLoading={() => changeLoading()}
          yeuCauDongLoat={(items) => yeuCauDongLoat(items)}
        />
      ),
    },
    {
      key: "4",
      label: "Duyệt yêu cầu số điện thoại",
      children: (
        <DynamicRequest
          changeOn={() => changeOn()}
          data={dataAll}
          changeOpen={() => changeOpen()}
          changeId={(id) => changeId(id)}
          onDelete={() => onDelete(id)}
          changeLoading={() => changeLoading()}
          yeuCauDongLoat={(items) => yeuCauDongLoat(items)}
        />
      ),
    },
    {
      key: "6",
      label: "Yêu cầu số điện thoại",
      children: (
        <DynamicApprove
          changeOn={() => changeOn()}
          data={dataAll}
          changeOpen={() => changeOpen()}
          changeId={(id) => changeId(id)}
          onDelete={() => onDelete(id)}
          changeLoading={() => changeLoading()}
          yeuCauDongLoat={(items) => yeuCauDongLoat(items)}
          key={key}
        />
      ),
    },
  ];

  const yeuCauDongLoat = (items) => {
    setItemsYeuCau(items);
  };
  const onClickYeuCauDongLoat = () => {
    itemsYeuCau.forEach((item) => {
      axios
        .post("https://connecthome.vn/apartment/request-data", {
          id: item,
          user: getCookie("user"),
        })
        .then((res) => {
          console.log(res);
        })
        .catch((e) => console.log(e));
    });
    mutate("https://connecthome.vn/apartment/request");
    messageApi.open({
      type: "success",
      content: "Đã yêu cầu thành công",
    });
  };

  const onClickXoaDongLoat = () => {
    itemsYeuCau.forEach((item) => {
      axios
        .post("https://connecthome.vn/delete", { id: item })
        .then((res) => {
          mutate("https://connecthome.vn/apartment");
        })
        .catch((e) => console.log(e));
    });
    messageApi.open({
      type: "success",
      content: "Đã xoá thành công",
    });
  };

  const onClickDuyetDongLoat = () => {
    itemsYeuCau.forEach((item) => {
      axios
        .post("https://connecthome.vn/apartment/approve-data", { id: item })
        .then((res) => {})
        .catch((e) => console.log(e));
    });
    mutate("https://connecthome.vn/apartment/request");
    messageApi.open({
      type: "success",
      content: "Đã duyệt thành công",
    });
  };

  const getProject = () => {
    axios
      .get("https://connecthome.vn/project")
      .then((res) => {
        var array = [];
        res.data.data.forEach((item) => {
          array.push({
            value: item._id,
            label: item.project_name,
          });
        });
        setProject(array);
      })
      .catch((e) => console.log(e));
  };

  const getBuilding = () => {
    axios
      .get("https://connecthome.vn/building")
      .then((res) => {
        var array = [];
        res.data.data.forEach((item) => {
          array.push({
            value: item._id,
            label: item.building_name,
          });
        });
        setBuilding(array);
      })
      .catch((e) => console.log(e));
  };

  const getProperty = () => {
    axios
      .get("https://connecthome.vn/property")
      .then((res) => {
        var array = [];
        res.data.data.forEach((item) => {
          array.push({
            value: item._id,
            label: item.property_name,
          });
        });
        setProperty(array);
      })
      .catch((e) => console.log(e));
  };

  const getBalconyDirection = () => {
    axios
      .get("https://connecthome.vn/balconyDirection")
      .then((res) => {
        var array = [];
        res.data.data.forEach((item) => {
          array.push({
            value: item._id,
            label: item.balcony_direction_name,
          });
        });
        setBalconyDirection(array);
      })
      .catch((e) => console.log(e));
  };

  const getAxis = () => {
    axios
      .get("https://connecthome.vn/axis")
      .then((res) => {
        var array = [];
        res.data.data.forEach((item) => {
          array.push({
            value: item._id,
            label: item.axis_name,
          });
        });
        setAxis(array);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getProject();
    getBuilding();
    getProperty();
    getBalconyDirection();
    getAxis();
    setRole(getCookie("role"));
  }, []);

  const onFinish = (values) => {
    axios
      .post("https://connecthome.vn/apartment/search", values)
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  };

  return (
    <>
      {contextHolder}

      <Flex gap={"small"} wrap>
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
        <Button onClick={onClickYeuCauDongLoat}>Yêu cầu đồng loạt</Button>
        {(role == "admin") | (role == "manager") ? (
          <>
            <Button onClick={onClickDuyetDongLoat}>Duyệt đồng loạt</Button>
            <Button type="primary" danger onClick={onClickXoaDongLoat}>
              Xoá đồng loạt
            </Button>
          </>
        ) : (
          ""
        )}
      </Flex>
      <ModalUpload open={on} hideModal={() => changeOn()} id={id} />
      <DynamicModalData open={open} hideModal={() => changeOpen()} id={id} />
      <Form layout="inline" onFinish={onFinish}>
        <Form.Item name="project_id">
          <Select
            style={{ width: 120 }}
            options={project}
            placeholder="Chọn dự án"
          ></Select>
        </Form.Item>
        <Form.Item name={"building_id"}>
          <Select
            style={{ width: 120 }}
            options={building}
            placeholder="Chọn toà"
          ></Select>
        </Form.Item>
        <Form.Item name={"furnished"}>
          <Select
            style={{ width: 150 }}
            options={[
              { value: true, label: "Full nội thất" },
              { value: false, label: "Cơ bản" },
            ]}
            placeholder="Chọn nội thất"
          ></Select>
        </Form.Item>
        <Form.Item name={"property_id"}>
          <Select
            style={{ width: 150 }}
            options={property}
            placeholder="Chọn loại BDS"
          ></Select>
        </Form.Item>
        <Form.Item name="balconyDirection_id">
          <Select
            style={{ width: 190 }}
            options={balconyDirection}
            placeholder="Chọn hướng ban công"
          ></Select>
        </Form.Item>
        <Form.Item name="bedrooms">
          <Select
            style={{ width: 170 }}
            options={[
              { value: "1", label: "1" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
              { value: "5", label: "5" },
            ]}
            placeholder="Chọn số phòng ngủ"
          ></Select>
        </Form.Item>
        <Form.Item name="axis_id">
          <Select
            style={{ width: 150 }}
            options={axis}
            placeholder="Trục căn"
          ></Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            <SearchOutlined />
          </Button>
        </Form.Item>
      </Form>
      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
    </>
  );
};
export default DataSource;

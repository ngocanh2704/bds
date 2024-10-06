"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  message,
  Row,
  Select,
  Tabs,
  Upload,
} from "antd";
import axios from "axios";
import ModalUpload from "./ModalUpload";
import dynamic from "next/dynamic";
import { SearchOutlined } from "@ant-design/icons";
import { getCookie } from "cookies-next";
import { useDispatch, useSelector } from "react-redux";
import {
  actFetchApartment,
  actSearchApartment,
} from "@/actions/actionApartment";

const DynamicAll = dynamic(() => import("./all"));
const DynamicSale = dynamic(() => import("./sale"));
const DynamicBuy = dynamic(() => import("./buy"));
const DynamicRequest = dynamic(() => import("./request"));
const DynamicApprove = dynamic(() => import("./approve"));
const DynamicModalData = dynamic(() => import("./ModalData"));
const fetcher = (url) => axios.get(url).then((res) => res.data);

const DataSource = () => {
  const [dataAll, setDataAll] = useState([]);
  const [key, setKey] = useState("1");
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
  const [furnished, setFurnished] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);

  const dispatch = useDispatch();
  const getApartment = () => dispatch(actFetchApartment());
  const searchApartment = (values, key) =>
    dispatch(actSearchApartment(values, key));

  useEffect(() => {
    getApartment();
  }, []);

  const changeOpen = () => {
    setOpen(!open);
  };

  const changeOn = () => {
    setOn(!on);
  };

  const changeLoading = () => {
    setIsLoading(!isLoading);
  };

  const onChange = (values) => {
    setKey(values);
    if (values == "1") {
      getApartment();
    }
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
          search={dataSearch}
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
          // key={key}
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
        .post("http://localhost:3001/apartment/request-data", {
          id: item,
          user: getCookie("user"),
        })
        .then((res) => {})
        .catch((e) => console.log(e));
    });
    mutate("http://localhost:3001/apartment/request");
    messageApi.open({
      type: "success",
      content: "Đã yêu cầu thành công",
    });
  };

  const onClickXoaDongLoat = () => {
    itemsYeuCau.forEach((item) => {
      axios
        .post("http://localhost:3001/delete", { id: item })
        .then((res) => {
          mutate("http://localhost:3001/apartment");
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
        .post("http://localhost:3001/apartment/approve-data", { id: item })
        .then((res) => {})
        .catch((e) => console.log(e));
    });
    childRef.current?.getRequest();
    messageApi.open({
      type: "success",
      content: "Đã duyệt thành công",
    });
  };

  const getProject = () => {
    axios
      .get("http://localhost:3001/project")
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
      .get("http://localhost:3001/building")
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
      .get("http://localhost:3001/property")
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
      .get("http://localhost:3001/balconyDirection")
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
      .get("http://localhost:3001/axis")
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

  const getFurnished = () => {
    axios
      .get("http://localhost:3001/furnished")
      .then((res) => {
        var array = [];
        res.data.data.forEach((item) => {
          array.push({
            value: item._id,
            label: item.furnished_name,
          });
        });
        setFurnished(array);
      })
      .catch((e) => console.log(e));
  };

  useEffect(() => {
    getProject();
    getBuilding();
    getProperty();
    getBalconyDirection();
    getAxis();
    getFurnished();
    setRole(getCookie("role"));
  }, []);

  const onFinish = (values) => {
    values.key = key;
    values.isDelete = false
    if(key == '2'){
      values.sale_price = { $gt: 0 };
    } if(key == '3'){
      values.rental_price = { $gt: 0 };
    }
    searchApartment(values, key);
  };

  const uploadExcel = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    var formData = new FormData();
    formData.append("file", file);
    axios
      .post("http://localhost:3001/apartment/import-excel", formData)
      .then((res) => {
        var ws = XLSX.utils.json_to_sheet(res.data.arrResult);
        /* create workbook and export */
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "result.xlsx");
        mutate("http://localhost:3001/apartment");
      })
      .catch((e) => {
        messageApi.open({
          type: "error",
          content: e.response.data.message,
          duration: 5,
        });
        mutate("http://localhost:3001/apartment");
      });
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
          </>
        ) : (
          ""
        )}
        <Upload
          type="select"
          showUploadList={false}
          customRequest={uploadExcel}
        >
          <Button>Nhập dữ liệu excel</Button>
        </Upload>
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
            options={furnished}
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
            style={{ width: 100 }}
            options={axis}
            placeholder="Trục căn"
          ></Select>
        </Form.Item>
        {(key == 2) | (key == 3) ? (
          <>
            <Form.Item initialValue={0}>
              <InputNumber
                placeholder="Giá từ"
                style={{ width: 120 }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
            <Form.Item initialValue={0}>
              <InputNumber
                placeholder="Đến giá"
                style={{ width: 120 }}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                }
                parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
              />
            </Form.Item>
          </>
        ) : (
          ""
        )}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            <SearchOutlined />
          </Button>
        </Form.Item>
        <Form.Item>
          <Button htmlType="reset" onClick={() => getApartment()}>
            reset
          </Button>
        </Form.Item>
      </Form>
      <Tabs
        defaultActiveKey="1"
        items={items}
        destroyInactiveTabPane={true}
        onChange={(key) => onChange(key)}
      />
    </>
  );
};
export default DataSource;

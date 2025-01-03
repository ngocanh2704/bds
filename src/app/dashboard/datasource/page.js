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
  actApproveApartment,
  actFetchApartment,
  actRequestApartment,
  actSearchApartment,
  clearSelectedRows,
} from "@/actions/actionApartment";
import { decryptData } from "@/ultil/crypto";

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
  const actionRequest = (id) => dispatch(actRequestApartment(id));
  const actionApprove = (id) => dispatch(actApproveApartment(id));
  const searchApartment = (values, key) =>
    dispatch(actSearchApartment(values, key));
  useEffect(() => {
    getApartment();
  }, []);
  const selectedRow = useSelector((state) => state.apartment.selectedRows);
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

  const handleClearSelectedRows = () => {
    dispatch(clearSelectedRows());
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
    // {
    //   key: "2",
    //   label: "Kho bán",
    //   children: (
    //     <DynamicSale
    //       changeOn={() => changeOn()}
    //       data={key}
    //       changeOpen={() => changeOpen()}
    //       changeId={(id) => changeId(id)}
    //       onDelete={() => onDelete(id)}
    //       changeLoading={() => changeLoading()}
    //       yeuCauDongLoat={(items) => yeuCauDongLoat(items)}
    //     />
    //   ),
    // },
    // {
    //   key: "3",
    //   label: "Kho Thuê",
    //   children: (
    //     <DynamicBuy
    //       changeOn={() => changeOn()}
    //       data={dataAll}
    //       changeOpen={() => changeOpen()}
    //       changeId={(id) => changeId(id)}
    //       onDelete={() => onDelete(id)}
    //       changeLoading={() => changeLoading()}
    //       yeuCauDongLoat={(items) => yeuCauDongLoat(items)}
    //     />
    //   ),
    // },
    {
      key: "4",
      label: "Số điện thoại yêu cầu",
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
      label: "Số điện thoại được duyệt",
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
      // axios
      //   .post("https://api.connecthome.vn/apartment/request-data", {
      //     id: item,
      //     user: getCookie("user"),
      //   })
      //   .then((res) => {})
      //   .catch((e) => console.log(e));
      actionRequest(item);
    });

    messageApi.open({
      type: "success",
      content: "Đã yêu cầu thành công",
    });
  };

  const onClickXoaDongLoat = () => {
    itemsYeuCau.forEach((item) => {
      axios
        .post("https://api.connecthome.vn/delete", { id: item })
        .then((res) => {
          mutate("https://api.connecthome.vn/apartment");
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
      actionApprove(item);
    });
    messageApi.open({
      type: "success",
      content: "Đã duyệt thành công",
    });
  };

  const getProject = () => {
    axios
      .get("https://api.connecthome.vn/project")
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
      .get("https://api.connecthome.vn/building")
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
      .get("https://api.connecthome.vn/property")
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
      .get("https://api.connecthome.vn/balconyDirection")
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
      .get("https://api.connecthome.vn/axis")
      .then((res) => {
        var data = JSON.parse(
          Buffer.from(res.data, "base64").toString("utf-8")
        );
        var array = [];
        data.data.forEach((item) => {
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
      .get("https://api.connecthome.vn/furnished")
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
    values.isDelete = false;
    if ((values.price == 1) | (values.price == 2)) {
      values.sale_price = { $gt: 0 };
    }
    if ((values.price == 3) | (values.price == 4)) {
      values.rental_price = { $gt: 0 };
    }
    if (values.minSalePrice && values.maxSalePrice) {
      if (values.minSalePrice <= values.maxSalePrice) {
        values.sale_price = {
          $gte: values.minSalePrice,
          $lte: values.maxSalePrice,
        };
      }
    }

    if (values.minRentalPrice && values.maxRentalPrice) {
      if (values.minRentalPrice <= values.maxRentalPrice) {
        values.rental_price = {
          $gte: values.minRentalPrice,
          $lte: values.maxRentalPrice,
        };
      }
    }
    // console.log(values);
    searchApartment(values, key);
  };

  const uploadExcel = async (options) => {
    const { onSuccess, onError, file, onProgress } = options;
    var formData = new FormData();
    formData.append("file", file);
    axios
      .post("https://api.connecthome.vn/apartment/import-excel", formData)
      .then((res) => {
        var ws = XLSX.utils.json_to_sheet(res.data.arrResult);
        /* create workbook and export */
        var wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "result.xlsx");
        mutate("https://api.connecthome.vn/apartment");
      })
      .catch((e) => {
        messageApi.open({
          type: "error",
          content: e.response.data.message,
          duration: 5,
        });
        mutate("https://api.connecthome.vn/apartment");
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
        {(role == "admin") | (role == "manager") ? <Button onClick={() => {
          axios
            .post("https://api.connecthome.vn/apartment/export-excel-apartment", { data: selectedRow })
            .then((res) => {
              const decryptedData = decryptData(res.data.apartment);
              if (!decryptedData) {
                return {
                  ...state,
                  isLoading: false,
                  error: "Data is not valid",
                };
              }
              var newData = [];
              for (let i = 0; i < decryptedData.length; i++) {
                console.log(decryptedData[i]);
                const value = {
                  'Dự án': decryptedData[i].project?.project_name,
                  'Căn hộ': decryptedData[i].apartment_name,
                  'Tên chủ căn hộ': decryptedData[i].owner,
                  'Số điện thoại': decryptedData[i].phone_number,
                  'Loại BDS': decryptedData[i].properties?.property_name,
                  'Diện tích': decryptedData[i].area,
                  'Hướng ban công': decryptedData[i].balcony_direction?.balcony_direction_name,
                  'Số phòng ngủ': decryptedData[i].bedrooms,
                  'Số WC': decryptedData[i].bathrooms,
                  'Trục căn': decryptedData[i].axis?.axis_name,
                  'Giá bán': decryptedData[i].sale_price,
                  'Giá thuê': decryptedData[i].rental_price,
                  'Nội thất': decryptedData[i].furnished?.furnished_name,
                  'Ghi chú': decryptedData[i].notes
                };
                newData.push(value);
              }
              var ws = XLSX.utils.json_to_sheet(newData);
              /* create workbook and export */
              var wb = XLSX.utils.book_new();
              XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
              XLSX.writeFile(wb, "result.xlsx");
              // var ws = XLSX.utils.json_to_sheet(res.data);
              // /* create workbook and export */
              // var wb = XLSX.utils.book_new();
              // XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
              // XLSX.writeFile(wb, "result.xlsx");
            })
            .catch((e) => console.log(e));
        }}>Xuất excel</Button> :
          ''}

      </Flex>
      <ModalUpload open={on} hideModal={() => changeOn()} id={id} />
      <DynamicModalData open={open} hideModal={() => changeOpen()} id={id} />

      <Form layout="inline" onFinish={onFinish}>
        <Row>
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
        </Row>
        <Row style={{ marginTop: 20 }}>
          <Form.Item name="price">
            <Select
              style={{ width: 170 }}
              options={[
                { value: "1", label: "Giá bán tăng dần" },
                { value: "2", label: "Giá bán giảm dần" },
                { value: "3", label: "Giá thuê tăng dần" },
                { value: "4", label: "Giá thuê giảm dần" },
              ]}
              placeholder="Giá"
            ></Select>
          </Form.Item>

          <Form.Item name="minSalePrice">
            <InputNumber
              placeholder="Giá bán từ"
              style={{ width: 120 }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item name="maxSalePrice">
            <InputNumber
              placeholder="Đến giá"
              style={{ width: 120 }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item name={"minRentalPrice"}>
            <InputNumber
              placeholder="Giá thuê từ"
              style={{ width: 120 }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
          <Form.Item name="maxRentalPrice">
            <InputNumber
              placeholder="Đến giá"
              style={{ width: 120 }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
            />
          </Form.Item>
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
          <Form.Item>
            <Button type="primary" danger onClick={() => handleClearSelectedRows()}>
              Xoá đã chọn
            </Button>
          </Form.Item>
        </Row>
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

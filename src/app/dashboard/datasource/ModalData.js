import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  message,
  Row,
  Col,
  Switch,
} from "antd";
import axios from "axios";
import moment from "moment";
import { mutate } from "swr";

const ModalData = (prop) => {
  const [form] = Form.useForm();
  const { RangePicker } = DatePicker;
  const { TextArea } = Input;
  const [data, setData] = useState([]);
  const [dataProject, setDataProject] = useState([]);
  const [dataAxis, setDataAxis] = useState([]);
  const [dataBalcon, setDataBalcon] = useState([]);
  const [dataStatus, setDataStatus] = useState([]);
  const [building, setBuilding] = useState([]);
  const [property, setProperty] = useState([]);
  const [furnished, setFurnished] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const dateFormat = "DD/MM/YYYY";

  const onFinish = async () => {
    var values = form.getFieldsValue();
    console.log(values.status)
    // const checkStatus = dataStatus.find(x => x.value === values.status)
    form
      .validateFields()
      .then((res) => {
        if (values.available) {
          values.available_from = values.available[0];
          values.available_until = values.available[1];
        }
        if (prop.id) {
          values.id = prop.id;
        }
        values.status ? values.color = '#FFFFFF ' : values.color = "#9d9d9d"
        var urlEdit = "https://api.connecthome.vn/apartment/edit";
        var urlCreate = "https://api.connecthome.vn/apartment/create";
        axios
          .post(prop.id ? urlEdit : urlCreate, values)
          .then((res) => {
            prop.hideModal();
            mutate("https://api.connecthome.vn/apartment");
          })
          .catch((e) => console.log(e));
      })
      .catch((e) => console.log(e));
  };

  const getDataProject = () => {
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
        setDataProject(array);
      })
      .catch((e) => console.log(e));
  };

  const getDataAxis = () => {
    axios
      .get("https://api.connecthome.vn/axis")
      .then((res) => {
        var array = [];
        res.data.data.forEach((item) => {
          array.push({
            value: item._id,
            label: item.axis_name,
          });
        });
        setDataAxis(array);
      })
      .catch((e) => console.log(e));
  };

  const getDataBalcon = () => {
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
        setDataBalcon(array);
      })
      .catch((e) => console.log(e));
  };

  const getDetailApartment = (id) => {
    axios
      .post("https://api.connecthome.vn/apartment/detail", { id: id })
      .then((res) => {
        console.log(res.data.detail)
        var detail = res.data.detail;
        var available = [
          moment(detail.available_from),
          moment(detail.available_until),
        ];
        form.setFieldsValue({
          project: res.data.detail.project._id,
          building: detail.building,
          floor: detail.floor,
          axis: detail.axis._id,
          owner: detail.owner,
          phone_number: detail.phone_number,
          property: detail.properties,
          area: detail.area,
          bedrooms: detail.bedrooms,
          bathrooms: detail.bathrooms,
          sale_price: detail.sale_price,
          rental_price: detail.rental_price,
          furnished: detail.furnished._id,
          balconies: detail.balconies,
          balcony_direction: detail.balcony_direction._id,
          last_updated: moment(detail.last_updated),
          status: detail.status,
          notes: detail.notes,
          available: available,
        });
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

  const getFurnished = () => {
    axios
      .get("https://api.connecthome.vn/furnished")
      .then((res) => {
        console.log(res)
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

  const changDataForOptions = () => {
    if (prop.id) {
      getDetailApartment(prop.id);
    } else {
      form.resetFields();
    }
  };

  useEffect(() => {
    getDataProject();
    getDataAxis();
    getDataBalcon();
    getBuilding();
    getProperty();
    getFurnished()
  }, []);
  return (
    <>
      {contextHolder}
      <Modal
        title={prop.id ? "Sửa thông tin căn hộ" : "Thêm căn hộ mới"}
        open={prop.open}
        onOk={onFinish}
        onCancel={prop.hideModal}
        onClose={prop.hideModal}
        width={1300}
        // afterOpenChange={changDataForOptions}
        afterOpenChange={() => {
          changDataForOptions();
        }}
      >
        <>
          <Form
            labelCol={{
              span: 7,
            }}
            wrapperCol={{
              span: 14,
            }}
            layout="horizontal"
            // disabled={componentDisabled}
            style={{
              maxWidth: 1300,
            }}
            form={form}
          >
            <Row>
              <Col span={12}>
                <Form.Item
                  label="Dự án"
                  name="project"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn dự án",
                    },
                  ]}
                >
                  <Select options={dataProject}></Select>
                </Form.Item>
                <Form.Item
                  label="Toà"
                  name="building"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn toà",
                    },
                  ]}
                >
                  <Select options={building} />
                </Form.Item>
                <Form.Item
                  label="Tầng"
                  name="floor"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tầng",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Trục căn hộ"
                  name="axis"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn trục căn hộ",
                    },
                  ]}
                >
                  <Select options={dataAxis}></Select>
                </Form.Item>
                <Form.Item label="Chủ căn hộ" name="owner">
                  <Input />
                </Form.Item>
                <Form.Item label="Số điện thoại" name="phone_number">
                  <Input />
                </Form.Item>
                <Form.Item label="Loại bất động sản" name="property" rules={[
                  {
                    required: true,
                    message: "Vui lòng loại bất động sản",
                  },
                ]}>
                  <Select options={property} />
                </Form.Item>
                <Form.Item label="Diện tích" name="area">
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Số phòng ngủ"
                  name="bedrooms"
                  initialValue={"1"}
                >
                  <Select
                    options={[
                      { value: "1", label: "1" },
                      { value: "2", label: "2" },
                      { value: "3", label: "3" },
                      { value: "4", label: "4" },
                      { value: "5", label: "5" },
                    ]}
                  ></Select>
                </Form.Item>
                <Form.Item
                  label="Số phòng vệ sinh"
                  name="bathrooms"
                  initialValue={"1"}
                >
                  <Select
                    options={[
                      { value: "1", label: "1" },
                      { value: "2", label: "2" },
                      { value: "3", label: "3" },
                      { value: "4", label: "4" },
                      { value: "5", label: "5" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Giá bán" name="sale_price">
                  <InputNumber
                    style={{ width: 150 }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item label="Giá cho thuê" name="rental_price">
                  <InputNumber
                    style={{ width: 150 }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value?.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
                <Form.Item label="Cho thuê" name="available">
                  <RangePicker format={dateFormat} />
                </Form.Item>
                <Form.Item
                  label="Nội thất"
                  name="furnished"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn nội thất",
                    },
                  ]}
                >
                  <Select
                    options={furnished}
                  ></Select>
                </Form.Item>
                <Form.Item
                  label="Số ban công"
                  name="balconies"
                  initialValue={"1"}
                >
                  <Select
                    options={[
                      { value: "1", label: "1" },
                      { value: "2", label: "2" },
                      { value: "3", label: "3" },
                      { value: "4", label: "4" },
                      { value: "5", label: "5" },
                    ]}
                  />
                </Form.Item>
                <Form.Item
                  label="Hướng ban công"
                  name="balcony_direction"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn hướng ban công",
                    },
                  ]}
                >
                  <Select options={dataBalcon}></Select>
                </Form.Item>
                <Form.Item
                  label="Thời gian cập nhật căn hộ"
                  name="last_updated"
                >
                  <DatePicker format={dateFormat} />
                </Form.Item>
                <Form.Item
                  label="Trạng thái"
                  name="status"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng chọn trạng thái căn hộ",
                    },
                  ]}
                  initialValue={true}
                >
                  {/* <Select options={dataStatus}></Select> */}
                  <Switch></Switch>
                </Form.Item>
                <Form.Item label="Ghi chú" name="notes">
                  <TextArea />
                </Form.Item>
                <Form.Item label="Đánh dấu" name="color">
                  <Select
                    options={[
                      { value: "#fbff00", label: "Vàng (căn giá rẻ)" },
                      { value: "#ff4d4f", label: "Đỏ (căn kết hợp)" },
                      { value: "rgb(88 206 79)", label: "Xanh" },
                      { value: "#ffa416c4", label: "Cam" },
                      { value: "#ffffff", label: "Mặc định" },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      </Modal>
    </>
  );
};

export default ModalData;

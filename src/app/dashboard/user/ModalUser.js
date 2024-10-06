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
} from "antd";
import axios from "axios";
import { mutate } from "swr";
const { Option } = Select;


const ModalUser = (prop) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = () => {
    var values = form.getFieldsValue();
    values.role = values.role ? values.role : "admin";
    values.employee_ID = values.employee_ID
      ? values.employee_ID
      : data[0]?.value;
    values.id = prop.id
    var urlCreate = "http://localhost:3001/user/register";
    var urlEdit = "http://localhost:3001/user/edit";
    axios
      .post(prop.id ? urlEdit : urlCreate, values)
      .then((res) => {
        prop.hideModal();
        messageApi.open({
          type: "success",
          content: res.data.message,
        });
        mutate("http://localhost:3001/user")
      })
      .catch((e) => {
        console.log(e)
      })
  };

  const getDetailUser = (id) => {
    form.resetFields()
    axios
      .post("http://localhost:3001/user/detail", { id: id })
      .then((res) => {
        console.log(res.data.user)
        form.setFieldsValue({
          username: res.data.user.username,
          password: res.data.user.password,
          status: res.data.user.status,
          employee_ID: res.data.user.employee_ID._id,
          role: res.data.user.role
        });
      })
      .catch((e) => console.log(e));
  };

  const changDataForOptions = () => {
    if (prop.id) {
      getDetailUser(prop.id);
    } else {
      form.resetFields();
    }
    var array = [];
    prop.employee.forEach((element) => {
      array.push({
        value: element._id,
        label: element.employee_name,
      });
    });
    setData(array);
  };

  return (
    <>
      {contextHolder}
      <Modal
        title={prop.id ? "Sửa tài khoản" : "Thêm tài khoản"}
        open={prop.open}
        onOk={onFinish}
        onCancel={prop.hideModal}
        onClose={prop.hideModal}
        width={700}
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
              maxWidth: 1000,
            }}
            form={form}
          >
            <Form.Item label="Tài khoản" name="username">
              <Input />
            </Form.Item>
            <Form.Item label="Mật khẩu" name="password">
              <Input style={{ width: 200 }} type="password" />
            </Form.Item>
            <Form.Item label="Trạng thái" name="status">
              <Select
                style={{ width: 200 }}
                options={[
                  { value: true, label: "Kích hoạt" },
                  { value: false, label: "Tắt" },
                ]}
              ></Select>
            </Form.Item>
            <Form.Item label="Nhân viên" name="employee_ID">
              <Select
                style={{ width: 200 }}
                options={data}
              ></Select>
            </Form.Item>
            <Form.Item label="Quyền" name="role" initialValue={'staff'}>
              <Select
                style={{ width: 200 }}
              // options={[
              //   // { value: "admin", label: "Admin" },
              //   { value: "manager", label: "Quản lý" },
              //   { value: "staff", label: "Nhân viên" },
              // ]}
              ><Option value='manager'>Quản lý</Option>
                <Option value='staff'>Nhân viên</Option>
              </Select>
            </Form.Item>
          </Form>
        </>
      </Modal>
    </>
  );
};

export default ModalUser;

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

const ModalStatus = (prop) => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const onFinish = () => {
    var values = form.getFieldsValue();
    values.id = prop.id;
    var urlCreate = "http://localhost:3001/status/create";
    var urlEdit = "http://localhost:3001/status/edit";
    axios
      .post(prop.id ? urlEdit : urlCreate, values)
      .then((res) => {
        prop.hideModal();
        prop.isLoading(),
          messageApi.open({
            type: "success",
            content: res.data.message,
          });
      })
      .catch((e) => {
        messageApi.open({
          type: "warning",
          content: e.response.data.message,
        });
      });
  };

  const getDetailProject = (id) => {
    axios
      .post("http://localhost:3001/status/detail", { id: id })
      .then((res) => {
        form.setFieldsValue({
          status_name: res.data.status.status_name
        });
      })
      .catch((e) => console.log(e));
  };

  const changDataForOptions = () => {
    if (prop.id) {
      getDetailProject(prop.id);
    } else {
      form.resetFields();
    }
  };
  return (
    <>
      {contextHolder}
      <Modal
        title={prop.id ? "Sửa trạng thái" : "Thêm trạng thái"}
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
            <Form.Item label="Trạng thái" name="status_name">
              <Input />
            </Form.Item>
          </Form>
        </>
      </Modal>
    </>
  );
};

export default ModalStatus;

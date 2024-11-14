import { Modal, Form, Input, Select, DatePicker } from "antd";
import axios from "axios";

const ModalCustomer = (prop) => {
  const [form] = Form.useForm();
  const dateFormat = "DD/MM/YYYY";

  const onFinish = () => {
    var values = form.getFieldsValue();
    axios
      .post("https://api.connecthome.vn/customer/create", values)
      .then((res) => form.resetFields())
      .catch((e) => console.log(e));
  };

  return (
    <>
      <Modal
        title="Thêm khách hàng"
        open={prop.open}
        onOk={onFinish}
        onCancel={prop.hideModal}
        onClose={prop.hideModal}
        width={700}
      >
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
          <Form.Item label="Tên khách hàng" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="Số điện thoại" name="phone_number">
            <Input />
          </Form.Item>
          <Form.Item label="Mã căn hộ" name="apartment_name">
            <Input />
          </Form.Item>
          <Form.Item label="Thuê / Mua bán" name="status">
            <Select
              options={[
                { value: true, label: "Mua bán" },
                { value: false, label: "Thuê" },
              ]}
            ></Select>
          </Form.Item>
          <Form.Item label="Ngày ký hợp đồng" name="day_sign">
            <DatePicker format={dateFormat} />
          </Form.Item>
          <Form.Item label="Ngày sinh" name="bod">
            <DatePicker format={dateFormat} />
          </Form.Item>
          <Form.Item label="Note" name="note">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalCustomer;

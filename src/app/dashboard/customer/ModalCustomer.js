import { actAddApartment, actFetchCustomer, editCustomer } from "@/actions/actionCustonmer";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import axios from "axios";
import moment from "moment";
import { useDispatch } from "react-redux";

const ModalCustomer = (prop) => {
  const [form] = Form.useForm();
  const dateFormat = "DD/MM/YYYY";
  const dispatch = useDispatch()

  const getData = (page) => dispatch(actFetchCustomer(page));
  const editData = (data) => dispatch(editCustomer(data))

  const onFinish = () => {
    var values = form.getFieldsValue();
    if (prop.id) {
      values.id = prop.id
      axios
        .post("https://api.connecthome.vn/customer/edit", values)
        // .then((res) => { form.resetFields(), prop.hideModal() })
        .then((res) => {editData(res.data.data),form.resetFields(), prop.hideModal(),getData(prop.page)})
        .catch((e) => console.log(e));
    } else {
      axios
        .post("https://api.connecthome.vn/customer/create", values)
        .then((res) => { form.resetFields(), prop.hideModal(), getData(prop.page) })
        .catch((e) => console.log(e));
    }

  };

  const changeDataOpenModal = () => {
    if (prop.id) {
      axios.post(`https://api.connecthome.vn/customer/detail`, { id: prop.id }).then(res => {
        const detail = res.data.data
        form.setFieldsValue({
          name: detail.name,
          phone_number: detail.phone_number,
          apartment_name: detail.apartment_name,
          status: detail.status,
          day_sign: moment(detail.day_sign),
          bod: moment(detail.bod),
          note: detail.note
        })
      }).catch(e => console.log(e))
    } else {
      form.resetFields();
    }
  }

  return (
    <>
      <Modal
        title="Thêm khách hàng"
        open={prop.open}
        onOk={onFinish}
        onCancel={prop.hideModal}
        onClose={prop.hideModal}
        width={700}
        afterOpenChange={() => {
          changeDataOpenModal()
        }}
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

import axios from 'axios';
import { InboxOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Form,
  GetProp,
  Input,
  InputNumber,
  Modal,
  Select,
  UploadFile,
  UploadProps,
  notification,
} from 'antd';
import Dragger from 'antd/es/upload/Dragger';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import useGetDepartments from '../../hooks/queries/useGetDepartments';
import useCreateUser from '../../hooks/mutations/useCreateUser';
import CustomSpin from '../../components/Spin';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

type RegisterType = {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  monthlyIncome: number;
  document: {
    documentPhoto: any;
    documentType: string;
    documentNumber: string;
  };
  municipality: string;
};

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const Home: FC = () => {
  const [form] = Form.useForm<RegisterType>();
  const department = Form.useWatch('department', form);

  const { createUserAsync, isLoading: isCreating } = useCreateUser();
  const { departments, isLoading: isLoadingD } = useGetDepartments();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>();

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      // eslint-disable-next-line no-param-reassign
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => setFileList(newFileList);

  const handleCustomRequest = async (options: any) => {
    const { file, onError, onSuccess } = options;

    const res = await axios.post<{ url: string }>(`${import.meta.env.VITE_API_URL}/s3`, { fileName: file.name });

    if (!res || res.status !== 200) {
      onError('No se pudo subir el archivo');
      return;
    }

    const upload = await axios.put(res.data.url, file);

    if (upload && upload.status === 200) {
      onSuccess('OK');
      return;
    }

    onError('No se pudo subir el archivo');
  };

  const onSubmit = async (values: RegisterType) => {
    try {
      const body = {
        ...values,
        document: {
          ...values.document,
          documentPhoto: `${import.meta.env.VITE_BUCKET}/${values.document.documentPhoto.file.name}`,
        },
      };

      await createUserAsync(body);

      notification.success({
        message: 'Solicitud creada',
        description: `${values.name}, tu solicitud ha sido creada con exito`,
      });
      form.resetFields();
    } catch (err) {
      notification.error({
        message: 'Error al crear solicitud',
        description: `${values.name}, tu solicitud no ha sido creada`,
      });
    }
  };

  return (
    <main className="p-10 pt-10 lg:p-20">
      <Link to="/solicitudes" className="mb-10 text-blue-500">
        Ver solicitudes
      </Link>
      <Divider />
      {isLoadingD || isCreating ? <CustomSpin /> : null}
      <h1 className="text-3xl font-bold">Solicitud de crédito</h1>
      <Divider />
      <Form form={form} className="my-12" layout="vertical" onFinish={onSubmit}>
        <div className="flex w-full flex-col items-start justify-between gap-10 lg:flex-row">
          <fieldset className="flex w-full flex-col gap-4 lg:w-2/3 ">
            <h2 className="text-lg font-bold">Información personal</h2>
            <div className="flex w-full flex-col items-start justify-between gap-4 lg:flex-row">
              <Form.Item
                className="w-full"
                label="Nombres"
                name="name"
                required
                rules={[
                  {
                    required: true,
                    message: 'Por favor, ingrese su nombre',
                  },
                ]}
              >
                <Input placeholder="Nombres" className="w-full" />
              </Form.Item>
              <Form.Item
                className="w-full"
                label="Apellidos"
                name="lastName"
                required
                rules={[
                  {
                    required: true,
                    message: 'Por favor, ingrese su apellido',
                  },
                ]}
              >
                <Input placeholder="Apellidos" />
              </Form.Item>
              <Form.Item
                className="w-full"
                label="Correo electrónico"
                name="email"
                required
                rules={[
                  {
                    required: true,
                    message: 'Por favor, ingrese su correo electrónico',
                  },
                  {
                    type: 'email',
                    message: 'Por favor, ingrese un correo electrónico válido',
                  },
                ]}
              >
                <Input placeholder="Correo electrónico" />
              </Form.Item>
            </div>
            <fieldset className="flex flex-col justify-start gap-4 lg:flex-row">
              <Form.Item
                label="Número de teléfono"
                name="phoneNumber"
                required
                rules={[{ required: true, message: 'Por favor, ingrese su número de teléfono' }]}
              >
                <Input placeholder="Número de teléfono" />
              </Form.Item>
              <Form.Item
                label="Tipo de identificación"
                name={['document', 'documentType']}
                required
                rules={[
                  {
                    required: true,
                    message: 'Por favor, seleccione un tipo de identificación',
                  },
                ]}
                className="w-full lg:w-44"
              >
                <Select
                  placeholder="Seleccione un tipo de identificación"
                  options={[
                    { label: 'DUI', value: 'DUI' },
                    { label: 'Pasaporte', value: 'PA' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Número de identificación"
                name={['document', 'documentNumber']}
                required
                rules={[
                  {
                    required: true,
                    message: 'Por favor, ingrese su número de identificación',
                  },
                ]}
              >
                <Input placeholder="Número de identificación" />
              </Form.Item>
              <Form.Item
                label="Ingresos mensuales"
                name="monthlyIncome"
                required
                rules={[
                  {
                    validator: (_, value) => {
                      if (value != null && typeof value === 'number' && value > 0) return Promise.resolve();

                      return Promise.reject(new Error('Por favor, ingrese un valor válido'));
                    },
                  },
                ]}
                className="w-full lg:w-auto"
              >
                <InputNumber placeholder="0.00" addonBefore="$" className="w-full" />
              </Form.Item>
            </fieldset>
          </fieldset>
          <fieldset className="flex flex-col gap-4 lg:w-1/3">
            <h2 className="text-lg font-bold">Foto de perfil</h2>
            <Form.Item
              name={['document', 'documentPhoto']}
              required
              rules={[
                {
                  required: true,
                  message: 'Por favor, seleccione una foto de perfil',
                },
              ]}
            >
              <Dragger
                maxCount={1}
                accept=".png,.jpg,.jpeg"
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                customRequest={handleCustomRequest}
              >
                <p className="antd-upload-drag-icon">
                  <InboxOutlined className="text-5xl text-blue-500" />
                </p>
                <p className="text-xl font-medium">Haga clic o arrastre una imagen para subirla</p>
                <p className="mb-4 mt-2 text-sm font-light">Soporta formatos JPG, PNG, GIF, SVG y otros</p>
              </Dragger>
            </Form.Item>
            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={handleCancel}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </fieldset>
        </div>
        <Divider />
        <fieldset className=" flex flex-col gap-4">
          <h2 className="text-lg font-bold">Dirección</h2>
          <div className="flex flex-col justify-start gap-4 lg:flex-row">
            <Form.Item
              label="Departamento"
              name="department"
              required
              rules={[
                {
                  required: true,
                  message: 'Por favor, seleccione un departamento',
                },
              ]}
              className="lg:w-60"
            >
              <Select
                placeholder="Seleccione un departamento"
                options={departments.map(({ _id, name }) => ({ label: name, value: _id }))}
                onChange={() => form.setFieldValue('municipality', undefined)}
                loading={isLoadingD}
              />
            </Form.Item>
            <Form.Item
              label="Municipio"
              name="municipality"
              required
              rules={[
                {
                  required: true,
                  message: 'Por favor, seleccione un municipio',
                },
              ]}
              className="lg:w-60"
            >
              <Select
                disabled={!department}
                placeholder="Seleccione un municipio"
                options={departments
                  .find(({ _id }) => _id === department)
                  ?.municipalities.map(({ _id, name }) => ({
                    label: name,
                    value: _id,
                  }))}
              />
            </Form.Item>
            <Form.Item
              label="Dirección"
              name="address"
              required
              rules={[
                {
                  required: true,
                  message: 'Por favor, ingrese su dirección',
                },
              ]}
              className="lg:w-96"
            >
              <Input placeholder="Dirección" />
            </Form.Item>
          </div>
        </fieldset>
        <Button type="primary" htmlType="submit" className="mt-4 w-full lg:w-auto">
          Enviar
        </Button>
      </Form>
    </main>
  );
};

export default Home;

import { Badge, Button, Divider, Skeleton, Table, TableProps } from 'antd';
import { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { EyeOutlined, HomeOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import useGetUsers, { User } from '../../hooks/queries/useGetUsers';
import useWindowSize from '../../hooks/useWindowsSize';

function encodeAndReconstructS3Url(joinedUrl?: string) {
  if (!joinedUrl) return undefined;

  const baseUrl = joinedUrl.substring(0, joinedUrl.lastIndexOf('/') + 1);

  const fileName = joinedUrl.substring(joinedUrl.lastIndexOf('/') + 1);

  const decodedFileName = decodeURIComponent(fileName.replace(/\+/g, '%20').replace(/_/g, ':'));

  const encodedFileName = encodeURIComponent(decodedFileName).replace(/[!'()*]/g, escape);

  const fullUrl = `${baseUrl}${encodedFileName}`;

  return fullUrl;
}

const Requests: FC = () => {
  const [paging, setPaging] = useState({
    page: 1,
    limit: 2,
  });
  const { users, total, isFetching } = useGetUsers(paging.page, paging.limit);
  const [current, setCurrent] = useState<User>();

  const { width } = useWindowSize();

  const columnsMobile: TableProps<User>['columns'] = [
    { key: 'name', title: 'Nombre', dataIndex: 'name' },
    {
      key: 'lastName',
      title: 'Apellido',
      dataIndex: 'lastName',
    },
    {
      key: 'action',
      title: 'Acciones',
      render: (_, record) => (
        <Button type="link" className="flex items-center justify-center" onClick={() => setCurrent(record)}>
          <EyeOutlined /> Ver más
        </Button>
      ),
    },
  ];

  const columns: TableProps<User>['columns'] = [
    { key: 'name', title: 'Nombre', dataIndex: 'name' },
    {
      key: 'lastName',
      title: 'Apellido',
      dataIndex: 'lastName',
    },
    {
      key: 'email',
      title: 'Correo electrónico',
      dataIndex: 'email',
      render: (v) => (
        <Button type="link" href={`mailto:${v}`}>
          {v}
        </Button>
      ),
    },
    {
      key: 'phone',
      title: 'Teléfono',
      dataIndex: 'phoneNumber',
      render: (v) => (
        <Button type="link" href={`phone:${v}`}>
          {v}
        </Button>
      ),
    },
    {
      key: 'action',
      title: 'Acciones',
      render: (_, record) => (
        <Button type="link" className="flex items-center justify-center" onClick={() => setCurrent(record)}>
          <EyeOutlined /> Ver más
        </Button>
      ),
    },
  ];

  const getColor = (amount: number) => {
    if (amount < 250) return 'red';
    if (amount < 750) return 'yellow';
    return 'green';
  };

  return (
    <main className="p-4 pt-10 lg:p-20">
      <Link to="/" className="text-blue-500">
        Crear solicitud
      </Link>
      <Divider />
      <h1 className="text-3xl font-bold">Solicitudes</h1>
      <div className="mt-10 flex w-full flex-col gap-4 lg:flex-row">
        <div className="lg:w-2/3">
          <Table
            columns={width < 1024 ? columnsMobile : columns}
            dataSource={users}
            pagination={{
              pageSize: paging.limit,
              current: paging.page,
              total,
              onChange: (p, s) => setPaging({ page: p, limit: s }),
            }}
            style={width < 1024 ? { width } : undefined}
            loading={isFetching}
          />
        </div>
        <div className="lg:w-1/3">
          {current ? (
            <div className="flex flex-col gap-3 rounded-xl border-2 p-4">
              <div className="flex items-start justify-between">
                <span className="inline-flex flex-col gap-2">
                  <strong>{` ${current.name} ${current.lastName ?? ''}`}</strong>
                  <Badge color={getColor(current.monthlyIncome)} count={`$ ${current.monthlyIncome.toFixed(2)}`} />
                </span>
                <img
                  src={encodeAndReconstructS3Url(current.document.documentPhoto)}
                  className="aspect-square w-20 rounded border-2 border-gray-500 bg-gray-300"
                  alt="DUI"
                />
              </div>
              <div className="inline-flex items-center justify-between">
                <p>
                  <PhoneOutlined />
                  <Button type="link" href={`phone:${current.phoneNumber}`}>
                    {current.phoneNumber}
                  </Button>
                </p>
                <p>
                  <MailOutlined />
                  <Button type="link" href={`mailto:${current.email}`}>
                    {current.email}
                  </Button>
                </p>
              </div>
              <p className="inline-flex items-start justify-start gap-2 text-sm">
                <HomeOutlined />
                <span>
                  {current.municipality.department.name}, {current.municipality.name}
                  <br />
                  {current.address}
                </span>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <span>Selecciona una solicitud</span>
              <Skeleton active />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Requests;

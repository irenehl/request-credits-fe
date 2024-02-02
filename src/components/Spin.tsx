import { Spin } from 'antd';
import { FC } from 'react';

const CustomSpin: FC = () => (
  <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-white/70">
    <Spin />
  </div>
);

export default CustomSpin;

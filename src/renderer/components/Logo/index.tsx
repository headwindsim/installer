import React from 'react';
import headerLogo from 'renderer/assets/HeadwindInstaller.png';

export const Logo = (): JSX.Element => (
    <div className="flex items-center justify-center space-x-4">
        <img style={{ width: 'auto', height: '14px' }} src={headerLogo} alt="" />
    </div>
);

import React, { FC } from 'react';
import settings, { useSetting } from 'renderer/rendererSettings';
import { ipcRenderer } from 'electron';
import { Toggle } from '../Toggle';
import {setupMsfsBasePath} from "renderer/actions/install-path.utils";

interface PathSettingItemProps extends SettingItemProps<string> {
  name: string;
  callback: () => Promise<string>;
}

const PathSettingItem: React.FC<PathSettingItemProps> = ({ value, setValue, name, callback }) => {
  const handleClick = async () => {
    const path = await callback();

    if (path) {
      setValue(path);
    }
  };

  return (
      <SettingsItem name={name}>
        <div
            className="cursor-pointer text-xl text-white underline transition duration-200 hover:text-gray-400"
            onClick={handleClick}
        >
          {value}
        </div>
      </SettingsItem>
  );
};

const SettingsItem: FC<{ name: string }> = ({ name, children }) => (
  <div className="flex flex-row items-center justify-between py-3.5">
    {/* TODO: Remove this styling later */}
    <p className="m-0">{name}</p>
    {children}
  </div>
);

interface SettingItemProps<T> {
  value: T;
  setValue: (value: T) => void;
}

const MsfsBaseSettingItem = ({ value, setValue }: SettingItemProps<string>): JSX.Element => (
    <PathSettingItem value={value} setValue={setValue} name="MSFS Base Path" callback={setupMsfsBasePath} />
);

const AutoStartSettingItem = ({ value, setValue }: SettingItemProps<boolean>) => {
  const handleClick = () => {
    const newState = !value;
    setValue(newState);
    settings.set('mainSettings.autoStartApp', newState);
    ipcRenderer.send('request-startup-at-login-changed', newState);
  };

  return (
    <SettingsItem name="Automatically Start Application on Login">
      <Toggle value={value} onToggle={handleClick} />
    </SettingsItem>
  );
};

const DateLayoutItem = ({ value, setValue }: SettingItemProps<string>) => {
  const handleSelect = (value: string) => {
    settings.set('mainSettings.dateLayout', value);
    setValue(value);
  };

  return (
    <SettingsItem name="Date Layout">
      <select
        value={value}
        onChange={(event) => handleSelect(event.currentTarget.value)}
        name="Date Layout"
        className="w-60 cursor-pointer rounded-md border-2 border-navy bg-navy-light px-3.5 py-2.5 text-xl text-white outline-none"
      >
        <option value={'yyyy/mm/dd'}>YYYY/MM/DD</option>
        <option value={'mm/dd/yyyy'}>MM/DD/YYYY</option>
        <option value={'dd/mm/yyyy'}>DD/MM/YYYY</option>
      </select>
    </SettingsItem>
  );
};

const LongDateFormatItem = ({ value, setValue }: SettingItemProps<boolean>) => {
  const handleClick = (value: boolean) => {
    settings.set('mainSettings.useLongDateFormat', value);
    setValue(value);
  };

  return (
    <SettingsItem name="Use Long Date Format">
      <Toggle value={value} onToggle={handleClick} />
    </SettingsItem>
  );
};

export const GeneralSettings = (): JSX.Element => {
  const [basePath, setBasePath] = useSetting<string>('mainSettings.msfsBasePath');
  const [autoStart, setAutoStart] = useSetting<boolean>('mainSettings.autoStartApp');
  const [dateLayout, setDateLayout] = useSetting<string>('mainSettings.dateLayout');
  const [useLongDate, setUseLongDate] = useSetting<boolean>('mainSettings.useLongDateFormat');

  return (
    <div>
      <div className="flex flex-col">
        <h2 className="text-white">General Settings</h2>
        <div className="flex flex-col divide-y divide-gray-600">
          <MsfsBaseSettingItem value={basePath} setValue={setBasePath} />
          <AutoStartSettingItem value={autoStart} setValue={setAutoStart} />
          <DateLayoutItem value={dateLayout} setValue={setDateLayout} />
          <LongDateFormatItem value={useLongDate} setValue={setUseLongDate} />
        </div>
      </div>
    </div>
  );
};

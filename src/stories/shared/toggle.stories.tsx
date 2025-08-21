import type { Meta, StoryObj } from '@storybook/react';
import Toggle from '../../components/shared/toggle';
import { useState } from 'react';
import { action } from 'storybook/actions';

const meta: Meta<typeof Toggle> = {
  title: 'Shared/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: { type: 'radio' }, options: ['sm', 'base'] },
    childrenLeft: { control: 'text' },
    childrenRight: { control: 'text' },
    onChange: { action: 'changed' },
  },
};

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(args.value);
    // Combine state update and action logger
    const handleChange = (val: boolean) => {
      setChecked(val);
      if (args.onChange) args.onChange(val); // This triggers Storybook's action logger
      action('changed')(val); // Optional: explicit action logging
    };
    return (
      <Toggle
        {...args}
        value={checked}
        onChange={handleChange}
      />
    );
  },
  args: {
    value: false,
    id: 'default-toggle',
    childrenLeft: 'Off',
    childrenRight: 'On',
    size: 'base',
    disabled: false,
  },
};

export const Small: Story = {
  render: (args: { value: boolean, id: string }) => {
    const [checked, setChecked] = useState(args.value);
    return (
      <Toggle
        {...args}
        value={checked}
        onChange={setChecked}
      />
    );
  },
  args: {
    value: true,
    id: 'small-toggle',
    childrenLeft: 'No',
    childrenRight: 'Yes',
    size: 'sm',
    disabled: false,
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    value: false,
    id: 'disabled-toggle',
    childrenLeft: 'Disabled',
    childrenRight: 'Enabled',
    size: 'base',
    disabled: true,
    onChange: () => {},
  },
};
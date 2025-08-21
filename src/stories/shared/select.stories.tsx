import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Select from '../../components/shared/select';
import { ReactNode, useState } from 'react';


const meta: Meta<typeof Select> = {
  title: 'Shared/Select',
  component: Select,
  tags: ['autodocs'],
  argTypes: {
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    onChange: { action: 'changed' },
  }
};

export default meta;

type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    return (
      <Select
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      >
        {args.children}
      </Select>
    );
  },
  args: {
    value: 'value 1',
    children: (
      <>
        <option value={'value 1'}>value 1</option>
        <option value={'value 2'}>value 2</option>
      </>
    ),
    id: 'default-select',
    disabled: false,
    onChange: () => {}
  }
};

export const Disabled: Story = {
  args: {
    value: 'value 1',
    children: (
      <>
        <option value={'value 1'}>value 1</option>
        <option value={'value 2'}>value 2</option>
      </>
    ),
    id: 'disabled-select',
    disabled: true,
    onChange: () => {}
  }
};
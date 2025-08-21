import NavButton from "@/components/layout/navbar/nav-button";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";


const meta: Meta<typeof NavButton> = {
  title: 'Navbar/NavButton',
  component: NavButton,
  tags: ['autodocs'],
  argTypes: {
    onClick: { action: 'clicked' },
    isActive: { control: 'boolean' },
  }
}

export default meta;

type Story = StoryObj<typeof NavButton>;

export const Default: Story = {
  args: {
      children: "Button",
      isActive: true
  }
}

export const NotActive: Story = {
  args: {
      children: "Button",
      isActive: false
  }
}
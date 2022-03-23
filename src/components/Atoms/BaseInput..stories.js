import BaseInput from './BaseInput.vue';

//import { action } from '@storybook/addon-actions';

export default {
  component: BaseInput,
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  title: 'Atoms/BaseInput',
  //👇 Our events will be mapped in Storybook UI
  argTypes: {
    label: {
        defaultValue: "placeholder"
    }
  },
};

/*export const actionsData = {
  onPinTask: action('pin-task'),
  onArchiveTask: action('archive-task'),
};*/
const Template = (args) => ({
	components: { BaseInput },

	setup() {
		return { args };
	},
	template: '<BaseInput v-bind="args"/>',
});

export const Simple = Template.bind({});

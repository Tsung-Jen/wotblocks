import BaseSelect from './BaseSelect.vue';

//import { action } from '@storybook/addon-actions';

export default {
  component: BaseSelect,
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  title: 'Atoms/BaseSelect',
  //👇 Our events will be mapped in Storybook UI
  argTypes: {
    options: [
        'water',
        'coffee',
        'milk',
    ],
  },
};

/*export const actionsData = {
  onPinTask: action('pin-task'),
  onArchiveTask: action('archive-task'),
};*/
const Template = (args) => ({
	components: { BaseSelect },

	setup() {
		return { args };
	},
	template: '<BaseSelect v-bind="args"/>',
});

export const Simple = Template.bind({});

Simple.args = {
    options: [
        'water',
        'coffee',
        'milk'
    ]
  };

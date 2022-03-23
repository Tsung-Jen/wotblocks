import BaseSlider from './BaseSlider.vue';

//import { action } from '@storybook/addon-actions';

export default {
  component: BaseSlider,
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  title: 'Atoms/BaseSlider',
  //👇 Our events will be mapped in Storybook UI
  argTypes: {
    value: {

    }
  },
};

/*export const actionsData = {
  onPinTask: action('pin-task'),
  onArchiveTask: action('archive-task'),
};*/
const Template = (args) => ({
	components: { BaseSlider },

	setup() {
		return { args };
	},
	template: '<BaseSlider v-bind="args" v-model="value"/>',
});

export const Simple = Template.bind({});

Simple.args = {
    value: 5,
    min: 0,
    max: 10
  };
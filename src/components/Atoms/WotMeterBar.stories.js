import WotMeterBar from './WotMeterBar.vue';

//import { action } from '@storybook/addon-actions';

export default {
  component: WotMeterBar,
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  title: 'Atoms/WotMeterBar',
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
	components: { WotMeterBar },

	setup() {
		return { args };
	},
	template: '<WotMeterBar v-bind="args" v-model="value"/>',
});

export const Simple = Template.bind({});

Simple.args = {
    value: 80
  };
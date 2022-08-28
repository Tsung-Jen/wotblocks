import WotState from './WotState.vue';

//import { action } from '@storybook/addon-actions';

export default {
  component: WotState,
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  title: 'Atoms/WotState',
  //👇 Our events will be mapped in Storybook UI
  argTypes: {
    checked: {
        default: false
    }
  },
};

/*export const actionsData = {
  onPinTask: action('pin-task'),
  onArchiveTask: action('archive-task'),
};*/
const Template = (args) => ({
	components: { WotState },

	setup() {
		return { args };
	},
	template: '<WotState v-bind="args" v-model:checked="checked">',
});

export const Simple = Template.bind({});

Simple.args = {
    checked: false
  };
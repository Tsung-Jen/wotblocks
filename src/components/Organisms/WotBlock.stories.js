import WotBlock from './WotBlock.vue';
import '../../index.css';

export default {
	title: 'WotBlock',
	component: WotBlock,
	argTypes: {
		wotTD: {
			name: 'wotTD',
			type: { name: 'string', required: true },
			defaultValue: 'http://localhost:8031/smart-coffee-machine/',
			description: 'W3C WoT Thing Description JSON.',
		},
	},
};

const Template = (args) => ({
	components: { WotBlock },

	setup() {
		return { args };
	},
	template: '<WotBlock v-bind="args"/>',
});

export const Simple = Template.bind({});

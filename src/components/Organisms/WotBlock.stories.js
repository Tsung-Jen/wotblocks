import WotBlock from './WotBlock.vue';
import '../../index.css';

export default {
	title: 'WotBlock',
	component: WotBlock,
	argTypes: {
		wotTD: {
			name: 'wotTD',
			type: { name: 'string', required: true },
			defaultValue: 'http://ec2-54-174-65-0.compute-1.amazonaws.com:8031/smart-coffee-machine',
			description: 'W3C WoT Thing Description JSON.',
		},
	},
};
//http://ec2-54-174-65-0.compute-1.amazonaws.com:8032/Smart-Coffee-Machine
//http://localhost:8037/counter/

const Template = (args) => ({
	components: { WotBlock },

	setup() {
		return { args };
	},
	template: '<WotBlock v-bind="args"/>',
});

export const Simple = Template.bind({});

import icon from './Icon.vue';
import '../../index.css';

export default {
	title: 'Utilities',
	component: icon,
	argTypes: {
		icon: {
			name: 'icon',
			type: { name: 'string', required: true },
			defaultValue: 'account_circle',
			description:
				'This defines the icon to render. A full list can be found here: https://fonts.google.com/icons',
		},
	},
};

const Template = (args) => ({
	components: { icon },

	setup() {
		return { args };
	},
	template: '<icon v-bind="args"/>',
});

export const Icon = Template.bind({});

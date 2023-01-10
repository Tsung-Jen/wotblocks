import Accordion from "./Accordion.vue";

//import { action } from '@storybook/addon-actions';

export default {
  component: Accordion,
  //👇 Our exports that end in "Data" are not stories.
  excludeStories: /.*Data$/,
  title: "Atoms/Accordion",
  //👇 Our events will be mapped in Storybook UI
  argTypes: {
    value: {},
  },
};

/*export const actionsData = {
  onPinTask: action('pin-task'),
  onArchiveTask: action('archive-task'),
};*/
const Template = (args) => ({
  components: { Accordion },

  setup() {
    return { args };
  },
  template: '<Accordion v-bind="args"> accordion content</Accordion>',
});

export const Simple = Template.bind({});

Simple.args = {
  id: "id-1",
  expandOnLoad: false,
  title: "Adasdsada",
  icon: "sports_esports",
};

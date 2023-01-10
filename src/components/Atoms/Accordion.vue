<template>
  <div class="accordion-item">
    <button
      style="cursor: pointer"
      class="clickarea"
      :id="header_id"
      :aria-controls="panel_id"
      :aria-expanded="isExpanded === true ? 'true' : 'false'"
      @click="toggle"
    >
      <div class="accordion-spacer">
        <div class="accordion-begin">
          <span
            v-if="icon"
            class="material-icons-outlined"
            style="color: #555"
            >{{ icon }}</span
          >
          <span class="accordion-title">{{ title }}</span>
        </div>

        <div class="accordion-item__toggler">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="toggle-arrow"
            fill="none"
            viewBox="0 0 24 24"
            stroke="#111111"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </button>
    <section
      :id="panel_id"
      :aria-labelledby="header_id"
      v-show="isExpanded"
      class="accordion-slot-space"
    >
      <slot></slot>
    </section>
  </div>
</template>

<script>
export default {
  name: "Accordion",
  data() {
    return {
      isExpanded: false,
    };
  },
  props: {
    expandOnLoad: { type: Boolean, default: false },
    icon: { type: String },
    id: { type: String, required: true },
    title: { type: String, required: true },
  },
  mounted() {
    if (this.expandOnLoad) {
      this.isExpanded = true;
    }
  },
  methods: {
    toggle() {
      this.isExpanded = !this.isExpanded;
    },
  },
  computed: {
    header_id() {
      return this.id + "-header";
    },
    panel_id() {
      return this.id + "-panel";
    },
  },
};
</script>

<style lang="css" scoped>
.accordion-item .accordion-item__toggler {
  transition: transform 0.25s linear;
  display: flex;
  align-items: flex-start;
  max-height: 1.75rem;
}
[aria-expanded="true"] .accordion-item__toggler {
  transform: rotate(180deg);
}

.toggle-arrow {
  height: 1.5rem;
  width: 1.5rem;
  justify-content: center;
  display: flex;
}

.accordion-item .clickarea {
  width: 100%;
  padding-left: 0px;
  padding-right: 14px;
  text-align: left;
  background-color: #fff;
  border: #eee;
}

.clickarea:hover {
  background-color: #eee;
}

.accordion-spacer {
  display: flex;
  justify-content: space-between;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.accordion-begin {
  padding-left: 1rem;
  display: flex;
}
.accordion-title {
  padding-left: 1rem;
  font-size: 16px;
  line-height: 1.5em;
}

.accordion-slot-space {
  padding-left: 16px;
  padding-right: 16px;
  padding-top: 1em;
}
</style>

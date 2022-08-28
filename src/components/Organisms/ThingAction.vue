<template>
  <div>
    <div class="wotbar_action-header">{{ actionName }}</div>

    <div v-if="actionObj.description">
      <span class="wotbar__caption">{{ actionObj.description }}</span>
    </div>

    <!-- action has no input, / it is a default action or needs parameters -->
    <!-- ?drinkId=hotChocolate&size=s&quantity=5 -->

    <!--<div v-if="'uriVariables' in actionObj">
      <button
        size="sm"
        class="full-width"
        color="green"
        @click="consumeAction(actionName, propvals)"
      >{{actionName}}</button>
    </div>-->

    <div v-if="actionObj.type == 'string'">
      <BaseInput
        v-if="!actionObj.enum"
        v-model="propvals[actionName]"
        :label="actionName"
      />
      <BaseSelect
        v-if="actionObj.enum"
        v-model="propvals[actionName]"
        :options="actionObj.enum"
        :label="actionName"
      />
      <!--<v-btn
        @click="consumeAction(actionName, Object.defineProperty({}, index, {value: propvals[actionName +'_'+ index], enumerable: true }))"
      >{{actionName}}</v-btn>-->
    </div>
    <div v-if="actionObj.type == 'integer'">
      <BaseInput
        v-if="
          !Object.prototype.hasOwnProperty.call(actionObj, 'minimum') ||
          !Object.prototype.hasOwnProperty.call(actionObj, 'maximum')
        "
        v-model.number="propvals[actionName]"
        :label="actionName"
      />
      <div
        v-if="
          Object.prototype.hasOwnProperty.call(actionObj, 'minimum') &&
          Object.prototype.hasOwnProperty.call(actionObj, 'maximum')
        "
      >
        <div class="q-pt-md">
          <BaseSlider
            :label="propvals[actionName]"
            v-model.number="propvals[actionName]"
            class="align-center"
            :max="actionObj.maximum"
            :min="actionObj.minimum"
          />
        </div>
        <!--<div side class="wotcard__action-side">
          <div>
            <BaseInput
              v-model.number="propvals[actionName]"
              :label="actionName"
            />
          </div>
        </div>-->
      </div>

      <!--<v-slider
        :label="actionName"
        v-if="
          Object.prototype.hasOwnProperty.call(actionObj, 'minimum') &&
          Object.prototype.hasOwnProperty.call(actionObj, 'maximum')
        "
        v-model.number="propvals[actionName]"
        class="align-center"
        :max="actionObj.maximum"
        :min="actionObj.minimum"
        hide-details
      >
        <template v-slot:append>
          <v-text-field
            v-model.number="propvals[actionName]"
            class="mt-0 pt-0"
            hide-details
            single-line
            type="number"
            style="width: 60px"
          ></v-text-field>
        </template>
      </v-slider>-->
      <!--<v-btn
        @click="consumeAction(actionName, Object.defineProperty({}, index, {value: propvals[actionName +'_'+ index], enumerable: true }))"
      >{{actionName}}</v-btn>-->
    </div>
    <div v-if="actionObj.type == 'boolean'">
      <WotState
        v-model="propvals[actionName]"
        :label="actionName"
        color="green"
      />

      <!--<v-btn
        @click="consumeAction(actionName, Object.defineProperty({}, index, {value: propvals[actionName +'_'+ index], enumerable: true }))"
      >{{actionName}}</v-btn>-->
    </div>

    <div v-if="actionObj.input">
      <button
        class="full-width"
        size="sm"
        color="green"
        @click="consumeAction(actionName, propvals)"
      >{{actionName}}</button>
      <!-- Actually, as far as I know, if an action has an input, it is ALWAYS of type object-->
      <div v-if="actionObj.input.type == 'object'">
        <div
          v-for="(property, index) in actionObj.input.properties"
          :key="index"
        >
          <ThingAction
            :propvals="propvals"
            :actionName="index"
            :actionObj="property"
            :index="index"
          />
          <!-- IMPORTANT, not always like this, be safe! -->
          <!--<div>{{index}}</div>-->
          <!-- Each of these represent an action that can be performed.-->
          <!--<div>{{property}}</div>-->

          <!-- A property can have type, description, minLength, maxLength, -->
          <!-- Type is very important, in order to know what to show. When type is boolean, you can have true,false props. REFER TO MANUAL -->
        </div>
      </div>
    </div>
    <div v-if="actionObj.uriVariables">
      <button
        class="full-width"
        size="sm"
        color="green"
        @click="consumeAction(actionName, propvals)"
      >{{actionName}}</button>
      <!-- Actually, as far as I know, if an action has an input, it is ALWAYS of type object-->
        <div
          v-for="(uriVariable, index) in actionObj.uriVariables"
          :key="index"
        >
          <ThingAction
            :propvals="propvals"
            :actionName="index"
            :actionObj="uriVariable"
            :index="index"
          />
        </div>
    </div>
  </div>
</template>

<script>
import BaseSelect from "../Atoms/BaseSelect.vue"
import BaseInput from "../Atoms/BaseInput.vue"
import BaseSlider from "../Atoms/BaseSlider.vue"
import WotState from "../Atoms/WotState.vue"

export default {
  name: "ThingAction",
  components: {
    BaseSelect,
    BaseSlider,
    WotState,
    BaseInput,
  },
  props: {
    index: {
      type: String,
      default: "noIndex",
    },
    actionName: {
      type: String,
      required: true,
    },
    actionObj: {
      type: Object,
      required: true,
    },
    propvals: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  computed: {},
  data() {
    return {
      //propvals: {}
    };
  },
  methods: {
    consumeAction(action, input) {
      this.$emit("actionTriggered", action, input);
    },
  },
};
</script>

<style >
.wotcard__action-side {
  max-width: 80px;
}

.wotbar__caption{
  font-size: 14px;
  color: #888;
  padding-bottom: 8px;
}

.wotbar_action-header{
  padding-top: 10px;
  padding-bottom: 4px;
}
</style>

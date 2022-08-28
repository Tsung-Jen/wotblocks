<template>
  <div>
    <!-- Since we already checked for isEnabled, this specialConf is only for ui_type -->
    <div v-if="'specialConf' in objectProperties">
      <!-- use: objectProperties.specialConf[0].ui_type  -->
      <div v-if="objectProperties.specialConf[0].ui_type == 'slot'">
        <slot
          name="special"
          :specialProp="{
            name: propertyName,
            consume: propertyConsume,
            objectProperties: objectProperties,
          }"
        ></slot>
      </div>
      <div v-if="objectProperties.specialConf[0].ui_type == 'html'">
        <div v-html="objectProperties.specialConf[0].url"></div>
      </div>
    </div>
    <div v-else>
      <div v-if="propertyType == 'integer'" class="wotbar">
          <div class="wotbar__label">
              <UIPropertyRefresh
                :objectProperties="objectProperties"
                :propertyName="propertyName"
                @click="consumeProperty(propertyName)"
            />
          </div>
              
          <div
            class="wotbar__meter"
            v-if="
              Object.prototype.hasOwnProperty.call(
                objectProperties,
                'minimum'
              ) &&
              Object.prototype.hasOwnProperty.call(objectProperties, 'maximum')
            "
          >
            <WotMeterBar :value="(propertyConsume / objectProperties.maximum) * 100"></WotMeterBar> {{propertyConsume}}

            <!--<q-linear-progress
              size="15px"
              :value="(propertyConsume / objectProperties.maximum) * 100"
              color="accent"
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  color="white"
                  text-color="accent"
                  :label="
                    Math.floor(
                      (propertyConsume / objectProperties.maximum) * 100
                    )
                  "
                />
              </div>
            </q-linear-progress>-->
          
     
              
           </div>
      </div>
      <div v-if="propertyType == 'number'">
              <UIPropertyRefresh
                :objectProperties="objectProperties"
                :propertyName="propertyName"
                @click="consumeProperty(propertyName)"
            />
              {{ propertyConsume }}
            
      </div>
      <div v-if="propertyType == 'string'">
            <!-- if it is readOnly -->
              <UIPropertyRefresh
                :objectProperties="objectProperties"
                :propertyName="propertyName"
                @click="consumeProperty(propertyName)"
            />{{ propertyConsume }}
      </div>
      <div v-if="propertyType == 'boolean'" class="wotbar">
              <UIPropertyRefresh
                class="wotbar__label"
                :objectProperties="objectProperties"
                :propertyName="propertyName"
                @click="consumeProperty(propertyName)"
            />
              <WotState :value="propertyConsume"/>
      </div>
      <div v-if="propertyType == 'array'" class="wotbar">
            <!-- if it is readOnly -->
              <UIPropertyRefresh
              class="wotbar__label"
                :objectProperties="objectProperties"
                :propertyName="propertyName"
                @click="consumeProperty(propertyName)"
              />
              <div class="wotbar__meter">
                  {{propertyConsume}}
              </div>
              
      </div>
    </div>
    <div v-if="propertyType == 'object'">
      <UIPropertyRefresh
        :objectProperties="objectProperties"
        :propertyName="propertyName"
        @click="consumeProperty(propertyName)"
      />

      <!--<div v-if="propertyObj.title">
        <span class="text-subtitle-2">{{propertyObj.title}}no {{propertyName}}</span>
        <span v-if="propertyObj.description" class="text-caption">&nbsp;- {{propertyObj.description}}</span>
      </div>
      <div v-if="!propertyObj.title">
        <span class="text-subtitle-2">{{propertyName}}nn</span>
        <span v-if="propertyObj.description" class="text-caption">&nbsp;- {{propertyObj.description}}</span>
      </div>-->
      <!-- only allow one nested obj -->
      <div
        v-for="(subsubprop, subPropertyName) in objectProperties.properties"
        :key="subPropertyName"
      >
        <div v-if="'specialConf' in subsubprop">
          <!-- Check if property is enabled: -->
          <div v-if="subsubprop.specialConf[0].isEnabled">
            <ThingProperty
              :propertyType="subsubprop.type"
              :propertyName="subPropertyName"
              :propertyObj="propertyObj"
              :propertyConsume="propertyConsume[subPropertyName]"
              :objectProperties="objectProperties.properties[subPropertyName]"
            >
              <template v-slot:special="{ specialProp }">
                <slot name="special" :specialProp="specialProp"></slot>
              </template>
            </ThingProperty>
          </div>
        </div>
        <div v-else>
          <ThingProperty
            :propertyType="subsubprop.type"
            :propertyName="subPropertyName"
            :propertyObj="propertyObj"
            :propertyConsume="propertyConsume[subPropertyName]"
            :objectProperties="objectProperties.properties[subPropertyName]"
          >
            <template v-slot:special="{ specialProp }">
              <slot name="special" :specialProp="specialProp"></slot>
            </template>
          </ThingProperty>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseSelect from "../Atoms/BaseSelect.vue"
import WotState from "../Atoms/WotState.vue"
import WotMeterBar from "../Atoms/WotMeterBar.vue"
import UIPropertyRefresh from "./UIPropertyRefresh.vue";

export default {
  name: "ThingProperty",
  components: {
    BaseSelect,
    WotMeterBar,
    WotState,
    UIPropertyRefresh,
  },
  props: {
    propertyType: {
      type: String,
      required: true,
    },
    propertyName: {
      type: String,
      required: true,
    },
    propertyObj: {
      type: Object,
      required: true,
    },
    propertyConsume: {
      required: true,
      default: function () {
        return "";
      },
    },
    objectProperties: {
      type: Object,
      default: function () {
        return {};
      },
    },
    propvals: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  computed: {},
  methods: {
    consumeProperty(property) {
      console.log("ones ", property);
      this.$emit("click", property);
    },
  },
};
</script>

<style >
.wotbar-minWidth {
  min-width: 150px;
}

.wotbar{
    display: flex;

    padding: 4px;
}
.wotbar__label {
    width: 30%;
}
.wotbar__meter{
    width: 70%;
}
</style>

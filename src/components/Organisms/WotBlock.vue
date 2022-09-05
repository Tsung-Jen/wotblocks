<template>
  <div class="wotcard">
      <!-- THING TOOLBAR, related to configs of a thing and how a Thing is represented on a Database. Can show reactivity -->
      <!-- A Thing Toolbar is an optional prop-->
      <div class="toolbar">
        <ThingToolbar
          :thingObj="thing"
          :availability="availability"
          @refresh-thing="refreshThing"
          @showConfigurationModal="showConfigurationModal"
        />
      </div>

      <!-- REAL BEGINNING OF THING-->
      <!-- "second toolbar" -->
      <div class="header">
        <div class="main">
          <div class="main-title">{{ thing.title }}</div>
          <div class="main-subtitle">{{ thing.description }}</div>
        </div>
          
        <div class="main-right">
          <div class="main-subtitle">last updated</div> <div class="main-time">{{lastReachabilityTime}} ago</div>
        </div>
      </div>
          
      <!-- "END of second toolbar" -->

      <!-- END of THING SPECIFICS -->

      <!-- PROPERTIES -->
      <Accordion :title="'Properties'" :icon="'ballot'" id="properties">
        <ThingProperty
              v-for="(property, index) in thing.properties"
              :key="index"
              :propertyType="property.type"
              :propertyName="index"
              :propertyObj="property"
              :propertyConsume="property.consumedProperty"
              :objectProperties="property"
              @onConsumeClick="consumeProperty"
            >
              <template v-slot:special="{ specialProp }">
                <slot name="special" :specialProp="specialProp"></slot>
              </template>
            </ThingProperty>
      </Accordion>

      <!-- Actions -->
      <Accordion :title="'Actions'" :icon="'sports_esports'" id="actions">
        <div
              v-for="(action, parent_index) in thing.actions"
              :key="parent_index"
            >
              <ThingAction
                :actionName="parent_index"
                :actionObj="action"
                @actionTriggered="consumeAction"
              />
            </div>
      </Accordion>

      <!-- Events -->
      <Accordion :title="'Events'" :icon="'notifications'" id="events">
        <div
              v-for="(event, parent_index) in thing.events"
              :key="parent_index"
            >
              <WotState
                v-model:checked="tempEvent[parent_index]"
                :label="`${parent_index}`"
                @onStateChanged="listenToEventIfTrue($event, parent_index, tempEvent[parent_index])"
              />
            </div>
        <div style="padding-bottom:20px;"></div>
      </Accordion>

    <!-- Default Modal for adding/setting configuration TODO -->
    <!-- <slot
      name="configModal"
      :wotBlockScope="{
        dialog: dialogConfiguration,
        thing: thing,
        closeConfigurationModal,
      }"
    >
      <ModalDefaultConfiguration
        :showModal.sync="dialogConfiguration"
        :thingToEdit="thing"
        :maxWidth="500"
      />
    </slot>-->
  </div>
</template>

<script>
import Accordion from "../Atoms/Accordion.vue"
import WotState from "../Atoms/WotState.vue"
import dateHelper from '../../utils/dateHelper'
import ThingProperty from "./ThingProperty.vue";
import ThingAction from "./ThingAction.vue";
import ThingToolbar from "./ThingToolbar.vue";
//import ModalDefaultConfiguration from "@/components/ModalDefaultConfiguration";

export default {
  name: "WoTBlock",
  props: {
    // a wotTD can be a W3C WoT TD or a URL to a W3C WoT TD
    wotTD: {
      type: String,
      required: true,
    },
    config: {
      type: Object,
    },
    thingObj: {
      type: Object,
    },
    thingId: {
      type: String,
    },
    webServient: {
      type: Object,
    },
    refreshAvailabilityRate: {
      type: Number,
      default: 301000
    },
    updateTimerRate: {
      type: Number,
      default: 61000
    },
    defaultProtocol: {
      type: String,
      default: "http"
    }
    
  },
  components: {
    Accordion,
    ThingProperty,
    ThingAction,
    WotState,
    ThingToolbar,
    //ModalDefaultConfiguration,
  },
  computed: {
  },
  data() {
    return {
      dialogConfiguration: false,
      availability: "connecting",
      lastUpdate: "",
      lastReachabilityTime: "",
      thing: {},
      properties: [],
      polling: {},
      thingFactory: null,
      tempEvent: {},
      eventSubscriptions: {},
      receivedEvents: ["ev1", "ev2"],
      messages: 0,
      updateTimer: null,
      reachabilityChecker: null,
      thingServient: null,
      helpers: null
    };
  },
  created() {
  },
  mounted() {
    this.thingServient = new Wot.Core.Servient();
    
    this.thingServient.addClientFactory(new Wot.Http.HttpClientFactory());
    this.helpers = new Wot.Core.Helpers(this.thingServient);

    // 1st. first check whether I was provided with a webServient, or need to create a new one for this specific thing.
    this.thingServient.start().then((thingFactory) => {
      this.thingFactory = thingFactory;
      //this.checkAvailability();
      this.helpers
        .fetch(this.wotTD) // before this, check if a URL was provided or a TD. TODO
        .then((td) => {
          this.thingFactory
            .consume(td)
            .then((thing) => {
              this.thing = thing;
              //this.availability = "connecting";
              // New default behavior:
              this.showInteractions(thing);

              this.lastSetup(thing);

              // Actually, here we should only check this method if we have provided a config.
              //this.setupWoTBlockConfigurations(thing, this.config);

            }) // end of "td fetch"
            .catch((err) => {
              // This error happens when the url of a thing is not reachable. This is useful for servients that use node-wot
              console.log("er: ", err);
              // update availability:
              this.availability = "unavailable";
            });
        })
        .catch((err) => {
          // This error happens when the url of a thing is not reachable. This is useful for servients that use node-wot
          // first attempt to reach the WoT Thing:
          // update availability:
          this.availability = "unavailable";
          this.updateLastUpdateTime()
        });
    });

    this.updateTimer = setInterval(() => {
      this.updateLastUpdateTime();
    }, this.updateTimerRate)
    this.reachabilityChecker = setInterval(() => {
      this.refreshThing();
    }, this.refreshAvailabilityRate)
  },
  methods: {
    updateLastUpdateTime(){
      this.lastUpdate = new Date();
      this.lastReachabilityTime = dateHelper.timeSince(this.lastUpdate)
    },
    lastSetup(thing){
      window.addEventListener('popstate', function (event) {
	    // The URL changed...
        let propertyNames = Object.keys(thing.properties);
        console.log("ajssa ", propertyNames);
        propertyNames.forEach((property, index, array) => {
          if (thing.properties[property].observable === true) {
                  thing.unobserveProperty(property);
          }
        });
        this.thing = {};
        this.thingServient = {};
      });
    },
    
    showInteractions(thing) {
      this.updateLastUpdateTime();
      let td = thing.getThingDescription(); 

      let properties = td.properties;

      //this.properties = td.properties; //http://192.168.2.128:8080/SenseHat
      //console.log("properties: ", td.properties);

      // HERE: consume each of the properties once and also check if observable for reactivity via polling:
      let propertyNames = Object.keys(properties); // Array of properties to be consumed one by one

      var readAllProperties = new Promise((resolve, reject) => {
        // Each property of propertyNames needs to be consumed
        propertyNames.forEach(async (property, index, array) => {
          try {
            // this might not be necessary: (because we can check if we should display via specialProperties)
              let consumedProperty = await thing.readProperty(property);
              console.log("consumed property: ", consumedProperty);
              properties[property]["consumedProperty"] = consumedProperty;  // why do we have a consumedProperty?
              this.availability = "available" // if it reaches here, it can reach it.
              if (properties[property].observable === true) {
                thing.observeProperty(property, (data) => {       
                  this.thing.properties[property]["consumedProperty"] = data;
                });
              }
          } catch (err) {
            // this error happens when we cannot communicate with a thing. That is, we cannot read a property.
            console.log("err ", err);
            reject(err);
          }

          if (index === array.length - 1) resolve();
        });

        setTimeout(function () {
          reject("timeout");
        }, 20000);
      });

      // To be created once all consumed properties have been read
      readAllProperties
        .then(() => {
          console.log("setting the thing object with functionality")
          this.availability = "available";

          //this.availability = "available";
          this.lastUpdate = this.lastUpdate = new Date();
          this.thing.properties = properties;
          this.thing.actions = td.actions;
          this.thing.events = td.events;
        })
        .catch((error) => {
          console.log("there was an error", error);
          //this.availability = "unavailable";
        });

    },
    listenToEventIfTrue(e, eventName, state) {
      if (state === true && !this.eventSubscriptions[eventName]) {
        this.eventSubscriptions[eventName] = eventName;
        this.thing.subscribeEvent(
          eventName,
          async function (data) {
            //console.log('Event "' + evnt + '"');
            window.alert("event: " + data);
          }).then((sub, ss) => {
            console.log("Subscribed for event: " + eventName);
            
          })
          .catch((error) => {
            console.log(eventName);
            window.alert("Event " + evnt + " error\nMessage: " + error);
          }
        );
      } else if (state === false && this.eventSubscriptions[eventName]) {
        console.log("Try to unsubscribing for event: " + eventName);
        this.eventSubscriptions[eventName] 
        this.thing.unsubscribeEvent(
          eventName,
          async function (data) {

          }).then((sub, ss) => {
            this.eventSubscriptions[eventName] = undefined;
            
          })
          .catch((error) => {
            console.log(eventName);
            window.alert("Event " + evnt + " error\nMessage: " + error);
          }
        );
                            
      }
    },
    refreshThing() {
      this.availability = "connecting";
      this.showInteractions(this.thing);
    },

    consumeProperty(property) {
      console.log("Read a specific property, again, so it can be updated manually",property);
      this.thing.readProperty(property).then((updatedProperty) => {
        this.thing.properties[property]["consumedProperty"] = updatedProperty;
        console.log("updated prop: ", updatedProperty);
        this.availability = "available";
      });
    },
    consumeAction(action, input) {

      this.thing
        .invokeAction(action, input)
        .then((res) => {
          if (res) {
            console.log(res);
            window.alert("Executed successfully.");
          } 
        })
        .catch((err) => {
          window.alert(err);
        });

      // invoke actions.
      // http://gist.githubusercontent.com/jmaza/ae17b8e1bec458ed706d99f1af09e031/raw/cf94d830793456bf13c656c8b6295ffd689bd64c/thingdesc.json
      // https://gist.githubusercontent.com/jmaza/3f555e5c782594bbd52244a684e6af5e/raw/066375538a0738cbdbfe27d7a6d3086fedacccf2/senhat
    },
  },
};
</script>

<style lang="css">

.wotcard {
  
  box-shadow: 0 1px 5px rgb(0 0 0 / 20%), 0 2px 2px rgb(0 0 0 / 14%), 0 3px 1px -2px rgb(0 0 0 / 12%);
  border-radius: 4px;
  font-family: "Roboto", "-apple-system", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 1.15;
}

.wotcard .header {
  padding: 1em 1em;
  display: flex;
}

.wotcard .toolbar {
  padding: 1em 1em 0em 1em;
  display: flex;
}

.wotcard .header .main {
  flex-direction: column;
  align-items: start;
  display: flex;
  width: 80%;
}

.wotcard .header .main-right {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: flex-end;

}

.wotcard .header .main-title {
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2em;
}

.wotcard .header .main-subtitle {
  font-size: 12px;
  color: #888;
  margin-top: 3px;
  font-weight: 500;
}

.wotcard .header .main-time {
  font-size: 12px;
  color: #555;
  margin-top: 3px;
  font-weight: 500;
}

.my-card.col-sm-6.col-xs-12.self-start {
  align-self: start;
}
</style>

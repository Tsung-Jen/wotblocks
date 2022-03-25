<template>
  <div class="wotcard">
      <!-- THING TOOLBAR, related to configs of a thing and how a Thing is represented on a Database. Can show reactivity -->
      <!-- A Thing Toolbar is an optional prop-->
        <!--<ThingToolbar
          :thingObj="thing"
          :availability="availability"
          @refresh-thing="refreshThing"
          @showConfigurationModal="showConfigurationModal"
        />-->

      <!-- REAL BEGINNING OF THING-->
      <!-- "second toolbar" -->
      <!--<i class="material-icons-outlined">sports_esports</i>
      <span class="material-icons">face</span>-->
      <div class="header">
        <div class="main">
          <div class="main-title">{{ thing.title }}</div>
          <div class="main-subtitle">{{ thing.description }}</div>
        </div>
          
        <div class="main-right">
          <div class="main-subtitle">last updated</div> <div class="main-time">1 min ago</div>
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
              @click="consumeProperty"
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
                @click="consumeAction"
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
                v-model="tempEvent[parent_index]"
                @change="listenToEventIfTrue($event, parent_index)"
                :label="`${parent_index}`"
              />
            </div>
      </Accordion>
      <!--<div class="wotcard__expansion">
        <div
              v-for="(action, parent_index) in thing.actions"
              :key="parent_index"
            >
              <ThingAction
                :actionName="parent_index"
                :actionObj="action"
                @click="consumeAction"
              />
            </div>
      </div>-->

    <!-- Default Modal for adding/setting configuration -->
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

//import * as Core from "@node-wot/";
//import * as WotHttp from "@node-wot/binding-http";
//import ThingRootProperty from "@/components/ThingRootProperty";
import ThingProperty from "./ThingProperty.vue";
import ThingAction from "./ThingAction.vue";
//import ThingToolbar from "./ThingToolbar";
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
  },
  components: {
    //ThingRootProperty,
    Accordion,
    ThingProperty,
    ThingAction,
    WotState,
    //ThingToolbar,
    //ModalDefaultConfiguration,
  },
  computed: {},
  data() {
    return {
      dialogConfiguration: false,
      availability: "connecting",
      thing: {},
      properties: [],
      polling: {},
      thingFactory: null,
      tempEvent: {},
      eventSubscriptions: {},
      receivedEvents: ["asas", "asa"],
      messages: 0,
    };
  },
  created() {
    //let ckeditor = document.createElement('script');    ckeditor.setAttribute('src',"https://cdn.jsdelivr.net/npm/@node-wot/browser-bundle@latest/dist/wot-bundle.min.js");
      //document.head.appendChild(ckeditor);
  },
  mounted() {

    /*var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@node-wot/browser-bundle@latest/dist/wot-bundle.min.js';
    script.onload = function () {
        console.log("loadedd");
    };
    document.head.appendChild(script);*/
    let servient = new Wot.Core.Servient();
    servient.addClientFactory(new Wot.Http.HttpClientFactory());
    this.helpers = new Wot.Core.Helpers(servient);

    // 1st. first check whether I was provided with a webServient, or need to create a new one for this specific thing.
    servient.start().then((thingFactory) => {
      this.thingFactory = thingFactory;
      console.log("thingfa: ", thingFactory);
      //this.checkAvailability();
      this.helpers
        .fetch(this.wotTD)
        .then((td) => {
          console.log("normal td: ", td);
          console.log("fetched once? ", this.wotTD);
          this.thingFactory
            .consume(td)
            .then((thing) => {
              this.thing = thing;
              //this.availability = "connecting";
              console.log("consumed successfully, but? ", thing);

              this.setupWoTBlockConfigurations(thing, this.config);
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
          console.log("er: ", err);
          // update availability:
          this.availability = "unavailable";
        });
    });
  },
  methods: {
    listenToEventIfTrue(e, eventName) {
      console.log("what is th name? ", e);
      console.log("other ar ", eventName);
      console.log("test: ", this.thing);
      if (e === true) {
        this.eventSubscriptions[eventName] = this.thing.subscribeEvent(
          eventName,
          (res) => {
            console.log("it for name  ", eventName);
            console.log("it was listened uscc ", res);
          },
          (err) => {
            console.log(eventName);
            console.log("damm..", err);
          }
        );
      }
    },
    //consumeProperty() {
    //this.$emit("click", property, this.thingObj.id);
    //},
    showInteractions(thing) {
      let td = thing.getThingDescription();

      console.log("again: ", thing);
      console.log("td ", td);
      let properties = td.properties;

      //this.properties = td.properties; //http://192.168.2.128:8080/SenseHat
      //console.log("properties: ", td.properties);

      // HERE: consume each of the properties once and also check if observable for reactivity via polling:
      let propertyNames = Object.keys(properties); // Array of properties to be consumed one by one

      var readAllProperties = new Promise((resolve, reject) => {
        // Each property of propertyNames needs to be consumed
        propertyNames.forEach(async (property, index, array) => {
          //let triedproperty = property;
          try {
            let consume = true;
            // this might not be necessary: (because we can check if we should display via specialProperties)

            console.log(thing);
            if (thing.hasThingConfiguration) {
              if (thing.ThingConfiguration.specialProperties.length > 0) {
                console.log("note that property might be an object");
                var pass = thing.ThingConfiguration.specialProperties.findIndex(
                  (elem) => elem.name == property
                );
                console.log(pass); // if pass is an index (aka, not -1), we could simply not render the property if it also says that isEnabled is false
                if (pass > -1) {
                  if (
                    thing.ThingConfiguration.specialProperties[pass]
                      .isEnabled === false
                  ) {
                    console.log("changed");
                    consume = false;
                    properties[property] = null; // null properties are checked after promise is resolved, below.
                  }
                }
              }
            }

            if (consume) {
              console.log("IT SKDNASKDNKAD A D SKD S");
              let consumedProperty = await thing.readProperty(property);
              properties[property]["consumedProperty"] = consumedProperty;
              if (properties[property].observable === true) {
                thing.observeProperty(property, (data) => {
                  properties[property]["consumedProperty"] = data;
                });
              }
            }
          } catch (err) {
            // this error happens when we cannot communicate with a thing. That is, we cannot read a property.
            console.log("it was rejected ", property);
            reject(err);
          }

          if (index === array.length - 1) resolve();
        });

        setTimeout(function () {
          reject("timeout");
        }, 10000);
      });

      // To be created once all consumed properties have been read
      readAllProperties
        .then(() => {
          console.log("------------------ is this working even?");
          this.availability = "available";
          //var propsToDisable = [];
          // what if we just use the same old things?, we have to look for the id
          //NEW        this.things.map(td_obj => {
          //NEW          if (td_obj.id == thing.t_id) {
          console.log("this is the last ", properties);
          //if(Object.values(properties).includes(null)){}
          var propToDel = Object.keys(properties).filter(function (k) {
            return properties[k] === null;
          });
          // delete all properties found in array:
          propToDel.forEach((prop) => {
            console.log("delete? ", prop);
            delete properties[prop];
          });

          this.availability = "available";
          this.thing.properties = properties;
          this.thing.actions = td.actions;
          this.thing.events = td.events;
          console.log("my babe ", this.thing);
        })
        .catch((error) => {
          console.log("there was ", error);
          this.availability = "unavailable";
        });

      // Set up observables:
      // 1. check up which properties have observable: true

      //console.log(this.consumedProperties);
      let keys = Object.keys(td.actions);
      console.log("somekeys ", keys);
      this.actions = td.actions;
      //console.log("events: ", td.events);
    },
    refreshThing() {
      this.availability = "connecting";
      this.showInteractions(this.thing);
      /*let specialPropertiesNames = null;
      this.helpers
        .fetch(this.wotTD)
        .then(td => {
          this.thingFactory.consume(td).then(thing => {
            if (this.config) {
              if (this.config.specialProperties.length > 0) {
                console.log(this.config.specialProperties);
                specialPropertiesNames = this.config.specialProperties.map(
                  elem => elem.name
                );
              }
            }

            thing.hasThingConfiguration = this.config !== null;
            thing.ThingConfiguration = this.config;
            thing.specialPropertiesNames = specialPropertiesNames;

            this.thing = thing;
            this.showInteractions(thing);
          });
        })
        .catch(err => {
          // This error happens when the url of a thing is not reachable. This is useful for servients that use node-wot
          console.log("er: ", err);
          // update availability:
          this.availability = "unavailable"; // maybe look for the this.things obj first
        });*/
    },
    showConfigurationModal() {
      console.log("must show conf ", this.config);
      console.log("id: ", this.thingId);
      this.dialogConfiguration = true;
    },
    closeConfigurationModal(newConfigs) {
      this.dialogConfiguration = false;
      console.log(newConfigs);
      if (newConfigs) {
        console.log("there was new", newConfigs.data.newConfig);
        console.log("new config should: ", this.thing.ThingConfiguration.name);
        this.thing.ThingConfiguration = newConfigs.data.newConfig;
        this.setupWoTBlockConfigurations(this.thing, newConfigs.data.newConfig);
      }
    },
    consumeProperty(property) {
      console.log("se supone....");
      console.log(property);
      this.thing.readProperty(property).then((updatedProperty) => {
        // update property:
        //this.things.find(thing => {
        //if (thing.id == thingId) {
        this.thing.properties[property]["consumedProperty"] = updatedProperty;
        //}
        //});
        //this.$set(this.properties[property], "consumedProperty", res);
      });
    },
    consumeAction(action, input) {
      console.log("action: ", action);
      console.log("input: ", input);
      console.log("thing: ", this.thing);
      var newinput = { on: true };

      console.log(typeof input);
      console.log(typeof newinput);

      if (typeof input == "object") {
        let keys = Object.keys(input);
        console.log("some", keys);
        //let newobj = {};
        //newobj = Object.defineProperty(newobj, keys[0], input[keys[0]]);
        //console.log(newobj);
      }
      this.thing
        .invokeAction(action, input)
        .then((res) => {
          if (res) {
            console.log(res);
            window.alert("Success! Received response: " + res);
          } else {
            window.alert("Executed successfully.");
          }
        })
        .catch((err) => {
          window.alert(err);
        });
      //showSchemaEditor(action, thing) in the case of light, you can rename and set_state

      // invoke actions.
      // http://gist.githubusercontent.com/jmaza/ae17b8e1bec458ed706d99f1af09e031/raw/cf94d830793456bf13c656c8b6295ffd689bd64c/thingdesc.json
      // https://gist.githubusercontent.com/jmaza/3f555e5c782594bbd52244a684e6af5e/raw/066375538a0738cbdbfe27d7a6d3086fedacccf2/senhat
    },
    checkAvailability() {
      // here we must check how long shall each thing check for its availability: (get this data from User configuration for a Thing)
      // -- this {user} has set that for a Thing, refreshSeconds should be 10000.

      // for each Thing, check (or for now, a default)

      var hasChangeDetection = false;
      // check if thing has configs
      console.log(this.thing.hasThingConfiguration);
      //this.polling = new Object();
      console.log("the poll ", this.polling);
      if (this.polling) {
        console.log("clearring");
        clearInterval(this.polling[this.thing]);
      }
      if (this.thing.hasThingConfiguration) {
        console.log(
          `!!!!!!!! thing: ${this.thing.ThingConfiguration.changeDetection}`
        );
        if (this.thing.ThingConfiguration.changeDetection) {
          hasChangeDetection = this.thing.ThingConfiguration.changeDetection;
        }
      }
      if (hasChangeDetection) {
        console.log(
          `setting for: ${this.thing} a refresh time of: ${this.thing.ThingConfiguration.millisecondsToCheckChange}`
        );
        this.polling[this.thing] = setInterval(() => {
          this.refreshThing();
        }, this.thing.ThingConfiguration.millisecondsToCheckChange);
      }
    },
    setupWoTBlockConfigurations(thing, WotBlockConfig) {
      let specialPropertiesNames = null;
      console.log("it knows thing is: ", thing.ThingConfiguration);
      console.log("and match: ", WotBlockConfig);
      // NOTE!!!! HERE IS THE FIRST TIME  ATHING HAS PROPERTIES AND ACTIONS. I could map properties here, for example
      if (WotBlockConfig) {
        console.log("should not here!!!");
        if (WotBlockConfig.specialProperties.length > 0) {
          console.log(WotBlockConfig.specialProperties);
          specialPropertiesNames = WotBlockConfig.specialProperties.map(
            (elem) => elem.name
          );
        }
      }
      console.log(specialPropertiesNames);
      // find all the properties: (properties is an object)
      if (specialPropertiesNames) {
        specialPropertiesNames.forEach((prop) => {
          // ea prop will be tested if ubicada en el objecto:
          console.log(prop);
          var roots = Object.keys(thing.properties);
          // 2. roots is an array of rootkeys. Test each of these keys:
          roots.forEach((root) => {
            // check rootkeys in obj:  thing.properties[root] ... a root is a key, like lightInformation or availableResources?
            // roots can be compared to a prop (IMPORTANT!)

            if (prop == root) {
              console.log("match of ", root);
              // change the property and add it with powers   --- thing.properties[root] is the level to be modified
              console.log("Adddding : ", WotBlockConfig.specialProperties); // an array of objs. one of these objs has the same name.
              var newPropToAdd = WotBlockConfig.specialProperties.filter(
                (prop) => {
                  return prop.name == root;
                }
              );
              thing.properties[root].specialConf = newPropToAdd;
              // TASK: look for the configuration. it is already there in the thing?
            }

            //if type is object, it means we have more properties to investigate:   (A root can be of type object.. it neeeds expansion)
            if (thing.properties[root].type == "object") {
              // we must expand:
              var subRoots = Object.keys(thing.properties[root].properties); // this is an object

              subRoots.forEach((subRoot) => {
                // subRoot can be compared to a prop (IMPORTANT!)

                if (prop == subRoot) {
                  var newPropToAdd = WotBlockConfig.specialProperties.filter(
                    (prop) => {
                      return prop.name == subRoot;
                    }
                  );
                  thing.properties[root].properties[
                    subRoot
                  ].specialConf = newPropToAdd;
                }

                if (
                  thing.properties[root].properties[subRoot].type == "object"
                ) {
                  var subSubRoots = Object.keys(
                    thing.properties[root].properties[subRoot].properties
                  ); // this is an object
                  // subSubRoots must be compared to a prop (IMPORTANT!)
                  console.log(subSubRoots);

                  subSubRoots.forEach((subSubRoot) => {
                    if (prop == subSubRoot) {
                      var newPropToAdd = WotBlockConfig.specialProperties.filter(
                        (prop) => {
                          return prop.name == subSubRoot;
                        }
                      );
                      thing.properties[root].properties[subRoot].properties[
                        subSubRoot
                      ].specialConf = newPropToAdd;
                    }
                  });
                }
              });
            }
          });
        });
      }

      thing.t_id = this.thingId; // test if nothing happens if removed.
      thing.hasThingConfiguration =
        WotBlockConfig !== undefined && WotBlockConfig !== null;
      thing.ThingConfiguration = WotBlockConfig;
      thing.specialPropertiesNames = specialPropertiesNames;

      this.thing = thing;
      this.checkAvailability();
      //this.thingsToConsume.push(thing); // TODO: this thingsToConsume array is not necessary
      this.showInteractions(thing);
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

'use strict';

/* exported ModelModule */
/* The above comment disables the JSHint warning of ModelModule being defined but not used. */

var ModelModule = (function () {
    var AbstractModel = function () {
        this.listeners = [];
    };


    _.extend(AbstractModel.prototype, {
        addListener: function (listener) {
            if (_.indexOf(this.listeners, listener) === -1) {
                this.listeners.push(listener);
            }
        },  
        notify: function (event) {
          _.each(this.listeners, function (listener) {
              listener.re_load(event);
            });
        }
    });


    var BuildingListModel = function () {
        AbstractModel.apply(this, arguments);
        this.Buildings_Set_List = [];
  
    };

    _.extend(BuildingListModel.prototype, AbstractModel.prototype, {

        initBuilding: function (buildings_val) {

                for(var i = 0; i < buildings_val.length; i++){

                  buildings_val[i].addListener(this);
                }

                this.Buildings_Set_List = buildings_val;

                this.notify({'init': this.Buildings_Set_List, 'Buildings_Set_List' : null, 'sub': null});
        },

        re_load: function (event) {

          var build_need_show = [];

          if(event.info_pass !== null){

              var info_recv = event.info_pass;

              for (var i = 0; i < this.Buildings_Set_List.length; i++) {

                if (this.Buildings_Set_List[i].name.match(info_recv) !== null) {

                    build_need_show.push(this.Buildings_Set_List[i]);
                }
              }
              this.notify({'Buildings_Set_List' : this.Buildings_Set_List, 'sub': build_need_show, 'init': null});

          } else {
             this.notify(event);
          }
        }
    });


    var BuildingModel = function (building, idx) {
        this.listeners = [];
        this.name = building.building_name;
        this.id = building.id;
        this.code = building.building_code;
        this.altNames = building.alternate_names;
        this.laititude = building.latitude;
        this.longtitude = building.longitude;
        this.has_checked = false;
        this.idx = idx;

    };

    _.extend(BuildingModel.prototype, {

      addListener: function (listener) {
        if (_.indexOf(this.listeners, listener) === -1) {
          this.listeners.push(listener);
        }
      },

      notify: function (event) {
        _.each(this.listeners, function (listener) {
          listener.re_load(event);
        });
      },

      re_load: function (event) {

          if (event.event === 'exist') {

            this.has_checked = true;

            this.notify({'building' : this, 'info_pass': null,'sub': null, 'init': null, 'action' : 'exist'});

            
          } 

          if (event.event === 'none') {

            this.has_checked = false;

            this.notify({'building' : this, 'info_pass': null,'sub': null, 'init': null, 'action': 'none'});
          }
        }

    });


    return {
        BuildingModel: BuildingModel,
        
        BuildingListModel: BuildingListModel,
    };
})();

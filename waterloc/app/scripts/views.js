'use strict';

/* exported ViewModule */
/* The above comment disables the JSHint warning of ViewModule being defined but not used. */

var ViewModule = (function () {

  var BuildingListView = function (model, ServiceUW, Build_Group_table) {
    this.model = model;
    this.model.addListener(this);
    this.ServiceUW = ServiceUW;
    this.Build_Group_table = Build_Group_table;
  };

  _.extend(BuildingListView.prototype, {

    re_load: function (event) {
        if(event.init !== null){
          for(var i = 0; i < event.init.length; i++){

            var buildingListElements = this.Build_Group_table;

            var build_group_children = document.createElement('div');
    
            build_group_children.id = event.init[i].idx;

          
            var checking_box = document.createElement('input');

            checking_box.type = 'checkbox';

          if (event.init[i].has_checked) {

            checking_box.checked = true;

            build_group_children.className = 'list-group-item Buildings_Instance_sample selected';

          } 

          if(!event.init[i].has_checked) {

            build_group_children.className = 'list-group-item Buildings_Instance_sample';

            checking_box.checked = false;
          }

          build_group_children.appendChild(checking_box);

          var current = build_group_children.innerHTML;

          build_group_children.innerHTML =  current + '<span class="buildingName" >' + event.init[i].name + '</span>';

          buildingListElements.appendChild(build_group_children);
        }
      }
      if(event.sub !== null && event.Buildings_Set_List !== null){

            if(event.Buildings_Set_List.length > 0){

              for(var j = 0; j < event.Buildings_Set_List.length; j++){

                var class_Name = document.querySelector('#' + event.Buildings_Set_List[j].idx).className;

                var lastbit = class_Name[class_Name.length - 1];

              if(lastbit !== 'n'){

                class_Name = class_Name  + ' hidden';
              }

              document.querySelector('#' + event.Buildings_Set_List[j].idx).className = class_Name;

              }
            }

          if (event.sub.length > 0) {

            for (var k = 0; k < event.sub.length; k++) {

              if(event.sub[k].has_checked){

                  document.querySelector('#' + event.sub[k].idx).className = 'list-group-item Buildings_Instance_sample selected';

              }else {

                  document.querySelector('#' + event.sub[k].idx).className = 'list-group-item Buildings_Instance_sample';
              }
          }
        }
      }
    }

  });


  var MapView = function (model, ServiceUW) {
    this.map_model_instance = model.map_model_instance;
    this.buildingListModel = model.buildingListModel;
    this.buildingListModel.addListener(this);
    this.ServiceUW = ServiceUW;
    this.mapMarkers = [];
  };

  _.extend(MapView.prototype, {


    re_load: function (event) {
      if (event.action === 'exist') {

          var latLong = new google.maps.LatLng(event.building.laititude, event.building.longtitude);
          var marker = new google.maps.Marker({ position: latLong, map: this.map_model_instance,title: event.building.name
        });

        var build_code = event.building.code;

        this.mapMarkers.push({'id': build_code, 'marker': marker});

      } 

      if (event.action === 'none') {

        var point = _.findWhere(this.mapMarkers, {id: event.building.code});

        if (point !== undefined) {

          point.marker.setMap(null);

          this.mapMarkers = _.without(this.mapMarkers, point);
        }
      }

    }
  });

  return {
    BuildingListView: BuildingListView,
    MapView: MapView
  };
})(ModelModule.BuildingModel);

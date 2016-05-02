'use strict';


(function () {
  $(document).ready(function () {

    var SeviceOfUW = new ServiceModule.ServiceUW('c5f4049ef94ed920448fb8ad4b7866c6');

    var buildingsListModel = new ModelModule.BuildingListModel();

    var buildingOnMap = document.getElementById('building_each');

    var buildingsListView = new ViewModule.BuildingListView(buildingsListModel, SeviceOfUW, buildingOnMap);

    var map_show = document.getElementById('map-canvas');

    var map_model_instance = new google.maps.Map(map_show);

    var map_instance = new ViewModule.MapView({'map_model_instance': map_model_instance,
                                          'buildingListModel': buildingsListModel}, SeviceOfUW);
    var initialAllElement = function () {


      var initialMap = function (DCResponseData) {

        var laititude = DCResponseData.latitude;
        var longtitude = DCResponseData.longitude;

        map_instance.map_model_instance.setCenter(new google.maps.LatLng(laititude, longtitude));

        map_instance.map_model_instance.setZoom(14);
      };


      var initializeBuildings = function (buildingListData) {
        var idx = 1;
        var Buildings_Set_List = [];


        _.each(buildingListData, function (building) {
          

          var current_building = new ModelModule.BuildingModel(building, 'name' + idx.toString());


          Buildings_Set_List.push(current_building);

          idx = idx + 1;

        });

        buildingsListModel.initBuilding(Buildings_Set_List);

        $('#search_input').on('keyup change', function(){

              var stringInput = '';

              _.each($(this).val(), function(letter){
                  stringInput += (letter + '.*');
              });

              var stringPattern = new RegExp(stringInput);

              buildingsListModel.re_load({info_pass: stringPattern});

          });


        $('#building_each').on('change', 'input', function() {
            var build_each = $(this).parent();
          
            var code = build_each.attr('id');
          
            var current_building = null;

            for(var k = 0; k < buildingsListModel.Buildings_Set_List.length; k++){

                if(buildingsListModel.Buildings_Set_List[k].idx === code) {

                   current_building = buildingsListModel.Buildings_Set_List[k];

                }
            }

          if ($(this).is(':checked')) {

            var class_string = document.querySelector('#' + code).className;
  
            var lastbit = class_string[class_string.length - 1];

            if(lastbit === 'n'){
             document.querySelector('#' + code).className = 'list-group-item Buildings_Instance_sample selected hidden';
            } else {
              document.querySelector('#' + code).className = 'list-group-item Buildings_Instance_sample selected';
            }

            current_building.re_load({event: 'exist', info_pass: null});
          } else {
            var class_string_2 = document.querySelector('#' + code).className;
  
            var lastbit_2 = class_string_2[class_string_2.length - 1];

            if(lastbit_2 === 'n'){
              document.querySelector('#' + code).className = 'list-group-item Buildings_Instance_sample hidden';
            } else {
              document.querySelector('#' + code).className = 'list-group-item Buildings_Instance_sample';
            }
            current_building.re_load({event:'none', info_pass: null});

          }
        });
          
      };
      map_instance.ServiceUW.getBuilding('DC', initialMap);

      buildingsListView.ServiceUW.queryBuildings(initializeBuildings);
    };

    initialAllElement();

  });
})(ModelModule, ViewModule, ServiceModule);

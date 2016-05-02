'use strict';

/* exported ServiceModule */
/* The above comment disables the JSHint warning of ServiceModule being defined but not used. */

var ServiceModule = (function () {

  // Code modifed by the homepage of al-Saffah's blog


  var Store_Builds = {};

  var ServiceUW = function (Key) {
    this.key = Key;
    this.urlPrefix = 'https://api.uwaterloo.ca/v2/';
  };


  _.extend(ServiceUW.prototype, {

    queryBuildings: function (callback) {

      if ('building_list' in Store_Builds) {

        return Store_Builds.building_list;

      } else {

        $.ajax({

          method: 'GET',

          url: this.urlPrefix + 'buildings/list.json' + '?key=' + this.key})
        .success(function (response) {

          Store_Builds.building_list = response.data;

          _.each(response.data, function(building) {

            Store_Builds[building.building_code] = building;
          });

          callback(response.data);

          return response.data;
        });
      }

    },

    getBuilding: function (buildingCode, callback) {

      if (buildingCode in Store_Builds) {

        return Store_Builds[buildingCode];

      } else {

        $.ajax({
          method: 'GET',
          url: this.urlPrefix + 'buildings/' + buildingCode + '.json' + '?key=' + this.key})

        .success(function (response) {

          Store_Builds.buildingCode = response.data;

          callback(response.data);
          
          return response;
        });
      }
    }
  });


  return {
    ServiceUW: ServiceUW
  };

})();





"use strict";var ModelModule=function(){var a=function(){this.listeners=[]};_.extend(a.prototype,{addListener:function(a){-1===_.indexOf(this.listeners,a)&&this.listeners.push(a)},notify:function(a){_.each(this.listeners,function(b){b.re_load(a)})}});var b=function(){a.apply(this,arguments),this.Buildings_Set_List=[]};_.extend(b.prototype,a.prototype,{initBuilding:function(a){for(var b=0;b<a.length;b++)a[b].addListener(this);this.Buildings_Set_List=a,this.notify({init:this.Buildings_Set_List,Buildings_Set_List:null,sub:null})},re_load:function(a){var b=[];if(null!==a.info_pass){for(var c=a.info_pass,d=0;d<this.Buildings_Set_List.length;d++)null!==this.Buildings_Set_List[d].name.match(c)&&b.push(this.Buildings_Set_List[d]);this.notify({Buildings_Set_List:this.Buildings_Set_List,sub:b,init:null})}else this.notify(a)}});var c=function(a,b){this.listeners=[],this.name=a.building_name,this.id=a.id,this.code=a.building_code,this.altNames=a.alternate_names,this.laititude=a.latitude,this.longtitude=a.longitude,this.has_checked=!1,this.idx=b};return _.extend(c.prototype,{addListener:function(a){-1===_.indexOf(this.listeners,a)&&this.listeners.push(a)},notify:function(a){_.each(this.listeners,function(b){b.re_load(a)})},re_load:function(a){"exist"===a.event&&(this.has_checked=!0,this.notify({building:this,info_pass:null,sub:null,init:null,action:"exist"})),"none"===a.event&&(this.has_checked=!1,this.notify({building:this,info_pass:null,sub:null,init:null,action:"none"}))}}),{BuildingModel:c,BuildingListModel:b}}(),ServiceModule=function(){var a={},b=function(a){this.key=a,this.urlPrefix="https://api.uwaterloo.ca/v2/"};return _.extend(b.prototype,{queryBuildings:function(b){return"building_list"in a?a.building_list:void $.ajax({method:"GET",url:this.urlPrefix+"buildings/list.json?key="+this.key}).success(function(c){return a.building_list=c.data,_.each(c.data,function(b){a[b.building_code]=b}),b(c.data),c.data})},getBuilding:function(b,c){return b in a?a[b]:void $.ajax({method:"GET",url:this.urlPrefix+"buildings/"+b+".json?key="+this.key}).success(function(b){return a.buildingCode=b.data,c(b.data),b})}}),{ServiceUW:b}}(),ViewModule=function(){var a=function(a,b,c){this.model=a,this.model.addListener(this),this.ServiceUW=b,this.Build_Group_table=c};_.extend(a.prototype,{re_load:function(a){if(null!==a.init)for(var b=0;b<a.init.length;b++){var c=this.Build_Group_table,d=document.createElement("div");d.id=a.init[b].idx;var e=document.createElement("input");e.type="checkbox",a.init[b].has_checked&&(e.checked=!0,d.className="list-group-item Buildings_Instance_sample selected"),a.init[b].has_checked||(d.className="list-group-item Buildings_Instance_sample",e.checked=!1),d.appendChild(e);var f=d.innerHTML;d.innerHTML=f+'<span class="buildingName" >'+a.init[b].name+"</span>",c.appendChild(d)}if(null!==a.sub&&null!==a.Buildings_Set_List){if(a.Buildings_Set_List.length>0)for(var g=0;g<a.Buildings_Set_List.length;g++){var h=document.querySelector("#"+a.Buildings_Set_List[g].idx).className,i=h[h.length-1];"n"!==i&&(h+=" hidden"),document.querySelector("#"+a.Buildings_Set_List[g].idx).className=h}if(a.sub.length>0)for(var j=0;j<a.sub.length;j++)a.sub[j].has_checked?document.querySelector("#"+a.sub[j].idx).className="list-group-item Buildings_Instance_sample selected":document.querySelector("#"+a.sub[j].idx).className="list-group-item Buildings_Instance_sample"}}});var b=function(a,b){this.map_model_instance=a.map_model_instance,this.buildingListModel=a.buildingListModel,this.buildingListModel.addListener(this),this.ServiceUW=b,this.mapMarkers=[]};return _.extend(b.prototype,{re_load:function(a){if("exist"===a.action){var b=new google.maps.LatLng(a.building.laititude,a.building.longtitude),c=new google.maps.Marker({position:b,map:this.map_model_instance,title:a.building.name}),d=a.building.code;this.mapMarkers.push({id:d,marker:c})}if("none"===a.action){var e=_.findWhere(this.mapMarkers,{id:a.building.code});void 0!==e&&(e.marker.setMap(null),this.mapMarkers=_.without(this.mapMarkers,e))}}}),{BuildingListView:a,MapView:b}}(ModelModule.BuildingModel);!function(){$(document).ready(function(){var a=new ServiceModule.ServiceUW("c5f4049ef94ed920448fb8ad4b7866c6"),b=new ModelModule.BuildingListModel,c=document.getElementById("building_each"),d=new ViewModule.BuildingListView(b,a,c),e=document.getElementById("map-canvas"),f=new google.maps.Map(e),g=new ViewModule.MapView({map_model_instance:f,buildingListModel:b},a),h=function(){var a=function(a){var b=a.latitude,c=a.longitude;g.map_model_instance.setCenter(new google.maps.LatLng(b,c)),g.map_model_instance.setZoom(14)},c=function(a){var c=1,d=[];_.each(a,function(a){var b=new ModelModule.BuildingModel(a,"name"+c.toString());d.push(b),c+=1}),b.initBuilding(d),$("#search_input").on("keyup change",function(){var a="";_.each($(this).val(),function(b){a+=b+".*"});var c=new RegExp(a);b.re_load({info_pass:c})}),$("#building_each").on("change","input",function(){for(var a=$(this).parent(),c=a.attr("id"),d=null,e=0;e<b.Buildings_Set_List.length;e++)b.Buildings_Set_List[e].idx===c&&(d=b.Buildings_Set_List[e]);if($(this).is(":checked")){var f=document.querySelector("#"+c).className,g=f[f.length-1];"n"===g?document.querySelector("#"+c).className="list-group-item Buildings_Instance_sample selected hidden":document.querySelector("#"+c).className="list-group-item Buildings_Instance_sample selected",d.re_load({event:"exist",info_pass:null})}else{var h=document.querySelector("#"+c).className,i=h[h.length-1];"n"===i?document.querySelector("#"+c).className="list-group-item Buildings_Instance_sample hidden":document.querySelector("#"+c).className="list-group-item Buildings_Instance_sample",d.re_load({event:"none",info_pass:null})}})};g.ServiceUW.getBuilding("DC",a),d.ServiceUW.queryBuildings(c)};h()})}(ModelModule,ViewModule,ServiceModule);
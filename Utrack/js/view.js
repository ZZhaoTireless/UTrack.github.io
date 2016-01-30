'use strict';

// Put your view code here (e.g., the graph renderering code)

///////////////////////////////////////////////
/**
*   Graph View
*/


var Graph_Draw = function(){
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;

    var width = canvas.width;
    var height = canvas.height;

    var wi_orig = width / 20;

    console.log(wi_orig);

    ctx.beginPath();
    ctx.moveTo(wi_orig,height - 350);
    ctx.fillText("Time: Hours(1-5)", wi_orig + 5, height - 370);
    ctx.fillText("Level: Unit(1-5)", wi_orig + 5, height - 355);
    ctx.fillText("5", wi_orig - 10, height - 340);
    ctx.fillText("4", wi_orig - 10, height - 280);
    ctx.fillText("3", wi_orig - 10, height - 220);
    ctx.fillText("2", wi_orig - 10, height - 160);
    ctx.fillText("1", wi_orig - 10, height - 100);
    ctx.lineTo(wi_orig, height - 50);
    ctx.lineTo(wi_orig + 500, height - 50);
    ctx.stroke();

    ctx.beginPath();
    ctx.font = "12px Verdana";
    ctx.fillText("Enery", wi_orig + 435, height - 412);
    ctx.fillText("Stress", wi_orig + 431, height - 397);
    ctx.fillText("Happiness", wi_orig + 407, height - 382);
    ctx.fillText("Duration", wi_orig + 415, height - 367);

    ctx.beginPath();
    ctx.fillStyle = '#AE0000';
    ctx.rect(wi_orig + 480, height - 420, 8, 8);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#0000C6';
    ctx.rect(wi_orig + 480, height - 405, 8, 8);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#009100';
    ctx.rect(wi_orig + 480, height - 390, 8, 8);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(wi_orig + 475, height - 370);
    ctx.lineTo(wi_orig + 495, height - 370);
    ctx.strokeStyle = '#D9B300';
    ctx.stroke();
    ctx.closePath();

}

var circle_core = [27.5 ,400];

var drawUpdate = function(GraphModel, times){

    var energy_dr = parseInt(GraphModel['ACT_DICTION'].energy);
    var happiness_dr = parseInt(GraphModel['ACT_DICTION'].happiness);
    var stress_dr = parseInt(GraphModel['ACT_DICTION'].stress);

    var duration_dr = parseInt(GraphModel['ACT_DUR_MIN']);

    var name_dr = GraphModel['ACT_TY'];

    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;

    var width = canvas.width;
    var height = canvas.height;

    var wi_orig = width / 20;

    ctx.beginPath();
    ctx.fillStyle = '#AE0000';
    ctx.rect(wi_orig + 10 + 50 * times, height - 50, 10, 0 - energy_dr * 60);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#0000C6';
    ctx.rect(wi_orig + 20 + 50 * times, height - 50, 10, 0 - stress_dr * 60);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#009100';
    ctx.rect(wi_orig + 30 + 50 * times, height - 50, 10, 0 - happiness_dr * 60);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#000000';
    ctx.fillText(name_dr, wi_orig + 10 + 50 * times, height - 35);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = '#D9B300';
    ctx.arc(wi_orig + 23 + 50 * times, height - 48 - duration_dr, 4, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(circle_core[0], circle_core[1]);
    circle_core = [wi_orig + 23 + 50 * times, height - 48 - duration_dr];
    ctx.lineTo(circle_core[0], circle_core[1]);
    ctx.strokeStyle = '#D9B300';
    ctx.lineWidth=2;
    ctx.stroke();

    ctx.closePath();

}

 var GraphView = function(graphModel, activityModel) {
    var self = this;

    this.graph_model = graphModel;
    console.log(graphModel);
    this.activity_model = activityModel;
    console.log(activityModel);


    this.collection_view_btn = document.getElementById('data_catch');
    this.statistics_view_btn = document.getElementById('stat_catch');

    this.GRA_TIL = document.getElementById('gr_til');

    this.TABLE_COLL = document.getElementById('table_sample');

    this.TABLE_STAT = document.getElementById('graph_sample');

     this.collection_view_btn.addEventListener('click', function() {
        var GRA_NAME = self.collection_view_btn.value;
            self.graph_model.selectGraph(GRA_NAME);
            self.TABLE_STAT.className = "hidden";
            self.TABLE_COLL.className = "active";
            self.GRA_TIL.innerHTML = 'Table Of Activities';
        
    });

    this.statistics_view_btn.addEventListener('click', function() {

        var GRA_NAME = self.statistics_view_btn.value;
            self.graph_model.selectGraph(GRA_NAME);
            self.TABLE_COLL.className = "hidden";
            self.TABLE_STAT.className = "active";
            self.GRA_TIL.innerHTML = 'Graph Of Activities';
        
    });

    Graph_Draw();

    var draw_times = 0;

    this.activity_model.addListener(function(eventType, eventTime, eventData) {

        if (eventType == ACTIVITY_DATA_ADDED_EVENT) {

            var row = document.getElementById('List_OBJ').getElementsByTagName('tbody')[0];

            var CEL_2 = document.createTextNode(eventData['ACT_DUR_MIN']);
            
            var CEL_1 = document.createTextNode(eventData['ACT_TY']);

            var energy_tb = document.createTextNode(eventData['ACT_DICTION'].energy);

            var stress_tb = document.createTextNode(eventData['ACT_DICTION'].stress);

            var Happiness_tb = document.createTextNode(eventData['ACT_DICTION'].happiness);

            console.log(eventData);

            update_form(row, CEL_1,CEL_2, energy_tb, stress_tb, Happiness_tb );

            console.log(eventData);

            drawUpdate(eventData, draw_times);

            draw_times += 1;

        }

    });


    function update_form(tb_row ,tb_proj, tb_time, tb_E, tb_S, tb_H){

            var update_row = tb_row.insertRow();

            var update_cell = update_row.insertCell(0);
            update_cell.appendChild(tb_proj);

            update_cell = update_row.insertCell(1);
            update_cell.appendChild(tb_time);

            update_cell = update_row.insertCell(2);
            update_cell.appendChild(tb_E);

            update_cell = update_row.insertCell(3);
            update_cell.appendChild(tb_S);

            update_cell = update_row.insertCell(4);
            update_cell.appendChild(tb_H);

    };

 }

///////////////////////////////////////////////
/**
*   Activity Collection View
*/


var ActivityCollectionView = function(model) {
    var self = this;

    this.model = model;


    self.SUMMIT_BNT = document.getElementById('INP_TO_SUMM');
    
    self.LAST_SUMM = document.getElementById('LAST_SUMMIT');

    self.SUMMIT_BNT.addEventListener('click', function() {

        show_hide();

        var ACT_TYPE = document.getElementById('activity').value;

        //console.log(ACT_TYPE);

        while(ACT_TYPE == 0) {
            var ACT_TYPE = prompt("You May Provide An Vaild Activity Below:");
        }

        var COND_DICT = {};

        COND_DICT.energy = document.getElementById('energy').value;
        COND_DICT.stress = document.getElementById('stress').value;
        COND_DICT.happiness = document.getElementById('happiness').value;

        var duration_hour = document.getElementById('Hours').value;
        
        var duration_min = document.getElementById('Mins').value;

        var minute_duration = parseInt(duration_hour) * 60 + parseInt(duration_min);

        while(minute_duration == 0){
            var minute_duration = prompt("Do You Want To Fill In Custom Time? (Minute)");
        }

        var data_point = new ActivityData(ACT_TYPE, COND_DICT, minute_duration);

        self.model.addActivityDataPoint(data_point);

    });


    function show_hide(){

        var Warning = document.getElementById('Hide_Forever');

        Warning.className = "hidden";

        var enable_gr = document.getElementById('GRA_SHOW');

        enable_gr.className = "col-md-6";

    }

    this.model.addListener(function(eventType, eventTime, eventData) {
        if (eventType == ACTIVITY_DATA_ADDED_EVENT) {

            self.LAST_SUMM.innerHTML = eventTime.toString();
        }
    });


}

///////////////////////////////////////
/**
 *  TabView  
 */

var TabView = function(model) {
    // Obtains itself   
    var self = this;

    // Stores the model
    this.model = model;

    // Available tabs and divs
    this.nav_input_tab = document.getElementById('nav-input-tab');
    this.input_div = document.getElementById('input-div');

    this.nav_analysis_tab = document.getElementById('nav-analysis-tab');
    this.analysis_div = document.getElementById('analysis-div');

    // Binds tab view with model  
    this.nav_input_tab.addEventListener('click', function() {
        model.selectTab('InputTab');
    });

    this.nav_analysis_tab.addEventListener('click', function() {
        model.selectTab('AnalysisTab');
    });

    // Binds model change with view
    this.model.addListener(function(eventType, eventTime, eventData) {
        if (eventType === TAB_SELECTED_EVENT)   {
            switch (eventData) {
                case 'InputTab':
                    self.nav_input_tab.className = "active";
                    self.nav_analysis_tab.className = "";
                    self.input_div.className = '';
                    self.analysis_div.className = 'hidden';
                    break;
                case 'AnalysisTab':
                    self.nav_analysis_tab.className = "active";
                    self.nav_input_tab.className = "";
                    self.input_div.className = 'hidden';
                    self.analysis_div.className = '';
                    break;
            }
        }
    });
}
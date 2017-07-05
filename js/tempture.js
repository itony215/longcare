<!DOCTYPE html>
<html lang="zh-Hant-TW">
<head>    
    <script src="/scripts/reports/report_method2/d3.js" charset="utf-8"></script>
    <script src="/scripts/reports/report_method2/nv.d3.js"></script>
    <script src="/scripts/reports/report_method2/lib/stream_layers.js"></script>
    <link href="/scripts/reports/report_method2/nv.d3.css" rel="stylesheet" type="text/css"> 
    
   
    <script src="/scripts/reports/tools.js"></script>
		<script src="/scripts/test1/js/data.js"></script>

    <style>
        text { font: 12px sans-serif; }
        svg { display: block; }
        
        html, body, #chart, svg
        {
            margin: 0px;
            padding: 0px;
            top: 0%;
            left: 0%;
            height: 100%;
            width: 100%;
        }
        .dashed
        {
            stroke-dasharray: 5,5;
        }
    </style>
</head>
<body class='with-3d-shadow with-transitions'>
<div id="chart">
</div>

<script> 
    //----- 

    function ParseData()
    {        
        var _day=new Date().YMD();
        var _data=getOneDayReport2('test', _day, null);
                  
        if(_data != null)
        {          
          var _date=new Date(_day);
          var _start_utc_time=Math.floor(_date.GetUTC()/1000);
          var _seconds_of_hour=3600;
          
          var _temp_value=new Array(24);
          var _humi_value=new Array(_temp_value.length);
          var _temp_tick=new Array(_temp_value.length);
          var _humi_tick=new Array(_temp_value.length);
          
          for(var i=0;i<_temp_value.length;i++)
            _temp_value[i]=_humi_value[i]=_temp_tick[i]=_humi_tick[i]=0; 
                                    
          var _root=JSON.parse(_data);
          for(var i=0; i < _root.results.length; i++)          
          {
            var _ts=_root.results[i].system_time/1000;
            var _index=Math.floor((_ts-_start_utc_time)/_seconds_of_hour);
                        
            if(_index >=0 && _index < _temp_value.length)
            {
              var _temp=_root.results[i].temp;
              if(_temp != null)
              {
                _temp_value[_index]=_temp_value[_index]+_temp;
                _temp_tick[_index]++;
              }
              
              var _humi=_root.results[i].humi;
              if(_humi != null)
              {
                _humi_value[_index]=_humi_value[_index]+_humi;
                _humi_tick[_index]++;                
              }
            }                           
          }
                    
          var _last_temp,_last_humi;
          
          var _result1=[];
          var _result2=[];
                    
          for(var i=0; i<_temp_value.length; i++)
          {            
            if(_temp_tick[i] > 0)
            {
              _last_temp=Math.floor(_temp_value[i]/_temp_tick[i]*100)/100;
              _result1.push({x: i, y: _last_temp});
            }  
            else
              _result1.push({x: i, y: 0});             
              
            if(_humi_tick[i] > 0)
            {
              _last_humi=Math.floor(_humi_value[i]/_humi_tick[i]*100)/100;
              _result2.push({x: i, y: _last_humi});
            }
            else
              _result2.push({x: i, y: 0}); 
          }
          
          localStorage.setItem("office_avg_temp", _last_temp);
          localStorage.setItem("office_avg_humi", _last_humi);
                                              
          return [
                    {
                        values: _result1,
                        key: "溫度",          
                        color: "#ff735a",
                         area: true,
                        fillOpacity: .3
                    },
                    {
                        values: _result2,
                        key: "濕度",     
                        color: "#97bbcd",
                         area: true,
                        fillOpacity: .3
                    }
                ];
        }
          
        return null;
    }
    
    function main()
    {alert("main被執行了沒?");
      var _data=ParseData();      
      if( _data != null)
      {
        var _chart;    
        
        nv.addGraph(function()
        {
            _chart = nv.models.lineChart();
            _chart.useInteractiveGuideline(true);
            _chart.showLegend(true);
            _chart.showYAxis(true);  
            _chart.showXAxis(true);
             _chart.options
                ({
                    transitionDuration: 0,
                    useInteractiveGuideline: true
                });                
                
            _chart.xAxis.axisLabel("新竹辦公室溫濕度").showMaxMin(false).axisLabelDistance(0)
            .tickFormat(function(d)
                        {
                          return ("0"+d).slice(-2)+":00";
                        });
                        
            _chart.yAxis.axisLabel("溫度/濕度");
            _chart.yAxis.staggerLabels(false);
            
            _chart.lines.forceY([0]);
            _chart.lines.padData(false);
            

            d3.select("#chart").selectAll("*").remove();
            d3.select('#chart').append('svg').datum(_data).call(_chart);
                        
            nv.utils.windowResize(_chart.update);    
            
            return _chart;   
        });
      }
    }

    $(document).ready(function(){
      main();
      window.setInterval(main, 300*1000);

    });
    
    // body.onload = function()
    // {                 
    //   main();
    //   window.setInterval(main, 300*1000);
    // }
</script>
</body>
</html>
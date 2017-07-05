//----- 
//
//-----
var _CurrentTemp=0;
var _CurrentHumi=0;
var _CurrentRainFall=0;
//-----

//----- 
//Show one day report (by 24 hours)
//----- 
function getOneDayReport2(_src, _day, _callback)
{                     
  var _data=http_get_sync("/api/getbyday?src="+_src+"&day="+_day);
        
  if(_data != null)
  {
    if(_callback != null) _callback(_data);
    return _data;
  }
       
  _callback("");
  return null;
}
//----- 
function getOneDayReport(canvas, _src, _day, _method)
{                     
  var _token=WasLogin();         
  if(_token != null)   
  {    
    var xmlHttp = new XMLHttpRequest();
    
    xmlHttp.open("GET", "/api/getbyday?src="+_src+"&day="+_day, false);
    xmlHttp.setRequestHeader("Authentication", "Bearer "+_token); 
    xmlHttp.send();
        
    ProcessOneDayRequest(canvas, xmlHttp, _day, _method);
    return true;
  }            
  else
    return false;
}
//-----
function ProcessOneDayRequest(canvas, xmlHttp, _day, _method) 
{
    if ( xmlHttp.readyState == 4 ) 
    {            
        if(xmlHttp.status == 200)
        {
            var _root = JSON.parse(xmlHttp.responseText);
            ShowOneDayData(canvas, _day, _root, _method);
        }      
        else
        {
            var _node = document.createTextNode(xmlHttp.responseText);
            document.body.appendChild(_node);
        }              
    }
}
//-----
function ShowOneDayData(canvas, _day, _root, _method) 
{
    if(_root != null)
    {
      var _date=new Date(_day);
      var _start_utc_time=Math.floor(_date.GetUTC()/1000);
      var _seconds_of_hour=3600;
      
      var _labels=new Array(24);
      var _temp_value=new Array(24);
      var _humi_value=new Array(24);
      var _temp_tick=new Array(24);
      var _humi_tick=new Array(24);
      
      for(var i=0;i<_labels.length;i++)
      {
        _labels[i]="";  
        _temp_value[i]=_humi_value[i]=_temp_tick[i]=_humi_tick[i]=0;  
      }
                  
      var _out = "";
      for(var i=0; i < _root.results.length; i++)          
      {
        var _ts=_root.results[i].system_time/1000;
        var _index=Math.floor((_ts-_start_utc_time)/_seconds_of_hour);
        if(_index >=0 && _index < _labels.length)
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
      
      for(var i=0; i<_labels.length; i++)
      {
        _labels[i]=("0"+i).slice(-2)+":00";
        
        if(_temp_tick[i] > 0)
        {
          _temp_value[i]=Math.round(_temp_value[i]*10/_temp_tick[i])/10;
          _CurrentTemp=_temp_value[i];
        }
          
        if(_humi_tick[i] > 0)
        {
          _humi_value[i]=Math.round(_humi_value[i]*10/_humi_tick[i])/10;
          _CurrentHumi=_humi_value[i];
        }          
      }
           
      ShowReport(canvas, _labels, _temp_value, _humi_value, _method);
    }
}
//----- 
//Show multiple days report (by day)
//-----      
function getDaysReport(canvas, src, _start_day, _end_day, _method)
{               
  var _token=WasLogin(); 
  if(_token != null)   
  {    
    var xmlHttp = new XMLHttpRequest(); 
    
    xmlHttp.open( "GET", "/api/getbyday?src="+src+"&day="+_start_day+"~"+_end_day, true);
    xmlHttp.setRequestHeader("Authentication", "Bearer "+_token); 
    xmlHttp.send( null );
    
    ProcessDaysRequest(canvas, xmlHttp, _start_day, _end_day, _method);
    return true;
  }            
  else
    return false;
}
function fetchpidlist(fn,failfn,pppid)
{
	
	var startday=jQuery("#thedateStart").val();
	var endday=jQuery("#thedateEnd").val();
	
	var today=new Date();
	var strchooseday="20140228";//parseDay(new Date(today.getTime()-1000*3600*24*1))
	var newq=[];
	 newq.push({"thedate":{"operate":1,"value":[strchooseday]}});
	 if(!g_issumByDay)
	 {
		 newq.push({"delivey_date":{"operate":6,"value":[startday,endday]}});
	}
	 
	 
	 if(pppid&&pppid!="*")
		{
		  	newq.push({"pid":{"operate":1,"value":pppid}});

		}else{
			 if(jQuery("#matchmode").val()=="pid")
			  {
				  	newq.push({"pid":{"operate":1,"value":jQuery("#thepid").val()}});

				}else{
					newq.push({"site_name":{"operate":1,"value":jQuery("#searchkeyword").val()}});
				}
		}
	 
	 

	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.order="desc";
			requestparams.sort="sum(promise_aclick)";
			requestparams.groupby="delivey_date,site_name,pid";
			requestparams.project="dim_adpmp_bd_activity_d";
			requestparams.fl="delivey_date,site_name,pid,sum(promise_aclick)";
		  requestparams.q=JSON.stringify(newq);
		 
			$.post("/result.jsp",requestparams,
					function (data, textStatus){	
						
						if(data.code!="1")
						{
								alert("服务器异常，请稍后再试");
								failfn();
								return ;
						}
					
						var returnresult={"pidlist":{},"promise_aclick":0};
						returnresult["pidlist_"+startday]={};
						returnresult["pidlist_"+endday]={};
						var listtmp=data.data.docs;
						for(var i=0;i<listtmp.length;i++)
						{
							var item=listtmp[i];
							if(!item["pid"]||item["pid"].length<3)
								{
								continue;
								}
							returnresult["pidlist"][item["pid"]]={"site_name":item["site_name"],"delivey_date":item["delivey_date"]};
							returnresult["promise_aclick"]+=parseFloat(item["sum(promise_aclick)"]);
							
							if(!returnresult["pidlist_"+item["delivey_date"]])
								{
								returnresult["pidlist_"+item["delivey_date"]]={};
								}
							returnresult["pidlist_"+item["delivey_date"]][item["pid"]]={"site_name":item["site_name"],"delivey_date":item["delivey_date"]};

							if(!returnresult["promise_aclick_"+item["delivey_date"]])
							{
								returnresult["promise_aclick_"+item["delivey_date"]]=0;
							}
							
						  returnresult["promise_aclick_"+item["delivey_date"]]+=parseFloat(item["sum(promise_aclick)"]);

						}

						fn(returnresult);
			
				}, "json");
	
}





function fetch_pc_hour(thedate,pidlist,fn,failfn)
{
	if(g_debug_mode)
	{
		var returnresult={"apv":[],"auv":[],"aclick":[],"spv":[],"suv":[],"sclick":[],"sclickuv":[],"lead_click":[],"lead_click_uv":[]};
		fn(returnresult);
		return ;
	}

	
	
	
	  var parsethedate=getParseThedate();
		var newq=[];
	  newq.push({"thedate":{"operate":1,"value":[thedate]}});
	  if(pidlist.length>0)
	  {
	  	newq.push({"resource_id":{"operate":6,"value":pidlist}});
	  }
	  
	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.project="rpt_adpmp_activity_pc_offline_h";
			requestparams.order="asc";
			requestparams.sort="miniute_5";
			requestparams.groupby="miniute_5";
			requestparams.fl="miniute_5,sum(apv),sum(auv),sum(aclick),sum(spv),sum(suv),sum(sclick),sum(sclick_uv),sum(lead_click),sum(lead_click_uv)";
		  requestparams.q=JSON.stringify(newq);
		 
			$.post("/result.jsp",requestparams,
					function (data, textStatus){	
						
						if(data.code!="1")
						{
								alert("服务器异常，请稍后再试");
								failfn();
								return ;
						}
					
						var returnresult={"apv":[],"auv":[],"aclick":[],"spv":[],"suv":[],"sclick":[],"sclickuv":[],"lead_click":[],"lead_click_uv":[]};
						var listtmp=data.data.docs;
						for(var i=0;i<listtmp.length;i++)
						{
							var item=listtmp[i];
							if(!item["miniute_5"]||item["miniute_5"].length!=4)
							{
								continue;
							}
							var ttts5=dayToTimestampDayHourMin(parsethedate,item["miniute_5"]);
							returnresult["apv"].push([ttts5,parseFloat(item["sum(apv)"])]);
							returnresult["auv"].push([ttts5,parseFloat(item["sum(auv)"])]);
							returnresult["aclick"].push([ttts5,parseFloat(item["sum(aclick)"])]);
							returnresult["spv"].push([ttts5,parseFloat(item["sum(spv)"])]);
							returnresult["suv"].push([ttts5,parseFloat(item["sum(suv)"])]);
							returnresult["sclick"].push([ttts5,parseFloat(item["sum(sclick)"])]);
							returnresult["sclickuv"].push([ttts5,parseFloat(item["sum(sclick_uv)"])]);
							returnresult["lead_click"].push([ttts5,parseFloat(item["sum(lead_click)"])]);
							returnresult["lead_click_uv"].push([ttts5,parseFloat(item["sum(lead_click_uv)"])]);
						}
						
						fn(returnresult);
			
				}, "json");
}

	//var returnresult={"apv":[],"auv":[],"aclick":[],"spv":[],"suv":[],"sclick":[],"sclickuv":[],"lead_click":[],"lead_click_uv":[],sum(call_client_pv),sum(call_client_uv),sum(download_client_pv),sum(download_client_uv)};


function fetch_wireless_hour(thedate,pidlist,fn,failfn)
{

	if(g_debug_mode)
	{
		var returnresult={"apv":[],"auv":[],"aclick":[],"spv":[],"suv":[],"sclick":[],"sclickuv":[],"call_client_pv":[],"call_client_uv":[],"download_client_pv":[],"download_client_uv":[]};
		if(thedate==parseDay(new Date()))
			{
				fn(returnresult);
			}else{
				fetch_realtime(thedate, pidlist, fn, failfn);

			}
		return ;
	}
	  var parsethedate=getParseThedate();
		var newq=[];
	  newq.push({"thedate":{"operate":1,"value":[thedate]}});
	  var strsource=jQuery("#source").val();
	  if(pidlist.length>0)
	  {
	  	newq.push({"resource_name":{"operate":6,"value":pidlist}});
	  }
	  
	  if(jQuery("#wireless_sub").val()!="all")
		  {
	  newq.push({"source":{"operate":1,"value":[jQuery("#wireless_sub").val()]}});
		  }
		newq.push({"channel":{"operate":1,"value":[jQuery("#channel").val()]}});
	  
	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.project="rpt_adpmp_activity_wireless_offline_h";
			requestparams.order="asc";
			requestparams.sort="miniute_5";
			requestparams.groupby="miniute_5";
			requestparams.fl="miniute_5,sum(apv),sum(auv),sum(aclick),sum(spv),sum(suv),sum(sclick),sum(sclickuv),sum(call_client_pv),sum(call_client_uv),sum(download_client_pv),sum(download_client_uv)";
		  requestparams.q=JSON.stringify(newq);
		 
			$.post("/result.jsp",requestparams,
					function (data, textStatus){	
						
						if(data.code!="1")
						{
								alert("服务器异常，请稍后再试");
								failfn();
								return ;
						}
					
						var returnresult={"apv":[],"auv":[],"aclick":[],"spv":[],"suv":[],"sclick":[],"sclickuv":[],"call_client_pv":[],"call_client_uv":[],"download_client_pv":[],"download_client_uv":[]};
						var listtmp=data.data.docs;
						for(var i=0;i<listtmp.length;i++)
						{
							var item=listtmp[i];
							if(!item["miniute_5"]||item["miniute_5"].length!=4)
							{
								continue;
							}
							var ttts5=dayToTimestampDayHourMin(parsethedate,item["miniute_5"]);
							returnresult["apv"].push([ttts5,parseFloat(item["sum(apv)"])]);
							returnresult["auv"].push([ttts5,parseFloat(item["sum(auv)"])]);
							returnresult["aclick"].push([ttts5,parseFloat(item["sum(aclick)"])]);
							returnresult["spv"].push([ttts5,parseFloat(item["sum(spv)"])]);
							returnresult["suv"].push([ttts5,parseFloat(item["sum(suv)"])]);
							returnresult["sclick"].push([ttts5,parseFloat(item["sum(sclick)"])]);
							returnresult["sclickuv"].push([ttts5,parseFloat(item["sum(sclickuv)"])]);
							returnresult["call_client_pv"].push([ttts5,parseFloat(item["sum(call_client_pv)"])]);
							returnresult["call_client_uv"].push([ttts5,parseFloat(item["sum(call_client_uv)"])]);
							returnresult["download_client_pv"].push([ttts5,parseFloat(item["sum(download_client_pv)"])]);
							returnresult["download_client_uv"].push([ttts5,parseFloat(item["sum(download_client_uv)"])]);
						}
						
						fn(returnresult);
			
				}, "json");
}










function fetch_pc_hour_day2(thedate,pidlist,fn,failfn)
{

	  var parsethedate=getParseThedate();
		var newq=[];
	  newq.push({"thedate":{"operate":9,"value":[jQuery("#thedateStart").val(),jQuery("#thedateEnd").val()]}});
	  if(pidlist.length>0)
	  {
	  	newq.push({"resource_id":{"operate":6,"value":pidlist}});
	  }
	  
	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.project="rpt_adpmp_activity_pc_offline_h";
			requestparams.order="asc";
			requestparams.sort="thedate";
			requestparams.groupby="thedate";
			requestparams.fl="thedate,sum(apv),sum(auv),sum(aclick),sum(spv),sum(suv),sum(sclick),sum(sclick_uv),sum(lead_click),sum(lead_click_uv)";
		  requestparams.q=JSON.stringify(newq);
		 
			$.post("/result.jsp",requestparams,
					function (data, textStatus){	
						
						if(data.code!="1")
						{
								alert("服务器异常，请稍后再试");
								failfn();
								return ;
						}
					
						var returnresult={"apv":[],"auv":[],"aclick":[],"spv":[],"suv":[],"sclick":[],"sclickuv":[],"lead_click":[],"lead_click_uv":[]};
						var listtmp=data.data.docs;
						for(var i=0;i<listtmp.length;i++)
						{
							var item=listtmp[i];
							var ttts5=dayToTimestampDayHourMin(item["thedate"],"0000");
							returnresult["apv"].push([ttts5,parseFloat(item["sum(apv)"])]);
							returnresult["auv"].push([ttts5,parseFloat(item["sum(auv)"])]);
							returnresult["aclick"].push([ttts5,parseFloat(item["sum(aclick)"])]);
							returnresult["spv"].push([ttts5,parseFloat(item["sum(spv)"])]);
							returnresult["suv"].push([ttts5,parseFloat(item["sum(suv)"])]);
							returnresult["sclick"].push([ttts5,parseFloat(item["sum(sclick)"])]);
							returnresult["sclickuv"].push([ttts5,parseFloat(item["sum(sclick_uv)"])]);
							returnresult["lead_click"].push([ttts5,parseFloat(item["sum(lead_click)"])]);
							returnresult["lead_click_uv"].push([ttts5,parseFloat(item["sum(lead_click_uv)"])]);
						}
						
						fn(returnresult);
			
				}, "json");
}




function fetch_pc_hour_day(thedate,pidlist,fn,failfn)
{

	  var parsethedate=getParseThedate();
		var newq=[];
	  newq.push({"thedate":{"operate":9,"value":[jQuery("#thedateStart").val(),jQuery("#thedateEnd").val()]}});
	  if(pidlist.length>0)
	  {
	  	newq.push({"resource_id":{"operate":6,"value":pidlist}});
	  }
	  
//		requestparams.fl="thedate,site_id,site_name,resource_id,resource_name,pidsize,is_js,apv,auv,aclick,estimate_auv,estimate_auv_rate,promise_aclick,promise_aclick_rate,
//	  spv,suv,sclick,sclick_uv,lead_click,lead_click_uv,pc_gmv_cnt,pc_gmv_amt,pc_alipay_cnt,pc_alipay_amt,wireless_gmv_cnt,wireless_gmv_amt,wireless_alipay_cnt,wireless_alipay_amt";

	  
	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.project="rpt_adpmp_activity_pc_offline_d";
			requestparams.order="asc";
			requestparams.sort="thedate";
			requestparams.groupby="thedate";
			requestparams.fl="thedate,sum(apv),sum(auv),sum(aclick),sum(spv),sum(suv),sum(sclick),sum(sclick_uv),sum(lead_click),sum(lead_click_uv)";
		  requestparams.q=JSON.stringify(newq);
		 
			$.post("/result.jsp",requestparams,
					function (data, textStatus){	
						
						if(data.code!="1")
						{
								alert("服务器异常，请稍后再试");
								failfn();
								return ;
						}
					
						var returnresult={"apv":[],"auv":[],"aclick":[],"spv":[],"suv":[],"sclick":[],"sclickuv":[],"lead_click":[],"lead_click_uv":[]};
						var listtmp=data.data.docs;
						for(var i=0;i<listtmp.length;i++)
						{
							var item=listtmp[i];
							var ttts5=dayToTimestampDayHourMin(item["thedate"],"0000");
							returnresult["apv"].push([ttts5,parseFloat(item["sum(apv)"])]);
							returnresult["auv"].push([ttts5,parseFloat(item["sum(auv)"])]);
							returnresult["aclick"].push([ttts5,parseFloat(item["sum(aclick)"])]);
							returnresult["spv"].push([ttts5,parseFloat(item["sum(spv)"])]);
							returnresult["suv"].push([ttts5,parseFloat(item["sum(suv)"])]);
							returnresult["sclick"].push([ttts5,parseFloat(item["sum(sclick)"])]);
							returnresult["sclickuv"].push([ttts5,parseFloat(item["sum(sclick_uv)"])]);
							returnresult["lead_click"].push([ttts5,parseFloat(item["sum(lead_click)"])]);
							returnresult["lead_click_uv"].push([ttts5,parseFloat(item["sum(lead_click_uv)"])]);
						}
						
						fn(returnresult);
			
				}, "json");
}

	//var returnresult={"apv":[],"auv":[],"aclick":[],"spv":[],"suv":[],"sclick":[],"sclickuv":[],"lead_click":[],"lead_click_uv":[],sum(call_client_pv),sum(call_client_uv),sum(download_client_pv),sum(download_client_uv)};


function fetch_wireless_hour_day2(thedate,pidlist,fn,failfn)
{

	  var parsethedate=getParseThedate();
		var newq=[];
	  newq.push({"thedate":{"operate":9,"value":[jQuery("#thedateStart").val(),jQuery("#thedateEnd").val()]}});
	  var strsource=jQuery("#source").val();
	  if(pidlist.length>0)
	  {
	  	newq.push({"resource_name":{"operate":6,"value":pidlist}});
	  }
	  if(jQuery("#wireless_sub").val()!="all")
	  {
  newq.push({"source":{"operate":1,"value":[jQuery("#wireless_sub").val()]}});
	  }
		newq.push({"channel":{"operate":1,"value":[jQuery("#channel").val()]}});
	  
	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.project="rpt_adpmp_activity_wireless_offline_h";
			requestparams.order="asc";
			requestparams.sort="thedate";
			requestparams.groupby="thedate";
			requestparams.fl="thedate,sum(apv),sum(auv),sum(aclick),sum(spv),sum(suv),sum(sclick),sum(sclickuv),sum(call_client_pv),sum(call_client_uv),sum(download_client_pv),sum(download_client_uv)";
		  requestparams.q=JSON.stringify(newq);
		 
			$.post("/result.jsp",requestparams,
					function (data, textStatus){	
						
						if(data.code!="1")
						{
								alert("服务器异常，请稍后再试");
								failfn();
								return ;
						}
					
						var returnresult={"apv":[],"auv":[],"aclick":[],"spv":[],"suv":[],"sclick":[],"sclickuv":[],"call_client_pv":[],"call_client_uv":[],"download_client_pv":[],"download_client_uv":[]};
						var listtmp=data.data.docs;
						for(var i=0;i<listtmp.length;i++)
						{
							var item=listtmp[i];
							var ttts5=dayToTimestampDayHourMin(item["thedate"],"0000");
							returnresult["apv"].push([ttts5,parseFloat(item["sum(apv)"])]);
							returnresult["auv"].push([ttts5,parseFloat(item["sum(auv)"])]);
							returnresult["aclick"].push([ttts5,parseFloat(item["sum(aclick)"])]);
							returnresult["spv"].push([ttts5,parseFloat(item["sum(spv)"])]);
							returnresult["suv"].push([ttts5,parseFloat(item["sum(suv)"])]);
							returnresult["sclick"].push([ttts5,parseFloat(item["sum(sclick)"])]);
							returnresult["sclickuv"].push([ttts5,parseFloat(item["sum(sclickuv)"])]);
							returnresult["call_client_pv"].push([ttts5,parseFloat(item["sum(call_client_pv)"])]);
							returnresult["call_client_uv"].push([ttts5,parseFloat(item["sum(call_client_uv)"])]);
							returnresult["download_client_pv"].push([ttts5,parseFloat(item["sum(download_client_pv)"])]);
							returnresult["download_client_uv"].push([ttts5,parseFloat(item["sum(download_client_uv)"])]);
						}
						
						fn(returnresult);
			
				}, "json");
}


function fetch_wireless_hour_day(thedate,pidlist,fn,failfn)
{

	//requestparams.project="rpt_adpmp_activity_wireless_offline_d";
	//requestparams.fl="apv,auv,aclick,actr,estimate_auv,estimate_auv_rate,promise_aclick,promise_aclick_rate,
	//spv,suv,sclick,sclickuv,sctr,call_client_cnt,call_client_uv,download_client_pv,download_client_uv,gmv_direct_cnt,gmv_direct_amt,alipay_direct_cnt,alipay_direct_amt";
	//thedate,sitename,resource_id,resource_name,channel,source,pidsize,isjs,channel,
	
	  var parsethedate=getParseThedate();
		var newq=[];
	  newq.push({"thedate":{"operate":9,"value":[jQuery("#thedateStart").val(),jQuery("#thedateEnd").val()]}});
	  var strsource=jQuery("#source").val();
	  if(pidlist.length>0)
	  {
	  	newq.push({"resource_id":{"operate":6,"value":pidlist}});
	  }
	  if(jQuery("#wireless_sub").val()!="all")
	  {
  newq.push({"source":{"operate":1,"value":[jQuery("#wireless_sub").val()]}});
	  }
		newq.push({"channel":{"operate":1,"value":[jQuery("#channel").val()]}});
	  
	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.project="rpt_adpmp_activity_wireless_offline_d";
			requestparams.order="asc";
			requestparams.sort="thedate";
			requestparams.groupby="thedate";
			requestparams.fl="thedate,sum(apv),sum(auv),sum(aclick),sum(spv),sum(suv),sum(sclick),sum(sclickuv),sum(call_client_cnt),sum(call_client_uv),sum(download_client_pv),sum(download_client_uv)";
		  requestparams.q=JSON.stringify(newq);
		 
			$.post("/result.jsp",requestparams,
					function (data, textStatus){	
						
						if(data.code!="1")
						{
								alert("服务器异常，请稍后再试");
								failfn();
								return ;
						}
					
						var returnresult={"apv":[],"auv":[],"aclick":[],"spv":[],"suv":[],"sclick":[],"sclickuv":[],"call_client_pv":[],"call_client_uv":[],"download_client_pv":[],"download_client_uv":[]};
						var listtmp=data.data.docs;
						for(var i=0;i<listtmp.length;i++)
						{
							var item=listtmp[i];
							var ttts5=dayToTimestampDayHourMin(item["thedate"],"0000");
							returnresult["apv"].push([ttts5,parseFloat(item["sum(apv)"])]);
							returnresult["auv"].push([ttts5,parseFloat(item["sum(auv)"])]);
							returnresult["aclick"].push([ttts5,parseFloat(item["sum(aclick)"])]);
							returnresult["spv"].push([ttts5,parseFloat(item["sum(spv)"])]);
							returnresult["suv"].push([ttts5,parseFloat(item["sum(suv)"])]);
							returnresult["sclick"].push([ttts5,parseFloat(item["sum(sclick)"])]);
							returnresult["sclickuv"].push([ttts5,parseFloat(item["sum(sclickuv)"])]);
							returnresult["call_client_pv"].push([ttts5,parseFloat(item["sum(call_client_cnt)"])]);
							returnresult["call_client_uv"].push([ttts5,parseFloat(item["sum(call_client_uv)"])]);
							returnresult["download_client_pv"].push([ttts5,parseFloat(item["sum(download_client_pv)"])]);
							returnresult["download_client_uv"].push([ttts5,parseFloat(item["sum(download_client_uv)"])]);
						}
						
						fn(returnresult);
			
				}, "json");
}


function getParseThedate() {
//	var rtn = "";
//	var parsethedate = jQuery("#thedateStart").val();
//	var parsethedateEnd = jQuery("#thedateEnd").val();
//	if (parsethedate >= parsethedateEnd) {
//		rtn = parsethedate;
//	} else {
//		rtn = getParseThedate;
//	}
//
//	return rtn;

	return parseDay(new Date());
	
}

function fetch_realtime(thedate,pidlist,fn,failfn)
{	
		
	if(g_debug_mode_realtime)
	{
		var returnresult={"spv":[],"aclick":[],"sclick":[],"call_client_pv":[]};
		fn(returnresult);
		return ;
	}
	
	  var parsethedate=getParseThedate();
		var newq=[];
	  newq.push({"thedate":{"operate":1,"value":[thedate]}});
	  var strsource=jQuery("#source").val();
	 	newq.push({"source":{"operate":1,"value":[strsource]}});
	  if(pidlist.length>0)
	  {
	  	newq.push({"media_pid":{"operate":6,"value":pidlist}});
	  }
	  

		if(strsource=="wireless") //wireless
		{
			if(jQuery("#wireless_sub").val()!="all")
			{
				newq.push({"media_name":{"operate":1,"value":[jQuery("#wireless_sub").val()]}});
			}
				newq.push({"channel":{"operate":1,"value":[jQuery("#channel").val()]}});
		}

	  
	  	var requestparams={};
			requestparams.start=0;
			requestparams.rows=10000;
			requestparams.project="rpt_adpmp_3_8_online";
			requestparams.order="asc";
			requestparams.sort="miniute_5";
			requestparams.groupby="miniute_5";
			requestparams.fl="miniute_5,sum(pv_2),sum(click_1),sum(click_2),sum(weakup)";
		  requestparams.q=JSON.stringify(newq);
		 
			$.post("/result.jsp",requestparams,
					function (data, textStatus){	
						
						if(data.code!="1")
						{
								alert("服务器异常，请稍后再试");
								failfn();
								return ;
						}
					
						var returnresult={"spv":[],"aclick":[],"sclick":[],"call_client_pv":[]};
						var listtmp=data.data.docs;
						for(var i=0;i<listtmp.length;i++)
						{
							var item=listtmp[i];
							if(!item["miniute_5"]||item["miniute_5"].length!=4)
								{
								continue;
								}
							var ttts5=dayToTimestampDayHourMin(parsethedate,item["miniute_5"]);
							returnresult["spv"].push([ttts5,parseFloat(item["sum(pv_2)"])]);
							returnresult["aclick"].push([ttts5,parseFloat(item["sum(click_1)"])]);
							returnresult["sclick"].push([ttts5,parseFloat(item["sum(click_2)"])]);
							returnresult["call_client_pv"].push([ttts5,parseFloat(item["sum(weakup)"])]);
						}
						
						fn(returnresult);
			
				}, "json");
}




function timeseries(pppid)
{
	
	if(!pppid||pppid=="*")
	{
		$("#showpidlist").empty();
		$("#showpidlist").hide();
	}

	g_result={};
	g_result_thedate={};
	
	showload();

	fetchpidlist(function(data){
		var promise_aclick=data;
		
		var pidlistobj=data["pidlist"];
		var pidlist=[];
		for(var pid in pidlistobj)
		{
			pidlist.push(pid);
		}
		
		var startday=jQuery("#thedateStart").val();
		var endday=jQuery("#thedateEnd").val();
		
		
		var pidlist_startday=[];
		var pidlist_endday=[];

		
	
		if(pidlist.length<=0)
		{
			alert("匹配不到PID，请重新查询");
			hideload();
		}
		
		if(g_issumByDay)
			{
				pidlist_startday=pidlist;
				pidlist_endday=pidlist;
			}else{
				

				var pidlistobj_startday=data["pidlist_"+startday];

				for(var pid in pidlistobj_startday)
				{
					pidlist_startday.push(pid);
				}
				
				var pidlistobj_endday=data["pidlist_"+endday];
				for(var pid in pidlistobj_endday)
				{
					pidlist_endday.push(pid);
				}
				
				if(pidlist_startday.length<=0)
				{
					alert("选择的日期["+startday+"]匹配不到PID，请重新查询");
					hideload();
					return ;
				}
				
				if(pidlist_endday.length<=0)
				{
					alert("选择的日期["+endday+"]匹配不到PID，请重新查询");
					hideload();
					return ;
				}
			}
		
		
		
		
		if(pidlist.length>5000)
		{
				alert("匹配的PID太多,超过5000了，请进一步完善匹配的关键词,以缩小范围");							
		}
		
		
		if($("#matchmode").val()=="keyword")
		{
			if(!pppid||pppid=="*")
			{
				var index=0;
				$("#showpidlist").append("<option value='*'>全部</option>");
						for(var pid in pidlistobj)
						{
							index++;
							if(index<500)
							{
									$("#showpidlist").append("<option value='"+pid+"'>"+pidlistobj[pid]["site_name"]+"@"+pid+"@"+pidlistobj[pid]["delivey_date"]+"</option>");
							}
						}
						
						$("#showpidlist").show();
			}
		}
		
		
		var strtoday=parseDay(new Date());
		
	
		
		if(jQuery("#source").val()=="pc")
		{
			
			if(g_issumByDay)
			{
				fetch_pc_hour_day(startday,pidlist_startday,function(data){
						searchData("hour_start",data,promise_aclick,startday);
				},hideload);
				searchData("realtime_start",{},promise_aclick,startday);
				searchData("realtime_end",{},promise_aclick,startday);
				searchData("hour_end",{},promise_aclick,endday);

			}else{
				fetch_pc_hour(startday,pidlist_startday,function(data){
					searchData("hour_start",data,promise_aclick,startday);
				},hideload);
				
				if(strtoday==startday)
				{
					fetch_realtime(startday,pidlist_startday,function(data){
					searchData("realtime_start",data,promise_aclick,startday);
					},hideload);
				}else{
					searchData("realtime_start",{},promise_aclick,startday);
				}
				
				fetch_pc_hour(endday,pidlist_endday,function(data){
				searchData("hour_end",data,promise_aclick,endday);
				},hideload);
			if(!g_issumByDay&&strtoday==endday)
			{
				fetch_realtime(endday,pidlist_endday,function(data){
				searchData("realtime_end",data,promise_aclick,endday);
				},hideload);
			}else{
				searchData("realtime_end",{},promise_aclick,endday);
			}
			}
		
			
			
			
			
			
			
		}else{
			
			
				if(g_issumByDay)
			{
					fetch_wireless_hour_day(startday,pidlist_startday,function(data){
					searchData("hour_start",data,promise_aclick,startday);
					},hideload);
					searchData("realtime_start",{},promise_aclick,startday);
					searchData("realtime_end",{},promise_aclick,endday);
					searchData("hour_end",{},promise_aclick,endday);

			}else{
				fetch_wireless_hour(startday,pidlist_startday,function(data){
					searchData("hour_start",data,promise_aclick,startday);
					},hideload);
				if(strtoday==startday||startday<="20140302")
				{
					fetch_realtime(startday,pidlist_startday,function(data){
						searchData("realtime_start",data,promise_aclick,startday);
					},hideload);
				}else{
					searchData("realtime_start",{},promise_aclick,startday);
				}
				
				
				fetch_wireless_hour(endday,pidlist_endday,function(data){
					searchData("hour_end",data,promise_aclick,endday);
					},hideload);
				if(strtoday==endday||endday<="20140302")
				{
					fetch_realtime(endday,pidlist_endday,function(data){
					searchData("realtime_end",data,promise_aclick,endday);
					},hideload);
				}else{
					searchData("realtime_end",{},promise_aclick,endday);
				}
			
			}
		}
		
		
		
	},hideload,pppid);
}
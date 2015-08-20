
// -------------------------------------------------------------------
// a global level month array for formating dates
// -------------------------------------------------------------------
var m_names = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");


// -------------------------------------------------------------------
///confirm deletion
// -------------------------------------------------------------------
function confirmDelete()
{
    if (confirm('Are you sure you want to delete?'))
    { 
      return true;
    }
    else
    {
      return false;
    }
}

// -------------------------------------------------------------------
///confirm action
// -------------------------------------------------------------------
function confirmGeneral(message)
{
    if (confirm(message))
    { 
      return true;
    }
    else
    {
      return false;
    }
}


//jan 2015 - originally used for ng
var num_pattern = '^-?(?:0|[1-9]\\d*)?(?:\\.[0-9]+)?$';

var r_parseFloat2_price_pref = /(?:\b|^)[^\d\s.,-]{1,3}(?=[\s.,-]*\d)/;
var r_parseFloat2_price_suf = /(\d)(?![.,]\d)\s*[^\d\s]{1,3}(?:\b|$)/; /*replace by $1*/
//check versions below {1,3} replaced by +
var r_parseFloat2_price_pref_test = /(?:\b|^)[^\d\s.,-]+(?=[\s.,-]*\d)/;
var r_parseFloat2_price_suf_test = /(\d)(?![.,]\d)\s*[^\d\s]+(?:\b|$)/;
//credit: https://gist.github.com/LeoDutra/3057153
//greater chance to return number, used for prices, european formats, etc...
function parseFloat2(_str)
{
    _str = str(_str);
    //addition by albert
    if( none(_str) ) return NaN;
    
    if(Number(_str)) return Number(_str);
    
    _str = (_str + '').trim();
    var len = _str.length;
    //first replace optional currecny pref
    _str = _str.replace( r_parseFloat2_price_pref, '');
    //allow ONLY pref or suf change, so if we managed in pref, dont do suf
    if( _str.length==len ){
        //then suff
        _str = _str.replace( r_parseFloat2_price_suf, '$1');
    }
    //if there is still left text in the sides - it's text, return here
    if( r_parseFloat2_price_pref_test.test(_str) || r_parseFloat2_price_suf_test.test(_str) ) return NaN;
    //end addition by albert

    _str = _str.replace(/[^\d,.-]/g, '');
    var sign = _str.charAt(0) === '-' ? '-' : '+'
    var minor = _str.match(/[.,](\d+)$/)
    _str = _str.replace(/[.,]\d*$/, '').replace(/\D/g, '')
    return Number(sign + _str + (minor ? '.' + minor[1] : ''))
}

//credits: http://stackoverflow.com/questions/2593637/how-to-escape-regular-expression-in-javascript
RegExp.quote = function(str) {
    return (str+'').replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
};

//smart .toString() of object
//if it lacks the toString() - get the first object property
function str(obj){
    
    obj && (typeof obj==='object') && (!obj.hasOwnProperty('toString')) && 
        ( obj = obj[get_keys(obj)[0]] );
    
    obj && ( obj=String(obj) );
    
    return obj == undefined ? '' : obj;
}

//copy
function cp(obj) {
    if(none(obj)) return obj;
    return JSON.parse(JSON.stringify(obj));
}

//clones - copies data - a good one!
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}

//get all keys from object
function get_keys(obj) {

    var keys = [], name;
    
    if( !obj ) return keys;
    
    for (name in obj) {
        if (obj.hasOwnProperty(name)) {
            keys.push(name);
        }
    }
    return keys;
}

function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

//if even return as is, else return larger even
function leven(x) {
    return (x & 1) ? x+1 : x; 
}

//credit; http://stackoverflow.com/questions/8584902/get-nearest-number-out-of-array
//jan 2014
//example arr=[1,2,4,6,9], goal = 5, return;4
//example arr=[9,6,4,2,1], goal = 5, return; this way the larger word is taken 6 - yep!
//example arr=[9,6,4,2,1], goal = 7, return; 6 this is where it doesn't work!
//but it can be used for nearest really
function nearest(arr, goal) {
    
    var closest = null;
    
    $.each(arr, function(){
      if (closest == null || Math.abs(this - goal) < Math.abs(closest - goal)) {
        closest = this;
      }
    });
    
    return Number(closest);
}

//jan 2014
//example arr=[1,2,4,6,9], goal = 5, return 6
//example arr=[9,6,4,2,1], goal = 5, return 6
//example arr=[9,6,4,2,1], goal = 7, return 9
//gets the larger number out of an array set
function larger(_arr, goal) {
    if( !_arr || !_arr.length || ne(goal) ) return;
    var arr = _arr.slice(); // prevent source array modification
    if( arr.indexOf(goal)>-1 ) return goal;
    arr.push(goal);
    //sort numeric asc
    arr.sort( function(a,b){return a-b} );
    var index = arr.indexOf(goal);
    
    return (index<arr.length-1) ? arr[index+1] : arr[index];
}

//credit: http://stackoverflow.com/questions/4338963/convert-html-character-entities-back-to-regular-text-using-javascript
String.prototype.decodeHTML = function() {
    var map = {"gt":">" /* , … */};
    return this.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z]+);?/gi, function($0, $1) {
        if ($1[0] === "#") {
            return String.fromCharCode($1[1].toLowerCase() === "x" ? parseInt($1.substr(2), 16)  : parseInt($1.substr(1), 10));
        } else {
            return map.hasOwnProperty($1) ? map[$1] : $0;
        }
    });
};

function get_debugobj() {
    return document.getElementById('debug');
}

//alias for currency_hex2html
function curr_sign( curreny_hex ) {
    return currency_hex2html( curreny_hex );
}

// -------------------------------------------------------------------
// get currency from curreny hex, example 
// 6B,72 = &#x6B;&#x72; = kr
// 00A3	 = &#x00A3; = £
// -------------------------------------------------------------------
function currency_hex2html( curreny_hex ) {

    if( ne(curreny_hex) ) return curreny_hex;
    
    return '&#x' + curreny_hex.replace(/xxCMxx|,/gi,";&#x") + ';';
}

// -------------------------------------------------------------------
// log to browser console if present and the global flag [is_logif] is set true - use for debug
// -------------------------------------------------------------------
//feb 2015 - cross domain issue
var is_logif = false;
try{
    is_logif = (typeof document !== 'undefined') && bool(qry('logif', parent.location.href )); /*set to true to logif*/
}
catch(ex){ 
    is_logif = false;
}
function logif(msg) {
    if(!is_logif) return;
    log(msg);
}

// -------------------------------------------------------------------
// log to browser console if present
// -------------------------------------------------------------------
function log(msg) {

    if(console && console.log){
        console.log(msg);
    }
}

function dbg(msg) {

    if(console && console.debug){
        console.debug(msg);
    }
    else {
        log(msg);
    }
}

// -------------------------------------------------------------------
// dump (print to htmlelement in doc)
// -------------------------------------------------------------------
function dump(msg) {

    var dbg;
    
    if( (dbg=get_debugobj()) ) {
        dbg.value+=msg+"\n";
    }
}

//requires jquery - enables or disables jq selection
//val - if ommited or false - disables jq selection
function de(jq_obj,val) {
    
    if( ne(jq_obj) || !jq_obj.length ) return;
    
    var b = bool(val);
    //disable
    if(!b){
        jq_obj.attr('disabled', 'disabled' );
    }
    //enable
    else{
        jq_obj.removeAttr('disabled');
    }
}

// -------------------------------------------------------------------
// ne (string is null or empty) - returns 1 if val is null or ''
// -------------------------------------------------------------------
function ne(val) {
    
    var ret = !(val!=null && ( val=='0' || val!=''));
    return ret;
}

// -------------------------------------------------------------------
// none ne(), not 0 and not NaN, undefined, etc...
// -------------------------------------------------------------------
function none(val) {
    
    return ne(val) || (Number(val)!=0 && !val);
}

function bool(_value) {
    //cast to number if val is int - js requires it 0 and '0' is not the same!
	if(is_int(_value)) _value = Number(_value);
	//set val to bool
    //dump('field_checkbox.prototype.init._value: ' + [_value, Boolean(_value)]);	
	return (_value && !ne(_value) && String(_value).toLowerCase()!='false') ? true : false ;
}

//credits http://werxltd.com/wp/2010/05/13/javascript-implementation-of-javas-string-hashcode-method/
String.prototype.get_hashCode = function(){
	var hash = 0;
	if (this.length == 0) return hash;
	for (i = 0; i < this.length; i++) {
		char = this.charCodeAt(i);
		hash = ((hash<<5)-hash)+char;
		hash = hash & hash; // Convert to 32bit integer
	}
	return hash;
}

function format( x,sep/*optional*/ ){
    return format_num_thousand( x,sep );
}

//formats 1000 to 1,000 or 1000.433454 to 1,000.433454
//could change separator optionally
function format_num_thousand(x,sep/*optional*/) {
    
    if(ne(x)) return 0;
    if(ne(sep)) sep = ','
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    return parts.join(".");
}

//credits: http://stackoverflow.com/questions/2974626/how-to-set-equal-width-on-divs-with-javascript 
//http://stackoverflow.com/users/214029/patad
function equal_width(arr/*jq selection*/) {
    
    var widest = 0, thisWidth = 0;

    setEqWidth = function(elem) {
        widest = 0;
        elem.each(function() {
            thisWidth = $(this).outerWidth();

            if (thisWidth > widest) {
                widest = thisWidth;
            }
        });

        elem.css({ 'width': widest });
    }
    
    setEqWidth(arr);
}

// -------------------------------------------------------------------
// is_int - checks if val is Int32. null or '' is not Int32
// -------------------------------------------------------------------
function is_int(val) {
    return !ne(val) && !num_int32(String(val));
}

//no-wrap
function  num_int32(val) {	
    
    if(ne(val)) return 0;
    
    var has_err = 0;    
    var regexp, expr;
    var limit = 2147483647;/*limit not precisly as in .net*/
       
    expr = "^-?(?:[1-9]\\d*|0)$";
    regexp = new RegExp(expr,"gi");
        
    if(!ne(val) && (val.match(/^-0$/g) || !val.match(regexp)) ) { 
        has_err = 1;/*general error*/
    }
    else if(val<-limit) {
        has_err = 'lower limit: ' + String(-limit);
    }
    else if(val>limit) {
        has_err = 'upper limit: ' + String(limit);
    }
    
    return has_err;
};

// -------------------------------------------------------------------
// is_dec - checks if val is Decimal. null or '' is not Decimal
// -------------------------------------------------------------------
function is_dec(val) {
    return !ne(val) && !num_decimal(val);
}

//no-wrap
function num_decimal(val) {	
    
    if(ne(val)) return 0;
    
    var has_err = 0;    
    var regexp, expr;
    var limit = 79228162514264337593543950335;
       
    expr = "^-?(?:0|[1-9]\\d*)?(?:\\.[0-9]+)?$";
    regexp = new RegExp(expr,"gi");
    
    //don't accept -0(.000)?
    if(!ne(val) && (val.match(/^-0(?:\.0*)?$/g) || !val.match(regexp)) ) { 
        has_err = 1;/*general error*/
    }
    else if(val<-limit) {
        has_err = 'lower limit: ' + String(-limit);
    }
    else if(val>limit) {
        has_err = 'upper limit: ' + String(limit);
    }
    
    return has_err;
};

// -------------------------------------------------------------------
// round - a round with decimal places
// !the build in parseFloat and parseInt will parse also '40 briks'???
// -------------------------------------------------------------------
function round(val, dec) {    
    
    if(val==null || isNaN(parseFloat(val))) return;
    
    if(dec==null || isNaN(parseInt(dec))) dec = 0;
    
    var po = Math.pow(10,dec);
    
    return Math.round(val * po)/po;
}

// -------------------------------------------------------------------
// random
// -------------------------------------------------------------------
function random(min, max) {        
    
    if(ne(max)) { 
        max = min;
        min = 0;        
    }
    
    return Math.floor(Math.random()*max+min);
}

// -------------------------------------------------------------------
// add commas to numbers. example: 1000 > 1,000
// -------------------------------------------------------------------
function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}
// -------------------------------------------------------------------
// get html &nbsp; or ' ' by count
// -------------------------------------------------------------------
function get_whitespace(count, is_space)
{
    var ret = '';
    for(var i = 0; i<count; ++i)
    {
        ret+= (is_space) ? ' ' : "&nbsp;";
    }
    
    return ret;
}

//gtin, ean
//credits for zeros: http://stackoverflow.com/questions/1295584/most-efficient-way-to-create-a-zero-filled-javascript-array
function barcode(str, chars_count /*int*/ ){

    if(none(chars_count)) chars_count=13;
    if(none(str)) str='';
    
    var hash = Math.abs(str.get_hashCode()).toString();
    var diff = chars_count-hash.length;
    if(diff>0){
        hash = new Array(diff+1).join('0') + hash;
    }
    else if( diff<0 ){
        hash = hash.substring(chars_count-1);
    }
    
    return hash;
}

//add event
function addEvent( obj, type, fn ) {
  if ( obj.attachEvent ) {
    obj['e'+type+fn] = fn;
    obj[type+fn] = function(){obj['e'+type+fn]( window.event );}
    obj.attachEvent( 'on'+type, obj[type+fn] );
    
  } else {
        obj.addEventListener( type, fn, false );
  }
    
}
//remove event
function removeEvent( obj, type, fn ) {  
  if ( obj.detachEvent ) {
    try {
        obj.detachEvent( 'on'+type, obj[type+fn] );
    }
    catch(ex) {
        obj.detachEvent( 'on'+type, null );        
    }
    
    obj[type+fn] = null;
    
  } else
    obj.removeEventListener( type, fn, false );
}

//is internet explorer
function is_ie() {    
    var browser=navigator.appName;        
    return browser.toLowerCase().indexOf("explorer")>-1;
}

//is internet explorer > 6
function is_ie_gt6() {    
    var browser=navigator.appName;    
    return browser.toLowerCase().indexOf("explorer")>-1 && getInternetExplorerVersion()>=7;
}

function is_ff() {    
    var browser=navigator.userAgent;        
    return browser && browser.toLowerCase().indexOf("firefox")>-1;
}

function is_chrome() {    
    var browser=navigator.userAgent;        
    //dump([browser,navigator,navigator.userAgent]);
    return browser && browser.toLowerCase().indexOf("chrome")>-1;
}

//crosbrowser hack
function hack_cb(standard,ie,iegt6,ff) {    
    
    var ret = '';
    
    //ff
    if( !ne(ff) && is_ff() ) {
        ret = ff;
    }
    //ff, chr, saf...
    else if( !ne(standard) && !is_ie() ) {
        ret = standard;
    }    
    //ie>6 set
    else if( !ne(iegt6) && is_ie_gt6() ) {
        ret = iegt6;
    }    
    //ie
    else if( !ne(ie) && is_ie() ) {
        ret = ie;
    }
    
    return ret;
}

function getInternetExplorerVersion()
{
  var rv = -1; // Return value assumes failure.
  
  var ua = navigator.userAgent;
  var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null) {
      rv = parseFloat( RegExp.$1 );
    }
    
  //dump("ie: " + rv);
      
  return rv;
}

//there should be a generic/regular html input element with id 'hdn_ctrl_statuses'
//if it's value is false - get a confirmation
//else return true
//this js is used for ctrl_statuses
function checkStatus(message)
{
    var el = document.getElementById('hdn_ctrl_statuses');
    
    if(el==null) return true;    
        
    if(el.value.toLowerCase()=="false")
    {
        return confirmGeneral(message);
    }
    else
    {
        return true;
    }
}


// -------------------------------------------------------------------
// add bookmark
// -------------------------------------------------------------------
function addbookmark(url,title)
{
    if (window.sidebar) { // Mozilla Firefox Bookmark
	    window.sidebar.addPanel(title, url,"");
    } else if( window.external ) { // IE Favorite
	    window.external.AddFavorite( url, title); }
    else if(window.opera && window.print) { // Opera Hotlist
	    return true; }
}

function fucuson(id){
    var o = document.getElementById(id);
    
    if(o) { 
        o.focus();
        o.select();
    }
}

// -------------------------------------------------------------------
//popup
// -------------------------------------------------------------------
function openWin(url,title,attrib) 
{
	var myRef = window.open(url,title,attrib);	
	myRef.focus();
}

//closes a previously opened pop up - todo - check if there is a better way to do that - by somehow getting a ref to an open win
//instead of getting the ref by first opening the win
function close_win(url,title) 
{
	var obj = window.open(url,title,null);	
	obj.close();
}

// -------------------------------------------------------------------
//popup
// -------------------------------------------------------------------
function openPopUp(jobRunID)
{
    openInnewWindow('CheckJobStatus.aspx?jobRunID='+jobRunID+'',600,400,0,10,10,'Check Status');
}


// -------------------------------------------------------------------
//pop up
// -------------------------------------------------------------------
function openInnewWindow(url,width,height,toolbar,top,left,title)
{
	if(toolbar==1)
	{
	    openWin(url,title,'toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width='+width+',height='+height +',top=' + top + ',left=' + left);
	}
	else {
	    openWin(url,title,'toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=no,movable=yes,resizable=yes,width='+width+',height='+height  +',top=' + top + ',left=' + left);
	}
}

//get url without querystrings
function get_url_noqrystr(url){
    
    if(ne(url)) url = location.href;
    
    var url_parts = url.split('?');
    return (url_parts!=null) ? url_parts[0] : url;
}

// --------------------------------------------------------------------
//js qry string
// --------------------------------------------------------------------
function QueryString(param){
	var loca = document.location.href;
	if(loca.indexOf('?' + param + '=')>-1 || loca.indexOf('&' + param + '=')>-1){
		var qString = loca.split('?');
		var keyVal = qString[1].split('&');
		for(var i=0;i<keyVal.length;i++){
			if(keyVal[i].indexOf(param + '=')==0){
				var val = keyVal[i].split('=');
				return val[1];
			}
		}
		return false;
	}else{
		return false;
	}
}

// --------------------------------------------------------------------
//js qry string - oct 2013 - in order not to take risks of changing the above, a new shortname version made, which returns null in case the qrystring key is missing
// --------------------------------------------------------------------
function qry(param, url /*expected in the form of &a=1&b=2...*/){
	
	if(url && !url.match(/\?/g) )  { 
	    url = '?d=1'+ url;
	}
	
	var loca = (ne(url)) ? document.location.href : url;
	
	if(loca.indexOf('?' + param + '=')>-1 || loca.indexOf('&' + param + '=')>-1){
		var qString = loca.split('?');
		var keyVal = qString[1].split('&');
		for(var i=0;i<keyVal.length;i++){
			if(keyVal[i].indexOf(param + '=')==0){
				var val = keyVal[i].split('=');
				return val[1];
			}
		}
		return null;
	}else{
		return null;
	}
}


// -------------------------------------------------------------------
//set refresh for iframe from main page
//uses the iFrameSource function as callback
// -------------------------------------------------------------------
function iFrameSourceTimeOut(url, qryStringName, frameName)
{
	setTimeout('iFrameSource("'+url+'", "'+qryStringName+'","'+frameName+'")',1000);
}

// -------------------------------------------------------------------
//get qryString from main page and pass it to inner frame
//url - the url to be passed to inner frame (ithout the qryString)
//the qryString to be retreived from main page url
// -------------------------------------------------------------------
function iFrameSource(url, qryStringName, frameName)
{
	var qryStringValue = QueryString(qryStringName);
	var src;
	if(qryStringValue)
	{
		src = url+"?"+qryStringName+"="+qryStringValue;
		frames[frameName].location.href=src;
	}
}

// -------------------------------------------------------------------
//refresh interval
// -------------------------------------------------------------------
function iFrameRefreshInterval(frameName, refreshRate)
{
	setInterval('iFrameRefresh("'+frameName+'")',refreshRate);	
}

// -------------------------------------------------------------------
//refresh interval callback
// -------------------------------------------------------------------
function iFrameRefresh(frameName, refreshRate)
{
	var src = frames[frameName].location.href;
	frames[frameName].location.href=src;		
}

// -------------------------------------------------------------------
//checks if dropdown has values
// -------------------------------------------------------------------
function validateDDL(items)
{
	if(items>0)
		return true;
	else
		return false;	
}

// -------------------------------------------------------------------
//checks or oncheckes a group of checkboxes according to main one check status
// -------------------------------------------------------------------
function checkUncheck(checkBox)
{
	var table = document.getElementById("AdminColumnDependant1__ctl0");
	table.getElementBy	
	var checkboxs = table.getElementsByTagName('input');	
      
      for(var i = 0, inp; inp = checkboxs[i]; i++)
      {	
		if(inp.type.toLowerCase() == 'checkbox' && inp.name.indexOf("checkAll") != 0)
		{
			inp.checked = checkBox.checked;
		}
      }
}

// -------------------------------------------------------------------
//sets a href according to a field value
//the source field has it id last part like: _someID
//the target <a href has the same begining and ends with _url
//then the function sets the field url to the <a href="url"
// -------------------------------------------------------------------
function urlUpdate(urlField)
{	
	var urlFieldID = urlField.id;
	var urlFieldValue = document.getElementById(urlFieldID).value;
	
	var regex = new RegExp(/_[^_]*$/);
	var myMatch = regex.exec(urlFieldID);
	
	var urlViewID = urlFieldID.replace(myMatch, "_url"+myMatch);
	var urlViewField = document.getElementById(urlViewID);
	
	urlViewField.href = urlFieldValue;
}

// -------------------------------------------------------------------
// swapOptions(select_object,option1,option2)
//  Swap positions of two options in a select list
// -------------------------------------------------------------------
function swapOptions(obj,i,j) {
	var o = obj.options;
	var i_selected = o[i].selected;
	var j_selected = o[j].selected;
	var temp = new Option(o[i].text, o[i].value, o[i].defaultSelected, o[i].selected);
	var temp2= new Option(o[j].text, o[j].value, o[j].defaultSelected, o[j].selected);
	o[i] = temp2;
	o[j] = temp;
	o[i].selected = j_selected;
	o[j].selected = i_selected;
	}
	
// -------------------------------------------------------------------
// moveOptionUp(select_object)
//  Move selected option in a select list up one
// -------------------------------------------------------------------
function moveOptionUp(objID, isAdmin) {
    
    var obj = document.getElementById(objID);    	
    var success = false;
    
	if (!hasOptions(obj)) { return; }
	
	for (i=0; i<obj.options.length; i++) {
		if (obj.options[i].selected) {
			if (i != 0 && !obj.options[i-1].selected) {			        
			        //check if in same group
			        if(getStepGroupID(obj.options[i].value) == 
			        getStepGroupID(obj.options[i-1].value))
			        {
				        //none admin users can only change places of groups 4,5
				        if(isAdmin || 
				        (!isAdmin && (getStepGroupID(obj.options[i].value)== 5 || getStepGroupID(obj.options[i].value)== 4)))
				        {
				            swapOptions(obj,i,i-1);
				            obj.options[i-1].selected = true;
				            success = true;
				        }
				    }
				}
			}
		}
		
		return success;
	}

// -------------------------------------------------------------------
// moveOptionDown(select_object)
//  Move selected option in a select list down one
// -------------------------------------------------------------------
function moveOptionDown(objID, isAdmin) {
	
	var obj = document.getElementById(objID);
    var success = false;
	
	if (!hasOptions(obj)) { return; }
	for (i=obj.options.length-1; i>=0; i--) {
		if (obj.options[i].selected) {
			if (i != (obj.options.length-1) && ! obj.options[i+1].selected) {
		        
		        //check if in same group
		            if(getStepGroupID(obj.options[i].value) == 
		            getStepGroupID(obj.options[i+1].value))
		            {
				        //alert("is admin: " + isAdmin + " !isAdmin && getStepGroupID(obj.options[i].value)== 5):" + (!isAdmin && getStepGroupID(obj.options[i].value)== 5));
				        
				        //none admin users can only change places of groups 4,5
				        if(isAdmin || 
				        (!isAdmin && (getStepGroupID(obj.options[i].value)== 5 || getStepGroupID(obj.options[i].value)== 4)))
				        {
				            swapOptions(obj,i,i+1);
				            obj.options[i+1].selected = true;
				            success = true;
				        }
				    }
				}
			}
		}
		
		return success;		
	}
	
// -------------------------------------------------------------------
// helper for the moveOptionDown and up
// -------------------------------------------------------------------
function getStepGroupID(str)
{
    var arr = str.split(",");
    
    return arr[0];
}	
	
// -------------------------------------------------------------------
// hasOptions(obj)
//  Utility function to determine if a select object has an options array
// -------------------------------------------------------------------
function hasOptions(obj) {
	    return (obj!=null && obj.options!=null) ;	    
    }
    
function hasOptions_byID(objID) {
	    
        var obj = document.getElementById(objID);
	    
	    return hasOptions(obj);	    
    }    
    

function Set_ListTransfer_OnLoad(objID, whatToFind, whatToFind_regex, whatToReplace)
{
   var obj = document.getElementById(objID);
   
   var regexp = new RegExp(whatToFind_regex,"gi");
   
   obj.innerHTML = 
    obj.innerHTML.replace(regexp,String(whatToFind + whatToReplace));
}

// -------------------------------------------------------------------
// 
// 
// -------------------------------------------------------------------
function Set_MinWidthCss(objID,css_regular,css_minWidth) {
	    
	    var obj = document.getElementById(objID);
	    	    
	    if (obj==null) { return; }
	    	    
	    if (hasOptions(obj) && obj.options.length<1)
	    {   
	        obj.className = css_minWidth;
	    }
	    else
	    {
	        obj.className = css_regular;	        
	    }
    }
	
// -------------------------------------------------------------------
// updateHidden
// -------------------------------------------------------------------
function updateHidden(objID, hiddenID) {
    var obj, hidden;
    
    obj = document.getElementById(objID);
    hidden = document.getElementById(hiddenID);
    
    hidden.value='';
    if (!hasOptions(obj)) { return; }
    for(i=0; i<obj.options.length; ++i){
        hidden.value+= (hidden.value=='') ? obj.options[i].value :
        ";"+obj.options[i].value;    
    }
}

function fuck(source, arguments)
{
    alert([source.innerHTML,source.getAttribute("Fuck")]);
}

// -------------------------------------------------------------------
// Generic custom validation
// -------------------------------------------------------------------
function ValidateCustom(source, arguments)
{   
    //return result
    arguments.ErrorMessage = "Test!";
    arguments.IsValid = false;        
}	

// -------------------------------------------------------------------
//  sets a textfield (hidden) to the selected value of a dropdown
// -------------------------------------------------------------------
function saveValue(obj, hiddenID)
{   
    if (!hasOptions(obj)) { return; }
    
    var hidden = document.getElementById(hiddenID);
            
    hidden.value = Get_SelectedValue(obj);
}

// -------------------------------------------------------------------
//  sets a textfield (hidden) to the selected values of a multi dropdown - csv
// -------------------------------------------------------------------
function saveValues(obj, hiddenID)
{   
    if (!hasOptions(obj)) { return; }
    
    var hidden = document.getElementById(hiddenID);
    var selectedValuesArr = Get_SelectedValues(obj);        
    var sep = ',';
    
    //sep is in pos 3    
    if(arguments.length>2)
    {
        sep = arguments[2];
    }
    
    hidden.value = '';
    
    if(selectedValuesArr == null) return;
    
    for(i=0; i<selectedValuesArr.length; ++i)
    {
        //add comma after value
        if(i>0) hidden.value+= sep;
        hidden.value+=selectedValuesArr[i];
    }
}

function Clear_SelectedValues(objID, hiddenID)
{
    var obj = document.getElementById(objID);
    
    if(!hasOptions(obj)) return;   
    
    var hidden = document.getElementById(hiddenID);
    
    if(hidden!=null)
    {
        hidden.value = '';
    }

	var arr,i,j;
	
	arr = new Array()
	
	for(i = 0, j = 0; i< obj.options.length; ++i)
    {
	    if(obj.options[i].selected)
	    {
		    arr[j++] = obj.options[i].value
		    obj.options[i].selected = false;
	    }        
    }
        
    return arr;
}
    
// -------------------------------------------------------------------
//  Function for check box - T/true or F/false
// -------------------------------------------------------------------
function saveValueCheckBox(obj, hiddenID, id)
{	    
    var hidden = document.getElementById(hiddenID);	    
    var checkBox = obj;
    hidden.value = checkBox.checked;
    hidden.value = hidden.value.replace("t","T");	    
    hidden.value = hidden.value.replace("f","F");	    	    
}

function setCheckBox(objID, value)
{	    
    var obj = document.getElementById(objID);	    
    
    if(!obj) return;
    
    obj.checked = value;
}

// -------------------------------------------------------------------
//  Enable or Disable Control Groups
// -------------------------------------------------------------------
function EnableDisableControlGroups(enableGroupIDSCSV, disableGroupIDSCSV)
{
    var enableElementsArr = enableGroupIDSCSV.split(',');
    var disableElementsArr = disableGroupIDSCSV.split(',');
    
    //enable
    for(var i = 0; i<enableElementsArr.length; ++i)
    {
       if(enableElementsArr[i]!="")
       {
           element = document.getElementById(enableElementsArr[i]);
           element.disabled = false;
       }
    }
    
    //disable
    for(var i = 0; i<disableElementsArr.length; ++i)
    {
       if(disableElementsArr[i]!="")
       {
           element = document.getElementById(disableElementsArr[i]);
           element.disabled = true;
       }
    }
}

// -------------------------------------------------------------------
//  Remove DropDownList items from a DDL according to a hidden field csv (; separated)
// -------------------------------------------------------------------
function setSelectValues(selectObjID, hiddenFieldID)
{   
    var select = document.getElementById(selectObjID);
    var hidden = document.getElementById(hiddenFieldID);
    var idArr;    
    
    
    if(select==null || select.disabled) return;
    
    idArr = hidden.value.split(";")   
        
    for(var i = 0; i< select.options.length; ++i)
    {
        if(select.options[i].value!="" && !ContainsValue(idArr, select.options[i].value))
        {
            select.remove(i);
            --i;   
        }
    }        
}

// -------------------------------------------------------------------
//  Checks if value is in Array arr
// -------------------------------------------------------------------
function ContainsValue(arr,value)
{
    for(var i = 0; i<arr.length; ++i)
    {
        if(arr[i]== value) return true;
    }
    return false;
}

// -------------------------------------------------------------------
//  Displays or hides objects
// -------------------------------------------------------------------
function ShowHide(what, vwStateHidden)
 {
    var myElement = document.getElementById(what);    
    var hidden = document.getElementById(vwStateHidden);    
    
	if(myElement==null) return false;
	
	if (myElement.style.display=='none'){		
	    myElement.style.display='';	    
	    
	    //document element
	    if(hidden!=null)
	    {
	        hidden.value = "true";	
	    }
	}
	else{
	    myElement.style.display='none';	
	    
	    //document element
	    if(hidden!=null)
	    {
	        hidden.value = "false";	
	    }
	}
	
	//alert([myElement,myElement.style.display]);
	//alert([hidden.value]);
	
	return false;
 }
 
// -------------------------------------------------------------------
//  hides objects
// -------------------------------------------------------------------
function Hide(what)
{  
    var myElement = document.getElementById(what);    

    if(myElement!=null)
    {
        myElement.style.display='none';	
    }
}

//shows obj
function Show(what)
{  
    var myElement = document.getElementById(what);    

    if(myElement!=null)
    {
        myElement.style.display='';	
    }
}
 
// -------------------------------------------------------------------
//  swaps 2 images according to the last element visibility
//  the ShowHide function is called first
// -------------------------------------------------------------------
function SwapImages(imgHolderID, src_closed, src_opened, objID)
{   
    var imgHolder = document.getElementById(imgHolderID);
    var obj = document.getElementById(objID);
    
    if(imgHolder==null || obj==null) return;
    
    //open
    if(obj.style.display!='none' && imgHolder.src.indexOf(src_closed)>-1)
    {
        imgHolder.src = imgHolder.src.replace(src_closed,src_opened);
    }
    else
    {
        imgHolder.src = imgHolder.src.replace(src_opened,src_closed);        
    }
}
 
// -------------------------------------------------------------------
// formats dates for the eworld CalendarPopUp control 
// in the following format: MMM d, yyyy or null("")
// -------------------------------------------------------------------
 function FormatDate_Old(seldate,nullable,tbID)
 {  
    var textField = document.getElementById(tbID + "_textBox");
    if(seldate=="")
    {
        textField.value = "";
        return;
    }    
    
    var date = get_CalednarPopUpDate(tbID);
    var curr_date = date.getDate();
    var curr_month = date.getMonth();
    var curr_year = date.getFullYear();
    
    textField.value = Get_FormatDate(date,"MMM d, yyyy");
 }
 
// -------------------------------------------------------------------
// clears cpp date
// -------------------------------------------------------------------
 function ClearDate(id)
 {  
    var textField = document.getElementById(id + "_textBox");    
    if(textField)
    {
        textField.value = '';
    }
    
    textField = document.getElementById(id + "_hidden");
    if(textField)
    {
        textField.value = '';
    }
    
    textField = document.getElementById(id + "_validateHidden");
    if(textField)
    {
        textField.value = '';
    }
 }
 
// -------------------------------------------------------------------
// formats dates for the eworld CalendarPopUp control 
// in the following format: MMM d, yyyy or null("")
// -------------------------------------------------------------------
 function FormatDate(seldate,nullable,tbID)
 {  
    var textField = document.getElementById(tbID + "_textBox");
    if(seldate=="")
    {
        textField.value = "";
        return;
    }    
    
    var date = get_CalednarPopUpDate(tbID);
    var curr_date = date.getDate();
    var curr_month = date.getMonth();
    var curr_year = date.getFullYear();
    
    textField.value = Get_FormatDate(date,"MMM d, yyyy");
    
    //set cookie
    //check for CookieName attr
    var seldateSpan = document.getElementById(tbID);
    var cookieNames;
    
    if(seldateSpan!=null && 
        seldateSpan.getAttribute("CookieName")!=null)
    {   
        cookieNames = seldateSpan.getAttribute("CookieName");
        
        //Set_Cookie        
        //check for isdateend attr
        if(seldateSpan.getAttribute("IsDateEnd")!=null &&
            seldateSpan.getAttribute("IsDateEnd")=='1')
        {   
            //yyyy-MM-dd - should be in standard/default format?
            //possible to set multiple cookies to same value
            SetCookies(cookieNames, Get_FormatDate(date,"yyyy-MM-dd") + 'T23:59:59');
        }
        else
        {   
            //possible to set multiple cookies to same value            
            SetCookies(cookieNames, Get_FormatDate(date,"yyyy-MM-dd") + 'T00:00:00');            
        }        
    }
 }
 
 function SetCookies(cookieNames, cookieValue)
 {
    var cookieNamesArr = cookieNames.split(";");
    
    //alert(cookieNamesArr);
    
    for(i = 0; i < cookieNamesArr.length; ++i)
    {
        //name, value, expires, path, domain, secure
        Set_Cookie( cookieNamesArr[i], cookieValue, 30, '/', '', '' );        
        
        //alert(['cookie set to:',cookieValue]);
    }
 }
 
 function FuckDate(seldate,nullable,tbID)
 {
    var seldateSpan = document.getElementById(tbID);
    alert([tbID,seldateSpan.getAttribute("Fuck")]);
 }
 
// -------------------------------------------------------------------
// formats dates by date format and returns  string 
// -------------------------------------------------------------------
function Get_FormatDate(date,format)
{
    var curr_date = date.getDate();
    var curr_month = date.getMonth();
    var curr_year = date.getFullYear();
    
    var dateStr
    
    switch(format)
    {
        case "MMM d, yyyy":
            dateStr = m_names[curr_month] + " " + curr_date + ", " + curr_year;
        break;
        
        case "yyyy/MM/dd":
            dateStr = curr_year + "/" + String(Get_2figureNumber(curr_month+1)) + "/" + Get_2figureNumber(curr_date);
        break;
        
        case "yyyy-MM-dd":
            dateStr = curr_year + "-" + String(Get_2figureNumber(curr_month+1)) + "-" + Get_2figureNumber(curr_date);
        break;
        
        default:
        break;
    }
    
    return dateStr;
}

// -------------------------------------------------------------------
// formats a number less than 10 to nn, ex: 9 = 09, 0 = 00, 10 = 10 
// -------------------------------------------------------------------
function Get_2figureNumber(i)
{
    if (i<10) 
      {i="0" + i}
      return i
}
 
// -------------------------------------------------------------------
// Gets the date from the CalednarPopUp object
// -------------------------------------------------------------------
 function get_CalednarPopUpDate(tbName){
    obj=new CalendarPopup_FindCalendar(tbName);
    var date = obj.GetDate();
    return date;    
}

// -------------------------------------------------------------------
// Sets hidden field to seldate value and calls the format function
// the hidden field is part of the calendar pop up id and is extracted by the regex
// -------------------------------------------------------------------
 function CalednarPopUp_DynamicFields(seldate,nullable,tbID){
    
    var regex = new RegExp(/.+?InnerCalendar_(.+?)_\d+$/gi);
	var hiddenID = String(tbID.replace(regex,"$1"));	
	
	var hidden = document.getElementById(hiddenID);
	
    var date = get_CalednarPopUpDate(tbID);
	
	hidden.value = Get_FormatDate(date,"yyyy-MM-dd");
	
	FormatDate(seldate,nullable,tbID);			
 }
 

function DDL_1_Changed(obj,ddl_dependentID,ddl_shortPrefix,calendar_shortPrefix,calendar_id)
{
    //seldate
    var seldate;
    
    //extract the id preffix for DDL
    var regex = new RegExp(/^(.+?_)\d+$/gi);    
    
    //extract the long ddl preffix
    var ddl_prefix = String(obj.id.replace(regex,"$1"));
    
    //extract the container prefix
    var container_prefix = ddl_prefix.replace(ddl_shortPrefix,"");
    
    //create the calendar id
    var calendar_longID = container_prefix + calendar_shortPrefix + calendar_id;    
    
    /////references///////
    //get reference to the dependent DDL
    var ddl2 = document.getElementById(ddl_prefix + ddl_dependentID);
    
    //get reference to calendar
    var calendar = document.getElementById(calendar_longID);    
    
    seldate = (Number(Get_SelectedValue(obj))>0) ? "" : "1/1/2007";    
    
    if(seldate!="")
    {
        //get calendar object
        var calendarObj = new CalendarPopup_FindCalendar(calendar_longID);
        calendarObj.SelectDate(new Date(2007,1,1));
    }
    
    CalednarPopUp_DynamicFields(seldate,true,calendar.id);    
    
    /////end references///////
    
    Hide_SelectItems_Smaller(Get_SelectedValue(obj),ddl2);
}

function Get_SelectedValues(obj)
{
    if(!hasOptions(obj)) return;   

	var arr,i,j;
	
	arr = new Array()
	
	for(i = 0, j = 0; i< obj.options.length; ++i)
    {
	    if(obj.options[i].selected)
	    {
		    arr[j++] = obj.options[i].value
	    }        
    }
        
    return arr;
}

//get checked from dom group(grouped by name) 
//used curently for radio groups
function get_gselected(name/*the group name*/) {

    ret=null;
    if( ne(name) ) return ret;
    
    var nobj = document.getElementsByName(name),i=0, ret=null;
    for(;i<nobj.length;++i) {
        if(nobj[i].checked) {
            ret = nobj[i].value;
            break;
        }
    }
    
    return ret;
}

//set dom group(grouped by name) 
//used curently for radio groups
function set_gselected(name/*the group name*/,value/*the group tem to be checked*/) {
    
    if( ne(name) || ne(value) ) return;
    
    var nobj = document.getElementsByName(name),i=0;
    for(;i<nobj.length;++i) {
        if(nobj[i].value==value) {
            nobj[i].checked=1;
        }
        else {
            nobj[i].checked=0;
        }
    }    
}

function Get_SelectedValue(obj)
{
    if(!hasOptions(obj) || obj.selectedIndex<0) return;   
        
    return obj.options[obj.selectedIndex].value;
}

function Get_SelectedText(obj)
{
    if(!hasOptions(obj) || obj.selectedIndex<0) return;   
        
    return obj.options[obj.selectedIndex].text;
}

function Set_SelectedValue(obj, value)
{
    if(!hasOptions(obj)) {
        
        obj = document.getElementById(obj);
        
        if(!hasOptions(obj)) return;
    }
    
    for(var i=0; i<obj.options.length; ++i)
    {
        if(obj.options[i].value == value)
        {
             obj.options[i].selected = true;
             break;
        }
    }
}

function Hide_SelectItems_Smaller(compareInt, select)
{
    var selectedValue;
    
    if(ddl2_options == null)
    { 
        Set_ddl2_options(select);        
    }
    else
    {
        selectedValue = Get_SelectedValue(select);
        RemoveAllElements_Select(select);
        AddElements(select,ddl2_options);        
    }
    
    for(var i = 1; i< select.options.length; ++i)
    {
        if(select.options[i].value!="" && Number(select.options[i].value)<Number(compareInt))
        {
            select.remove(i);
            --i;   
        }
    }
    
    Set_SelectedValue(select,selectedValue);
}

function AddElements(obj, elements)
{
    for(var i = 0; i< elements.length; ++i)
    {   
        if( elements[i]===undefined ) continue;
        try
        {
            obj.add(elements[i],null);
        }
        catch(ex)
        {
            obj.add(elements[i]);
        }          
    }
}

function RemoveAllElements_Select(select)
{
    if(!hasOptions(select)) return;
    
    for(var i = 0; i< select.options.length; ++i)
    {   
        select.remove(i);
        --i;           
    }
}

var ddl2_options;
function Set_ddl2_options(select)
{
    ddl2_options = new Array(select.options.length);
    for(var i=0; i<select.options.length; ++i)
    {
        ddl2_options[i] = select.options[i];
    }
}

function FixHeight()
{   
    //TODO - add logic to check if ie(ie7?) 
    //and change className to a const? calculated % 
    var browser=navigator.appName;
    
    var isIE = Boolean(browser.indexOf("Explorer")>-1);
    var isIE7 = Boolean(window.XMLHttpRequest);
    var mainBody;
    
    //currently fix only ie6 and lower 100% height
    //if(isIE && !isIE7)
    if(is_ie())
    {
        mainBody = document.getElementById("mainBody");
        mainBody.className = mainBody.className + "_ie";
        //alert(mainBody.className);
    }
}

var objTimeout;
var resized = false;
function FixHeight_old()
{   
    var ieDiff = 20; //20 px diff in ie
        
    var mainTable = document.getElementById("adminMenuMain");        
    var mainTableHeight = mainTable.offsetHeight;
    var docHeight = document.documentElement.clientHeight;        
    
    var vMenuMain = document.getElementById("vMenuMain");    
    var vMenuMain_Height;
    
    if(vMenuMain!=null)
    {
        vMenuMain_Height = vMenuMain.offsetHeight;
    }
    
    var mainTD = document.getElementById("ctl00_adminMainContent");
    var mainHeight = mainTD.offsetHeight;
    
    var heightDiff = Number(docHeight - mainTableHeight);
    heightDiff = (heightDiff>0) ? heightDiff : 0;    
    
    var browser=navigator.appName;
    
    var isIE = Boolean(browser.indexOf("Explorer")>-1);
    var isIE7 = Boolean(window.XMLHttpRequest);
    
    //check if vMenuMain visible
    if(vMenuMain==null)
    {
        //height logic
        FixHeight_MainTD(mainTD,mainHeight,heightDiff,isIE,ieDiff);
        return;
    }
    
    //IE - no comment
    if(isIE)
    {           
        //add onresize event for shorter pages
        //if(heightDiff>0)
        //{
            //window.onresize = FixHeight;
        //}
        
        // case where not heigh enough tables should be resized on js postback - resize
        var boolBig = Boolean(mainHeight==vMenuMain_Height && vMenuMain.style.height!="" && heightDiff>0 && mainTD.style.height=="");
        if(mainHeight>vMenuMain_Height || boolBig)
        {   
            //alert([
            //"mainHeight td : "+mainHeight,
            //" vMenuMain_Height: " + vMenuMain_Height,
            //" heightDiff: " + heightDiff,
            //" docHeight: " + docHeight,
            //" style height: " + vMenuMain.style.height]);
            
            //setting the style height in ie actualy adds value to existing offset!
            //no comment            
            if(boolBig)
            {
                var currentStyleHeight = Number(vMenuMain.style.height.replace("px",""));
                vMenuMain.style.height = currentStyleHeight + heightDiff + "px";
                
                if(isIE7)
                {
                    mainTable.style.height = mainHeight + heightDiff + "px";
                }
            }
            else
            {
                vMenuMain.style.height = ((mainHeight + heightDiff) - (vMenuMain_Height - ieDiff)) + "px";                                                             
                if(isIE7)
                {
                    mainTable.style.height = mainHeight + heightDiff + "px";
                }
            }
        }
        else
        {   
            //alert([
            //"heightDiff: " + heightDiff,
            //"vMenuMain.style.height: " + vMenuMain.style.height,
            //"vMenuMain_Height: " + vMenuMain_Height,
            //" docHeight: " + docHeight,
            //" mainTD.style.height: " + mainTD.style.height
            //]);
            
            var bool = Boolean(vMenuMain.style.height!="" && mainTD.style.height=="");
            if(!bool && Number(docHeight)>0)
            {                
                //vMenuMain.style.height = heightDiff + "px";
                vMenuMain.style.height = 
                ((mainHeight + heightDiff) - (vMenuMain_Height - ieDiff)) + "px"
                
                if(!isIE7)
                {
                    mainTD.style.height = "10px";
                }
                else
                {
                    mainTD.style.height = 
                      Number(mainHeight + heightDiff -ieDiff) + "px";
                }
                //mainTD.style.height = vMenuMain.style.height;
                
                //mainTable.style.height = "10px";            
            }
        }
     }
     //Standard compliant
     else
     {  
        //window.onresize = FixHeight;
        vMenuMain.style.height = Number(vMenuMain_Height + heightDiff) + "px";
        mainTD.style.height = Number(mainHeight + heightDiff) + "px";        
     }
     
     clearTimeout(objTimeout); 
     objTimeout=null; 
     window.status=""; 
}

function FixHeight_MainTD(mainTD,mainHeight,heightDiff, isIE, ieDiff)
{
     ieDiff = 45;
     
     //set main td height
     //alert(["mainTD.style.height: " + mainTD.style.height,
     //" mainHeight: " + mainHeight,
     //" heightDiff" + heightDiff]);
     
     if(!isIE)
     {
          if(heightDiff>0)
          {
            mainTD.style.height = Number(mainHeight + heightDiff) + "px";         
          }
     }
     else
     {
        if(mainTD.style.height=="" && heightDiff>0)
         {
            mainTD.style.height = Number(mainHeight + heightDiff -ieDiff) + "px";
         }     
     }
     
     clearTimeout(objTimeout); 
     objTimeout=null; 
     window.status="";
}

function resize_document() 
{
    if (objTimeout) { //ignore multiple resize requests to avoid infinite loop
        window.status="Please wait while the document is resized...";
    } else {
        objTimeout = setTimeout("FixHeight()", 1);
    }
}

//window.onresize=resize_document;

//===================
var _ddl_options;

function Set_ddl_options(select)
{   
    if(select==null) return;
    
    _ddl_options = new Array(select.options.length);
    for(var i=0; i<select.options.length; ++i)
    {   
        _ddl_options[i] = select.options[i];
    }
}

function Hide_SelectItems(dependentSelectID, hiddenID, masterSelectID)
{   
    
    var select, hidden, masterSelect, selectedValue, selectedValueMaster, arr, contains;
    
    select = document.getElementById(dependentSelectID);
    masterSelect = document.getElementById(masterSelectID);
    selectedValueMaster = Get_SelectedValue(masterSelect);
    hidden = document.getElementById(hiddenID);
        
    if(_ddl_options == null)
    { 
        Set_ddl_options(select);        
    }
    else
    {
        selectedValue = Get_SelectedValue(select);
        RemoveAllElements_Select(select);
        AddElements(select,_ddl_options);        
    }
    
    //get arr from hidden and selected value
    arr = Get_DependentArray(hidden,selectedValueMaster);    
    
    for(var i = 0; i< select.options.length; ++i)
    {   
        contains = false;
        for(var x in arr)
        {   
            if(arr[x]==select.options[i].value)
            {   
                contains=true;
                break;
            }
        }
        if(!contains)
        {
            select.remove(i);
            --i;   
        }
    }
    
    Set_SelectedValue(select,selectedValue);
}

function Get_DependentArray(hidden, selectedValue)
{
    var hiddenValue = hidden.value;    
    var arr_all = hiddenValue.split("***");    
    var arr_inner;
    var arr_return;
    
    for(var group in arr_all)
    {   
        arr_inner = arr_all[group].split(";");
        if(arr_inner[0]==selectedValue)
        {   
            break;
        }
    }
    
    arr_return = arr_inner[1].split(",");
    
    return arr_return;
}

// -------------------------------------------------------------------
//get number suffix - like 1st, 2nd...
// -------------------------------------------------------------------
function getNumberSuffix(i)
{
    var d = Math.floor(1/10) % 10;
    
    switch(d) 
    {
        default:
        var d2 = i % 10;
        switch( d2 ) {
                case 1: return  i + "st";
                case 2: return i + "nd";
                case 3: return i + "rd";  
            }
            break;
        case "1":
            break;
    }
    return i + "th";
}

// -------------------------------------------------------------------
//a generic hash class
//example: var myhash = new Hash ('key1',value1,'key2',array2,'key3',hash3...); - the hash can contain a {'string',object} pairs,
//where object could be anything - single object, array, etc. the collection could be mixed 
//         var len = myhash.length,  myhash.removeItem, myhash.setItem, var val = myhash.getItem(key), myhash.hasItem(key)... see below for all
// -------------------------------------------------------------------
function Hash()
{
	this.length = 0;
	this.items = new Array();
	for (var i = 0; i < arguments.length; i += 2) {
		if (typeof(arguments[i + 1]) != 'undefined') {
			this.items[arguments[i]] = arguments[i + 1];
			this.length++;
		}
	}
   
	this.removeItem = function(in_key)
	{
		var tmp_previous;
		if (typeof(this.items[in_key]) != 'undefined') {
			this.length--;
			var tmp_previous = this.items[in_key];
			delete this.items[in_key];
		}
	   
		return tmp_previous;
	}

	this.getItem = function(in_key) {
		return this.items[in_key];
	}

	this.setItem = function(in_key, in_value)
	{
		var tmp_previous;
		if (typeof(in_value) != 'undefined') {
			if (typeof(this.items[in_key]) == 'undefined') {
				this.length++;
			}
			else {
				tmp_previous = this.items[in_key];
			}

			this.items[in_key] = in_value;
		}
	   
		return tmp_previous;
	}

	this.hasItem = function(in_key)
	{
		return typeof(this.items[in_key]) != 'undefined';
	}

	this.clear = function()
	{
		for (var i in this.items) {
			delete this.items[i];
		}

		this.length = 0;
	}
}

//this function was copied in 2 places throughout the UI project - now both places use the function below
//translate sql_simple mode to a where only line of standard sql (excluding the where word itself)
//https://app.adcore.com/demo
function rule_simple_2sql( sql_simple ) {
    
    // if the condition is empty, or some argument's value is null, return empty:
    if( !sql_simple.match(/arg\d+/ig) || sql_simple.match(/arg\d+\s+null/ig) ) return "";
    
    if( ne(sql_simple) ) return sql_simple;
    
    var r_rule_simple_where = /where\s+.+?\s*?(?=($|arg0:))/i;
    var r_rule_simple_where_placeholder = /\?/i;
    var r_rule_simple_argN = /arg\d+:?([^\r\n]*)/gi;
    
    var ret = null;
    
    var m = sql_simple.match( r_rule_simple_where );
    
    if ( !m ) return sql_simple;
    
    ret = m[0];
    //strip " from the columns/fiels names
    ret = ret.replace( /"/g, '' );
    
    //loop the ? in the where line and replace with a match from the arg: matchlist
    m = r_rule_simple_where_placeholder.exec( ret );
    var mc = sql_simple.match( r_rule_simple_argN );
    var i = 0;
    do
    {
        ret = ret.replace( '?', mc[i++].replace(/arg\d+:?/i,'') );
        m = r_rule_simple_where_placeholder.exec( ret );

    } while ( m );
    
    
    ret = ret.trim().replace(/^\s*where\s*/i,'');
    //then restore double quotes encoded in rqb_init
    ret = ret.replace(/~dq~/gi,'"');
    
    //and deal with the like
    ret = ret.replace( /like\s+N?'(.*?)'\s*\)/gi, "like N'%$1%')" );
    
    //and starts_with
    ret = ret.replace( /starts_with\s+N?'(.*?)'\s*\)/gi, "like N'$1%')" );
    
    //sep 2014 - clear the stuff marking const
    ret = ret.replace( /(N'#|#')/gi, '' );
    
    return ret;
};

// validate user id has a value.
    angular.module('adcore.filter', []).filter('html', ['$sce', function ($sce) { 
        return function (text) {
            if(isNaN(text))
                return $sce.trustAsHtml(text);
            else
                return $sce.trustAsHtml('<span>' + text +'</span>');
        };    
    }]).filter('startFrom', function() {
        return function(input, start) {
            start = +start; //parse to int
            return input.slice(start);
        }
    }).filter('costumSearch', function() {
        return function(_array, value, cloumns) {
            // cloumns is array of keys to look in _array
            // value is what u looking for
            if(value == null || value == '')
                return _array;
            
            if(cloumns == null || cloumns.length <= 0)
                return [];
                    
            var newArray = [];
            var isResult = false;
            var row = {};
            
            //console.log('costumSearch', value, cloumns);
            for(var j=0; j<_array.length; j++){
                row = _array[j];
                isResult = false;
                for(var i=0; i<cloumns.length; i++)
                {
                    if(row[cloumns[i]] && row[cloumns[i]].toString().toLowerCase().indexOf(value.toLowerCase()) > -1){
                        isResult = true;
                        break;
                    }
                }    
                if(isResult)
                   newArray.push(row);
            }
         
            return newArray;
        }
    }).filter('FormulasTypeFilter', function() {
        return function(_array, value) {
            // console.log('FormulasTypeFilter', _array, value)
            // cloumns is array of keys to look in _array
            // value is what u looking for
            if(value == null || value == '')
                return _array;
            // filter    
            var newArray = [];
            angular.forEach(_array, function(row) {
                if(row.allowedTypes.indexOf(value) > -1)
                    newArray.push(row);
            }); 
            
            return newArray;
        }
    }).filter('FilterForFormula', function() {
        return function(_array, value) {
            //console.log('FilterForFormula', _array, value)
            // cloumns is array of keys to look in _array
            // value is what u looking for
            if(value == null || value == '')
                return _array;
            // filter    
            var newArray = [];
            angular.forEach(_array, function(row) {
                if(row.allowedTypes.indexOf(value) > -1 && row.isFormulaSupport == true)
                    newArray.push(row);
            }); 
            
            return newArray;
        }
    }).filter('htmlToPlaintext', function() {
        return function(text) {
          return String(text).replace(/<[^>]+>/gm, '');
        }
     }).filter("toArray", function(){
        return function(obj) {
            var result = [];
            angular.forEach(obj, function(val, key) {
                result.push({ _key: key, _val: val});
            });
            return result;
        };
    });
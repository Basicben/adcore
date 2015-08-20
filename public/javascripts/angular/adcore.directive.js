angular.module('adcore.directive', []).directive('dynamic', function ($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function (scope, ele, attrs) {
            //scope.$watch(attrs.dynamic, function(html) {
            
            ele.html(attrs.dynamic);
            if (attrs.dynamic.indexOf('ng-') > 0)
                $compile(ele.contents())(scope);
          //});
        }
    };
}).directive('dynamicFunction', function ($compile, $parse) {
    return {
        restrict: 'AE',
        link: function (scope, ele, attrs) {
            scope.$watch(attrs.value, function (n) {
                var html = scope.$eval(attrs.func);
                ele.html(html);
                if (html.indexOf('ng-') > 0)
                    $compile(ele.contents())(scope);
            });
            
        }
    };
}).directive('switch', function () {
    return {
        restrict: 'AE'
        , replace: true
        , transclude: true
        , template: function (element, attrs) {
            var html = '';
            html += '<span';
            html += ' class="switch' + (attrs.class ? ' ' + attrs.class : '') + '"';
            html += attrs.ngModel ? ' ng-click="' + attrs.ngModel + '=!' + attrs.ngModel + (attrs.ngChange ? '; ' + attrs.ngChange + '"' : '"') : '';
            html += ' ng-class="{ checked:' + attrs.ngModel + ' }"';
            html += '>';
            html += '<small></small>';
            html += '<input type="checkbox"';
            html += attrs.id ? ' id="' + attrs.id + '"' : '';
            html += attrs.name ? ' name="' + attrs.name + '"' : '';
            html += attrs.ngModel ? ' ng-model="' + attrs.ngModel + '"' : '';
            html += ' style="display:none" />';
            html += '<span class="switch-text">'; /*adding new container for switch text*/
            html += attrs.on ? '<span class="on">' + attrs.on + '</span>' : ''; /*switch text on value set by user in directive html markup*/
            html += attrs.off ? '<span class="off">' + attrs.off + '</span>' : ' ';  /*switch text off value set by user in directive html markup*/
            html += '</span>';
            return html;
        }
    }
}).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                
                event.preventDefault();
            }
        });
    };
}).directive('emitLastRepeaterElement', function () {
    return function (scope) {
        if (scope.$last) {
            scope.$emit('LastRepeaterElement');
        }
        if (scope.$index == 0) {
            scope.$emit('StartRepeaterElement');
        }
    };
}).directive('adMenu', function ($location) {
    // add location dependency dor ngRoute support.
    return {
        restrict: 'E',
        replace: true,
        scope: { menuClass: '=', menuItems: '=', menuDefualt: '=' },
        link: function (scope, ele, attrs) {
            scope.active = scope.menuDefualt || scope.menuItems[0].id;
            
            scope.menuItemClick = function (item) {
                scope.active = item.id;
                $location.url(item.link);
            }
        },
        templateUrl: '/public/templates/directives/menu.html?_=' + (new Date())
    };
}).directive('adUser', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: { user: '=' },
        link: function (scope, elem, attrs) {
            // set defualt class if not exist.
            scope.userClass = scope.user._class || 'menu_blue_user';
            
            // get from db all users this user have a premmition to use
            scope.getAllUsers = function () {
                //todo:(Or 26.07.2015) make an api call "get users".
                return [{}];
            };

            
        },
        templateUrl: '/public/templates/directives/headerUser.html?_=' + (new Date())
    }
}).directive('draggable', ['$document', function ($document) {
        return {
            link: function (scope, element, attr) {
                var startX = 0, startY = 0, x = 0, y = 0;
                
                element.css({
                    position: 'relative',
                    border: '1px solid red',
                    backgroundColor: 'lightgrey',
                    cursor: 'pointer'
                });
                
                element.on('mousedown', function (event) {
                    // Prevent default dragging of selected content
                    event.preventDefault();
                    startX = event.pageX - x;
                    startY = event.pageY - y;
                    $document.on('mousemove', mousemove);
                    $document.on('mouseup', mouseup);
                });
                
                function mousemove(event) {
                    y = event.pageY - startY;
                    x = event.pageX - startX;
                    element.css({
                        top: y + 'px',
                        left: x + 'px'
                    });
                }
                
                function mouseup() {
                    $document.off('mousemove', mousemove);
                    $document.off('mouseup', mouseup);
                }
            }
        };
    }]).directive('adPop', ['$http', function ($http) {
        return {
            restrict: 'E',
            replace: true,
            scope: { column: '=', filters: '=' },
            link: function (scope, elem, attrs) {
                
                scope.currentFilters = [];
                
                // watch over filters.
                scope.$watch('filters', function (n, o) {
                    scope.currentFilters = scope.getCurrentFiltersCopy(n);
                //console.log('scope.currentFilters changed', scope.currentFilters);
                }, true);
                
                scope.getCurrentFiltersCopy = function (filters) {
                    var temp = [];
                    for (var i = 0; i < filters.length; i++)
                        if (scope.column.name == filters[i].columnName)
                            temp.push(filters[i]);
                    return angular.copy(temp);
                }
                
                scope.isOpen = false;
                // get all Columns
                scope.columns = scope.$parent.getColumns();
                // get Filter List
                scope.filterList = scope.$parent.getFilterList();
                
                // Each time a popover comes in.
                scope.makeSingleDraggable = function (index, columns) {
                    
                    scope.isOpen = !scope.isOpen;
                                        
                    if (scope.currentFilters.length > 0) {
                        // if here, load filters.
                        for (var i = 0; i < scope.filters; i++)
                            if (scope.filters[i].columnName != column.name)
                                scope.currentFilters.push(scope.filters[i]);
                        
                    } else {
                        // if here, make 1 empty filter.
                        scope.pushFirstRow();
                    }
                    
                    // making the popover draggable
                    setTimeout(function () {
                        var popups = $('.popover').attr("draggable", true);
                        popups.draggable() 
                        scope.$apply();
                    }, 400);

                }
                
                // close popover
                scope.close = function () {
                    scope.isOpen = false;
                }
                
                // add filter.
                scope.addFilter = function () {
                    
                    if (scope.column.name == '' || scope.column.name == null)
                        return;
                    
                    scope.pushFirstRow();
                }
                
                // save filters.
                scope.saveFilters = function () {
                    
                    for (var i = 0; i < scope.filters.length; i++) {
                        if (scope.filters[i].columnName == scope.column.name) {
                            scope.filters.splice(i, 1);
                            i--;
                        }
                    }
                    
                    for (var i = 0; i < scope.currentFilters.length; i++)
                        scope.filters.push(angular.copy(scope.currentFilters[i]));
                    
                    console.log('scope.filters', scope.filters);
                    
                    scope.$parent.getDataAfterFilter();
                    
                    scope.close();
                    
                    console.log('scope.filters', scope.filters);

                }
                
                // remove specific filter
                scope.removeFilter = function (index) {
                    scope.currentFilters.splice(index, 1);
                    
                    if (scope.currentFilters.length == 0)
                        scope.pushFirstRow();

                }
                
                scope.pushFirstRow = function () {
                    scope.currentFilters.push({
                        uniq: scope.$parent.guid(),
                        columnName: scope.column.name,
                        params: [],
                        key: scope.$parent.columns[scope.column.name].filters[0],
                        operator: '&&'
                    });
                }
                
                // init filter params
                scope.initFilter = function (index) {
                    // init specific chosen filter params
                    console.log('index', index);
                    scope.currentFilters[index].params = {};
                }
                
                scope.clear = function () {
                    scope.currentFilters = [];
                    //scope.pushFirstRow();
                    scope.saveFilters();
                }
                
                scope.isLastIndex = function (index) {
                    // checks if specific index is last index
                    return index == (scope.currentFilters.length - 1) ? false : true;
                }

            },
            templateUrl: '/public/templates/directives/filterDirective.html?_=' + (new Date())
        }
    }]);
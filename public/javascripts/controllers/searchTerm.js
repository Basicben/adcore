app.controller('searchTermsController', ['$scope', '$http', '$compile', '$filter', '$timeout', '$location', 'Chronicle', 'notify', 'ipCookie', function ($scope, $http, $compile, $filter, $timeout, $location, Chronicle, notify, ipCookie) { //'ipCookie',
        $http.defaults.headers.post["Accept"] = "application/json;charset=UTF-8";


        $scope.isLoading = true;
        // boolean represent if table data is loading .
        $scope.isAnalizeData = false;
        
        // filters made array.
        $scope.filters = [];
        $scope.columns = {};
        
        // object that holds all the ROWS that user has selected (by checkbox)
        $scope.checkedRows = {};

        // the grid data.
        $scope.grid_data = [];
        
        // grid data uniq values object - watch on grid 
        $scope.gridDataValues = {};
        
        // template object for sort \ filter etc...
        $scope.templates = {
            filter: {
                title: 'Filter',
                url: 'public/templates/directives/fitlerPopup.html',
            }
        };
        
        // general unique object
        $scope.uniqeObj = {
            key: '',
            type: "searchTerms",
            advertiserId: "fsd78f68s7d6gsd78g6sd",
        };
        
        // Get Data. called after initPage()
        $scope.getData = function () {
            $scope.isAnalizeData = true;
            $http({
                method: 'POST',
                data: { uniq: $scope.uniqeObj.key, pagination: { currentPage: $scope.pagination.currentPage, rows: $scope.pagination.pageSize, pages: $scope.pagination.pages} },
                url: 'http://localhost:3001/api/core/get'
            }).success(function (data) {
                $scope.safeApply(function () {
                    $scope.grid_data = data.result;
                    $scope.pagination.gridLength = data.length;
                    console.log('$scope.grid_data', $scope.grid_data);
                    $scope.isAnalizeData = false;
                });
            }).error(function (err) {
                $scope.isAnalizeData = false;
            });
        }
        
        // Get filtered Data.
        $scope.getDataAfterFilter = function (){
            // set loader on
            $scope.isAnalizeData = true;
            $http({
                method: 'POST',
                data: { uniq: $scope.uniqeObj.key, filters: $scope.filters },
                url: 'http://localhost:3001/api/core/filter'
            }).success(function (data) {
                $scope.grid_data = data.result;
                console.log('data.result', data.result);
                $scope.isAnalizeData = false;
                $scope.pagination.currentPage = 0;
            }).error(function (err) {
                $scope.isAnalizeData = false;
            });
        }
        

        
        // InitPage in order to get a unique key.
        $scope.initPage = function () {
            $scope.isLoading = true;
            //TOCHECK: http://www.lemondedubagage.com/adcore.xml
            $http({
                method: 'POST',
                data: { type: $scope.uniqeObj.type, advertiserId: $scope.uniqeObj.advertiserId },
                url: 'http://localhost:3001/api/core/create'
            }).success(function (result) {
                if (result.err) {
                    console.log('result.err', result.err);
                    return;
                }

                if (result.result == undefined) {
                    console.log('result.err', result);
                    return;
                } 
                
                result = result.result;

                $scope.uniqeObj.key = result.uniq;
                $scope.columns = result.columns;
                
                $scope.initColumns();
                
                $scope.isAnalizeData = true;
                $scope.isLoading = false;
                $scope.getData($scope.uniqeObj.key);
                
            }).error(function (err) {
                $scope.isLoading = false;
            });

        }

        // Initiallize Page
        $scope.initPage();
        
        // Initiallize columns
        $scope.initColumns = function (){
            for (var key in $scope.columns)
                if ($scope.columns[key].type == 'uniq') {
                    $scope.uniq.isExist = true;
                    $scope.uniq.key = key;
                    break;
                }
        }

        $scope.mainAction = [
            {
                name: 'change_status',
                display: 'Status',
                type: 'dropdown',
                options: [
                    {
                        display: 'Active',
                        name: 'active',
                        action: function () {
                            // the on click option event
                            var rows = getSelectedRows();
                            for (var i = 0; i < rows.length; i++) {
                                row = rows[i];
                                changeStatusToActive(row);
                            }
                        }
                    },
                    {
                        display: 'Disable',
                        name: 'disable',
                        action: function () {
                            // the on click option event
                            var rows = getSelectedRows();
                            for (var i = 0; i < rows.length; i++) {
                                row = rows[i];
                                changeStatusToDisable(row);
                            }
                        }
                    }
                ],
                defualtValue: 'active'
            },
            {
                name: 'addColumn',
                display: '+ Column',
                type: 'button',
                options: null
            }
        ];
        
        $scope.action = {
            'addKeywork' : {
                display: '',
                paramInputType: ['textarea', 'select'],
                placeholder: ['value \nvalue \nvalue', ''],
                DefualtValues: ['', 'Include'], 
                options: [
                    null,
                    [
                        { _key: 'Include', _value : 'Include' },
                        { _key: 'Exclude', _value : 'Exclude' }
                    ]
                ],
                numberOfParams: 1,
                exec: function () { 
            
                }
            },
            'removeKeyword': function () { 
            
            },
            'excludeKeyword': function () { 
            
            },
            'changeBid': function () { 
            
            }
        };
        
        // chosen filters object
        
        $scope.chosen_filters = [];
        
        // filters object
        $scope.filterList = {
            'equal': {
                label: 'Equals', 
                value: 'equal', 
                allowedTypes: ['number', 'string'], 
                isFormulaSupport: true,
                paramInputType: ['text'] , 
                placeholder: ['Value'], 
                numberOfParams: 1
            },
            'notEqual': {
                label: 'Does Not Equal',
                value: 'notEqual', 
                allowedTypes: ['number', 'string'], 
                isFormulaSupport: true,
                paramInputType: ['text'] , 
                placeholder: ['Value'],
                numberOfParams: 1
            }, 
            'begins': {
                label: 'Begins With', 
                value: 'begins', 
                allowedTypes: ['string'], 
                isFormulaSupport: true,
                paramInputType: ['text'] , 
                placeholder: ['Text'], 
                numberOfParams: 1
            }, 
            'ends': {
                label: 'Ends With', 
                value: 'ends', 
                allowedTypes: ['string'], 
                isFormulaSupport: true,
                paramInputType: ['text'],
                placeholder: ['Text'],
                numberOfParams: 1
            }, 
            'contains': {
                label: 'Contains', 
                value: 'contains', 
                allowedTypes: ['string'], 
                isFormulaSupport: true,
                paramInputType: ['text'],
                placeholder: ['Text'],
                numberOfParams: 1
            }, 
            'notContains': {
                label: 'Does Not Contain', 
                value: 'notContains', 
                allowedTypes: ['string'], 
                isFormulaSupport: true,
                paramInputType: ['text'],
                placeholder: ['Text'],
                numberOfParams: 1
            }, 
            'greater': {
                label: 'Greater Than', 
                value: 'greater', 
                allowedTypes: ['number'], 
                isFormulaSupport: true,
                paramInputType: ['number'],
                placeholder: ['No.'],
                numberOfParams: 1
            }, 
            'greaterEquals': {
                label: 'Greater Than Or Equal To', 
                value: 'greaterEquals', 
                allowedTypes: ['number'], 
                isFormulaSupport: true,
                paramInputType: ['number'],
                placeholder: ['No.'],
                numberOfParams: 1
            }, 
            'lower': {
                label: 'Less Than', 
                value: 'lower', 
                allowedTypes : ['number'], 
                isFormulaSupport: true,
                paramInputType: ['number'],
                placeholder: ['No.'],
                numberOfParams: 1
            }, 
            'lowerEquals': {
                label: 'Less Than Or Equal To',
                value: 'lowerEquals',
                allowedTypes : ['number'], 
                isFormulaSupport: true,
                paramInputType: ['number'],
                placeholder: ['No.'],
                numberOfParams: 1
            },
            'range': {
                label: 'Range',
                value: 'range',
                allowedTypes : ['string'], 
                isFormulaSupport: false,
                paramInputType: ['text'],
                placeholder: ['ex: 0-1000 / 1,2,4,7'],
                numberOfParams: 1
            },
            'value': {
                label: 'Values list',
                value: 'value', 
                allowedTypes : ['string'], 
                isFormulaSupport: false,
                paramInputType: ['textarea', 'select'] ,
                placeholder: ['value \nvalue \nvalue', ''],
                DefualtValues: ['', 'Include'], 
                options: [
                    null,
                    [
                        { _key: 'Include', _value : 'Include' },
                        { _key: 'Exclude', _value : 'Exclude' }
                    ]
                ],
                numberOfParams: 1
            },
            'length': {
                label: 'Length', 
                value: 'length', 
                allowedTypes : ['string'], 
                isFormulaSupport: false,
                paramInputType: ['select', 'select', 'number'] , 
                DefualtValues: ['word', '>'],
                options: [
                    [
                        { _key: 'word', _value : 'Words' },
                        { _key: 'char', _value : 'Chars' }
                    ],
                    [
                        { _key: '>', _value : '>' },
                        { _key: '<', _value : '>' },
                        { _key: '==', _value : '=' }
                    ]
                ],
                placeholder: ['', '', 'No.'] , 
                numberOfParams: 3
            },
            'duplicates': {
                label: 'Duplicates', 
                value: 'duplicates', 
                allowedTypes : ['number', 'string'],
                isFormulaSupport: false,
                paramInputType: ['select', 'select'] , 
                DefualtValues: ['<', ''],
                options: [
                    [
                        { _key: '<', _value : 'Keep minimum' },
                        { _key: '>', _value : 'Keep maximum' }
                    ],
                    []
                ],
                placeholder: ['', ''] , 
                numberOfParams: 2
            }
        };
        
        $scope.getFilterList = function () {
            return $scope.filterList;
        }
        
        $scope.getColumns = function () {
            return $scope.columns;
        }
        
        $scope.sorts = [];
        
        // returns the index of column object in sort. else return -1
        $scope.ifExistsInSort = function (columnName){
            if (columnName == undefined || columnName == null || $scope.sorts.length <= 0 )
                return -1;

            for(var i =0; i< $scope.sorts.length; i++) {
                if ($scope.sorts[i].columnName == columnName)
                    return i;
            }

            return -1;
        }

        $scope.sort = function (columnName) {
            if (!(columnName != undefined && columnName != null))
                return;
            
            if ($scope.columns[columnName].type == 'uniq')
                return;

            var index = $scope.ifExistsInSort(columnName);
            // Default order value is ASC
            if (index == -1) {
                // if column doesnt exist in sort array, push it.
                $scope.sorts.push({ columnName: columnName, order: 'asc' });
            } else {
                // if column exists in array, change order value.
                $scope.sorts[index].order = $scope.sorts[index].order == 'desc' ? 'asc'  : 'desc';
            }
            
            console.log('$scope.sorts', $scope.sorts);
            $scope.setSort();
        }
        
        $scope.setSort = function (){
            // set loader on
            $scope.isAnalizeData = true;
            // make api call to sort.
            $http({
                method: 'POST',
                data: { uniq: $scope.uniqeObj.key, sorts: $scope.sorts },
                url: 'http://localhost:3001/api/core/sort'
            }).success(function (data) {
                $scope.grid_data = data.result;
                console.log('data.result', data.result);
                $scope.isAnalizeData = false;
            }).error(function (err) {
                $scope.isAnalizeData = false;
            });
        }
        
        $scope.deleteSort = function (obj){
            if (obj == null || obj.columnName == undefined || obj.order == undefined || $scope.sorts.length <= 0 )
                return;

            var index = $scope.sorts.indexOf(obj);

            if (index != -1) {
                $scope.sorts.splice(index, 1);
                $scope.setSort();
            }

        }

        $scope.closeAllPopovers = function (columns) {
            // close any open popovers
            for (var i = 0; i < columns.length; i++) {
                if (columns[i].popoverToggle == true)
                    columns[i].popoverToggle = false
            }
        }        
        
        $scope.isAttributeExists = function (array, attr, value) {
            var returnValue = -1;
            console.log(array, attr, value);
            for (var i = 0; i < array.length; i++) {
                console.log('array[i][attr]', i, attr, array[i][attr]);
                if (array[i][attr] == value) {
                    return returnValue = i;
                }
            }
            return returnValue;
        }
        
        
        $scope.uniq = {
            isExist: false,
            key: '',
            addRemove: function (obj) {
                $scope.checkedRows[obj] = ($scope.uniq.isChecked(obj)) ? true : false;
            },
            isChecked: function (obj) {
                return ($scope.checkedRows[obj] == undefined || $scope.checkedRows[obj] == false) ? false : true;
            }
        };
        
        
        
        // parse objdata into post call format.
        $scope.parseData = function (obj) {
            var result = '';
            angular.forEach(obj, function (value, key) {
                result += key + '=' + value + '&';
            });
            return result;
        };
        
        
        
        /*
            sortField: the current sort field
            sortOrder: true desc , false asc
            sortBy: function gets key and isSort the premmission of column sort.
            searchText: ng-model of the search box.
            searchOnColumns: array contains all the columns should seach on.
            onlyActive: ng-model of the active checkbox.
            _class: the grid table class.
        */
        // grid settings search and sort handaling. 
        $scope.grid = {
            sortField : null, // set defualt value 
            sortOrder : null,
            sort: {
                column: null,
                dir: null
            },
            sortBy: function (key) {
                $scope.safeApply(
                    function () {
                        if (ne(key))
                            return;
                        
                        $scope.safeApply(function () {
                            
                        });
                        
                        if ($scope.grid.sortField == key) {
                            // 
                            if ($scope.grid.sortOrder == 'asc')
                                $scope.grid.sortOrder = 'desc';
                            else
                                $scope.grid.sortOrder = 'asc';
                                
                        } else {
                            $scope.grid.sortOrder = 'asc';
                            $scope.grid.sortField = key;
                        }
                        
                        // saving in engine.
                        $scope.engine.get_settings('all')['sort'] = $scope.settings.sort = $scope.mainObjects.sort = { dir: $scope.grid.sortOrder, column: $scope.grid.sortField };
                        
                        // refresh Grid
                        try {
                            $scope.refreshGridDataFromEngine();
                        } catch (err) {
                            //TODO: error on Sort.
                            console.log("Sort Error");
                        }
                        
                    }
                );
            },
            searchText : null,
            searchOnColumns : [],
            onlyActive : true,
            _class : 'grid_class'
        }
        
        /*
            head_class: grid head row style
            _class: simple data row class
            active_class: active row class (active on click)
            rowActive: id of the active row.
            onclick: on row click event.
        */ 
        // set rows settings & events
        $scope.rows = {
            head_class : 'column_header', // if null then defualt
            _class : 'grid_simple_row', // if null then defualt
            active_class : 'grid_active_row',
            rowActive : null,
            onclick : function (e, row) {
                //console.log('rows onclick event', e, row);
                var col = $($(e.target).closest('td')).attr('col_index');
                console.log(col);
                //console.log('rows onclick event',col);
                //$scope.openDialog('singleValueReplace', col, e, row[col]);
            }
        };
        
        /********************************************************************* Pagination************************************************************/
        /*
            dataIndexRoot: used to set the row we start from.
            pageSizeOptions: all page sizes options.
            pageSize: current page size.
            data_grid_length: get data length after filtering.
            data_grid: get data after filtering.
            numberOfPages: no of pages in the grid.
            nextPage: go to next page
            previosPage: go to previos page.
            toPage: go to page get the page number as a param.
            _class: pagination wrapper class
            button_class: pagination button class
            select_class: page size options selectbox class.
        */

        $scope.pagination = {
            dataIndexRoot : 0,
            pageSizeOptions : [
                { value: 10, lable : '10 per page' },
                { value: 20, lable : '20 per page' },
                { value: 50, lable : '50 per page' },
                { value: 100, lable : '100 per page' }
            ],
            pageSize : 10,
            pages: 5,
            currentPage : 0,
            gridLength : 0,
            data_grid_length: function () {
                return $scope.pagination.gridLength;
            },
            markAllRows: function () {
                // get startup index point.
                var offsetStart = ($scope.pagination.currentPage + 1) * $scope.pagination.pageSize - $scope.pagination.pageSize;
                // end index point
                var offsetEnd = $scope.grid_data[offsetStart + ($scope.pagination.pageSize)] == undefined ? $scope.grid_data.length : offsetStart + ($scope.pagination.pageSize);
                for (var i = offsetStart; i < offsetEnd; i++) {
                    var keywordId = $scope.grid_data[i]['keywordID'];
                    if($scope.checkedRows[keywordId] == undefined || $scope.checkedRows[keywordId] == !$scope.pagination.isAllChecked)
                        $scope.checkedRows[keywordId] = $scope.pagination.isAllChecked;
                    
                    //if (row['keywordID'])
                }
                
            },
            numberOfPages : function () {
                return Math.ceil(this.data_grid_length() / this.pageSize);
            },
            nextPage : function () {
                if ((this.currentPage + 1) >= this.numberOfPages())
                    return;
                
                // if the next page is beyond the pulled array -> get more data
                if (this.currentPage + 1 > this.pages) {
                    this.pages++;
                    $scope.getData();
                }

                $scope.safeApply(function () {
                    $scope.pagination.toPage($scope.pagination.currentPage + 1);
                    // $scope.pagination.dataIndexRoot = $scope.pagination.currentPage * $scope.pagination.pageSize
                });
            },
            previosPage: function () {
                if (this.currentPage <= 0)
                    return;
                $scope.safeApply(function () {
                    $scope.pagination.toPage($scope.pagination.currentPage - 1);
                });
            },
            toPage: function (pageNumber) {
                $scope.safeApply(function () {
                    if (pageNumber != $scope.pagination.currentPage && $scope.pagination.pageSize > 49) {
                        $scope.isAnalizeData = true;
                    }
                });
                setTimeout(function () {
                    $scope.safeApply(function () {
                        console.log('pageNumber', pageNumber + 1, $scope.pagination.pages);
                        if ( (pageNumber + 1) > $scope.pagination.pages) {
                            $scope.pagination.pages = pageNumber + 1;
                            console.log('$scope.pagination.pages after' , $scope.pagination.pages);
                            $scope.getData();
                        }
                        $scope.pagination.currentPage = pageNumber;
                        $scope.pagination.dataIndexRoot = $scope.pagination.currentPage * $scope.pagination.pageSize;
                    });
                }, 100);
            },
            isAllChecked:false,
            _class : 'pagination_class', // if null then defualt
            button_class : 'pagination_button_class',
            select_class : 'pagination_select_class',
            number_class : 'pagination_number_class',
            eachSide : 7
        };
        
        $scope.paginationFixBarWidth = function () {
            setTimeout(function () {
                $('.' + $scope.pagination._class).css('width', $('.pagination_transition').width());
            }, 400);
        }
        
        // pagination page end retpeat event
        $scope.$on('LastRepeaterElement', function () {
            $scope.safeApply(function () {
                $scope.isAnalizeData = false;
            });
            $scope.paginationFixBarWidth();
        });
        
        
        // function for the pagination page number.        
        $scope.isDisplayPage = function (pageNumber) {
            var numberOfPages = $scope.pagination.numberOfPages();
            
            if (numberOfPages < $scope.pagination.eachSide * 2)
                return 1;
            
            // bigger then 20
            // if he is on the start
            if ($scope.pagination.currentPage - $scope.pagination.eachSide < 0) {
                if (pageNumber < $scope.pagination.eachSide * 2) {
                    return 1;
                } else {
                    if (pageNumber == ($scope.pagination.eachSide * 2) + 1)
                        return 2;
                    else
                        return 0;
                }
            }
            // if he is on the end.
            if ($scope.pagination.currentPage + $scope.pagination.eachSide > numberOfPages) {
                if (pageNumber > numberOfPages - ($scope.pagination.eachSide * 2)) {
                    return 1;
                } else {
                    if (pageNumber == numberOfPages - ($scope.pagination.eachSide * 2) - 1)
                        return 2;
                    else
                        return 0;
                }
            }
            
            // if currentPage on the middle - right side
            if (pageNumber > $scope.pagination.currentPage - $scope.pagination.eachSide && pageNumber < $scope.pagination.currentPage + $scope.pagination.eachSide) {
                return 1;
            } else {
                if (pageNumber == ($scope.pagination.currentPage - $scope.pagination.eachSide) - 1)
                    return 1;
                else
                    return 0;
            }
            
            // if currentPage on the middle - left side.
            if (pageNumber < $scope.pagination.currentPage + $scope.pagination.eachSide) {
                return 1;
            } else {
                if (pageNumber == ($scope.pagination.currentPage - $scope.pagination.eachSide) + 1)
                    return 2;
                else
                    return 0;
            }
        }


    }]);


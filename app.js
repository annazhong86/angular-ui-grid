angular.module('app', [
    'ui.grid'
]).controller('MainCtrl', MainCtrl);

MainCtrl.$inject = ['$http', 'uiGridConstants', 'myData'];

function MainCtrl($http, uiGridConstants, myData) {
    var vm = this;
    vm.gridOptions = {
        enableSorting:true,
        data:myData,
        columnDefs:[
            {
                field:'firstName',
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 1
                }
            },
            {
                field:'lastName', 
                enableSorting: false
            },
            {
                field:'company',
                sort: {
                    direction: uiGridConstants.ASC,
                    priority: 0
                },
                suppressRemoveSort: true,
                sortingAlgorithm: function(a,b,rowA,rowB,direction){
                    //console.log(a,b,rowA,rowB,direction)
                    var nulls = vm.gridApi.core.sortHandleNulls(a,b);
                    if(nulls !== null) {
                        return nulls;
                    } else {
                        if( a === b){
                            return 0;
                        }
                        if( a === true){
                            return 1;
                        }
                        if(b === false){
                            return -1;
                        }
                        if( a === false){
                            return 1;
                        }
                        if(b === true){
                            return -1;
                        }
                        return 0;
                    }
                }
            },{
                field:'employed',
                sort: {
                    direction: uiGridConstants.DESC,
                    priority: 2
                }
            }

        ],
        onRegisterApi: function(gridApi){
            vm.gridApi = gridApi;
        }
    }
    vm.toggleEmployed = function(){
        if(vm.gridOptions.data[2].employed === false){
            vm.gridOptions.data[2].employed = true;
        };
        console.log(vm.gridOptions.data[2])
        vm.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    }
}

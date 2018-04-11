angular.module('app', [
    'ui.grid',
    // selected rows will be shown if using ui-grid-selectioon featue.
    'ui.grid.selection'
])
.controller('MainCtrl', MainCtrl)
.filter('mapGender', mapGender);

MainCtrl.$inject = ['$http', 'uiGridConstants', 'myData'];

function MainCtrl($http, uiGridConstants, myData) {
    var vm = this;
    myData.forEach(function(row){
        row.registered = Date.parse(row.registered);
        row.gender = row.gender === 'male' ? '1' : '2';
    })
    
    vm.highlightFilteredHeader = function( row, rowRenderIndex, col, colRenderIndex ) {
        if( col.filters[0].term ){
          return 'header-filtered';
        } else {
          return '';
        }
      };

    vm.gridOptions = {
        //Display total rows and the number of filtered rows
        showGridFooter: true,
        showColumnFooter: true,
        enableFiltering: true,
        enableSorting:true,
        data:myData,
        columnDefs:[
            {
                field:'name', width:'10%'
            },
            { 
                field: 'gender', 
                filter: {
                term: '1',
                type: uiGridConstants.filter.SELECT,
                selectOptions: [ { value: '1', label: 'male' }, { value: '2', label: 'female' }, { value: '3', label: 'unknown'}, { value: '4', label: 'not stated' }, { value: '5', label: 'a really long value that extends things' } ]
              },
              cellFilter: 'mapGender', 
              headerCellClass: vm.highlightFilteredHeader,
              width:'10%' 
            },
            {field:'address.street', aggregationType: uiGridConstants.aggregationTypes.sum, width:'10%'},
            {field:'age', aggregationType: uiGridConstants.aggregationTypes.avg, aggregationHideLabel:true, width:'10%'},
            {field:'age', name:'ageMin', aggregationType: uiGridConstants.aggregationTypes.min, width:'12%', displayName: 'Age for min'},
            {field:'age', name:'ageMax', aggregationType: uiGridConstants.aggregationTypes.max, width:'13%', displayName:'Age for max'},
            {field:'age', name:'customColumnFooterTemplate', width:'14%', footerCellTemplate:'<div class="ui-grid-contents" style="background-color:red; color: White">custom template</div>'},
            {name:'registered', field:'registered', width:'20%', cellFilter:'date', footerCellFilter:'date', aggregationType: uiGridConstants.aggregationTypes.max}            
        ],
        onRegisterApi: function(gridApi){
            vm.gridApi = gridApi;
        }
    }

    vm.toggleGridFooter = function(){
        $scope.gridOptions.showGridFooter = !$scope.gridOptions.showGridFooter;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
    }

    vm.toggleColumnFooter = function(){
        $scope.gridOptions.showColumnFooter = !$scope.gridOptions.showColumnFooter;
        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);
    }
    
}

function mapGender() {
    var genderHash = {
      1: 'male',
      2: 'female'
    };
   
    return function(input) {
      if (!input){
        return '';
      } else {
        return genderHash[input];
      }
    };
  }
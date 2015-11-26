var app = angular.module('bookmarkApp');

app.controller("TabCtrl", ['$scope', 'TabsSrvc', '$stateParams', function($scope, TabsSrvc, $stateParams) {
  
  console.log($stateParams.tab)
  console.log(TabsSrvc.tabs)
  $scope.tab = function(){
    return TabsSrvc.tabs.find(function(tab){
      if (tab.tabName === $stateParams.tab) {
        return true;
      }
      else {
        return false;
      }
    });
  }





}])
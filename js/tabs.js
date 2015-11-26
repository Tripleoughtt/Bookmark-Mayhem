var app = angular.module('bookmarkApp');

app.controller("TabsCtrl", ['$scope', 'TabsSrvc', '$stateParams', function($scope, TabsSrvc, $stateParams) {

  $scope.tabs = TabsSrvc.tabs;
  $scope.deleteTab = function(tab){
    console.log('You CLICKED ME : ', tab)
    TabsSrvc.removeTab(tab).then(function(resp){
      var deleteIndex = TabsSrvc.tabs.indexOf(tab);
      console.log(deleteIndex)
      TabsSrvc.tabs.splice(deleteIndex, 1)
    })
  }

  $scope.add = function(tab){
    var newTab = {
      tabName: tab.tabName,
      links : []
    }
    TabsSrvc.addTab(newTab).then(function(resp){
      console.log('add response: ', resp);
      newTab.dateCreated = Date.now();
      TabsSrvc.storeTab(newTab);
    });
  }

}]).service('TabsSrvc',[ '$http', function($http){

  this.tabs = [];

  this.addTab = function(tab){
    return $http.post('http://bookmark-mayhem.herokuapp.com/tabs/create', tab)
  }

  this.getTabs = function(){
    return $http.get("http://bookmark-mayhem.herokuapp.com/tabs")
  };

  this.removeTab = function(tab){
    var data = {tabName: tab.tabName};
    return $http.post('http://bookmark-mayhem.herokuapp.com/tabs/delete', data)
  }

  this.storeTab = function(tab){
    this.tabs.push(tab);
  }

  this.storeTabs = function(resp){
    resp.data.forEach(tab => {
      delete tab.__v;
      this.tabs.push(tab)
    })
    return this.tabs;
  }

  this.getTabsByLink = function(linkUrlToFind) {
    return this.tabs.filter(function(tab){
      if (!tab.links.length) return false;
      return tab.links.some(function(link){
        return link.linkUrl === linkUrlToFind;
      })
    })
  }

}])
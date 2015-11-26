'use strict';

var app = angular.module('bookmarkApp');

app.controller("ItemCtrl", ['$scope', 'LinkSrvc', '$stateParams', 'TabsSrvc', function($scope, LinkSrvc, $stateParams, TabsSrvc) {
  
  $scope.tabs = TabsSrvc.tabs;
  $scope.links = LinkSrvc.links;

  $scope.linkTabs = function(link){
    if (!$scope.links.length) return;
    return TabsSrvc.getTabsByLink(link.linkUrl);
  }

  $scope.deleteLink = function(link){
    console.log('you clikced it',link)
    LinkSrvc.deleteLink(link).then(function(resp){
      console.log('add response: ', resp);
      LinkSrvc.removeStoredLink(link);
    })
  }

  $scope.add = function(link){
    var newLink = {
      linkUrl: link.linkUrl,
      linkName: link.linkName
    }
    LinkSrvc.addLink(newLink).then(function(resp){
      console.log('add response: ', resp);
      newLink.dateCreated = Date.now();
      LinkSrvc.storeLink(newLink);
    });
  }

  $scope.getNotTabsByLink = function(link) {
    var availableTabs = [];
    var takenTabs = TabsSrvc.getTabsByLink(link.linkUrl);
    TabsSrvc.tabs.forEach(function(tab){
      if (takenTabs.indexOf(tab)==-1) {
        availableTabs.push(tab);
      }
    })
    return availableTabs;
  }

  $scope.addTabToLink = function(link,tab) {
    LinkSrvc.addTabToLink(link,tab).then(function(resp){
      var allTabs = TabsSrvc.tabs;
      var indexOfTab = allTabs.indexOf(tab);
      tab.links.push(link);
      TabsSrvc.tabs[indexOfTab] = tab;
    })
  }

}]).service('LinkSrvc',[ '$http', function($http){

  this.addTabToLink = function(link, tab){
    var data = {linkUrl: link.linkUrl, tabName: tab.tabName};
    console.log('sending data: ',data)
    return $http({method:'POST', 
      url: "http://bookmark-mayhem.herokuapp.com/tabs/addLink",
      data: data
    });
  }

  this.links = [];

  this.storeLink = function(link){
    this.links.push(link);
  }

  this.removeStoredLink = function(link){
    console.log('rm stored')
    this.links.splice(this.links.indexOf(link),1)
  }

  this.addLink = function(link){
    return $http({method:'POST', 
      url: "http://bookmark-mayhem.herokuapp.com/links/create",
      data: link
    });
  }

  this.deleteLink = function(link){
    var options = {
      method:'POST', 
      url: "http://bookmark-mayhem.herokuapp.com/links/delete",
      data: {linkUrl: link.linkUrl}
    }
    return $http(options);
  }


  this.getLinks = function(){
    return $http.get("http://bookmark-mayhem.herokuapp.com/links")
  };

  this.storeLinks = function(resp){
    resp.data.forEach(link => {
      delete link.__v;
      this.links.push(link)
    })
    return this.links;
  }

}])








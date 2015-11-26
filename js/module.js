var app = angular.module('bookmarkApp', ["ui.router"])

app.config(['$stateProvider', '$urlRouterProvider' ,function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise("/")

  $stateProvider
  .state('main', {
    url: "/",
    templateUrl: "partials/links.html",
    controller: "ItemCtrl"
  })
  .state('tags', {
    url: "/tags",
    templateUrl: "partials/tabs.html",
    controller: "TabsCtrl"
  })
  .state('tag', {
    url: "/tag/:tab",
    templateUrl: "partials/tab.html",
    controller: "TabCtrl"
  })

}])

app.run(['TabsSrvc', 'LinkSrvc', function(TabsSrvc, LinkSrvc){

  LinkSrvc.getLinks().then(function(resp){
    console.log('Got links: ',LinkSrvc.storeLinks(resp));
  })

  TabsSrvc.getTabs().then(function(resp){
    console.log('Got tabs: ',TabsSrvc.storeTabs(resp));
  })

}])
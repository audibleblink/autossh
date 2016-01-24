registerController('autosshMainCtrl', ['$api', '$scope', function($api, $scope) {

  $scope.isRunning = false
  $scope.isEnabled = false
  $scope.getStatus = function () {
    $api.request({
      module: 'autossh',
      action: 'status'
    }, function(response) {
      if (response.success) {
        $scope.isRunning = response.isRunning
        $scope.isRunning = response.isEnabled
      }
      console.log(response)
    })
  }

  $scope.getStatus()

  $scope.startAutossh = function () {
    $api.request({
      module: 'autossh',
      action: 'startAutossh'
    }, function (response) {
      console.log(response);
      $scope.getStatus()
    })
  }

  $scope.stopAutossh = function () {
    $api.request({
      module: 'autossh',
      action: 'stopAutossh'
    }, function (response) {
      console.log(response);
      $scope.getStatus()
    })
  }

  $scope.enableAutossh = function () {
    $api.request({
      module: 'autossh',
      action: 'enableAutossh'
    }, function (response) {
      console.log(response);
      $scope.getStatus()
    })
  }

  $scope.disableAutossh = function () {
    $api.request({
      module: 'autossh',
      action: 'disableAutossh'
    }, function (response) {
      console.log(response);
      $scope.getStatus()
    })
  }


}])

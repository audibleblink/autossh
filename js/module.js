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
    apiCaller("startAutossh")
  }

  $scope.stopAutossh = function () {
    apiCaller("stopAutossh")
  }

  $scope.enableAutossh = function () {
    apiCaller("enableAutossh")
  }

  $scope.disableAutossh = function () {
    apiCaller("disableAutossh")
  }
  
  function setState (response) {
    console.log(response)
    $scope.getStatus()
  }

  function apiCaller (action) {
    $api.request({ module: 'autossh', action: action }, setState)
  }

}])

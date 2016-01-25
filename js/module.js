registerController('autosshMainCtrl', ['$api', '$scope', function($api, $scope) {

  $scope.isRunning = false
  $scope.isEnabled = false
  $scope.getStatus = function () {
    apiCaller("status", function(response) {
      if (response.success) {
        $scope.isRunning = response.isRunning
        $scope.isEnabled = response.isEnabled
      }
      console.log(response)
    })
  }
  $scope.getStatus()

  $scope.startAutossh = function () {
    apiCaller("startAutossh", handler)
  }

  $scope.stopAutossh = function () {
    apiCaller("stopAutossh", handler)
  }

  $scope.enableAutossh = function () {
    apiCaller("enableAutossh", handler)
  }

  $scope.disableAutossh = function () {
    apiCaller("disableAutossh", handler)
  }


  function handler (response) {
    console.log(response)
    $scope.getStatus()
  }

  function apiCaller (action, cb) {
    $api.request({ module: 'autossh', action: action }, cb)
  }
}])


registerController('autosshConfCtrl', ['$api', '$scope', function($api, $scope) {

  $scope.formData = {}

  $scope.readConf = function () {
    apiCaller('readConf', function(response) {
      if (response.success) {
        $scope.formData.user  = response.user
        $scope.formData.host  = response.host
        $scope.formData.port  = response.port
        $scope.formData.rport = response.rport
        $scope.formData.lport = response.lport
      }
      console.log(response)
    })
  }
  $scope.readConf()

  $scope.writeConf = function () {
    $api.request({
      module: "autossh",
      action: "writeConf",
      data: $scope.formData
    }, handler)
  }


  function handler (response) {
    console.log(response)
  }

  function apiCaller (action, cb) {
    $api.request({ module: 'autossh', action: action }, cb)
  }

}])

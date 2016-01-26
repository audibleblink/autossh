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
    if (response.success) {
      console.log(response)
      $scope.getStatus()
    } else {
      console.error(response)
    }
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

  $scope.resetConf = function () {
    apiCaller("resetConf", handler)
  }


  function handler (response) {
    if (response.success) {
      console.log(response)
      $scope.readConf()
    } else {
      console.error(response)
    }
  }

  function apiCaller (action, cb) {
    $api.request({ module: 'autossh', action: action }, cb)
  }

}])


registerController('firstRunCtrl', ['$api', '$scope', function($api, $scope) {

  $scope.pubKey = ""
  $scope.knownHosts = ""
  $scope.sshCopyCommand=""
  $scope.generatingKeys=false

  $scope.getInfo = function () {
    apiCaller('getInfo', function(response) {
      if (response.success) {
        $scope.pubKey  = response.pubKey
        $scope.knownHosts  = response.knownHosts
        $scope.keyExists = response.keyExists
      }
      console.log(response)
    })
  }
  $scope.getInfo()

  apiCaller("readConf", function (resp) {
    $scope.sshCopyCommand = "cat ~/.ssh/id_rsa.autossh.pub | \
    ssh -p "+resp.port+" "+resp.user+"@"+resp.host+" \
    'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'"
  })

  $scope.createSshKey = function () {
    $scope.generatingKeys=true
    apiCaller("createSshKey", function(response) {
      $scope.generatingKeys=false
      if (response.success) {
        console.log(response)
        $scope.getInfo()
      } else {
        console.error(response)
      }
    })
  }

  function apiCaller (action, cb) {
    $api.request({ module: 'autossh', action: action }, cb)
  }

}])

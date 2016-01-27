// TODO: update known_hosts in gui on config save

registerController('autosshMainCtrl', ['$api', '$scope', '$rootScope', function($api, $scope, $rootScope) {
  // TODO: this should be in a service
  $rootScope.apiCaller =   function (action, payload, cb) {
    var options = { module: 'autossh', action: action }
    if (payload) $.extend(options, payload)
    $api.request(options, cb)
  }
  // TODO: this should be in a service
  $rootScope.handle = function (updaterFunction) {
    return function (response) {
      if (response.success) {
        updaterFunction()
      } else {
        console.error(response)
      }
    }
  }

  $scope.isRunning = false
  $scope.isEnabled = false
  $scope.getStatus = function () {
    $rootScope.apiCaller("status", null, function(response) {
      if (response.success) {
        $scope.isRunning = response.isRunning
        $scope.isEnabled = response.isEnabled
      }
    })
  }
  $scope.getStatus()

  $scope.startAutossh = function () {
    $rootScope.apiCaller("startAutossh", null, $rootScope.handle($scope.getStatus))
  }

  $scope.stopAutossh = function () {
    $rootScope.apiCaller("stopAutossh", null, $rootScope.handle($scope.getStatus))
  }

  $scope.enableAutossh = function () {
    $rootScope.apiCaller("enableAutossh", null, $rootScope.handle($scope.getStatus))
  }

  $scope.disableAutossh = function () {
    $rootScope.apiCaller("disableAutossh", null, $rootScope.handle($scope.getStatus))
  }

}])

// -

registerController('autosshConfCtrl', ['$rootScope','$api', '$scope', function($rootScope, $api, $scope) {

  $scope.formData = {}
  $scope.savingConf = false

  $scope.readConf = function () {
    $rootScope.apiCaller('readConf', null, function(response) {
      if (response.success) {
        $scope.formData = {
          user: response.user,
          host: response.host,
          port: response.port,
          rport: response.rport,
          lport: response.lport
        }

        $rootScope.cmdThatRuns = [
          'autossh -M 20000 -i ~/.ssh/id_rsa.autossh -N -T -R ',
          $scope.formData.rport,
          ':localhost:',
          $scope.formData.lport,
          ' ',
          $scope.formData.user,
          '@',
          $scope.formData.host,
          ' -p ',
          $scope.formData.port
        ].join('')


      }
    })
  }
  $scope.readConf()

  $scope.writeConf = function () {
    $scope.savingConf = true
    $rootScope.apiCaller('writeConf', { data: $scope.formData }, function (response) {
      $scope.savingConf = false
      if (response.success) {
        $scope.readConf()
      } else {
        console.error(response.error)
      }
    })
  }

  $scope.resetConf = function () {
    $rootScope.apiCaller("resetConf", null, $rootScope.handle($scope.readConf))
  }

}])

// -

registerController('firstRunCtrl', ['$api', '$scope', '$rootScope', function($api, $scope, $rootScope) {

  $scope.pubKey = ""
  $scope.knownHosts = ""
  $scope.sshCopyCommand = ""
  $scope.generatingKeys = false

  $rootScope.getInfo = function () {
    $rootScope.apiCaller('getInfo', null, function(response) {
      if (response.success) {
        $scope.pubKey  = response.pubKey
        $scope.knownHosts  = response.knownHosts
        $scope.keyExists = response.keyExists
      }
    })
  }
  $rootScope.getInfo()

  $rootScope.apiCaller("readConf",null, function (resp) {
    $scope.sshCopyCommand = "cat ~/.ssh/id_rsa.autossh.pub | \
    ssh -p "+resp.port+" "+resp.user+"@"+resp.host+" \
    'mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys'"
  })

  $scope.createSshKey = function () {
    $scope.generatingKeys=true
    $rootScope.apiCaller("createSshKey", null, function(response) {
      $scope.generatingKeys=false
      if (response.success) {
        $rootScope.getInfo()
      } else {
        console.error(response)
      }
    })
  }

}])

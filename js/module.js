registerController('autosshMainCtrl', ['$api', '$scope', function($api, $scope) {

    $scope.greeting = ""
    $scope.content = ""

    $api.request({
        module: 'autossh',
        action: 'getContents'
    }, function(response) {
        if (response.success === true) {
            $scope.greeting = response.greeting
            $scope.content = response.content
        }
        console.log(response)
    })
}])

//-

registerController('autosshConfigCtrl', ['$api', '$scope', function($api, $scope) {

    $scope.greeting = ""
    $scope.content = ""

    $api.request({
        module: 'autossh',
        action: 'getContents'
    }, function(response) {
        if (response.success === true) {
            $scope.greeting = response.greeting
            $scope.content = response.content
        }
        console.log(response)
    })
}])

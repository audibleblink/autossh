<?php namespace pineapple;
// TODO: remove '.test' from file paths before release


class autossh extends Module
{
  public function route()
  {
    $actions = array(
      'status',
      'getInfo',
      'stopAutossh',
      'startAutossh',
      'enableAutossh',
      'disableAutossh',
      'readConf',
      'writeConf',
      'resetConf',
      'createSshKey',
    );

    foreach ($actions as $action) {
      if ($this->request->action == $action) {
        eval("\$this->$action();");
      }
    }
  }

// Initial Setup
  private function createSshKey()
  {
    $path = "/root/.ssh/id_rsa.autossh";
    exec("ssh-keygen -f $path -t rsa -N ''");
    if (file_exists($path)) {
      $this->response = array("success" => true);
    }
  }

  private function ensureKnownHosts($args)
  {
    $cmd = "ssh -o StrictHostKeyChecking=no -o PasswordAuthentication=no -p $args->port $args->user@$args->host";
    exec($cmd);
    if (file_exists('/root/.ssh/known_hosts')) {
      $this->response = array("success" => true);
    }
  }

  private function getInfo()
  {
    $this->response = array(
      "success" => true,
      "pubKey" => $this->safeRead('/root/.ssh/id_rsa.autossh.pub'),
      "knownHosts" => shell_exec("awk '{print $1}' /root/.ssh/known_hosts")
    );
  }

  private function safeRead($file)
  {
    return file_exists($file) ? file_get_contents($file) : "";
  }



// Configuration
  private function readConf()
  {
    $conf = $this->parsedConfig() + array("success" => true);
    $this->response = $conf;
  }

  private function resetConf()
  {
    exec("cp /rom/etc/config/autossh /etc/config/autossh.test");
    return $this->response = $this->parsedConfig() + array("success" => true);
  }

  private function parsedConfig()
  {
    $contents = file("/etc/config/autossh.test");
    $args = preg_split("/\s|\t|:|@|'/", $contents[1]);
    return $this->parseArguments(array_filter($args));
  }

  private function writeConf()
  {
    $args = $this->request->data;
    $location = "/etc/config/autossh.test";
    $config = $this->buildOptionString($args);
    $this->ensureKnownHosts($args);
    $cmd = "sed \"2s|.*|$config|\" /rom/etc/config/autossh > $location";
    exec($cmd);
    $this->response = array("success" => true);
  }

  private function buildOptionString($args)
  {
    return "option ssh '-i /root/.ssh/id_rsa.autossh -N -T -R 0.0.0.0:$args->rport:localhost:$args->lport $args->user@$args->host -p $args->port'";
  }

  // $args {1: "option", 2: "ssh", 4: "-i", 5: "/etc/dropbear/id_rsa", 6: "-N", 7: "-T", 8: "-R", 9: "2222", 10: "localhost", 11: "22", 12: "user", 13: "host"}
  private function parseArguments($args)
  {
    return array(
      "user" => $args[12],
      "host" => $args[13],
      "port" => (!$args[15]) ? "22" : $args[15],
      "rport" => $args[9],
      "lport" => $args[11],
      "keyFile" => $args[5],
    );
  }


  // Management

  private function status()
  {
    $this->response = array(
      "success" => true,
      "isRunning" => $this->isRunning(),
      "isEnabled" => $this->isEnabled()
    );
  }

  private function isRunning()
  {
    return !!$this->pid();
  }


  private function isEnabled()
  {
    $rcFile = "/etc/rc.d/S80autossh";
    return file_exists($rcFile);
  }


  private function startAutossh()
  {
    exec("/etc/init.d/autossh start");
    $this->response = array("success" => true);
  }


  private function stopAutossh()
  {
    exec("/etc/init.d/autossh stop");
    $this->response = array("success" => true);
  }


  private function enableAutossh()
  {
    exec("/etc/init.d/autossh enable");
    $this->response = array("success" => true);
  }


  private function disableAutossh()
  {
    exec("/etc/init.d/autossh disable");
    $this->response = array("success" => true);
  }


  private function pid()
  {
    return exec("pidof autossh");
  }

}

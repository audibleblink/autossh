<?php namespace pineapple;

class autossh extends Module
{
  public function route()
  {
    switch ($this->request->action) {
      case 'status':
      $this->status();
      break;

      case 'startAutossh':
      $this->startAutossh();
      break;

      case 'stopAutossh':
      $this->stopAutossh();
      break;

      case 'enableAutossh':
      $this->enableAutossh();
      break;

      case 'disableAutossh':
      $this->disableAutossh();
      break;

      case 'readConf':
      $this->readConf();
      break;

      case 'writeConf':
      $this->writeConf();
      break;
    }
  }

// Configuration
  private function readConf()
  {
    $contents = file("/etc/config/autossh.test");
    $args = preg_split("/\s|\t|:|@|'/", $contents[1]);

    return $this->response = $this->parseArguments(array_filter($args));
  }

  private function writeConf()
  {
    $args = $this->request->data;
    $location = "/etc/config/autossh.test";
    $config = $this->buildCommand($args);
    $command = "sed \"2s|.*|$config|\" /rom/etc/config/autossh > $location";
    exec($command);
  }

  private function createSshKey()
  {
    $path = "/root/.ssh/id_rsa.autossh";
    exec("ssh-keygen -f $path -t rsa -N ''");
  }

  private function buildCommand($args)
  {
    return "option ssh '-i /root/.ssh/id_rsa.autossh -N -T -R 0.0.0.0:$args->rport:localhost:$args->lport $args->user@$args->host -p $args->port'";
  }

  // $args {1: "option", 2: "ssh", 4: "-i", 5: "/etc/dropbear/id_rsa", 6: "-N", 7: "-T", 8: "-R", 9: "2222", 10: "localhost", 11: "22", 12: "user", 13: "host"}
  private function parseArguments($args)
  {
    return array(
      "host" => $args[13],
      "keyFile" => $args[5],
      "rport" => $args[9],
      "lport" => $args[11],
      "user" => $args[12],
      "port" => (!$args[15]) ? "22" : $args[15],
      "success" => true
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
  }


  private function stopAutossh()
  {
    exec("/etc/init.d/autossh stop");
  }


  private function enableAutossh()
  {
    exec("/etc/init.d/autossh enable");
  }


  private function disableAutossh()
  {
    exec("/etc/init.d/autossh disable");
  }


  private function pid()
  {
    return exec("pidof autossh");
  }

}

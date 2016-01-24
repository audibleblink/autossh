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
    }
  }


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

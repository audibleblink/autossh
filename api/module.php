<?php namespace pineapple;

class autossh extends Module
{
    public function route()
    {
        switch ($this->request->action) {
            case 'getContents':
            $this->getContents();
            break;
        }
    }

    private function getContents()
    {
        $this->response = array("success" => true,
                                "greeting" => "Hey there!",
                                "content" => "This is the HTML template for your new module! The example shows you the basics of using HTML, AngularJS and PHP to seamlessly pass information to and from Javascript and PHP and output it to HTML.");
    }
}

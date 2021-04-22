<?php

 *
 * @author     Shinya Muramatsu <revulon@gmail.com>
 * @copyright  2010-2011 Shinya Muramatsu
 * @license    http://www.opensource.org/licenses/mit-license.php  MIT License
 * @link       http://flashcanvas.net/
 * @link       http://code.google.com/p/flashcanvas/
 */

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    header('Content-Type: application/octet-stream');
    header('Content-Disposition: attachment; filename="canvas.png"');

    if (isset($_POST['dataurl'])) {
     
        $data = $_POST['dataurl'];
        $data = substr($data, strpos($data, ',') + 1);
        echo base64_decode($data);
    } else {
      
        readfile('php://input');
    }
}

<?php
header("Content-Type: text/html; charset=utf-8");
$name = htmlspecialchars($_POST["name"]);
$tel = htmlspecialchars($_POST["tel"]);

$refferer = getenv('HTTP_REFERER');
$date=date("d.m.y"); // число.месяц.год  
$time=date("H:i"); // часы:минуты:секунды 
$myemail = "koweb93@gmail.com";

$tema = "Новая заявка. Кнопка (заказать звонок)";
$message_to_myemail = "
<br><br>
Имя: $name<br>
Телефон: $tel<br>

Источник (ссылка): $refferer
";

mail($myemail, $tema, $message_to_myemail, "From: ANDROMEDA <admin@kateweb.ru> \r\n  \r\n"."MIME-Version: 1.0\r\n"."Content-type: text/html; charset=utf-8\r\n" );



?>

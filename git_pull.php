<?php
$input = fopen('php://input');
$input = json_decode($input);
if (!empty($input->pullrequest_merged)){
  echo exec('git pull');
} else{
  echo 'not merged';
}

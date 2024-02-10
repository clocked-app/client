#!/bin/bash

build_js_path=/usr/share/nginx/html/assets/*.js
env_file_path=/tmp/.env.production

while IFS= read -r line; do
  var_name=$(echo $line | cut -d '=' -f1)
  var_value=$(echo $line | cut -d '=' -f2)
  var_name_first_two_chars=$(echo $var_name | cut -c1-2)

  if [[ "$var_name_first_two_chars" == "//" ]]; then
    continue;
  fi

  var_set_on_container=$(printenv | grep $var_name)
  if [[ ! -z "$var_set_on_container" ]]; then
    var_set_on_container_value=$(echo $var_set_on_container | cut -d '=' -f2)
    sed -i "s#$var_value#$var_set_on_container_value#g" $build_js_path
  fi
done < $env_file_path

rm -f $env_file_path
exit 0

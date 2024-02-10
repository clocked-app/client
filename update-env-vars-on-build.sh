build_js_path=/usr/share/nginx/html/assets/*.js
env_file_path=/usr/share/nginx/.env

while IFS= read -r line; do
  var_name=$(echo $line | cut -d '=' -f1)
  var_value=$(echo $line | cut -d '=' -f2)

  var_set_on_container=$(printenv | grep $var_name)
  if [[ ! -z "$var_set_on_container" ]]; then
    var_set_on_container_value=$(echo $var_set_on_container | cut -d '=' -f2)
    if [[ "$var_value" != "$var_set_on_container_value" ]]; then
       sed -i "s#$var_value#$var_set_on_container_value#g" $build_js_path
    fi
  fi
done < $env_file_path

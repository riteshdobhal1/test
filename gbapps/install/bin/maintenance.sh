#!/bin/sh
. ./import_function
ENV=$1
APACHE_CONFIG_PATH=/glassbeam/tools/apache/conf/extra/httpd-ssl.conf
if [[ -z "$ENV" ]]
then
        show_maintenance_syntax
        exit
elif ! [ -z "$ENV" ]
then
        if [ -e $APACHE_CONFIG_PATH ];then
                if [ $ENV == "on" ];then
                        sed -i 's/#RewriteEngine On/RewriteEngine On/gi' $APACHE_CONFIG_PATH
                        sed -i 's/#RewriteCond %{HTTPS} on/RewriteCond %{HTTPS} on/gi' $APACHE_CONFIG_PATH
                        sed -i 's/#RewriteRule "^\/apps\/dist\/index.html" https:\/\/%{HTTP_HOST}\/apps\/app\/maintenance.html \[R=301,NE,L\]/RewriteRule "^\/apps\/dist\/index\.html" https:\/\/%{HTTP_HOST}\/apps\/app\/maintenance\.html \[R=301,NE,L\]/gi' $APACHE_CONFIG_PATH

                elif [ $ENV == "off" ];then
                        sed -i 's/RewriteEngine On/#RewriteEngine On/gi' $APACHE_CONFIG_PATH
                        sed -i 's/RewriteCond %{HTTPS} on/#RewriteCond %{HTTPS} on/gi' $APACHE_CONFIG_PATH
                        sed -i 's/RewriteRule "^\/apps\/dist\/index.html" https:\/\/%{HTTP_HOST}\/apps\/app\/maintenance.html \[R=301,NE,L\]/#RewriteRule "^\/apps\/dist\/index\.html" https:\/\/%{HTTP_HOST}\/apps\/app\/maintenance\.html \[R=301,NE,L\]/gi' $APACHE_CONFIG_PATH
                else
                        show_maintenance_syntax
                        exit
                fi
        else
                failed_status "Configuration file not found $APACHE_CONFIG_PATH"
                exit
        fi
fi
ok_status
echo 'Restart Apache.....'

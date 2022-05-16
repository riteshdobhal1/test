-- httpd.conf: Default apache configuration file for glassbeam installation
-- httpd-maintenance.conf: apache configuration file to be used when the system is under maintenance

-------------------------------------------------
 Steps to enable maintenance mode 
-------------------------------------------------

1. Stop apache
sudo /glassbeam/tools/apache/bin/apachectl -k stop # Stop apache
2. Take a backup of glassbeam configuration httpd.conf
cp httpd.conf httpd-gb.conf
3. Copy httpd-maintenance.conf to httpd.conf
cp httpd-maintenance.conf httpd.conf 
4. Confirm you get maintenance mode message by running below command
sed -n '65p' /glassbeam/tools/apache/htdocs/index.html 
5. Run the below command by changing the date when server will be back
sed -i '65s/.*/Glassbeam server is on a maintenance schedule and will be back at Sep 11th 2011 10:50 PST or Sep 11th 2011 04:50 GMT/' /glassbeam/tools/apache/htdocs/index.html
6. Confirm again if you get the proper message run in step 4
sed -n '65p' /glassbeam/tools/apache/htdocs/index.html 
7. Start apache
sudo /glassbeam/tools/apache/bin/apachectl -k start # Start apache

-------------------------------------------------
 Steps to disable maintenance mode 
-------------------------------------------------

1. Stop apache
sudo /glassbeam/tools/apache/bin/apachectl -k stop # Stop apache
2. Move httpd-gb.conf to httpd.conf 
mv httpd-gb.conf httpd.conf
3. Start apache
sudo /glassbeam/tools/apache/bin/apachectl -k start # Start apache

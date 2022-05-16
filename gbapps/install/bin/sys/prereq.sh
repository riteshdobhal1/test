#!/bin/bash

################# GCC installation #############
gchk=`rpm -qa | grep gcc`

if [ $? -ne 0 ];then
echo "gcc is Not Installed please install it"
else
echo "gcc is already Installed"
fi

################# mysql-devel installation #############
mchk=`rpm -qa | grep mariadb-devel`

if [ $? -ne 0 ];then
echo "mariadb-devel is Not Installed"
else
echo "mariadb-devel is already Installed"

fi

################# Aspell installation #############
achk=`rpm -qa | grep aspell`

if [ $? -ne 0 ];then
echo "Aspell is Not Installed"
rpm -Uvh aspell-0.60.6.1-9.el7.x86_64.rpm
else
echo "Aspell is already Installed"
fi

adchk=`rpm -qa | grep aspell-devel`

if [ $? -ne 0 ];then
echo "Aspell Devel is Not Installed"
rpm -Uvh aspell-devel-0.60.6.1-9.el7.x86_64.rpm 
else
echo "Aspell Devel is already Installed"
fi

################# Aspell installation #############
echk=`rpm -qa | grep expat`

if [ $? -ne 0 ];then
echo "Expat is Not Installed"
rpm -Uvh expat-2.1.0-8.el7.x86_64.rpm
else
echo "Expat is already Installed"
fi

edchk=`rpm -qa | grep expat-devel`

if [ $? -ne 0 ];then
echo "Expat Devel is Not Installed"
rpm -Uvh expat-devel-2.1.0-8.el7.x86_64.rpm
else
echo "Expat Devel is already Installed"
fi

eschk=`rpm -qa | grep expat-static`

if [ $? -ne 0 ];then
echo "Expat-Static is Not Installed"
rpm -Uvh expat-static-2.1.0-8.el7.x86_64.rpm
else
echo "Expat-Static is already Installed"
fi

################# Perl installation #############

pv=`perl -v | awk '/This/ {print $4}' | sed -e 's/v//'`

if [[ $pv = 5.8.8 ]]; then
echo "Perl-5.8.8 is already Installed"

else

rpm -qa | grep perl | awk '{print "\ rpm -e "$0"\  --nodeps"}' > uninperl.sh
chmod +x uninperl.sh
sudo ./uninperl.sh

rpm -Uvh perl-5.8.8-42.el5.x86_64.rpm --nodeps
sudo cpan
fi


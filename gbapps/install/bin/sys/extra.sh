#!/bin/bash

#yum -y install mysql-devel # need to install via yum
#yum -y install gcc*   # need to install via yum
#yum -y install git* # need to install via yum
#yum -y install expat-* # need to install via yum

################# aspell installation #############
aschk=`rpm -qa | grep aspell`

if [ $? -ne 1 ];then
echo "ok_status"

else

rpm -Uvh aspell-0.60.6.1-9.el7.x86_64.rpm
rpm -Uvh aspell-devel-0.60.6.1-9.el7.x86_64.rpm

fi

################# expat installation #############

aschk=`rpm -qa | grep expat`

if [ $? -ne 1 ];then
echo "ok_status"

else

rpm -Uvh expat-2.1.0-8.el7.x86_64.rpm
rpm -Uvh expat-devel-2.1.0-8.el7.x86_64.rpm
rpm -Uvh expat-static-2.1.0-8.el7.x86_64.rpm

fi


################# Perl installation #############

pv=`perl -v | awk '/This/ {print $4}' | sed -e 's/v//'`

if [[ $pv = 5.8.8 ]]; then
echo "ok_status"

else

rpm -qa | grep perl | awk '{print "\ rpm -e "$0"\  --nodeps"}' > uninperl.sh
chmod +x uninperl.sh
sudo ./uninperl.sh

rpm -Uvh perl-5.8.8-42.el5.x86_64.rpm --nodeps
sudo cpan
fi


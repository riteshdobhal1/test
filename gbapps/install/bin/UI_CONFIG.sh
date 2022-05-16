#!/bin/sh
. ./import_function
ENV=$1
ENV_ARR=(PROD POC QA DEV STAGE)
if [[ -z "$ENV" ]]
then
        show_all_config_syntax
        exit
elif ! [ -z "$ENV" ]
then
        if ! (printf '%s\n' "${ENV_ARR[@]}" | grep -xq $ENV); then
                show_all_config_syntax
                exit 1
        else
             if [ -e "server_dtls_${ENV}" ]
             then
                . "./server_dtls_${ENV}"
             else
                failed_status "Server Details configuration file missing for $ENV environment"
                exit 1
             fi
        fi

fi
if [ -n $UI_HOST ];then
	if [ -e $CONFIGURATION_FILE -a -e $PERL_SCRIPT ];then
		if [ $REMOTE_UI == "yes" ];then
			scp $CONFIGURATION_FILE $PERL_SCRIPT $UI_USER\@$UI_HOST:/tmp &> /dev/null
		else
			cp $CONFIGURATION_FILE $PERL_SCRIPT /tmp &> /dev/null
		fi
		if [ $? == 0 ];then
			if [ $REMOTE_UI == "yes" ];then
				ssh $UI_USER\@$UI_HOST "perl /tmp/$PERL_SCRIPT ui"
			else
				perl /tmp/$PERL_SCRIPT ui
			fi
			if [ $? != 0 ];then
				failed_status "$PERL_SCRIPT failed to run"
              			exit 1
			fi
		
		else
			failed_status "SCP to remote $UI_HOST failed"
                	exit 1
		fi

		
	else
		failed_status "$CONFIGURATION_FILE or $PERL_SCRIPT missing"
            	exit 1
	fi
else
        failed_status "UI host entry missing server_dtls file"
        exit 1	
fi
ok_status


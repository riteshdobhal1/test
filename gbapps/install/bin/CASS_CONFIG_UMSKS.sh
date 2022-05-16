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
if [ -e $CONFIG_CQL_UMSKS ];then
	scp $CONFIG_CQL_UMSKS $CASS_USER_UMSKS\@$CASS_HOST_UMSKS:/tmp &> /dev/null
	if [ $? != 0 ];then
		if [ $REMOTE_UMS_KEYSPACE == "yes" ];then
			remote_output="$(ssh $CASS_USER_UMSKS@$CASS_HOST_UMSKS "sh $CQLSH_PATH_UMSKS $CASS_HOST_UMSKS -f $CONFIG_CQL_UMSKS")"
		else
			sh $CQLSH_PATH_UMSKS $CASS_HOST_UMSKS -f $CONFIG_CQL_UMSKS
		fi
		if [ $? != 0 ];then
			failed_status "CQL file $CONFIG_CQL_UMSKS failed to run"
			exit 1
		fi
	else
		failed_status "SCP to remote $CASS_HOST_UMSKS failed"
		exit 1
	fi
fi
ok_status

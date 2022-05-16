#!/bin/sh
. ./immport_function
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
if [ -e $CONFIG_CQL_GLASSBEAMKS ];then
        scp $CONFIG_CQL_GLASSBEAMKS $CASS_USER_GLASSBEAMKS\@$CASS_HOST_GLASSBEAMKS:/tmp &> /dev/null
        if [ $? != 0 ];then
		if [ $REMOTE_GB_KEYSPACE == "yes" ];then	
                	remote_output="$(ssh $CASS_USER_GLASSBEAMKS@$CASS_HOST_GLASSBEAMKS "sh $CQLSH_PATH_GLASSBEAMKS $CASS_HOST_GLASSBEAMKS -f $CONFIG_CQL_GLASSBEAMKS")"		else
			sh $CQLSH_PATH_GLASSBEAMKS $CASS_HOST_GLASSBEAMKS -f $CONFIG_CQL_GLASSBEAMKS
		fi
                if [ $? != 0 ];then
                        failed_status "CQL file $CONFIG_CQL_GLASSBEAMKS failed to run"
                        exit 1
                fi
        else
                echo "SCP to remote $CASS_HOST_GLASSBEAMKS failed"
                exit 1
        fi
fi
ok_status

#!/usr/bin/perl
## This script will be used to add configuration to update the configuration to all the config files for UI,UMS,INFOSERVER and CASSANDRA respectively
my $interactive = 0;

my $configuration_file = "/tmp/configuration.txt";
my @argument_list = ('ui','ums','infoserver','apache');

my $config_files = {'ui'=>['/apps/config/uiconfig.json','/apps/app/js/globals.js','/apps/app/login/js/global.js'],'ums'=>['/conf/application.conf'],'infoserver'=>['/conf/application-dev.conf'],'apache'=>['/conf/httpd.conf']};

my $config_files_delimeter = {'/apps/app/js/globals.js'=>'=','/apps/app/login/js/global.js'=>'=','/apps/config/uiconfig.json'=>':','/conf/application.conf'=>'=','/conf/application-dev.conf'=>'=','/conf/httpd.conf'=>''};

my $label_configuration = {'info.httpProtocol'=>'UI protocol http/https?','globalObj.help_link_global'=>'Help link Url','"umsDomain"'=>'UMS Domain','xdomain.name'=>'Xdomain (ex. glassbeam.com if UI is abc.glassbeam.com)','request.limit'=>'Request limit','globalObj.gb_studio_protocol' => 'GBSTUDIO UI protocol http/https?','globalObj.download_max_limit' => 'Bundle download limit in bytes','session.domain' => 'Session domain to be same is Xdomain with prefix as .','request.protocol' => 'Protocol to be set as http/https same as for Apps UI','admin.default.emaillink' => 'Change password link domain','ums.domain.name' => 'UMS domain name to be set without port if protocol is https','dx.cassandraSeeds' => 'Cassandra IP for UMS','value' => 'Spark IP','admin.default.fromemail' => 'Email configuration (from email)','admin.default.emailhost' => 'Email configuration (email host)', 'admin.default.authemail' => 'Auth Email', 'admin.default.authpasswd' => 'Auth Password', 'admin.default.emailsubject' => ' Email Subject','admin.default.port'=>'Default port','admin.default.pwdresetsubject' => 'Password reset subject','ums.host' => 'UMS domain name to be set without port if protocol is https','tableau.domain' => 'Tableau Domain','tableau.ipdomain' => 'Tableau IP','tableau.user' => 'Tableau administrator','tableau.password' => 'Tableau password','studio.host' => 'Studio domain name'};

my $RED="\e[31m";
my $GREEN="\e[32m";
my $NC="\e[37m";


if (!(-f $configuration_file))
{
	print "${RED} Configuration file is missing$NC\n";
}
else
{
	if(@ARGV == 0)
	{
		usage();
	}	
	elsif(@ARGV > 1)
	{
		print "${RED}Script should only have one parameter$NC\n";
		usage();
	}
	else
	{
		my $argument = $ARGV[0];
		if(!(grep $_ eq "$argument",@argument_list))
		{
			print "${RED}Given parameter is not valid$NC\n";
			usage();
		}
		else
		{
			my @all_config;
	        open(READFILE,"$configuration_file");
    	    	@all_config = (<READFILE>);
        	close(READFILE);


			my $config_list = $config_files->{$argument};
			my $start_configuration_line = uc($argument);
			my $end_configuration_line = "EOC_".uc($argument);
			my @configuration;
			my @absolute_path;
			my $base_path;
			open(READFILE,"$configuration_file");
			foreach my $config_file(@$config_list)
			{
				my $delimeter = $config_files_delimeter->{$config_file};		
				while (<READFILE>) {
 					if (/$start_configuration_line/../$end_configuration_line/) {
    				next if /$start_configuration_line/ || /$end_configuration_line/;
					push(@configuration,$_);
  					}
					else
					{
						next if /^\s*$/;
						next if /^#/;
						push(@absolute_path,$_);
					}
				}
				foreach my $abs_path(@absolute_path)
				{
					my ($key,$value) = split /=/ ,$abs_path;
				    if($key eq "$argument")
					{
						$value =~s/^"//;
						$value =~s/"$//;
						$base_path = $value;
						chomp($base_path);
					}
				}
				err_msg($argument) if(!(-d $base_path));
				open(CONFIGFILE,"$base_path$config_file");
				my @config_configuration = (<CONFIGFILE>);
				close(CONFIGFILE);
				my @configuration_filter;
				foreach my $config(@configuration)
				{
					my ($key,$value) = split /=/ ,$config;
					chomp($config);
					if(grep(/$key/,@config_configuration))
					{
						push(@configuration_filter,$config);
					}

				}
				my $key_value = 0;
				my $index = 0;
				my $index_h2 = 0;
				
				foreach my $line(@configuration_filter)
				{
					my($key,$value) = split /=/, $line, 2;
					$line =~ s/=/ $delimeter /;
					my $display_value = $value;
					$display_value =~s/[,;]+//g;
					chomp($display_value);
					
					my $column_value = "";
					if($interactive){ 
					print "\n${GREEN}Enter: ".$label_configuration->{$key}."\n${RED}Default configuration is $display_value\n${GREEN}Enter new value or leave as blank to take default\n$NC";	
						$column_value = <STDIN>;
						chomp($column_value);
				    		$column_value =~s/^\s+//;
						$column_value =~s/\s+$//;
						print "\n";
					}else{
						$column_value = "";
					}
					if($column_value ne "")
					{
						if($value =~/"/)
						{
							$line = "$key$delimeter\"$column_value\"";
						}
						else
						{
							$line = "$key$delimeter$column_value";
						}
						if($value =~ /;/)
                        			{
                            				$line = "$line;";
                        			}
                        			elsif($value =~ /,/)
                        			{
                            				$line = "$line,";
                        			}

					}
					chomp($line);
					if($argument eq "infoserver"){
					if($key_value == 1){
					 	$config_configuration[$index] = "    $line\n";
					 	$key_value = 0;
					}
					for($i=$index;$i<@config_configuration;$i++){
						my $line_arr = $config_configuration[$i];
						if($line_arr =~ /\s*name\s*=\s*/ && $line_arr =~ /$line/){
							$key_value = 1;
							$index = $i + 1;
							last;
						}
						
					}

					if($line =~ /\s*jdbc:h2:tcp/){
					for($j=$index_h2;$j<@config_configuration;$j++){
                                                my $line_arr = $config_configuration[$j];
							if($line_arr =~ /\s*jdbc:h2:tcp/){
								$config_configuration[$j] = "      $line\n";
								$index_h2 = $j + 1;
                                                        	last;
                                                	}

                                        	}
					}
					} else {
					@config_configuration = map {s/$key\s*$delimeter\s*[A-Za-z0-9\:\/\.";,@\-\!\?\[\]\#\+]+/$line/g; $_; } @config_configuration;
					}
				}

			#print @config_configuration;
				open(WRITEFILE,">$base_path$config_file");
				print WRITEFILE @config_configuration;
				close(WRITEFILE);
			}
			close(READFILE);

		}

	print "${GREEN} Configuration for $NC".uc($argument)."$GREEN is done!!$NC\n\n"; 
	}	

}

sub err_msg {

	my $arg = $_[0];
	print "${RED} Base path for $NC".uc($arg)."${RED} does not exist, please provide the valid path in configuration.txt$NC\n";
        exit 0;

}
sub usage{

	print "${GREEN} Run the script as $NC=>$NC ${GREEN}perl update_config_file.pl ui|ums|infoserver|apache$NC\n"; 
	exit 0;
}


package controllers;

import models.RoleDetails;
import models.Utils;
import models.vRole;
import models.vClinsight;
import org.apache.thrift.TException;
import org.joda.time.DateTime;
import java.net.MalformedURLException;
import java.rmi.RemoteException;
import play.mvc.*;
import play.Logger;
import java.net.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.UUID;

import com.sforce.soap.partner.SforceServiceLocator;
import com.sforce.soap.partner.SessionHeader;
import com.sforce.soap.partner.SoapBindingStub;
import com.sforce.soap.partner.GetUserInfoResult;
import javax.xml.rpc.Stub;
import com.sforce.soap.partner.fault.ExceptionCode;
import com.sforce.soap.partner.fault.UnexpectedErrorFault;
import com.sforce.soap.partner.fault.ApiFault;
import com.google.gson.JsonObject;
import scala.Option;
import scala.collection.immutable.Map;
import scala.util.Try;

public class SSOSoap extends Controller {

	private static final Logger.ALogger logger = Logger
			.of("Controller_SSOSoap");

	public static Result getUserInfo(String version, String mfr, String prod,
			String domain, String sessionId, String serverUrl,
			String additional_params) {

		String[] optionalParams;
		String query_string = null;
		String dashboardId = null;

		if (additional_params != null) {
			additional_params = additional_params.substring(1,
					additional_params.length() - 1);
			optionalParams = additional_params.split("~");
			for (String param : optionalParams) {
				String[] key_value = param.split("=");
				String key = key_value[0];
				if (key.equals("dashboardId")) {
					dashboardId = key_value[1];
				} else {
					if (query_string == null) {
						query_string = param;
					} else {
						query_string = query_string + "&" + param;
					}
				}
			}
		}

		String uuid = UUID.randomUUID().toString();
		String v_message = null;
		String sch = play.Play.application().configuration().getConfig("sso.mps").getString(mfr + "_" + prod);
		String mps = mfr + "/" + prod + "/" + sch;
		String redirect_def_url = play.Play.application().configuration().getString("sso.redirect_def_url");
        String redirect_fail_url = play.Play.application().configuration().getString("sso.redirect_fail_url");
        
        String redirect_url_success =models.Auth.ReqProtocol() + "://" + domain + "/" + redirect_def_url + "?mps=" + mps;
		String redirect_url_failure = models.Auth.ReqProtocol() + "://" + domain + "/" + redirect_fail_url + "?mps=" + mps;
		String sso_user_role = "sso" + mfr + "internal";
		String domain_name = play.Play.application().configuration()
				.getString("xdomain.name");
		String salesforce_login_url = play.Play.application().configuration()
				.getString("salesforce.login.url");

		DateTime current_time;
		current_time = new DateTime();
		long current_time_sec = current_time.getMillis();
		try {
			if (!domain.endsWith(domain_name)) {
				v_message = "Domain name missing as part of configuration in Salesforce panel '"
						+ domain + "' is not the valid domain";
				logger.error(v_message);
				return redirect(salesforce_login_url);
			}
			if (sessionId == null || sessionId == "") {
				v_message += "SessionId is missing or blank.";
				logger.error(v_message);
				return redirect(redirect_url_failure);
			}
			if (serverUrl == null || serverUrl == "") {
				v_message += "ServerURL is missing or blank.";
				logger.error(v_message);
				return redirect(redirect_url_failure);

			}
			URL uri = new URL(serverUrl);
			if (!uri.getProtocol().startsWith("https")
					|| !uri.getHost().endsWith("force.com")) {

				v_message = "Bad request " + uri.getProtocol() + "Host : "
						+ uri.getHost();
				logger.error(v_message);
				return redirect(redirect_url_failure);
			}
			SforceServiceLocator serviceLocator = new SforceServiceLocator();
			SoapBindingStub binding = new SoapBindingStub();
			SessionHeader sh = new SessionHeader();
			sh.setSessionId(sessionId);

			String ns = serviceLocator.getServiceName().getNamespaceURI();
			binding.setHeader(ns, "SessionHeader", sh);

			binding._setProperty(Stub.ENDPOINT_ADDRESS_PROPERTY, uri.toString());
			GetUserInfoResult userInfoResult = binding.getUserInfo();
			JsonObject data = new JsonObject();
			Object role_details = new Object();
			data.addProperty("userFullName", userInfoResult.getUserFullName());
			data.addProperty("userID", userInfoResult.getUserId());
			data.addProperty("userEmail", userInfoResult.getUserEmail());
			String str = userInfoResult.getUserFullName();
			String[] inputs = str.split(" ");
			String firstname = inputs[0];
			String lastname = inputs[1];
			String status = models.vUser.notActiveSSO(userInfoResult.getUserEmail());

			if(status.toLowerCase() == "inactive" || status == "") {
				return redirect(redirect_url_failure);
			} else {

				String user_role = models.vUser.userRole(userInfoResult.getUserEmail());
				Try<RoleDetails> role_info = vRole.roleDetails(user_role);
				Boolean isAdmin = false;

				String[] newMPSList;
				String strColon;
				String[] domains = new String[role_info.get().domains().values().size()];
				for (int count = 0; count < role_info.get().domains().values().size(); count++) {
					newMPSList = role_info.get().domains().values().head().split("/");
					strColon = String.join(":", newMPSList);
					domains[count] = strColon;
				}
				String realms = role_info.get().realm().mkString(",");

				if (user_role != "") {


					session("id", userInfoResult.getUserEmail());
					session("role", user_role);
					session("org", mfr);
					session("current_time", String.valueOf(current_time_sec));
					session("session_id", uuid);
					session("realms", realms);
					session("domains", String.join(",", domains));
					session("superadmin", isAdmin.toString());
					session("remote_address", request().remoteAddress());


					v_message = "User already exists in DB";
					logger.debug(v_message);
					if (dashboardId != null) {

						String dashboard_url = models.vClinsight.getHealthcheckSummaryUrl(mfr, prod, sch);

						if (dashboard_url != "") {
							if(models.vUser.updateSSOToken(userInfoResult.getUserEmail(),sessionId)){
								Option<String> encryptedUsernameOpt = Utils.encryptString(userInfoResult.getUserEmail());
								String encryptedUsername = encryptedUsernameOpt.get();
								 dashboard_url = dashboard_url + "&username=" + encryptedUsername + "&token_id=" + sessionId;
								if (query_string != null) {
									dashboard_url = dashboard_url + "&" + query_string;
								}
								v_message = "User " + userInfoResult.getUserEmail() + " redirected successfully to " + dashboard_url;  ;

								logger.debug(v_message);
								return redirect(dashboard_url);
							} else {
								v_message = "Unable to update token in DB for " + userInfoResult.getUserEmail();
								logger.error(v_message);
								return redirect(redirect_url_failure);
							}


						} else {
							v_message = "DashboardId not found or dashboard missing for dashboard Id for " + mfr + "/"
									+ prod + "/" + sch;
							logger.error(v_message);
							return redirect(redirect_url_failure);
						}
					} else {
						if (query_string != null) {
							redirect_url_success = redirect_url_success + "&" + query_string;
						}
						return redirect(redirect_url_success);
					}

				} else {

					return redirect(redirect_url_failure + "?user="
							+ userInfoResult.getUserId() + "&domain=" + domain);
					/***** BELOW LOGIC will be used if there is requirement to add SSO user on the fly *****/
				/* if (models.vUser.createSsoUserSalesforce(
						userInfoResult.getUserId(), mfr, sso_user_role,
						firstname, lastname, userInfoResult.getUserEmail(),
						mps, domain)) {
					session("id", userInfoResult.getUserEmail());
					session("role", sso_user_role);
					session("org", mfr);
					session("current_time", String.valueOf(current_time_sec));
					session("session_id", uuid);
					session("realms", realms);
					session("domains", domains_list);
					v_message = "New User added successfully in DB";
					logger.debug(v_message);
					if (dashboardId != null) {
						String dashboard_url = models.vOrg.getDashboardUrl(mfr,
								prod, sch, dashboardId);
						if (dashboard_url != "") {
							if (query_string != null) {
								dashboard_url = dashboard_url + "&"
										+ query_string;
							}
							return redirect(dashboard_url);

						} else {
							v_message = "DashboardId not found for " + mfr
									+ "/" + prod + "/" + sch;
							logger.error(v_message);
							return redirect(redirect_url_failure);
						}
					} else {
						logger.error(redirect_url_success);	
						return redirect(redirect_url_success);
					}
				} else {
					v_message = "Failed to Add new user";
					logger.error(v_message);
					return redirect(redirect_url_failure + "?user="
							+ userInfoResult.getUserId() + "&domain=" + domain);

				} */
				}
			}

		} catch (UnexpectedErrorFault e) {
			v_message = "Unable to connect to the API.<br><br>"
					+ e.getExceptionMessage();
			logger.error(v_message);
			return redirect(redirect_url_failure);

		} catch (ApiFault e) {
			if (e.getExceptionCode().equals(ExceptionCode.API_DISABLED_FOR_ORG)) {
				v_message += "This edition of salesforce.com "
						+ "does not provide API access.<br><br>"
						+ "This API is standard feature of Enterprise "
						+ "and Unlimited Editions. <br>"
						+ "Certify your application tp gain API Access"
						+ "to Professional Editon as well.";
				v_message += e.getExceptionMessage();

			}
			logger.error(v_message);
			return redirect(redirect_url_failure);
		} catch (RemoteException e) {
			v_message += "Unable to connect to the API.<br><br>"
					+ e.getMessage();
			logger.error(v_message);
			return redirect(redirect_url_failure);
		} catch (MalformedURLException e) {
			v_message += "The server URL is not valid.<br><br>"
					+ e.getMessage();
			logger.error(v_message);
			return redirect(redirect_url_failure);
		}

	}
}
